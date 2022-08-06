import {CART_QUERY, PRODUCT_QUERY} from 'graphql-query';

export async function api(_req, {queryShop}) {
  const id = new URL(_req.url).searchParams.get('id');
  const idUser = new URL(_req.url).searchParams.get('id_user');

  const discountRules = await (
    await fetch(`${new URL(_req.url).origin}/api/discountRule`)
  ).json();

  const discounts = filterDiscountsRules(discountRules, idUser);

  const {
    data: {
      cart: {
        lines: {nodes: productsCart = []},
      },
    },
  } = await queryShop({
    query: CART_QUERY,
    variables: {
      id,
    },
  });

  const promises_products = productsCart.map((productCart) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const {
        data: {product},
      } = await queryShop({
        query: PRODUCT_QUERY,
        variables: {
          handle: productCart.merchandise.product.handle,
        },
      });

      const discountPrice = filterDiscounts(
        discounts,
        productCart.quantity,
        product.id,
        parseFloat(productCart.merchandise.priceV2.amount) *
          productCart.quantity,
      );
      resolve({
        productId: product.id,
        ...productCart,
        discountPrice:
          discountPrice || parseFloat(productCart.merchandise.priceV2.amount),
      });
    });
  });

  const products = await Promise.all(promises_products);

  return products;
}

function filterDiscounts(discounts, from, id_product, price) {
  const accept_discounts = discounts
    .filter(({discount}) => {
      // get all object in discount array if object has from property "from" < from
      const from_discount = discount.filter(
        ({from: from_str}) => parseInt(from_str) <= from,
      );
      return from_discount.length > 0;
    })
    .filter(
      ({product_target}) =>
        !product_target.length || product_target.includes(id_product),
    );
  const all_discounts_can_use = accept_discounts.map(({discount, _id}) => ({
    _id,
    ...discount.find(
      ({from: from_str, to: to_str}) =>
        parseInt(from_str) <= from &&
        (to_str === null || parseInt(to_str) >= from),
    ),
  }));
  const all_value_discount = all_discounts_can_use.map(({value, _type}) => {
    const returnValue =
      _type === 'percent'
        ? price - (price * parseInt(value)) / 100
        : price - parseInt(value);
    if (returnValue < 0) {
      return 0;
    }
    return returnValue;
  });
  // get biggest value in array
  const biggest_value_discount = Math.min(...all_value_discount);
  return biggest_value_discount;
}

function filterDiscountsRules(discounts, id_user) {
  const accepts = discounts.filter(
    ({customer_target, non_customer_target, status}) => {
      if (status === 'active') {
        if (customer_target.length === 0 && non_customer_target.length === 0) {
          return true;
        } else {
          return (
            customer_target.includes(id_user) &&
            !non_customer_target.includes(id_user)
          );
        }
      }
    },
  );
  return accepts;
}
