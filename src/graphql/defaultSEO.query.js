import {gql} from '@shopify/hydrogen';

export const DEFAULT_SEO_QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
