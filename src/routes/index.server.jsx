import {Suspense} from 'react';
import {
  CacheLong,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {getHeroPlaceholder} from 'lib';
import {FeaturedCollections, Hero} from 'client-comp';
import {Layout, ProductSwimlane} from 'server-comp';
import {HOMEPAGE_CONTENT_QUERY, HOMEPAGE_SEO_QUERY} from 'graphql-query';

import info from 'assets/info.json';
import {HomePageFallback} from 'fallback-comp';

export default function Homepage() {
  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });

  return (
    <Suspense fallback={<HomePageFallback />}>
      <Layout>
        <SeoForHomepage />
        <HomepageContent />
      </Layout>
    </Suspense>
  );
}

function HomepageContent() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: HOMEPAGE_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {heroBanners, featuredCollections, featuredProducts} = data;

  const [primaryHero, secondaryHero, tertiaryHero] = getHeroPlaceholder(
    heroBanners.nodes,
  );

  return (
    <>
      {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )}
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      {secondaryHero && <Hero {...secondaryHero} />}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
      {tertiaryHero && <Hero {...tertiaryHero} />}
    </>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title: shopTitle, description: shopDescription},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  const {
    homepage: {
      SEO: {
        title: homepageTitle,
        description: homepageDescription,
        titleTemplate: homepageTitleTemplate,
      },
    },
  } = info;

  return (
    <Seo
      type="homepage"
      data={{
        title: homepageTitle || shopTitle,
        description: homepageDescription || shopDescription,
        titleTemplate: homepageTitleTemplate || '%s · Powered by Hydrogen',
      }}
    />
  );
}
