<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    const { isAuthLoading } = useAuth();
    const { aulas, loadAulas } = useAulas();

    onMounted(() => {
        loadAulas();
    });
</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <Header />
        <h1> Aulas </h1>

        <div v-if="aulas.length === 0">
            <p> Ainda não há nenhuma aula disponível. </p>
        </div>
        <div v-else>
            <ul>
                <li v-for="aula in aulas">
                    <p> Aula {{ aula.numero }} - {{ aula.titulo }} </p>
                    <p> Data de abertura: {{ aula.dataAbertura }} </p>
                    <p> Data de fechamento: {{ aula.dataFechamento }} </p>
                    <NuxtLink :to="`/atividade/${aula.numero}`"> Questionário </NuxtLink> 
                    <NuxtLink :to="`${aula.linkVideo}`"> Vídeo-aula </NuxtLink>
                    <NuxtLink :to="`${aula.linkMaterial}`"> Material </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>