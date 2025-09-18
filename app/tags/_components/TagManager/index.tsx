"use client";

import { useState } from 'react';
import { usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Preloaded } from 'convex/react';
import { useUrlState } from '@/hooks/useUrlState';
import TagsHeader from './TagsHeader';
import TagsSearchAndFilters from './TagsSearchAndFilters';
import TagsViewToggle from './TagsViewToggle';
import TagGrid from './TagGrid';
import TagList from './TagList';
import TagDialog from './TagDialog';
import TagShareDialog from './TagShareDialog';
import DeleteTagDialog from './DeleteTagDialog';
import { EmptyState } from '@/components/ui/empty-state';

interface TagManagerProps {
  preloadedTags: Preloaded<typeof api.tags.list>;
}

export default function TagManager({ preloadedTags }: TagManagerProps) {
  const tags = usePreloadedQuery(preloadedTags);
  const [showFilters, setShowFilters] = useState(false);
  const { setParam, clearParams, getParam } = useUrlState({ scroll: false });

  // Get current URL state for UI decisions
  const currentView = (getParam('view') as 'grid' | 'list') || 'grid';
  const currentAction = getParam('action') as 'create' | 'edit' | 'share' | 'delete' | null;
  const currentSelected = getParam('selected');
  const currentSearch = getParam('search') || '';
  const currentSort = (getParam('sort') as 'name' | 'date' | 'usage') || 'name';
  const currentOrder = (getParam('order') as 'asc' | 'desc') || 'asc';

  const handleCreateTag = () => {
    setParam('action', 'create', true); // Use shallow routing for dialog actions
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearAction = () => {
    clearParams(['action', 'selected'], true); // Use shallow routing for dialog actions
  };

  // Calculate active filters count
  const activeFiltersCount = [
    currentSearch,
    currentSort !== 'name',
    currentOrder !== 'asc'
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <TagsHeader
        tagsCount={tags.length}
        onCreateTag={handleCreateTag}
      />

      {/* Mobile Filters Panel */}
      <TagsSearchAndFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* View Toggle */}
      <TagsViewToggle
        onToggleFilters={handleToggleFilters}
        filtersOpen={showFilters}
        activeFiltersCount={activeFiltersCount}
      />      {/* Main Content */}
      <div className="flex-1 min-h-0 p-4">
        {tags.length > 0 ? (
          currentView === 'grid' ? (
            <TagGrid tags={tags} />
          ) : (
            <TagList tags={tags} />
          )
        ) : (
          <EmptyState
            title={currentSearch ? 'No tags found' : 'No tags yet'}
            description={
              currentSearch
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create your first tag to start organizing your expenses and share them with others.'
            }
            actionLabel={!currentSearch ? 'Create your first tag' : undefined}
            onAction={!currentSearch ? handleCreateTag : undefined}
          />
        )}
      </div>

      {/* Dialogs */}
      <TagDialog
        isOpen={currentAction === 'create' || currentAction === 'edit'}
        mode={currentAction === 'create' ? 'create' : 'edit'}
        tagId={currentSelected}
        onClose={clearAction}
        tags={tags}
      />

      <TagShareDialog
        isOpen={currentAction === 'share'}
        tagId={currentSelected}
        onClose={clearAction}
        tags={tags}
      />

      <DeleteTagDialog
        isOpen={currentAction === 'delete'}
        tagId={currentSelected}
        onClose={clearAction}
        tags={tags}
      />
    </div>
  );
}