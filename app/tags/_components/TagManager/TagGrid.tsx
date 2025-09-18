"use client";

import type { Id } from '@/convex/_generated/dataModel';
import { useUrlState } from '@/hooks/useUrlState';
import { Card, CardContent } from '@/components/ui/card';
import { getTagColorStyle } from '@/lib/tag-color-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Share2, Trash2, Edit3, Eye } from 'lucide-react';

interface Tag {
  _id: Id<"tags">;
  name: string;
  description?: string;
  color?: string;
  isOwner: boolean;
  permission?: 'viewer' | 'editor';
}

interface TagGridProps {
  tags: Tag[];
}

const TagCard = ({ tag }: { tag: Tag }) => {
  const { setParams } = useUrlState({ scroll: false });

  const handleAction = (action: 'edit' | 'share' | 'delete') => {
    setParams({ selected: tag._id, action }, true);
  };

  const isOwner = tag.isOwner;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-card border hover:border-border/80 overflow-hidden relative">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 w-full" style={getTagColorStyle(tag.color)} />

      <CardContent className="p-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm truncate">{tag.name}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            {isOwner ? (
              <>
                <DropdownMenuItem onClick={() => handleAction('edit')} className="cursor-pointer text-sm"><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('share')} className="cursor-pointer text-sm"><Share2 className="h-3.5 w-3.5 mr-2" />Share</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('delete')} className="text-destructive hover:bg-destructive/10 cursor-pointer text-sm"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem disabled className="text-muted-foreground cursor-default text-sm">
                {tag.permission === 'editor' ? <><Edit3 className="h-3.5 w-3.5 mr-2" />Editor</> : <><Eye className="h-3.5 w-3.5 mr-2" />Viewer</>}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

export default function TagGrid({ tags }: TagGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
      {tags.map((tag) => (
        <TagCard key={tag._id} tag={tag} />
      ))}
    </div>
  );
}