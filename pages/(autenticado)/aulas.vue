<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    const { isAuthLoading, logout } = useAuth();
    const { aulas, loadAulas } = useAulas();
    const { $auth } = useNuxtApp();

    onMounted(() => {
        loadAulas();
    });
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <Header />
        <h1> Aulas </h1>
        <p> Página onde o aluno irá encontrar as aulas </p>
        <button @click="logout"> Logout </button>
        <p> token: {{ $auth.currentUser.accessToken }} </p>

        <div v-if="aulas.length === 0">
            <p> Ainda não há nenhuma aula disponível. </p>
        </div>
        <div v-else>
            <ul>
                <li v-for="aula in aulas">
                    {{ aula.titulo }}, {{ aula.linkMaterial }}, {{ aula.linkVideo }}
                </li>
            </ul>
        </div>
    </div>
</template>