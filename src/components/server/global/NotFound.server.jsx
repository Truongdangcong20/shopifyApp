import {useLocalization, useShopQuery} from '@shopify/hydrogen';

import {Suspense} from 'react';
import {Button, FeaturedCollections, PageHeader, Text} from 'client-comp';
import {Layout, ProductSwimlane} from '../index';
import {NOT_FOUND_QUERY} from 'graphql-query';

export function NotFound({response, type = 'page'}) {
  if (response) {
    response.status = 404;
    response.statusText = 'Not found';
  }

  const heading = `We've lost this ${type}`;
  const description = `We couldn’t find the ${type} you're looking for. Try checking the URL or heading back to the home page.`;

  return (
    <Layout>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <Suspense>
        <FeaturedSection />
      </Suspense>
    </Layout>
  );
}

function FeaturedSection() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: NOT_FOUND_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {featuredCollections, featuredProducts} = data;

  return (
    <>
      {featuredCollections.nodes.length < 2 && (
        <FeaturedCollections
          title="Popular Collections"
          data={featuredCollections.nodes}
        />
      )}
      <ProductSwimlane data={featuredProducts.nodes} />
    </>
  );
}
