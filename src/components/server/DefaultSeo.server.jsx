import {CacheLong, Seo, useShopQuery} from '@shopify/hydrogen';
import {DEFAULT_SEO_QUERY} from 'graphql-query';

export function DefaultSeo() {
  const {
    data: {
      shop: {name, description},
    },
  } = useShopQuery({
    query: DEFAULT_SEO_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  return (
    <Seo
      type="defaultSeo"
      data={{
        title: name,
        description,
        titleTemplate: `%s · ${name}`,
      }}
    />
  );
}
