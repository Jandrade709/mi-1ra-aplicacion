import { defineStore } from "pinia";
import { ref } from "vue";
import axiosRiksiri from "@/axios/axiosRiksiri";

type MenuItem = {
    id: number | null;
    url: string | null;
    internal_name: string;
    name?: string;
    active?: string;
};

type MenuGroup = {
    icon?: string;
    name?: string;
    sub: MenuItem[];
};

type ContentState = {
    contenido: {
        name: string | null;
        contenido: string | null;
        youtube: string;
    };
    internal_name: string | null;
};

const defaultContent = (): ContentState => ({
    contenido: {
        name: null,
        contenido: null,
        youtube: "",
    },
    internal_name: null,
});

const defaultHome = () => ({
    url: null as string | null,
    internal_name: "",
});

const defaultNext = () => ({
    id: null as number | null,
    url: null as string | null,
    internal_name: "",
});

export const useContentStore = defineStore('content', () => {
    const menu = ref<MenuGroup[]>(localStorage.getItem('menu') ? JSON.parse(localStorage.getItem('menu') as string) : []);
    const content = ref<ContentState>(defaultContent());
    const home = ref(localStorage.getItem('home') ? JSON.parse(localStorage.getItem('home') as string) : defaultHome());
    const next = ref(defaultNext());
    const loading = ref(false);

    function setContent(data: any | null){
        content.value = data || defaultContent();
    }   

    function $setMenu(data: any | null){
        menu.value = data || [];
        if(menu.value.length){
            localStorage.setItem('menu', JSON.stringify(menu.value));
        } else {
            localStorage.removeItem('menu');
        }   
    }   

    function $setHome(data: any | null){
        home.value = data || defaultHome();
        if (home.value.url || home.value.internal_name) {
            localStorage.setItem('home', JSON.stringify(home.value));
        } else {
            localStorage.removeItem('home');
        }
    }   

    function $getContent(name: string){
        if (!name) {
            setContent(null);
            return Promise.resolve(defaultContent());
        }

        loading.value = true;
        return axiosRiksiri.get('/contenido/'+name).then( res => {
            setContent(res.data);
            return res.data;
        }).finally(() => {
            loading.value = false;
        });
    }

    function $seteaSiguiente(){
        return axiosRiksiri.post('/seteasiguiente', next.value);
    }

    function $setNext(data: any | null){
        next.value = data || defaultNext();
    }

    function $resetState() {
        menu.value = [];
        content.value = defaultContent();
        home.value = defaultHome();
        next.value = defaultNext();
        localStorage.removeItem('menu');
        localStorage.removeItem('home');
    }

    return { content, setContent, menu, $setMenu, $getContent, loading, home, $setHome, next, $setNext, $seteaSiguiente, $resetState };

});
