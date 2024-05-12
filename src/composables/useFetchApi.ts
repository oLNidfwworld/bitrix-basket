import { useFetch, type UseFetchOptions, type UseFetchReturn } from "@vueuse/core"; 
import type { Ref } from "vue";

const useFetchApi = async <T>( url : string )  =>  {
    const fetchResponse =  await useFetch<T>( url,  { credentials : 'same-origin' } ).json();
 
    return {
        ...fetchResponse,
        data : fetchResponse.data as Ref<T>,
    } ;
}

export {  useFetchApi  };