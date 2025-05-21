import { useLiveQuery } from '@tanstack/react-db';
import { Link } from 'react-router-dom';
import { blendCollection } from '../queries';
import { Blend } from '../types';
import { Skeleton } from '../components/ui/skeleton';

export const Blends = ({ searchString }: { searchString?: string }) => {
  const { data: blendsData } = useLiveQuery((query) =>
    query
      .from({ blendCollection })
      .select('@name', '@id', '@description', '@spices', '@blends')
      .keyBy('@id'),
  );

  const blendsArray: Blend[] = blendsData ? Object.values(blendsData) : [];

  const filteredBlends = blendsArray
    .filter((blend) =>
      blend.name.toLowerCase().includes(searchString?.toLowerCase() ?? ''),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!blendsArray.length) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!filteredBlends.length) {
    return (
      <div>No blends found {searchString && `matching "${searchString}"`}.</div>
    );
  }

  return (
    <ul>
      {filteredBlends.map((blend) => (
        <li key={blend.id}>
          <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
        </li>
      ))}
    </ul>
  );
};
