<script setup>
  definePageMeta({ middleware: ['auth', 'cadastro'] });
  const { isAuthLoading } = useAuth();
  const { aulas, loadAulas } = useAulas();

  onMounted(() => {
    loadAulas();
  });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };
</script>

<template>
  <Header v-if="!isAuthLoading" />
  <Loading v-if="isAuthLoading" />
  <div v-else class="space-y-8 px-6 py-8">
    <section class="space-y-4 max-w-6xl mx-auto">
      <h1 class="text-2xl font-semibold px-4">Aulas</h1>
      
      <div v-if="aulas.length === 0" class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600">Ainda não há aulas disponíveis.</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="aula in [...aulas].sort((a, b) => b.numero - a.numero)" :key="aula.numero" class="space-y-2">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold text-lg mb-2">
              <span class="font-bold text-xl">Aula {{ aula.numero }}</span>
              <span class="text-gray-600"> | {{ aula.titulo }}</span>
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Disponível: {{ formatarData(aula.dataAbertura) }}<br>
              Questionário até: {{ formatarData(aula.dataFechamento) }}
            </p>
            
            <!-- Vídeo-aula -->
            <NuxtLink
              :to="aula.linkVideo"
              class="block p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center mb-2"
            >
              <div class="flex items-center">
                <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Vídeo-aula</span>
              </div>
            </NuxtLink>

            <!-- Material -->
            <NuxtLink
              :to="aula.linkMaterial"
              class="block p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center mb-2"
            >
              <div class="flex items-center">
                <img src="/icons/materialIcon.png" alt="Material" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Material</span>
              </div>
            </NuxtLink>

            <!-- Questionário -->
            <NuxtLink
              :to="`/atividade/${aula.numero}`"
              class="block p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div class="flex items-center">
                <img src="/icons/formIcon.png" alt="Questionário" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Questionário</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
