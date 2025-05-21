import { useLiveQuery } from '@tanstack/react-db';
import { Link } from 'react-router-dom';
import { spiceCollection } from '../queries';
import { Spice } from '../types';
import { Skeleton } from '../components/ui/skeleton';

export const Spices = ({ searchString }: { searchString?: string }) => {
  const { data: spicesData } = useLiveQuery((query) =>
    query
      .from({ spiceCollection })
      .select('@name', '@id', '@color', '@heat', '@price')
      .keyBy('@id'),
  );

  const spicesArray: Spice[] = spicesData ? Object.values(spicesData) : [];

  const filteredSpices = spicesArray
    .filter((spice) =>
      spice.name.toLowerCase().includes(searchString?.toLowerCase() ?? ''),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!spicesArray.length) {
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

  if (!filteredSpices.length) {
    return (
      <div>No spices found {searchString && `matching "${searchString}"`}.</div>
    );
  }

  return (
    <ul>
      {filteredSpices.map((spice) => (
        <li key={spice.id}>
          <Link to={`/spices/${spice.id}`}>{spice.name}</Link>
        </li>
      ))}
    </ul>
  );
};
