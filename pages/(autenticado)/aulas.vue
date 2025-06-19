<script setup>
    definePageMeta({ middleware: ['auth'] });
    const { isAuthLoading, logout } = useAuth();
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <h1> Aulas </h1>
        <p> Página onde o aluno irá encontrar as aulas </p>
        <button @click="logout"> Logout </button>
    </div>
</template>