import {defineStore} from "pinia";
import {useGlobalStore} from "~/store/GlobalStore";
import {UserRole} from "~/models/apiModels";
export const useUserStore = defineStore('user', () => {
    // const EMPTY_USER = {
    //     avatar: "",
    //     created: "",
    //     email: "",
    //     emailVisibility: "",
    //     id: "",
    //     updated: "",
    //     username: "",
    //     verified: false,
    //     isNew: false,
    // }
    const loggedIn = ref(false);
    const isAdmin = ref(false);
    // const userToken = ref('')
    // const userDetails = ref({...EMPTY_USER});
    const userRole = ref<UserRole>('nothing')
    // function setUserDetails(authData: any) {
    //     userDetails.value = { ...authData }
    // }
    // function setUserToken(token: string) {
    //     userToken.value = token;
    // }
    // function login(authData: any,token: string) {
    //     setUserDetails(authData);
    //     setUserToken(token);
    //     loggedIn.value=true;
    // }
    function authenticate(role: UserRole) {
        switch (role) {
            case 'nothing':
                userRole.value = role;
                return;
            case 'admin': {
                userRole.value = role;
                isAdmin.value = true;
                loggedIn.value = true;
            }
            case 'driver': {
                userRole.value = role;
                loggedIn.value = true;
            }
            default:
                return;
        }
    }
    function resetState() {
        loggedIn.value = false;
        // userToken.value = '';
        // userDetails.value = { ...EMPTY_USER };
        document.cookie = 'tt-user' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    function logout() {
        resetState();
        useGlobalStore().resetState();
    }
    return {
        // login,
        // userToken,
        // userDetails,
        // setUserDetails,
        // setUserToken,
        authenticate,
        isAdmin,
        loggedIn,
        logout
    }
}, {
    persist: {
        key: "tt-user",
    }
},)