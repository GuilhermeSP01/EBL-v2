import { getAuth } from "firebase/auth";

const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
}

export function useCadastro() {
    const cadastro = useState('cadastro', () => null);

    const save = (data) => {
        cadastro.value = data;
        localStorage.setItem('cadastro', JSON.stringify(data));
        localStorage.setItem('cadastroTimestamp', Date.now().toString());
    }

    const load = async () => {
        const token = await getToken();
        if (!token) {
            cadastro.value = null;
            localStorage.removeItem('cadastro');
            localStorage.removeItem('cadastroTimestamp');
            return;
        };

        const auth = getAuth();
        const user = auth.currentUser;
        const stored = localStorage.getItem('cadastro');
        const timestamp = localStorage.getItem('cadastroTimestamp');

        if (stored && timestamp && Date.now() - Number(timestamp) < 1000 * 60 * 60 * 24) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.email === user?.email) {
                    cadastro.value = parsed;
                    return;
                }
            } catch (e) {
                localStorage.removeItem('cadastro');
                localStorage.removeItem('cadastroTimestamp');
            }
        }

        try {
            cadastro.value = await $fetch('/api/cadastro', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.setItem('cadastro', JSON.stringify(cadastro.value));
            localStorage.setItem('cadastroTimestamp', Date.now().toString());
        } catch (e) {
            cadastro.value = null;
            localStorage.removeItem('cadastro');
            localStorage.removeItem('cadastroTimestamp');
        }
    };

    onMounted(load);

    return { cadastro, save, load };
}