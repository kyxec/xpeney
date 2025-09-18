"use client";

import { useState, useEffect } from 'react';
import { useUrlState } from '@/hooks/useUrlState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, X, Grid3X3, List, Users } from 'lucide-react';

export default function TagFilters() {
  const {
    getParam,
    getBooleanParam,
    setParam,
    clearParams,
    hasParams
  } = useUrlState({ scroll: false });

  // Get current filter values from URL
  const searchValue = getParam('search') || '';
  const includeShared = getBooleanParam('includeShared');
  const sortValue = getParam('sort') || 'name';
  const orderValue = getParam('order') || 'asc';
  const viewValue = getParam('view') || 'grid';

  // Local state for search input to prevent focus loss
  const [searchInput, setSearchInput] = useState(searchValue);

  // Sync local search state with URL search param when it changes externally
  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  // Debounced search function
  const debouncedSearch = useDebounce((value: string) => {
    setParam('search', value || null);
  }, 500);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    clearParams(['search']);
  };

  const activeFiltersExist = hasParams(['search', 'includeShared']);

  return (
    <div className="space-y-4">
      {/* Main filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Include Shared Toggle */}
        <Button
          variant={includeShared ? 'default' : 'outline'}
          onClick={() => setParam('includeShared', !includeShared)}
          className="whitespace-nowrap"
        >
          <Users className="h-4 w-4 mr-2" />
          Shared Tags
        </Button>

        {/* View Toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewValue === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setParam('view', 'grid', true)}
            className="rounded-r-none border-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewValue === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setParam('view', 'list', true)}
            className="rounded-l-none border-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Secondary filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortValue}
            onValueChange={(value) => setParam('sort', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="usage">Usage</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={orderValue}
            onValueChange={(value) => setParam('order', value)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A-Z</SelectItem>
              <SelectItem value="desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters and clear */}
        {activeFiltersExist && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            <div className="flex gap-1">
              {searchValue && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchValue}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={handleClearSearch}
                  />
                </Badge>
              )}
              {includeShared && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Shared
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setParam('includeShared', false)}
                  />
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearParams(['search', 'includeShared'])}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}