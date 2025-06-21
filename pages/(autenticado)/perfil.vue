<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    const { $auth } = useNuxtApp();
    const { cadastro } = useCadastro();
</script>

<template>
    <Header />
    <h1> Perfil </h1>
    <p> Página onde o aluno visualiza e edita dados do perfil </p>
    <p> token: {{ $auth.currentUser.accessToken }} </p>
    <p> {{ cadastro }} </p>
</template>