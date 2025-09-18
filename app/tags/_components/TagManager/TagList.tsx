"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUrlState } from '@/hooks/useUrlState';
import { getTagColorStyle } from '@/lib/tag-color-utils';
import { MoreHorizontal, Share2, Edit, Trash2, Users, Eye, Edit3 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import { formatDate } from '@/lib/date-utils';
import { Fragment } from 'react';

interface Tag {
  _id: Id<"tags">;
  name: string;
  description?: string;
  color?: string;
  shareCount?: number;
  isOwner: boolean;
  permission?: 'viewer' | 'editor';
  sharedBy?: {
    name: string;
    email: string;
  };
  createdAt: number;
  updatedAt: number;
}

interface TagListProps {
  tags: Tag[];
}

const TagRow = ({ tag }: { tag: Tag }) => {
  const { setParams } = useUrlState({ scroll: false });

  const handleAction = (action: 'edit' | 'share' | 'delete') => {
    setParams({ selected: tag._id, action }, true);
  };

  const isShared = (tag.shareCount ?? 0) > 0 || !tag.isOwner;
  const isOwner = tag.isOwner;

  return (
    <div
      className="group grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors"
    >
      {/* Tag name and color */}
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <div
          className="w-4 h-4 rounded-full border border-background shadow-sm flex-shrink-0"
          style={getTagColorStyle(tag.color)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-foreground truncate">{tag.name}</span>
            <div className="sm:hidden">
              {isShared && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                  <Users className="h-3 w-3 mr-1" />
                  Shared{isOwner && tag.shareCount ? ` +${tag.shareCount}` : ''}
                </Badge>
              )}
            </div>
          </div>
          {!isOwner && tag.sharedBy && (
            <div className="text-xs text-muted-foreground">
              by {tag.sharedBy.name || tag.sharedBy.email}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="col-span-3 hidden md:block">
        <p className="text-sm text-muted-foreground line-clamp-1">
          {tag.description || '—'}
        </p>
      </div>

      {/* Shared indicator (sm+) */}
      <div className="col-span-2 hidden sm:flex items-center gap-2">
        {isShared && (
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Shared{isOwner && tag.shareCount ? ` +${tag.shareCount}` : ''}
          </Badge>
        )}
      </div>

      {/* Updated date */}
      <div className="col-span-2 hidden lg:block text-sm text-muted-foreground">
        {formatDate(tag.updatedAt)}
      </div>

      {/* Actions */}
      <div className="col-span-1 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner ? (
              <Fragment>
                <DropdownMenuItem onClick={() => handleAction('edit')}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('share')}><Share2 className="h-4 w-4 mr-2" />Share ({tag.shareCount || 0})</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('delete')} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
              </Fragment>
            ) : (
              <DropdownMenuItem disabled>
                {tag.permission === 'editor' ? <><Edit3 className="h-4 w-4 mr-2" />Editor Access</> : <><Eye className="h-4 w-4 mr-2" />Viewer Access</>}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs sm:text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">Tag</div>
        <div className="col-span-3 hidden md:block">Description</div>
        <div className="col-span-2 hidden sm:block"></div>
        <div className="col-span-2 hidden lg:block">Updated</div>
        <div className="col-span-1"></div>
      </div>
      {/* Tag rows */}
      {tags.map((tag) => <TagRow key={tag._id} tag={tag} />)}
    </div>
  );
}