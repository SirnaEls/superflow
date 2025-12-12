'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { Feature } from '@/types';
import Link from 'next/link';

interface SavedFlow {
  id: string;
  name: string;
  features: Feature[];
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const [flows, setFlows] = useState<SavedFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load flows from localStorage
    const savedFlows = localStorage.getItem('flowforge-flows');
    if (savedFlows) {
      try {
        const parsed = JSON.parse(savedFlows);
        setFlows(parsed);
      } catch (error) {
        console.error('Error loading flows:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this flow?')) {
      const updated = flows.filter(f => f.id !== id);
      setFlows(updated);
      localStorage.setItem('flowforge-flows', JSON.stringify(updated));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My User Flows</h1>
          <p className="text-slate-400">View and manage all your generated user flows</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : flows.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <CardTitle className="mb-2">No flows yet</CardTitle>
              <p className="text-slate-400 mb-6">
                Start creating your first user flow to see it here
              </p>
              <Link href="/">
                <Button>Create New Flow</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flows.map((flow) => (
              <Card key={flow.id} className="hover:border-slate-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate">
                        {flow.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(flow.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(flow.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-slate-400 mb-2">
                      {flow.features.length} feature{flow.features.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flow.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature.id}
                          className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300"
                        >
                          {feature.name}
                        </span>
                      ))}
                      {flow.features.length > 3 && (
                        <span className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-400">
                          +{flow.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/flows/${flow.id}`}>
                    <Button variant="secondary" className="w-full" leftIcon={<Eye className="w-4 h-4" />}>
                      View Flow
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

