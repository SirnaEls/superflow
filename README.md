# FlowForge ⚡

Transform your FigJam post-its into visual user flows with AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 📁 Project Structure

```
flowforge/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
│
├── components/                   # React Components
│   ├── ui/                      # Reusable UI primitives
│   │   ├── alert.tsx           # Alert/notification component
│   │   ├── badge.tsx           # Badge/tag component
│   │   ├── button.tsx          # Button with variants
│   │   ├── card.tsx            # Card container components
│   │   ├── drop-zone.tsx       # File drag & drop zone
│   │   ├── textarea.tsx        # Text input area
│   │   ├── toggle-group.tsx    # Toggle button group
│   │   └── index.ts            # UI exports
│   │
│   ├── flow/                    # Flow visualization
│   │   ├── connection-arrow.tsx # Arrow connectors
│   │   ├── empty-state.tsx     # Empty state placeholder
│   │   ├── flow-canvas.tsx     # Main flow canvas
│   │   ├── flow-legend.tsx     # Node type legend
│   │   ├── flow-node.tsx       # Individual flow nodes
│   │   └── index.ts            # Flow exports
│   │
│   ├── features/                # Feature-specific components
│   │   ├── feature-card.tsx    # Feature list item
│   │   ├── feature-list.tsx    # Features sidebar
│   │   ├── flow-viewer.tsx     # Flow display panel
│   │   ├── input-panel.tsx     # Input area (text/image)
│   │   └── index.ts            # Feature exports
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx          # App header
│   │   └── index.ts            # Layout exports
│   │
│   └── index.ts                 # All component exports
│
├── hooks/                        # Custom React Hooks
│   ├── use-flow-generator.ts   # Flow generation logic
│   ├── use-image-upload.ts     # Image upload handling
│   └── index.ts                # Hook exports
│
├── lib/                          # Utilities & Config
│   ├── constants.ts            # App constants, AI prompts
│   └── utils.ts                # Helper functions, API calls
│
├── types/                        # TypeScript Types
│   └── index.ts                # All type definitions
│
└── [config files]               # Next.js, Tailwind, TS configs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Component Architecture

### UI Components (`/components/ui`)

Reusable, styled primitives following a consistent design system:

- **Button** - Primary, secondary, ghost, danger variants
- **Card** - Container with header, content, title
- **Badge** - Status indicators
- **Alert** - Info, success, warning, error messages
- **Textarea** - Styled text input
- **ToggleGroup** - Radio-like button group
- **DropZone** - Drag & drop file upload

### Flow Components (`/components/flow`)

Flowchart visualization:

- **FlowNode** - Renders different node shapes (diamond, parallelogram, etc.)
- **FlowCanvas** - Main canvas with nodes and connections
- **ConnectionArrow** - Arrows between nodes
- **FlowLegend** - Node type reference

### Feature Components (`/components/features`)

App-specific composite components:

- **InputPanel** - Text/image input with mode toggle
- **FeatureList** - Detected features sidebar
- **FeatureCard** - Individual feature item
- **FlowViewer** - Flow display with export

## 🛠️ Customization

### Adding New Node Types

1. Add type to `types/index.ts`:
```typescript
export type NodeType = 'start' | 'end' | 'process' | 'your-new-type';
```

2. Configure in `lib/constants.ts`:
```typescript
export const NODE_CONFIGS: Record<NodeType, NodeConfig> = {
  'your-new-type': {
    label: 'New Type',
    color: '#FF0000',
    bgColor: '#FFE0E0',
    textColor: '#800000',
    shape: 'rect',
  },
};
```

### Modifying AI Prompt

Edit `FLOW_GENERATION_PROMPT` in `lib/constants.ts` to change how flows are generated.

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component-level: Tailwind classes in each component

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Claude API (Anthropic)

## 🔮 Future Improvements

- [ ] Export to Figma/FigJam API
- [ ] Drag & drop node editing
- [ ] SVG/PNG export
- [ ] Save/load flows (localStorage or DB)
- [ ] Flow templates library
- [ ] Collaborative editing
- [ ] Undo/redo functionality

## 📄 License

MIT
