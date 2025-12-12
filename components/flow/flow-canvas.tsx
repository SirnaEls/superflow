'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserFlow, FlowNode as FlowNodeType } from '@/types';
import { FlowNode } from './flow-node';
import { ConnectionArrow } from './connection-arrow';

// ============================================
// Flow Canvas Component - Whiteboard Style
// ============================================

interface FlowCanvasProps {
  flow: UserFlow | undefined;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  featureId: string;
  onUpdateNode: (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  flow,
  selectedNodeId,
  onSelectNode,
  featureId,
  onUpdateNode,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastStatePushTime = useRef<number>(0);

  // Reset position and scale when flow changes
  useEffect(() => {
    if (flow && flow.nodes && flow.nodes.length > 0) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [flow]);

  // Prevent page scroll and zoom when mouse is over whiteboard
  useEffect(() => {
    if (isMouseOver) {
      document.body.style.overflow = 'hidden';
      
      // Push a state to prevent back navigation immediately
      window.history.pushState(null, '', window.location.href);
      
      // Continuously push state to prevent back navigation (every 100ms)
      const preventBackInterval = setInterval(() => {
        window.history.pushState(null, '', window.location.href);
      }, 100);
      
      // Prevent page zoom on trackpad (only Ctrl/Cmd + wheel)
      const preventZoom = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
      };
      
      const preventTouchZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      
      // Prevent browser navigation gestures (swipe left/right) - only for touch
      const preventNavigation = (e: TouchEvent) => {
        // Only prevent if it's a swipe gesture, not regular touch
        if (e.touches.length === 1) {
          // Let the whiteboard handle it, but prevent default browser behavior
          e.preventDefault();
        }
      };
      
      // Aggressively prevent popstate navigation (back button and trackpad gestures)
      const preventPopState = (e: PopStateEvent) => {
        // Always push state back to prevent navigation immediately
        window.history.pushState(null, '', window.location.href);
        // Prevent the navigation
        e.stopImmediatePropagation();
        // Also try to prevent default if possible
        if (e.cancelable) {
          e.preventDefault();
        }
      };
      
      // Intercept beforeunload and other navigation events
      const preventBeforeUnload = (e: BeforeUnloadEvent) => {
        // Don't prevent, just ensure state is pushed
        window.history.pushState(null, '', window.location.href);
      };
      
      document.addEventListener('wheel', preventZoom, { passive: false });
      document.addEventListener('touchmove', preventTouchZoom, { passive: false });
      document.addEventListener('touchstart', preventNavigation, { passive: false });
      document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
      document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
      document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
      window.addEventListener('popstate', preventPopState, { capture: true });
      window.addEventListener('beforeunload', preventBeforeUnload);
      
      return () => {
        clearInterval(preventBackInterval);
        document.body.style.overflow = '';
        document.removeEventListener('wheel', preventZoom);
        document.removeEventListener('touchmove', preventTouchZoom);
        document.removeEventListener('touchstart', preventNavigation);
        window.removeEventListener('popstate', preventPopState, { capture: true } as any);
        window.removeEventListener('beforeunload', preventBeforeUnload);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMouseOver]);

  if (!flow || !flow.nodes || flow.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        <p className="text-sm">No flow generated yet</p>
      </div>
    );
  }

  // Organize nodes in sequential order
  const nodes = flow.nodes;

  // Handle wheel zoom and pan
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    
    // Check if it's a zoom gesture (Ctrl/Cmd + wheel) or trackpad pinch
    // On trackpad: Ctrl/Cmd + two fingers = zoom, two fingers without Ctrl = pan
    const isZoom = e.ctrlKey || e.metaKey;
    
    if (isZoom) {
      // Zoom gesture (Ctrl/Cmd + wheel or trackpad pinch)
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Faster zoom: increase multiplier for more responsive zoom
      const delta = e.deltaY * -0.005;
      const newScale = Math.min(Math.max(0.1, scale + delta), 3);
      const scaleChange = newScale / scale;
      
      // Zoom towards mouse position
      setPosition({
        x: mouseX - (mouseX - position.x) * scaleChange,
        y: mouseY - (mouseY - position.y) * scaleChange,
      });
      setScale(newScale);
    } else {
      // Pan gesture (trackpad two-finger scroll or mouse wheel)
      // Prevent browser navigation when panning horizontally by pushing state
      if (Math.abs(e.deltaX) > 0) {
        // Push state to prevent back navigation more frequently during horizontal pan
        const now = Date.now();
        if (now - lastStatePushTime.current > 50) { // Throttle to every 50ms
          window.history.pushState(null, '', window.location.href);
          lastStatePushTime.current = now;
        }
      }
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, [scale, position]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning if clicking on the background (not on a node or arrow)
    const target = e.target as HTMLElement;
    const isNode = target.closest('[data-flow-node]') || target.closest('[data-connection-arrow]');
    
    // Allow panning with middle mouse button or if clicking directly on background
    if ((e.button === 1 || (e.button === 0 && !isNode)) && containerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      if (e.button === 1) {
        e.preventDefault();
      }
    }
  }, [position]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      // Prevent back navigation during drag
      const now = Date.now();
      if (now - lastStatePushTime.current > 100) {
        window.history.pushState(null, '', window.location.href);
        lastStatePushTime.current = now;
      }
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setIsMouseOver(false);
  }, []);

  // Reset view on double click
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="whiteboard-bg w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing"
      style={{
        touchAction: 'none',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * scale}px ${20 * scale}px`,
        backgroundPosition: `${position.x}px ${position.y}px`,
      }}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      onTouchStart={(e) => {
        // Prevent browser navigation gestures
        if (e.touches.length === 1) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }}
      onTouchMove={(e) => {
        // Prevent browser navigation gestures during pan
        if (e.touches.length === 1) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }}
      onPointerDown={(e) => {
        // Prevent navigation on pointer events
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
          window.history.pushState(null, '', window.location.href);
        }
      }}
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
      >
        <div className="flex items-center gap-8 p-10">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div data-flow-node>
                <FlowNode
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={onSelectNode}
                  featureId={featureId}
                  onUpdateNode={onUpdateNode}
                />
              </div>
              {index < nodes.length - 1 && (
                <div data-connection-arrow>
                  <ConnectionArrow label={node.connectionLabel} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
