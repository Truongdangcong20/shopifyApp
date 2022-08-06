import {Suspense} from 'react';
import {Seo, useLocalization, useShopQuery} from '@shopify/hydrogen';

import {PAGINATION_SIZE} from 'lib';
import {PageHeader, ProductGrid, Section} from 'client-comp';
import {Layout} from '../../components/server';
import {ALL_PRODUCTS_QUERY, PAGINATE_ALL_PRODUCTS_QUERY} from 'graphql-query';

export default function AllProducts() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'All Products'}} />
      <PageHeader heading="All Products" variant="allCollections" />
      <Section>
        <Suspense>
          <AllProductsGrid />
        </Suspense>
      </Section>
    </Layout>
  );
}

function AllProductsGrid() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy: PAGINATION_SIZE,
    },
    preload: true,
  });

  const products = data.products;

  return (
    <ProductGrid
      key="products"
      url={`/products?country=${countryCode}`}
      collection={{products}}
    />
  );
}

// API to paginate products
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(request, {params, queryShop}) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {Allow: 'POST'},
    });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const {handle} = params;

  return await queryShop({
    query: PAGINATE_ALL_PRODUCTS_QUERY,
    variables: {
      handle,
      cursor,
      pageBy: PAGINATION_SIZE,
      country,
    },
  });
}
