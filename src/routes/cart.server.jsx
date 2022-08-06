import {
  CacheNone,
  Seo,
  useLocalization,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import {CartDetails, PageHeader, Section} from 'client-comp';
import {CUSTOMER_QUERY} from 'graphql-query';
import {Layout} from '../components/server';

export default function Cart({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

  const {id} = customer;

  return (
    <Layout>
      <Seo type="page" data={{title: 'Cart'}} />
      <PageHeader heading="Your Cart" className="max-w-7xl mx-auto" />
      <Section className="max-w-7xl mx-auto">
        <CartDetails layout="page" idUser={id} />
      </Section>
    </Layout>
  );
}
