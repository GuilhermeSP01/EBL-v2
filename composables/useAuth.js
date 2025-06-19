import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

export function useAuth() {
    const { $auth } = useNuxtApp();
    const isAuthLoading = useState('isAuthLoading', () => true);
    const error = ref('');

    const register = async (email, password) => {
        isAuthLoading.value = true;
        error.value = '';

        try {
            await createUserWithEmailAndPassword($auth, email, password, confirmPassword);
            navigateTo('/inscricao');
        } catch (e) {
            error.value = e.message;
        } finally {
            isAuthLoading.value = false;
        }
    };

    const login = async (email, password) => {
        isAuthLoading.value = true;
        error.value = '';

        try {
            await signInWithEmailAndPassword($auth, email, password);
            navigateTo('/inscricao');
        } catch (e) {
            error.value = e.message;
        } finally {
            isAuthLoading.value = false;
        }
    };

    const loginWithGoogle = async () => {
        isAuthLoading.value = true;
        error.value = '';

        try {
            await signInWithPopup($auth, new GoogleAuthProvider());
            navigateTo('/inscricao');
        } catch (e) {
            error.value = e.message;
        } finally {
            isAuthLoading.value = false;
        }
    };

    const logout = () => {
        try {
            $auth.signOut();
            navigateTo('/');
        } catch (e) {
            error.value = e.message;
        }
    };

    return {
        isAuthLoading, error,
        register, login, loginWithGoogle, logout
    };
}