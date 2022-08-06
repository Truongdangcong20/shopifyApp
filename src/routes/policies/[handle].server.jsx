import {
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {Button, PageHeader, Section} from 'client-comp';
import {Layout, NotFound} from '../../components/server';
import {POLICIES_QUERY_HANDLER} from 'graphql-query';

export default function Policy({params}) {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();
  const {handle} = params;

  // standard policy pages
  const policy = {
    privacyPolicy: handle === 'privacy-policy',
    shippingPolicy: handle === 'shipping-policy',
    termsOfService: handle === 'terms-of-service',
    refundPolicy: handle === 'refund-policy',
  };

  // if not a valid policy route, return not found
  if (
    !policy.privacyPolicy &&
    !policy.shippingPolicy &&
    !policy.termsOfService &&
    !policy.refundPolicy
  ) {
    return <NotFound />;
  }

  // The currently visited policy page key
  const activePolicy = Object.keys(policy).find((key) => policy[key]);

  const {
    data: {shop},
  } = useShopQuery({
    query: POLICIES_QUERY_HANDLER,
    variables: {
      languageCode,
      ...policy,
    },
  });

  const page = shop?.[activePolicy];

  // If the policy page is empty, return not found
  if (!page) {
    return <NotFound />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="page" data={page} />
      </Suspense>
      <Section
        padding="all"
        display="flex"
        className="flex-col items-baseline w-full gap-8 md:flex-row"
      >
        <PageHeader
          heading={page.title}
          className="grid items-start flex-grow gap-4 md:sticky top-36 md:w-5/12"
        >
          <Button
            className="justify-self-start"
            variant="inline"
            to={'/policies'}
          >
            &larr; Back to Policies
          </Button>
        </PageHeader>
        <div className="flex-grow w-full md:w-7/12">
          <div
            dangerouslySetInnerHTML={{__html: page.body}}
            className="prose dark:prose-invert"
          />
        </div>
      </Section>
    </Layout>
  );
}
