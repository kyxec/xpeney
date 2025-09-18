"use client";

import { useState, useEffect } from 'react';
import { useUrlState } from '@/hooks/useUrlState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TagsSearchAndFiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TagsSearchAndFilters({ isOpen, onClose }: TagsSearchAndFiltersProps) {
    const { getParam, getBooleanParam, setParams } = useUrlState({ scroll: false });

    // Local state - only updated to URL when Apply is clicked
    const [search, setSearch] = useState('');
    const [includeShared, setIncludeShared] = useState(false);
    const [sort, setSort] = useState<'name' | 'date' | 'usage'>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    // Initialize local state from URL when component opens
    useEffect(() => {
        if (isOpen) {
            setSearch(getParam('search') || '');
            setIncludeShared(getBooleanParam('includeShared'));
            setSort((getParam('sort') as 'name' | 'date' | 'usage') || 'name');
            setOrder((getParam('order') as 'asc' | 'desc') || 'asc');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleSortChange = (value: 'name' | 'date' | 'usage') => {
        if (value !== sort) {
            setSort(value);
            setOrder('asc');
        }
    };

    const handleClearAll = () => {
        setSearch('');
        setIncludeShared(false);
        setSort('name');
        setOrder('asc');
    };

    const handleApplyFilters = () => {
        // Only update URL when Apply is clicked
        setParams({
            search: search || null,
            includeShared: includeShared || null,
            sort: sort === 'name' ? null : sort,
            order: order === 'asc' ? null : order
        });
        onClose();
    };

    const handleCancel = () => {
        // Reset local state to current URL values and close
        setSearch(getParam('search') || '');
        setIncludeShared(getBooleanParam('includeShared'));
        setSort((getParam('sort') as 'name' | 'date' | 'usage') || 'name');
        setOrder((getParam('order') as 'asc' | 'desc') || 'asc');
        onClose();
    };

    // Count active local filters (includeShared should NOT count as a filter)
    const activeFiltersCount = [
        search,
        sort !== 'name',
        order !== 'asc'
    ].filter(Boolean).length;

    // Show chips/clear when any filter differs from defaults (includeShared included)
    const hasAnyChanges = Boolean(search) || includeShared || sort !== 'name' || order !== 'asc';

    if (!isOpen) return null;

    return (
        <div className="bg-card border-b shadow-sm">
            <div className="p-2 sm:p-2 space-y-3">
                {/* Mobile: stacked controls */}
                <div className="sm:hidden space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tags..."
                            aria-label="Search tags"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyFilters();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            className="pl-10 pr-10 h-10 text-sm"
                        />
                        {search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Clear search"
                                onClick={() => setSearch('')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Include Shared Toggle */}
                    <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="include-shared" className="text-sm">Include shared</Label>
                        </div>
                        <Switch
                            id="include-shared"
                            checked={includeShared}
                            onCheckedChange={(v) => setIncludeShared(!!v)}
                            aria-label="Include shared tags"
                        />
                    </div>

                    {/* Sort + Order */}
                    <div className="flex flex-col gap-2">
                        <div className="flex-1">
                            <Label className="mb-1 block text-xs text-muted-foreground">Sort by</Label>
                            <Select value={sort} onValueChange={(v) => handleSortChange(v as 'name' | 'date' | 'usage')}>
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue placeholder="Select sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="usage">Usage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="w-full">
                                <Label className="mb-1 block text-xs text-muted-foreground">Order</Label>
                                <div className="inline-flex w-full sm:w-auto rounded-md border bg-background p-0.5">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={order === 'asc' ? 'default' : 'ghost'}
                                        aria-pressed={order === 'asc'}
                                        className="h-9 px-3 rounded-md sm:rounded-l-md sm:rounded-r-none"
                                        onClick={() => setOrder('asc')}
                                    >
                                        <ChevronUp className="h-4 w-4 mr-1" /> Asc
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={order === 'desc' ? 'default' : 'ghost'}
                                        aria-pressed={order === 'desc'}
                                        className="h-9 px-3 rounded-md sm:rounded-r-md sm:rounded-l-none"
                                        onClick={() => setOrder('desc')}
                                    >
                                        <ChevronDown className="h-4 w-4 mr-1" /> Desc
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active filters preview - Compact */}
                    {hasAnyChanges && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t">
                            {search && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    &ldquo;{search.length > 15 ? search.slice(0, 15) + '...' : search}&rdquo;
                                </Badge>
                            )}
                            {includeShared && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    Shared
                                </Badge>
                            )}
                            {sort !== 'name' && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
                                    {sort}
                                    {order === 'asc' ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
                                </Badge>
                            )}
                            {order !== 'asc' && sort === 'name' && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
                                    {sort}
                                    <ChevronDown className="h-2.5 w-2.5" />
                                </Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="h-5 px-1.5 text-xs text-muted-foreground ml-auto hover:text-foreground"
                            >
                                Clear
                            </Button>
                        </div>
                    )}

                    {/* Action buttons - Compact */}
                    <div className="flex gap-2 pt-1">
                        <Button
                            onClick={handleApplyFilters}
                            className="flex-1 h-10 text-sm font-medium"
                            size="sm"
                        >
                            Apply
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-1.5 bg-white/20 text-white px-1.5 py-0 text-xs">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="h-10 px-4 text-sm"
                            size="sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

                {/* Desktop: compact toolbar */}
                <TooltipProvider>
                    <div className="hidden sm:flex items-center gap-2">
                        {/* Search */}
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tags..."
                                aria-label="Search tags"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleApplyFilters();
                                    if (e.key === 'Escape') handleCancel();
                                }}
                                className="pl-10 pr-8 h-9 text-sm"
                            />
                            {search && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Clear search"
                                    onClick={() => setSearch('')}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>

                        {/* Include shared icon toggle */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant={includeShared ? 'default' : 'outline'}
                                    size="sm"
                                    aria-pressed={includeShared}
                                    onClick={() => setIncludeShared((v) => !v)}
                                    className="h-9 px-2"
                                >
                                    <Users className="h-4 w-4" />
                                    <span className="sr-only">Include shared</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Include shared tags</TooltipContent>
                        </Tooltip>

                        {/* Sort */}
                        <div>
                            <Select value={sort} onValueChange={(v) => handleSortChange(v as 'name' | 'date' | 'usage')}>
                                <SelectTrigger size="sm" className="h-9 min-w-[8rem]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="usage">Usage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Order segmented */}
                        <div className="inline-flex rounded-md border bg-background p-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={order === 'asc' ? 'default' : 'ghost'}
                                        aria-pressed={order === 'asc'}
                                        className="h-9 px-2.5 rounded-md rounded-r-none"
                                        onClick={() => setOrder('asc')}
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                        <span className="sr-only">Ascending</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ascending</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={order === 'desc' ? 'default' : 'ghost'}
                                        aria-pressed={order === 'desc'}
                                        className="h-9 px-2.5 rounded-md rounded-l-none"
                                        onClick={() => setOrder('desc')}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                        <span className="sr-only">Descending</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Descending</TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex-1" />

                        {hasAnyChanges && (
                            <div className="flex items-center gap-2">
                                {search && (
                                    <Badge variant="secondary" className="hidden md:inline-flex">Search</Badge>
                                )}
                                {includeShared && (
                                    <Badge variant="secondary" className="hidden md:inline-flex">Shared</Badge>
                                )}
                                {(sort !== 'name' || order !== 'asc') && (
                                    <Badge variant="secondary" className="hidden md:inline-flex">{sort}{order === 'desc' ? ' • Desc' : ''}</Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Clear
                                </Button>
                            </div>
                        )}

                        <Button size="sm" onClick={handleApplyFilters} className="h-9 px-4">
                            Apply
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="h-9 px-3">
                            Cancel
                        </Button>
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}