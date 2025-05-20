import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Blend, Spice } from '../types';
import {
  fetchBlendByIdQueryFn,
  fetchBlendsQueryFn,
  fetchSpicesQueryFn,
} from '../queries';
import { useMemo } from 'react';

const BlendDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: blend } = useQuery({
    queryKey: ['blend', id],
    queryFn: () => fetchBlendByIdQueryFn(id),
    initialData: () => queryClient.getQueryData<Spice>(['spice', id]),
  });

  const { data: spices } = useQuery({
    queryKey: ['spices'],
    queryFn: () => fetchSpicesQueryFn(),
    initialData: () => queryClient.getQueryData<Spice[]>(['spices']),
  });

  const { data: blends } = useQuery({
    queryKey: ['blends'],
    queryFn: () => fetchBlendsQueryFn(),
    initialData: () => queryClient.getQueryData<Blend[]>(['blends']),
  });

  const resolvedSpices = useMemo(() => {
    if (!blend?.spices || !spices) {
      return [];
    }

    return blend.spices.map((spiceId: number) => {
      const foundSpice = spices.find((spice: Spice) => spice.id === spiceId);
      return (
        foundSpice || {
          id: spiceId,
          name: `Spice ID ${spiceId} (details not found)`,
        }
      );
    });
  }, [blend, spices]);

  const resolvedBlends = useMemo<Blend[]>(() => {
    if (!blend?.blends || !blends) {
      return [];
    }

    return blend.blends.map((blendId: number) => {
      const foundBlend = blends.find((blend: Blend) => blend.id === blendId);
      return (
        foundBlend || {
          id: blendId,
          name: `Blend ID ${blendId} (details not found)`,
        }
      );
    });
  }, [blend, blends]);

  if (!blend) {
    return <div>Blend not found or ID is missing.</div>;
  }

  return (
    <div>
      <h2>Blend Detail Page</h2>
      <div>Blend Name: {blend?.name}</div>
      <div>Description: {blend?.description}</div>
      <hr />
      <div>
        Spices:
        {resolvedSpices.length > 0 ? (
          <ul>
            {resolvedSpices.map((spice: Spice) => (
              <li key={`${spice.id}-${spice.name}`}>
                <Link to={`/spices/${spice.id}`}>{spice.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            No spices listed for this blend (or spices data is still
            loading/unavailable).
          </div>
        )}
      </div>
      <hr />
      <div>
        {blend.blends && blend.blends.length > 0 && (
          <div>Child Blend IDs: {blend.blends.join(', ')}</div>
        )}
      </div>
      <div>
        {resolvedBlends && resolvedBlends.length > 0 && (
          <ul>
            {resolvedBlends.map((blend) => (
              <li key={`${blend.id}-${blend.name}`}>
                <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlendDetail;
