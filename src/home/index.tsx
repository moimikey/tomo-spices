import { Link } from 'react-router-dom';
import { Blend, Spice } from '../types';
import { useState } from 'react';
import { spiceCollection, blendCollection } from '../queries';
import { useLiveQuery } from '@tanstack/react-db';

const Spices = ({ searchString }: { searchString?: string }) => {
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
    return <div>Loading spices...</div>;
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

const Blends = ({ searchString }: { searchString?: string }) => {
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
    return <div>Loading blends...</div>;
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

function Home() {
  const [searchString, updateSearchString] = useState('');

  return (
    <section>
      <div className="flex flex-col gap-4 ">
        <input
          placeholder="Search spices and blends..."
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
      </div>
      <hr />
      <h4>Blend List</h4>
      <Blends searchString={searchString} />
      <h4>Spice List</h4>
      <Spices searchString={searchString} />
    </section>
  );
}

export default Home;
