import {Suspense} from 'react';
import {Seo, useLocalization, useShopQuery} from '@shopify/hydrogen';
import {Grid, PageHeader, Section} from 'client-comp';
import {CollectionCard, Layout} from '../../components/server';
import {getImageLoadingPriority, PAGINATION_SIZE} from 'lib';
import {COLLECTIONS_QUERY} from 'graphql-query';

export default function Collections() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'All Collections'}} />
      <PageHeader heading="Collections" />
      <Section>
        <Suspense>
          <CollectionGrid />
        </Suspense>
      </Section>
    </Layout>
  );
}

function CollectionGrid() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: COLLECTIONS_QUERY,
    variables: {
      pageBy: PAGINATION_SIZE,
      country: countryCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data.collections.nodes;

  return (
    <Grid items={collections.length === 3 ? 3 : 2}>
      {collections.map((collection, i) => (
        <CollectionCard
          collection={collection}
          key={collection.id}
          loading={getImageLoadingPriority(i, 2)}
        />
      ))}
    </Grid>
  );
}
