export function useTurmas() {
    const turmas = useState('turmas', () => []);

    const loadTurmas = async () => {
        try {
            turmas.value = await $fetch('/api/turmas');
        } catch (e) {
            console.error('Error ao carregar turmas', e);
            turmas.value = [];
        }
    };

    return { turmas, loadTurmas };
}