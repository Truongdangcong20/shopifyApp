export default function createAddressMutation() {
  return `
    mutation createAddress($address: AddressInput!) {
      createAddress(address: $address) {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
        isDefault
      }
    }
  `;
}
