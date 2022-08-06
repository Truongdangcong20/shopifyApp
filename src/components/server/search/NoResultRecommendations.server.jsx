import {useShopQuery} from '@shopify/hydrogen';
import {FeaturedCollections} from 'client-comp';
import {ProductSwimlane} from '../index';
import {PAGINATION_SIZE} from 'lib';
import {SEARCH_NO_RESULTS_QUERY} from 'graphql-query';

export function NoResultRecommendations({country, language}) {
  const {data} = useShopQuery({
    query: SEARCH_NO_RESULTS_QUERY,
    variables: {
      country,
      language,
      pageBy: PAGINATION_SIZE,
    },
    preload: false,
  });

  return (
    <>
      <FeaturedCollections
        title="Trending Collections"
        data={data.featuredCollections.nodes}
      />
      <ProductSwimlane
        title="Trending Products"
        data={data.featuredProducts.nodes}
      />
    </>
  );
}
