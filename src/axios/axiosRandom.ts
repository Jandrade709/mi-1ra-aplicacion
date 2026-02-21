import axios from 'axios';
import { useUserStore } from '@/stores/user';

const axiosPublic = axios.create({
    baseURL: 'https://randomuser.me',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function fetchRandomUsers(count = 1) {
    const res = await axiosPublic.get(`/api/?results=${count}`);
    const results = res.data?.results || [];
    const users = results.map((u: any) => ({
        name: `${u.name.first} ${u.name.last}`,
        first: u.name.first,
        last: u.name.last,
        email: u.email,
        phone: u.phone,
        picture: u.picture?.large || u.picture?.medium || u.picture?.thumbnail || null,
        location: u.location,
        nat: u.nat,
        login: u.login,
    }));

    if (users.length > 0) {
        try {
            const store = useUserStore();
            if (typeof store.setRandomUser === 'function') {
                store.setRandomUser(users[0]);
            } else {
                store.$patch({ userData: users[0] });
                localStorage.setItem('userData', JSON.stringify(users[0]));
            }
        } catch (e) {
            // si ocurre un error al acceder al store, simplemente no guardamos
            console.warn('No fue posible guardar el usuario en el store:', e);
        }
    }

    return users;
}

export default axiosPublic;