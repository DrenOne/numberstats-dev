export default interface Api {
  /**
    * https://cr.numberstats.com/api/v1/
    */
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  onStart: string
  onSuccess: string
  onFail: string
}
