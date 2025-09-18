"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUrlState } from '@/hooks/useUrlState';
import { getTagColorStyle } from '@/lib/tag-color-utils';
import { MoreHorizontal, Share2, Edit, Trash2, Lock, Users, Eye, Edit3 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

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
}

interface TagGridProps {
  tags: Tag[];
}

export default function TagGrid({ tags }: TagGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {tags.map((tag) => (
        <Card key={tag._id} className="group hover:shadow-lg transition-all duration-200 bg-card border hover:border-border/80 touch-manipulation">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-7 h-7 md:w-6 md:h-6 rounded-full border-2 border-background shadow-sm flex-shrink-0"
                  style={getTagColorStyle(tag.color)}
                />
                <h3 className="font-semibold text-foreground truncate text-base md:text-lg leading-tight">
                  {tag.name}
                </h3>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-9 w-9 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  {tag.isOwner ? (
                    <>
                      <DropdownMenuItem onClick={() => handleEdit(tag._id)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(tag._id)} className="cursor-pointer">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(tag._id)}
                        className="text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem disabled className="text-muted-foreground">
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
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {tag.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {tag.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
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

              {tag.isOwner && tag.shareCount !== undefined && tag.shareCount > 0 && (
                <div className="text-xs text-muted-foreground font-medium">
                  {tag.shareCount} shared
                </div>
              )}

              {!tag.isOwner && tag.sharedBy && (
                <div className="text-xs text-muted-foreground">
                  by {tag.sharedBy.name || tag.sharedBy.email}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}