import { get } from '@rails/request.js'

export async function getJSON(url) {
  const response = await get(url)
  return response.json
}
