import {PRODUCT_QUERY} from 'graphql-query';

export async function api(_request, {queryShop}) {
  const handle = new URL(_request.url).searchParams.get('id');

  const {
    data: {product},
  } = await queryShop({
    query: PRODUCT_QUERY,
    variables: {
      handle,
    },
  });

  return product;
}
