export function getDomain() {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') return 'dev.numberstats.com'
    else return window.location.hostname
  }
}
export function getHost() {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'dev'
    }
    if (window.location.hostname === 'dev.numberstats.com') return 'dev'
    else return 'cr'
  }
}

export default {
  meEndpoint: `https://${getDomain()}/api/v1/account/me/`,
  loginEndpoint: `https://${getDomain()}/api/v1/account/me/`,
  registerEndpoint: `https://${getDomain()}/jwt/register`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
}
