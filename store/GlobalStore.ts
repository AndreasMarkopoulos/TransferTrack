import {defineStore} from "pinia";

export const useGlobalStore = defineStore('global', () => {
    const loading = ref(0);
    const navbarVisible = ref(true);
    function startLoading() {
        loading.value += 1;
    }

    function setNavbarVisibility(isVisible: boolean) {
        navbarVisible.value = isVisible;
    }
    function stopLoading() {
        loading.value -= 1;
    }

    function resetState() {
        loading.value = 0;
        document.cookie = 'tt-global' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    function callFunctionWithLoading<T>(promise: Promise<T>): Promise<T> {
        startLoading();
        return promise.finally(() => stopLoading());
    }

    return {
        loading,
        navbarVisible,
        startLoading,
        stopLoading,
        resetState,
        callFunctionWithLoading,
        setNavbarVisibility,
    }
},
    // {
    // persist: {
    //     key: "tt-global",
    // },}
)