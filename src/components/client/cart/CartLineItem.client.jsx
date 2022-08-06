import {
  CartLinePrice,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Image,
  Link,
  useCart,
  useCartLine,
} from '@shopify/hydrogen';

import {Heading, IconRemove, Text} from '../index';

export function CartLineItem() {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise, discountPrice} = useCartLine();

  return (
    <li key={lineId} className="flex gap-4" data-key={merchandise.id}>
      <div className="flex-shrink">
        <Image
          width={112}
          height={112}
          widths={[112]}
          src={
            merchandise.image
              ? merchandise.image.url
              : '/src/assets/favicon.ico'
          }
          loaderOptions={{
            scale: 2,
            crop: 'center',
          }}
          alt={merchandise.title}
          className="object-cover object-center w-24 h-24 border rounded md:w-28 md:h-28"
        />
      </div>

      <div className="flex justify-between flex-grow">
        <div className="grid gap-2">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>

          <div className="grid pb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name}>
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />
            </div>
            <button
              type="button"
              onClick={() => linesRemove([lineId])}
              className="flex items-center justify-center w-10 h-10 border rounded"
            >
              <span className="sr-only">Remove</span>
              <IconRemove aria-hidden="true" />
            </button>
          </div>
        </div>
        <Text
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CartLinePrice
            as="span"
            style={{
              textDecoration: discountPrice !== null ? 'line-through' : 'none',
            }}
          />
          {discountPrice && (
            <Text>
              {discountPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ
            </Text>
          )}
        </Text>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({lineId, quantity}) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center border rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity as="div" className="px-2 text-center" />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
