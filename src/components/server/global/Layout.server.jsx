import {Suspense} from 'react';
import {CacheLong, useLocalization, useShopQuery} from '@shopify/hydrogen';
import {parseMenu} from 'lib';
import {LAYOUT_QUERY} from 'graphql-query';
import {Footer} from '../index';
import {Header} from 'client-comp';

const HEADER_MENU_HANDLE = 'main-menu';
const FOOTER_MENU_HANDLE = 'footer';

const SHOP_NAME_FALLBACK = 'Hydrogen';

export function Layout({children}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Suspense fallback={<Header title={SHOP_NAME_FALLBACK} />}>
          <HeaderWithMenu />
        </Suspense>
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <Suspense fallback={<Footer />}>
        <FooterWithMenu />
      </Suspense>
    </>
  );
}

function HeaderWithMenu() {
  const {shopName, headerMenu} = useLayoutQuery();
  return <Header title={shopName} menu={headerMenu} />;
}

function FooterWithMenu() {
  const {footerMenu} = useLayoutQuery();
  return <Footer menu={footerMenu} />;
}

function useLayoutQuery() {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: LAYOUT_QUERY,
    variables: {
      language: languageCode,
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    cache: CacheLong(),
    preload: '*',
  });

  const shopName = data ? data.shop.name : SHOP_NAME_FALLBACK;

  /*
        Modify specific links/routes (optional)
        @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
        e.g here we map:
          - /blogs/news -> /news
          - /blog/news/blog-post -> /news/blog-post
          - /collections/all -> /products
      */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return {footerMenu, headerMenu, shopName};
}
