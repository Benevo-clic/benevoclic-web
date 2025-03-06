import {useRegisterStore} from "~/stores/register";
import {onMounted} from "vue";


export const userRegister = ()=>{
    const registerStore = useRegisterStore();

    return {
        register: registerStore.register,
        idUser: registerStore.getIdUser,
        isRegisted: registerStore.isRegisted
    }

}