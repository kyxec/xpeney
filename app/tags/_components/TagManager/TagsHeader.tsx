"use client";

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TagsHeaderProps {
    onCreateTag: () => void;
    tagsCount: number;
}

export default function TagsHeader({ onCreateTag, tagsCount }: TagsHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="p-4">
                {/* Mobile-first header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">
                            Tags
                        </h1>
                    </div>
                    <Button
                        onClick={onCreateTag}
                        size="sm"
                        className="h-9 px-3 font-medium shrink-0 ml-3"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Create</span>
                    </Button>
                </div>

                {/* Description and count */}
                <div className="space-y-1">
                    <p className="text-sm md:text-base text-muted-foreground">
                        {tagsCount === 0
                            ? 'Organize your expenses with tags and share them with others'
                            : `${tagsCount} tag${tagsCount === 1 ? '' : 's'} • Organize your expenses and share with others`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}