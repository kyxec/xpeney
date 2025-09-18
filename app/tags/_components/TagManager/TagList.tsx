"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUrlState } from '@/hooks/useUrlState';
import { getTagColorStyle } from '@/lib/tag-color-utils';
import { MoreHorizontal, Share2, Edit, Trash2, Lock, Users, Eye, Edit3 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import { formatDate } from '@/lib/user-utils';

interface Tag {
  _id: Id<"tags">;
  name: string;
  description?: string;
  color?: string;
  isPrivate: boolean;
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

export default function TagList({ tags }: TagListProps) {
  const { setParams } = useUrlState({ scroll: false });

  const handleEdit = (tagId: string) => {
    setParams({ selected: tagId, action: 'edit' }, true); // Use shallow for dialog
  };

  const handleShare = (tagId: string) => {
    setParams({ selected: tagId, action: 'share' }, true); // Use shallow for dialog
  };

  const handleDelete = (tagId: string) => {
    setParams({ selected: tagId, action: 'delete' }, true); // Use shallow for dialog
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">Tag</div>
        <div className="col-span-3 hidden md:block">Description</div>
        <div className="col-span-2 hidden sm:block">Status</div>
        <div className="col-span-2 hidden lg:block">Updated</div>
        <div className="col-span-1"></div>
      </div>

      {/* Tag rows */}
      {tags.map((tag) => (
        <div
          key={tag._id}
          className="group grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors"
        >
          {/* Tag name and color */}
          <div className="col-span-4 flex items-center gap-3 min-w-0">
            <div
              className="w-4 h-4 rounded-full border border-background shadow-sm flex-shrink-0"
              style={getTagColorStyle(tag.color)}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground truncate">
                {tag.name}
              </div>
              {!tag.isOwner && (
                <div className="text-xs text-muted-foreground">
                  by {tag.sharedBy?.name || tag.sharedBy?.email}
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

          {/* Status badges */}
          <div className="col-span-2 hidden sm:flex items-center gap-2">
            {tag.isPrivate ? (
              <Badge variant="secondary" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}

            {!tag.isOwner && (
              <Badge variant="secondary" className="text-xs">
                {tag.permission === 'editor' ? 'Editor' : 'Viewer'}
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
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {tag.isOwner ? (
                  <>
                    <DropdownMenuItem onClick={() => handleEdit(tag._id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(tag._id)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share ({tag.shareCount || 0})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(tag._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem disabled>
                    {tag.permission === 'editor' ? (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editor Access
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Viewer Access
                      </>
                    )}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}