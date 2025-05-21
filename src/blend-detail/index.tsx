import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from '@tanstack/react-db';
import { blendCollection, spiceCollection } from '../queries';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import { FlowerIcon, MoveLeft, SaladIcon, SlashIcon } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Spice } from '../types';

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

  const spicePriciness = (spice: Spice) =>
    spice?.price === '$'
      ? 'Inexpensive'
      : spice?.price === '$$$'
      ? 'Moderately priced'
      : 'Expensive';

  return (
    <div className="flex flex-col gap-4 m-4">
      <div className="flex items-center gap-2">
        <MoveLeft />
        <Link to="/">Back to Home</Link>
      </div>
      {blend && (
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl font-bold">{blend?.name}</h1>
            </CardTitle>
            <CardDescription>
              <h2>{blend?.description}</h2>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resolvedSpices && resolvedSpices.length > 0 && (
              <>
                <h3 className="text-md font-bold">Included spices:</h3>
                <section>
                  <ul>
                    {resolvedSpices.map((spice) => (
                      <li
                        key={`${spice?.id}-${spice?.name}`}
                        className="flex items-center gap-2"
                      >
                        <FlowerIcon
                          className="w-4 h-4"
                          color={`#${spice?.color ?? '000000'}`}
                        />
                        <Link to={`/spices/${spice?.id}`}>{spice?.name}</Link>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {spicePriciness(spice as Spice)}
                          <SlashIcon className="w-4 h-4" />
                          <span className="text-xs flex items-center gap-1">
                            {Array.from(
                              { length: spice?.heat || 0 },
                              (_, i) => (
                                <span key={i} className="text-xs">
                                  🌶️
                                </span>
                              ),
                            )}
                          </span>
                        </Badge>

                        <div className="flex items-center gap-1"></div>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
            {resolvedBlends && resolvedBlends?.length > 0 && (
              <>
                <Separator className="my-4 bg-muted" />
                <section>
                  <h3 className="text-md font-bold">Included blends:</h3>
                  <ul>
                    {resolvedBlends.map((childBlend) => (
                      <li
                        key={`${childBlend?.id}-${childBlend?.name}`}
                        className="flex items-center gap-2"
                      >
                        <SaladIcon className="w-4 h-4" />
                        <Link to={`/blends/${childBlend?.id}`}>
                          {childBlend?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlendDetail;
