import {TOP_PRODUCTS_QUERY} from 'graphql-query';

export async function api(_request, {queryShop}) {
  const {
    data: {products},
  } = await queryShop({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count: 4,
    },
  });

  return products.nodes;
}
