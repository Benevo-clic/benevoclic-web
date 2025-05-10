import {useRegisterStore} from "~/stores/user/register";


export const userRegisterEmailPassword = ()=>{
    const registerStore = useRegisterStore();

    return {
        register: registerStore.registerWithEmailPassword,
        idUser: registerStore.getIdUser,
        isRegisted: registerStore.isRegisted,
        isVerified: registerStore.isVerified
    }

}