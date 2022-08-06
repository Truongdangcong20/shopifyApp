import {useLocalization, useShopQuery, useUrl} from '@shopify/hydrogen';

import {PAGINATION_SIZE} from 'lib';
import {ProductGrid, Section, Text} from 'client-comp';
import {NoResultRecommendations, SearchPage} from 'server-comp';
import {Suspense} from 'react';
import {PAGINATE_SEARCH_QUERY, SEARCH_QUERY} from 'graphql-query';

export default function Search({pageBy = PAGINATION_SIZE, params}) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {handle} = params;
  const {searchParams} = useUrl();

  const searchTerm = searchParams.get('q');

  const {data} = useShopQuery({
    query: SEARCH_QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      pageBy,
      searchTerm,
    },
    preload: true,
  });

  const products = data?.products;
  const noResults = products?.nodes?.length === 0;

  if (!searchTerm || noResults) {
    return (
      <SearchPage searchTerm={searchTerm ? decodeURI(searchTerm) : null}>
        {noResults && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
        <Suspense>
          <NoResultRecommendations
            country={countryCode}
            language={languageCode}
          />
        </Suspense>
      </SearchPage>
    );
  }

  return (
    <SearchPage searchTerm={decodeURI(searchTerm)}>
      <Section>
        <ProductGrid
          key="search"
          url={`/search?country=${countryCode}&q=${searchTerm}`}
          collection={{products}}
        />
      </Section>
    </SearchPage>
  );
}

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
  const searchTerm = url.searchParams.get('q');
  const {handle} = params;

  return await queryShop({
    query: PAGINATE_SEARCH_QUERY,
    variables: {
      handle,
      cursor,
      pageBy: PAGINATION_SIZE,
      country,
      searchTerm,
    },
  });
}
