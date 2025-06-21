<script setup>
    import { useCadastro } from '#imports';
    const { save } = useCadastro();
    const { $auth } = useNuxtApp();

    const props = defineProps({
        turma: { type: Object, required: true }
    });

    const cadastro = ref({
        nome: $auth.currentUser.displayName || '',
        turmaId: props.turma._id,
        modalidade: 'online',
        email: $auth.currentUser.email,
        telefone: '',
    });

    const error = ref(null);
    const isLoading = ref(false);

    const submit = async () => {
        try {
            isLoading.value = true;
            error.value = null;

            const response = await $fetch('/api/cadastro', {
                method: 'POST',
                body: cadastro.value
            });

            save(response);
            navigateTo('/aulas');
        } catch (e) {
            error.value = e.message || 'Ocorreu um erro ao se inscrever';
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <h1> Formulario de inscrição para a turma {{ props.turma.nome }} - {{ props.turma._id }} </h1>
    
    <form @submit.prevent="submit">
        <div>
            <label for="nome"> Nome </label>
            <input type="text" id="nome" v-model="cadastro.nome" required />
        </div>

        <div>
            <label for="telefone"> Telefone </label>
            <input type="tel" id="telefone" v-model="cadastro.telefone" required />
        </div>

        <div>
            <label for="modalidade"> Modalidade </label>
            <select id="modalidade" v-model="cadastro.modalidade" required>
                <option value="online"> Online </option>
                <option value="presencial"> Presencial </option>
            </select>
        </div>

        <button type="submit" :disabled="isLoading"> Enviar </button>
        <p v-if="error"> {{ error }} </p>
    </form>
</template>