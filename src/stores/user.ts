import { defineStore } from "pinia";
import { ref } from "vue";
import axiosRiksiri from "@/axios/axiosRiksiri";

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || null);
    const registro = ref({
        usuario: null,
        email: null,
        password: null,
    });
    const login = ref({
        username: null,
        password: null,
    });

    const userData = ref(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null); 

    function $setLogin(data: any | null){
        token.value = data?.token || null;
        if(token.value){
            localStorage.setItem('token', token.value || '');
            localStorage.setItem('userData', JSON.stringify(data.user));
            userData.value = data.user;
        }else{
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        }
    }

    function setRandomUser(data: any | null){
        if(data){
            userData.value = data;
            localStorage.setItem('userData', JSON.stringify(data));
        } else {
            userData.value = null;
            localStorage.removeItem('userData');
        }
    }

    function $login(){
        return axiosRiksiri.post('login', login.value).then( res => {
            $setLogin(res.data);
            return res.data;
        })
    }

    function $registro(){
        return axiosRiksiri.post('register', registro.value).then( res => {
            $setLogin(res.data);
            return res.data;
        })
    }
    return { registro, login, $login, token, $setLogin, userData, $registro, setRandomUser };
});