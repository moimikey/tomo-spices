import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from '@tanstack/react-db';
import { blendCollection, spiceCollection } from '../queries';

const BlendDetail = () => {
  const { id: blendId } = useParams<{ id: string }>();
  const blendIdNumber = Number(blendId);

  const { data: blends } = useLiveQuery(
    (query) =>
      query
        .from({ blendCollection })
        .where('@id', '=', blendIdNumber)
        .select('@name', '@id', '@description', '@spices', '@blends')
        .keyBy('@id'),
    [blendIdNumber],
  );
  const blend = blends?.[0];

  const { data: allSpicesArray } = useLiveQuery((query) =>
    query
      .from({ spiceCollection })
      .select('@name', '@id', '@color', '@heat', '@price')
      .keyBy('@id'),
  );

  const { data: allBlendsArray } = useLiveQuery((query) =>
    query
      .from({ blendCollection })
      .select('@name', '@id', '@description', '@spices', '@blends')
      .keyBy('@id'),
  );

  const resolvedSpices = blend?.spices.map((spiceId: number) => {
    return allSpicesArray.find((s) => s.id === spiceId);
  });

  const resolvedBlends = blend?.blends.map((blendId: number) => {
    return allBlendsArray.find((b) => b.id === blendId);
  });

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h2>Blend Detail Page</h2>
      <div>Blend Name: {blend?.name}</div>
      <div>Description: {blend?.description}</div>
      {resolvedSpices && resolvedSpices.length > 0 && (
        <>
          <hr />
          <div>
            Spices:
            <ul>
              {resolvedSpices.map((spice) => (
                <li key={`${spice?.id}-${spice?.name}`}>
                  <Link to={`/spices/${spice?.id}`}>{spice?.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {resolvedBlends && resolvedBlends?.length > 0 && (
        <>
          <hr />
          <div>
            Child Blends:
            <ul>
              {resolvedBlends.map((childBlend) => (
                <li key={`${childBlend?.id}-${childBlend?.name}`}>
                  <Link to={`/blends/${childBlend?.id}`}>
                    {childBlend?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default BlendDetail;
