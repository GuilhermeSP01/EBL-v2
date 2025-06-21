<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    import { getToken } from '~/composables/useCadastro';
    const { cadastro, save, load } = useCadastro();
    const { isAuthLoading, logout } = useAuth();
    const { $auth } = useNuxtApp();

    const editando = ref(false);
    const form = ref({});

    const editandoEndereco = ref(false);
    const formEndereco = ref({});

    watch(editando, (val) => {
        if (val) form.value = { ...cadastro.value };
    });

    watch(editandoEndereco, (val) => {
        if (val) formEndereco.value = { ...cadastro.value.endereco };
    });

    async function salvarPerfil() {
        try {
            const token = await getToken();
            const response = await $fetch('/api/cadastro', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form.value
            });
            save(response);
            editando.value = false;
        } catch (e) {
            alert('Ocorreu um erro ao salvar o perfil: ' + e.message);
        }
    }

    async function salvarEndereco() {
        try {
            const token = await getToken();
            const response = await $fetch('/api/endereco', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formEndereco.value
            });
            cadastro.value = response;
            save(cadastro.value);
            editandoEndereco.value = false;
        } catch (e) {
            alert('Ocorreu um erro ao salvar o endereço: ' + e.message);
        }
    }
</script>

<template>
    <div v-if="isAuthLoading">
        <Loading />
    </div>
    <div v-else>
        <Header />
        <h1> Perfil </h1>
        <p> token: {{ $auth.currentUser.accessToken }} </p>
        <p> Nome: {{ cadastro.nome }} </p>
        <p> Email: {{ cadastro.email }} </p>
        <p> Telefone: {{ cadastro.telefone }} </p>
        <div v-if="cadastro.endereco">
            <p> Endereço: </p>
            <p> CEP: {{ cadastro.endereco.cep }} </p>
            <p> {{ cadastro.endereco.bairro }}, {{ cadastro.endereco.cidade }} - {{ cadastro.endereco.estado }} </p>
            <p> {{ cadastro.endereco.tipoLogradouro }} {{ cadastro.endereco.logradouro }}, Nº {{ cadastro.endereco.numero }} </p>
            <p v-if="cadastro.endereco.complemento"> Complemento: {{ cadastro.endereco.complemento }} </p>
        </div>
        <div v-else>
            <p> Endereço: Não informado </p>
        </div>
        <p> Modalidade: {{ cadastro.modalidade === 'presencial' ? 'Presencial' : 'Online' }} </p>
        <button @click="editando = true"> Editar perfil </button>
        <button @click="editandoEndereco = true"> Editar endereço </button>
        <button @click="logout"> Logout </button>

        <!-- Modal de edição do perfil -->
        <div v-if="editando" class="modal">
            <h2>Editar Perfil</h2>
            <form @submit.prevent="salvarPerfil">
                <label>Nome: <input v-model="form.nome" required /></label>
                <label>Telefone: <input v-model="form.telefone" required /></label>
                <label>Modalidade: 
                    <select v-model="form.modalidade" required>
                        <option value="presencial">Presencial</option>
                        <option value="online">Online</option>
                    </select>
                </label>
                <button type="submit">Salvar</button>
                <button type="button" @click="editando = false">Cancelar</button>
            </form>
        </div>

        <!-- Modal de edição do endereço -->
        <div v-if="editandoEndereco" class="modal">
            <h2>Editar Endereço</h2>
            <form @submit.prevent="salvarEndereco">
            <label>CEP: <input v-model="formEndereco.cep" required /></label>
            <label>Estado: <input v-model="formEndereco.estado" required /></label>
            <label>Cidade: <input v-model="formEndereco.cidade" required /></label>
            <label>Bairro: <input v-model="formEndereco.bairro" required /></label>
            <label>Tipo de Logradouro: <input v-model="formEndereco.tipoLogradouro" required /></label>
            <label>Logradouro: <input v-model="formEndereco.logradouro" required /></label>
            <label>Número: <input v-model="formEndereco.numero" type="number" required /></label>
            <label>Complemento: <input v-model="formEndereco.complemento" /></label>
            <button type="submit">Salvar</button>
            <button type="button" @click="editandoEndereco = false">Cancelar</button>
            </form>
        </div>

        <p> {{ cadastro }} </p>
    </div>
</template>