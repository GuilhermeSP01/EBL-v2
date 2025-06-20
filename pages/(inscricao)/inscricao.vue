<script setup>
    definePageMeta({ middleware: ['auth'] });
    const { $auth } = useNuxtApp();
    const { isAuthLoading } = useAuth();
    const { logout } = useAuth();

    
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <h1> Inscrição </h1>
        <p> Página onde o aluno irá se inscrever em uma turma </p>
        <button @click="logout"> Logout </button>
        <p> email: {{ $auth.currentUser.email }} </p>
        <p> name: {{ $auth.currentUser.displayName }} </p>
        <button @click="console.log($auth.currentUser)"> log user info </button>
    </div>
</template>