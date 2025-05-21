import { Link, useParams } from 'react-router-dom';
import { spiceCollection } from '../queries';
import { useLiveQuery } from '@tanstack/react-db';

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

  return (
    <div>
      <div>Spice Name: {spice?.name}</div>
      <div>Spice Color: {spice?.color}</div>
      <div>Spice Cost: {spice?.price}</div>
      <div>Spice Heat Level: {spice?.heat}</div>
    </div>
  );
};

const SpiceDetail = () => {
  const { id: spiceId } = useParams<{ id: string }>();
  const spiceIdNumber = Number(spiceId);

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h2>Spice Detail Page</h2>
      <SpiceDetailContent id={spiceIdNumber} />
    </div>
  );
};

export default SpiceDetail;
