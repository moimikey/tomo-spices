import { Link } from 'react-router-dom';
import { Blend, Spice } from '../types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchBlendsQueryFn,
  fetchSpicesQueryFn,
  queryClient,
} from '../queries';

const Spices = ({ searchString }: { searchString?: string }) => {
  const { data: spices } = useQuery({
    queryKey: ['spices'],
    queryFn: fetchSpicesQueryFn,
    initialData: () => queryClient.getQueryData<Spice[]>(['spices']),
  });

  return (
    <ul>
      {spices
        ?.filter((spice: Spice) =>
          spice.name.toLowerCase().includes(searchString?.toLowerCase() ?? ''),
        )
        .map((spice: Spice) => (
          <li key={spice.id}>
            <Link to={`/spices/${spice.id}`}>{spice.name}</Link>
          </li>
        ))}
    </ul>
  );
};

const Blends = ({ searchString }: { searchString?: string }) => {
  const { data: blends } = useQuery({
    queryKey: ['blends'],
    queryFn: fetchBlendsQueryFn,
    initialData: () => queryClient.getQueryData<Blend[]>(['blends']),
  });

  return (
    <ul>
      {blends
        ?.filter((blend: Blend) =>
          blend.name.toLowerCase().includes(searchString?.toLowerCase() ?? ''),
        )
        .map((blend: Blend) => (
          <li key={blend.id}>
            <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
          </li>
        ))}
    </ul>
  );
};

function Home() {
  const [searchString, updateSearchString] = useState('');

  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Spice List</h4>
      <div>
        <input
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
      </div>
      <Spices searchString={searchString} />
      <h4>Blend List</h4>
      <Blends searchString={searchString} />
    </div>
  );
}

export default Home;
