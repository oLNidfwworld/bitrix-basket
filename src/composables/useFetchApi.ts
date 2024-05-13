import { useFetch, type UseFetchOptions } from '@vueuse/core'
import type { Ref } from 'vue'

const useFetchApi = async <T>(
  url: string,
  options?: RequestInit,
  useFetchOptions?: UseFetchOptions
) => {
  const fetchResponse = await useFetch<T>(
    url,
    { credentials: 'same-origin', ...options },
    useFetchOptions
  ).json()

  return {
    ...fetchResponse,
    data: fetchResponse.data as Ref<T>
  }
}

export { useFetchApi }
