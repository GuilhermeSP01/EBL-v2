<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    const { $auth } = useNuxtApp();
    const { isAuthLoading } = useAuth();
    const { logout } = useAuth();
    const { turmas, loadTurmas } = useTurmas();

    onMounted(() => {
        loadTurmas();
    });
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <h1> Inscrição </h1>
        <p> Página onde o aluno irá se inscrever em uma turma </p>
        <p> token: {{ $auth.currentUser.accessToken }} </p>
        <button @click="logout"> Logout </button>

        <div v-if="turmas.length === 0">
            <p> Nenhuma há nenhuma turma aberta no momento. </p>
        </div>
        <div v-else>
            <p> As inscrições estão abertas para a turma {{ turmas[0].nome }}
                até {{ turmas[0].dataFechamento }} </p>
            <p> Complete sua inscrição para participar! </p>

            <FormInscricao :turma="turmas[0]" />
        </div>
    </div>
</template>