import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG, FLOW_GENERATION_PROMPT } from '@/lib/constants';
import { UploadedImage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { textInput, images, inputMode } = body;

    // Get API key from environment (server-side, no NEXT_PUBLIC_ prefix)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not found. Please set ANTHROPIC_API_KEY in your .env file.' },
        { status: 500 }
      );
    }

    // Build content based on input mode
    let userContent: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }>;
    
    if (inputMode === 'text' && textInput?.trim()) {
      userContent = `Analyze the following FigJam post-it notes. IMPORTANT: Multiple post-its can belong to the same feature. Group post-its by semantic content and user journey, not by individual post-it. Identify distinct features based on complete user workflows, not individual notes.

Post-it notes:
${textInput}

Instructions:
- Analyze the semantic content of each post-it
- Group post-its that describe the same feature or user journey
- Create one feature per distinct user goal/workflow, not per post-it
- Combine related post-its into comprehensive flows`;
    } else if (inputMode === 'image' && images && images.length > 0) {
      const content: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [
        {
          type: 'text',
          text: `Analyze these FigJam post-it note screenshots. CRITICAL: Multiple post-its can belong to the same feature. 

Instructions:
- Analyze the semantic content of each post-it note in the images
- Group post-its that describe the same feature or user journey together
- Create one feature per distinct user goal/workflow, NOT per post-it
- Look for thematic coherence: post-its about the same functionality belong together
- Only separate into different features if they represent truly distinct user goals or workflows

Example: If you see 5 post-its about "file conversion" (upload, conversion, download, formats, optimization), group them into 1 feature: "Document Conversion", not 5 separate features.

Generate user flows by grouping related post-its into comprehensive features:`,
        },
      ];

      images.forEach((img: UploadedImage) => {
        const base64Data = img.data.split(',')[1];
        const mediaType = img.data.split(';')[0].split(':')[1];
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        });
      });

      userContent = content;
    } else {
      return NextResponse.json(
        { error: 'Please add some content to analyze' },
        { status: 400 }
      );
    }

    // Call Claude API
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        max_tokens: API_CONFIG.maxTokens,
        system: FLOW_GENERATION_PROMPT,
        messages: [
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || `API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || 'API error occurred' },
        { status: 500 }
      );
    }

    // Extract text response from Claude format
    const responseText = data.content
      ?.filter((item: { type: string }) => item.type === 'text')
      ?.map((item: { text: string }) => item.text)
      ?.join('') || '';

    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from API' },
        { status: 500 }
      );
    }

    // Parse JSON response
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    let parsedFeatures;
    
    try {
      const parsed = JSON.parse(cleanJson);
      parsedFeatures = Array.isArray(parsed) 
        ? parsed 
        : (parsed.features || parsed.data || (typeof parsed === 'object' ? Object.values(parsed).find(Array.isArray) : null) || []);
      
      if (!Array.isArray(parsedFeatures) || parsedFeatures.length === 0) {
        return NextResponse.json(
          { error: 'Invalid response format: expected a JSON array of features' },
          { status: 500 }
        );
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Response:', responseText);
      return NextResponse.json(
        { error: `Failed to parse JSON response from API: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ features: parsedFeatures });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

