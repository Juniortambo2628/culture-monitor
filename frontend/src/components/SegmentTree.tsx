"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown, CheckSquare, Square } from "lucide-react";
import { Button } from "./ui/button";

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface SegmentTreeProps {
  nodes: TreeNode[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function SegmentTree({ nodes, onSelectionChange }: SegmentTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'location': true,
    'generation': true
  });
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id: string) => {
    const newSelected = { ...selected, [id]: !selected[id] };
    setSelected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(Object.keys(newSelected).filter(k => newSelected[k]));
    }
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expanded[node.id];
    const isSelected = selected[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center gap-1 py-1.5 px-3 hover:bg-primary/5 rounded-xl cursor-pointer transition-all group"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(node.id)} className="text-primary hover:opacity-80 p-0.5">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div 
            onClick={() => toggleSelect(node.id)}
            className={`flex items-center gap-2 flex-1`}
          >
            <div className={`${isSelected ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
              {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
            </div>
            <span className={`text-[12px] font-medium ${isSelected ? 'text-primary' : 'text-slate-600 dark:text-slate-400'} group-hover:text-primary transition-colors`}>
              {node.label}
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 border-l border-border ml-4 pl-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-0 bg-transparent">
      <div className="space-y-0.5">
        {nodes.map(node => renderNode(node))}
      </div>
    </div>
  );
}
