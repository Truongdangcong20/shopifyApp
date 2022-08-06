import {gql} from '@shopify/hydrogen';

export const CART_QUERY = gql`
  query ($id: ID!) {
    cart(id: $id) {
      lines(first: 100) {
        nodes {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              availableForSale
              compareAtPriceV2 {
                amount
                currencyCode
              }
              priceV2 {
                currencyCode
                amount
              }
              requiresShipping
              title
              image {
                altText
                height
                width
                url
                id
              }
              product {
                handle
                title
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;
