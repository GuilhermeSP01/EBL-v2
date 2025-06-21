import { getAuth } from "firebase/auth";

const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
}

export function useAulas() {
    const aulas = useState('aulas', () => []);

    const loadAulas = async () => {
        const token = await getToken();
        if (!token) {
            aulas.value = [];
            return;
        };

        try {
            aulas.value = await $fetch('/api/aulas', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            console.error('Error ao carregar aulas', e);
            aulas.value = [];
        }
    };

    return { aulas, loadAulas };
}