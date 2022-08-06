import {CacheLong, useShopQuery} from '@shopify/hydrogen';
import {SHOP_QUERY} from 'graphql-query';

export default function AdminRedirect({response}) {
  const {data} = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
  });

  const {url} = data.shop.primaryDomain;
  return response.redirect(`${url}/admin`);
}
