import {setDefaultAddress} from './[addressId].server';
import {CacheNone} from '@shopify/hydrogen';

import {getApiErrorMessage} from 'lib';
import {CREATE_ADDRESS_MUTATION} from 'graphql-query';

export async function api(request, {session, queryShop}) {
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    });
  }

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {
    firstName,
    lastName,
    company,
    address1,
    address2,
    country,
    province,
    city,
    zip,
    phone,
    isDefaultAddress,
  } = await request.json();

  const address = {};

  if (firstName) address.firstName = firstName;
  if (lastName) address.lastName = lastName;
  if (company) address.company = company;
  if (address1) address.address1 = address1;
  if (address2) address.address2 = address2;
  if (country) address.country = country;
  if (province) address.province = province;
  if (city) address.city = city;
  if (zip) address.zip = zip;
  if (phone) address.phone = phone;

  const {data, errors} = await queryShop({
    query: CREATE_ADDRESS_MUTATION,
    variables: {
      address,
      customerAccessToken,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const error = getApiErrorMessage('customerAddressCreate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  if (isDefaultAddress) {
    const {data: defaultDataResponse, errors} = await setDefaultAddress(
      queryShop,
      data.customerAddressCreate.customerAddress.id,
      customerAccessToken,
    );

    const error = getApiErrorMessage(
      'customerDefaultAddressUpdate',
      defaultDataResponse,
      errors,
    );

    if (error) return new Response(JSON.stringify({error}), {status: 400});
  }

  return new Response(null);
}
