import { Link, useParams } from 'react-router-dom';
import { spiceCollection } from '../queries';
import { useLiveQuery } from '@tanstack/react-db';
import { MoveLeft } from 'lucide-react';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Card } from '../components/ui/card';

const SpiceDetailContent = ({ id }: { id: number }) => {
  const { data: spices } = useLiveQuery(
    (query) =>
      query
        .from({ spiceCollection })
        .where('@id', '=', id)
        .select('@name', '@id', '@color', '@heat', '@price')
        .keyBy('@id'),
    [id],
  );

  const spice = spices?.[0];

  const spicePriciness =
    spice?.price === '$'
      ? 'Inexpensive'
      : spice?.price === '$$'
      ? 'Moderately priced'
      : 'Expensive';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 items-center">
          <h1 className="text-2xl font-bold">{spice?.name}</h1>
          <h2>
            {Array.from({ length: spice?.heat || 0 }, (_, i) => (
              <span key={i}>🌶️</span>
            ))}
          </h2>
        </CardTitle>
        <CardDescription>
          <h2>
            {spice?.price} - {spicePriciness}
          </h2>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const SpiceDetail = () => {
  const { id: spiceId } = useParams<{ id: string }>();
  const spiceIdNumber = Number(spiceId);

  return (
    <section className="flex flex-col gap-4 m-4">
      <div className="flex items-center gap-2">
        <MoveLeft />
        <Link to="/">Back to Home</Link>
      </div>

      <div className="flex flex-col gap-4">
        <SpiceDetailContent id={spiceIdNumber} />
      </div>
    </section>
  );
};

export default SpiceDetail;
