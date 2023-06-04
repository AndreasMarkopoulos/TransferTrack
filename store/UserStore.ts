import {defineStore} from "pinia";
import {useGlobalStore} from "~/store/GlobalStore";
import {UserRole} from "~/models/apiModels";
export const useUserStore = defineStore('user', () => {

    const userRole = ref<UserRole>('nothing')
    const userId = ref('')
    const loggedIn = computed(() => userRole.value !== 'nothing');
    const isAdmin = computed(() => userRole.value === 'admin');
    const isDriver = computed(() => userRole.value === 'driver');

    function authenticate(role: UserRole, id: string) {
        switch (role) {
            case 'nothing':
                userRole.value = role;
                return;
            case 'admin': {
                userRole.value = role;
                userId.value = id;
                return;
            }
            case 'driver': {
                userRole.value = role;
                userId.value = id;
                return;
            }
            default:
                return;
        }
    }
    function resetState() {
        userRole.value = 'nothing';
        userId.value = '';
        document.cookie = 'tt-user' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    function logout() {
        resetState();
        useGlobalStore().resetState();
    }
    return {
        userId,
        authenticate,
        isAdmin,
        isDriver,
        loggedIn,
        userRole,
        logout
    }
}, {
    persist: {
        key: "tt-user",
    }
},)