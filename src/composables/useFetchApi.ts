import { useFetch, type UseFetchOptions, type UseFetchReturn } from "@vueuse/core"; 
import type { Ref } from "vue";

const useFetchApi = async <T>( url : string, options? : UseFetchOptions)  =>  {
    const fetchResponse =  await useFetch<T>( url,  { credentials : 'same-origin', ...options }).json();
 
    return {
        ...fetchResponse,
        data : fetchResponse.data as Ref<T>,
    } ;
}

export {  useFetchApi  };