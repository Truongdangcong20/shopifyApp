import {gql} from '@shopify/hydrogen';

export const SHOP_QUERY = gql`
  query {
    shop {
      primaryDomain {
        url
      }
    }
  }
`;

export const SHOP_QUERY_INFO = gql`
  query shopInfo {
    shop {
      name
    }
  }
`;
