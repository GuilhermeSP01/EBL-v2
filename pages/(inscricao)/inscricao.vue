<script setup>
    definePageMeta({ middleware: ['auth'] });
    const { isAuthLoading } = useAuth();
    const { logout } = useAuth();
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <h1> Inscrição </h1>
        <p> Página onde o aluno irá se inscrever em uma turma </p>
        <button @click="logout"> Logout </button>
    </div>
</template>