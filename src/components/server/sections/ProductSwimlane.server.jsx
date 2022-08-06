import {Suspense, useMemo} from 'react';
import {useLocalization, useShopQuery} from '@shopify/hydrogen';
import {ProductCard, Section} from 'client-comp';
import {RECOMMENDED_PRODUCTS_QUERY, TOP_PRODUCTS_QUERY} from 'graphql-query';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane({
  title = 'Featured Products',
  data = mockProducts,
  count = 12,
  ...props
}) {
  const productCardsMarkup = useMemo(() => {
    if (typeof data === 'object') {
      return <ProductCards products={data} />;
    }

    if (typeof data === 'string') {
      return (
        <Suspense fallback={true}>
          <RecommendedProducts productId={data} count={count} />
        </Suspense>
      );
    }

    return <TopProducts count={count} />;
  }, [count, data]);

  return (
    <Section heading={title} padding="y" {...props}>
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {productCardsMarkup}
      </div>
    </Section>
  );
}

function ProductCards({products}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          className={'snap-start w-80'}
        />
      ))}
    </>
  );
}

function RecommendedProducts({productId, count}) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data: products} = useShopQuery({
    query: RECOMMENDED_PRODUCTS_QUERY,
    variables: {
      count,
      productId,
      languageCode,
      countryCode,
    },
  });

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return <ProductCards products={mergedProducts} />;
}

function TopProducts({count}) {
  const {
    data: {products},
  } = useShopQuery({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count,
    },
  });

  return <ProductCards products={products.nodes} />;
}
