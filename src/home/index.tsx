import { useState } from 'react';
import { Blends } from './Blends';
import { Spices } from './Spices';
import { Input } from '../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

function Home() {
  const [searchString, updateSearchString] = useState('');

  return (
    <section className="flex flex-col gap-4 m-4">
      <div>
        <Input
          placeholder="Search spices and blends..."
          value={searchString}
          onChange={(e) => {
            updateSearchString(e.target.value);
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blend List</CardTitle>
          <CardDescription>
            <h1>A lovely list of spice blends!</h1>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Blends searchString={searchString} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spice List</CardTitle>
          <CardDescription>
            <h1>Find your favorite spices!</h1>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Spices searchString={searchString} />
        </CardContent>
      </Card>
    </section>
  );
}

export default Home;
