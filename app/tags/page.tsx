import TagManager from './_components/TagManager';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';

type SearchParams = {
  search?: string;
  includeShared?: string;
  sort?: 'name' | 'date' | 'usage';
  order?: 'asc' | 'desc';
  view?: 'grid' | 'list';
  selected?: string;
  action?: 'create' | 'edit' | 'share' | 'delete';
};

interface TagsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const params = await searchParams;

  // Preload the tags query with server-side parameters
  const preloadedTags = await preloadQuery(
    api.tags.list,
    {
      // Default to true when the param is not provided
      includeShared: params.includeShared === undefined ? true : params.includeShared === 'true',
      search: params.search || undefined,
      sort: params.sort || 'name',
      order: params.order || 'asc',
    },
    { token: await convexAuthNextjsToken() }
  );

  return (
    <div className="min-h-screen bg-background">
      <TagManager preloadedTags={preloadedTags} />
    </div>
  );
}