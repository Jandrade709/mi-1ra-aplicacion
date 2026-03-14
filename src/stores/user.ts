import { defineStore } from "pinia";
import { ref } from "vue";
import axiosRiksiri from "@/axios/axiosRiksiri";
import { useContentStore } from "./content";

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || null);
    const registro = ref({
        usuario: '',
        email: '',
        password: '',
    });
    const login = ref({
        username: '',
        password: '',
    });

    const contentStore = useContentStore();
    const userData = ref(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null); 

    function getAvatarStorageKey(user: any | null) {
        const key = user?.usuario || user?.email || 'default';
        return `avatar:${key}`;
    }

    if (userData.value) {
        const storedAvatar = localStorage.getItem(getAvatarStorageKey(userData.value));
        if (storedAvatar) {
            userData.value = { ...userData.value, picture: storedAvatar };
            localStorage.setItem('userData', JSON.stringify(userData.value));
        }
    }

    function $setLogin(data: any | null){
        token.value = data?.token || null;
        if(token.value){
            localStorage.setItem('token', token.value || '');
            const storedAvatar = localStorage.getItem(getAvatarStorageKey(data.user));
            userData.value = storedAvatar ? { ...data.user, picture: storedAvatar } : data.user;
            localStorage.setItem('userData', JSON.stringify(userData.value));
            contentStore.$setMenu(data.menu);
            contentStore.$setHome(data.home);
        }else{
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            userData.value = null;
            contentStore.$resetState();
            login.value = { username: '', password: '' };
            registro.value = { usuario: '', email: '', password: '' };
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

    function setAvatar(avatarUrl: string | null) {
        const key = getAvatarStorageKey(userData.value);
        if (avatarUrl) {
            localStorage.setItem(key, avatarUrl);
        } else {
            localStorage.removeItem(key);
        }
        if (!userData.value) {
            userData.value = { picture: avatarUrl } as any;
        } else {
            userData.value = { ...userData.value, picture: avatarUrl };
        }
        localStorage.setItem('userData', JSON.stringify(userData.value));
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
    return { registro, login, $login, token, $setLogin, userData, $registro, setRandomUser, setAvatar };
});
