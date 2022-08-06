import {COUNTRIES_QUERY} from 'graphql-query';

export async function api(_request, {queryShop}) {
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: COUNTRIES_QUERY,
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}
