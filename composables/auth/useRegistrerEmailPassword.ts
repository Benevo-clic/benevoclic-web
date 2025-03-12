import {useRegisterStore} from "~/stores/auth/register";
import {onMounted} from "vue";


export const userRegisterEmailPassword = ()=>{
    const registerStore = useRegisterStore();

    return {
        register: registerStore.registerWithEmailPassword,
        idUser: registerStore.getIdUser,
        isRegisted: registerStore.isRegisted,
        isVerified: registerStore.isVerified
    }

}