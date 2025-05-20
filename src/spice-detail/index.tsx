import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const SpiceDetail = () => {
  const { id } = useParams();

  const { data: spice } = useQuery({
    queryKey: ['spice', id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/spices/${id}`);
      return response.json();
    },
  });

  return (
    <div>
      <h2>Spice Detail Page</h2>
      {spice && (
        <div>
          <div>Spice Name: {spice.name}</div>
          <div>Spice Color: {spice.color}</div>
          <div>Spice Cost: {spice.price}</div>
          <div>Spice Heat Level: {spice.heat}</div>
        </div>
      )}
    </div>
  );
};

export default SpiceDetail;
