import { useState } from 'react';
import { Blends } from './Blends';
import { Spices } from './Spices';

function Home() {
  const [searchString, updateSearchString] = useState('');

  return (
    <section>
      <div>
        <input
          placeholder="Search spices and blends..."
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
      </div>
      <h4>Blend List</h4>
      <Blends searchString={searchString} />
      <h4>Spice List</h4>
      <Spices searchString={searchString} />
    </section>
  );
}

export default Home;
