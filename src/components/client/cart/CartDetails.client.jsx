import {useRef} from 'react';
import {useScroll} from 'react-use';
import {
  CartLineProvider,
  CartShopPayButton,
  fetchSync,
  Link,
  Money,
  useCart,
} from '@shopify/hydrogen';

import {Button, CartEmpty, CartLineItem, Text} from '../index';

export function CartDetails(props) {
  const {layout, onClose, idUser} = props;

  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);

  const {id, cost} = useCart();

  const lines = id
    ? fetchSync(
        `/api/applyDiscount?id=${encodeURIComponent(id)}&id_user=${idUser}`,
      ).json()
    : [];

  if (lines.length === 0) {
    return <CartEmpty onClose={onClose} layout={layout} />;
  }

  const container = {
    drawer: 'grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]',
    page: 'pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12',
  };

  const content = {
    drawer: 'px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12',
    page: 'flex-grow md:translate-y-4',
  };

  const summary = {
    drawer: 'grid gap-6 p-6 border-t md:px-12',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full',
  };

  return (
    <form className={container[layout]}>
      <section
        ref={scrollRef}
        aria-labelledby="cart-contents"
        className={`${content[layout]} ${y > 0 ? 'border-t' : ''}`}
      >
        <ul className="grid gap-6 md:gap-10">
          {lines.map((line) => {
            return (
              <CartLineProvider key={line.id} line={line}>
                <CartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="summary-heading" className={summary[layout]}>
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        {cost && cost.subtotalAmount && (
          <OrderSummary
            discountsPrice={lines
              .map(({discountPrice}) => discountPrice)
              .reduce((a, b) => {
                return a + b;
              })}
            subtotalAmount={cost.subtotalAmount}
          />
        )}
        <CartCheckoutActions />
      </section>
    </form>
  );
}

function CartCheckoutActions() {
  const {checkoutUrl} = useCart();
  return (
    <>
      <div className="grid gap-4">
        {checkoutUrl ? (
          <Link to={checkoutUrl} prefetch={false} target="_self">
            <Button as="span" width="full">
              Continue to Checkout
            </Button>
          </Link>
        ) : null}
        <CartShopPayButton />
      </div>
    </>
  );
}

function OrderSummary({discountsPrice, subtotalAmount}) {
  const money = {
    ...subtotalAmount,
    amount: `${discountsPrice}`,
  };
  console.log(money);
  return (
    <>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">
            <Money data={money} />
          </Text>
        </div>
      </dl>
    </>
  );
}
