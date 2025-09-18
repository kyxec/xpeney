"use client";

import { Button } from '@/components/ui/button';
import { useUrlState } from '@/hooks/useUrlState';
import { Grid3X3, List, Filter } from 'lucide-react';

interface TagsViewToggleProps {
    onToggleFilters: () => void;
    filtersOpen: boolean;
    activeFiltersCount: number;
}

export default function TagsViewToggle({ onToggleFilters, filtersOpen, activeFiltersCount }: TagsViewToggleProps) {
    const { getParam, setParam } = useUrlState({ scroll: false });
    const currentView = getParam('view') || 'grid';

    return (
        <div className="flex items-center justify-between p-4 bg-muted/30">
            {/* View Toggle */}
            <div className="flex items-center bg-background border rounded-lg p-1">
                <Button
                    variant={currentView === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setParam('view', 'grid', true)}
                    className="h-8 px-3 text-xs font-medium"
                >
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Grid
                </Button>
                <Button
                    variant={currentView === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setParam('view', 'list', true)}
                    className="h-8 px-3 text-xs font-medium"
                >
                    <List className="h-4 w-4 mr-1" />
                    List
                </Button>
            </div>

            {/* Filter Toggle */}
            <Button
                variant={filtersOpen ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleFilters}
                className="h-8 px-3 text-xs font-medium relative"
            >
                <Filter className="h-4 w-4 mr-1" />
                {filtersOpen ? 'Hide filters' : 'Filters'}
                {activeFiltersCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                    </div>
                )}
            </Button>
        </div>
    );
}