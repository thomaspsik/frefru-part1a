const SERVER_URL = import.meta.env.VITE_APP_REST_API_URL + '/';
const CLIENT_URL = '';

export function getPCImageUrl(pcimage) {
  return `${CLIENT_URL}/pcimages/${pcimage}`;
}

export function getProducerLogo(imgFilename) {
  if (!imgFilename) {
    return null;
  }
  return `${SERVER_URL}/producerLogo/${imgFilename}`;
}

export function getProductImageUrl(image) {
  return `${SERVER_URL}/products/${image}`;
}

export function getFlagUrl(code) {
  return `${CLIENT_URL}/flags/${code.toLowerCase()}.svg`;
}

export const countries = [
  { country: 'Austria', code: 'aut' },
  { country: 'Deutschland', code: 'ger' },
  { country: 'Italien', code: 'ita' },
  { country: 'Belgien', code: 'bel' },
  { country: 'Amerika', code: 'usa' },
];
