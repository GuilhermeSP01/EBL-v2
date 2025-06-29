<script setup>
  definePageMeta({ middleware: ['auth', 'cadastro'] });
  const { isAuthLoading } = useAuth();
  const { aulas, loadAulas } = useAulas();
  const { cadastro } = useCadastro();

  onMounted(() => {
    loadAulas();
  });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  function gerarChaveLocalStorage(userId, tipoConteudo, aulaId) {
    return `user_${userId}_${tipoConteudo}_${aulaId}`;
  };

  function salvarStatusVisualizacao(userId, tipoConteudo, aulaId, status) {
    const chave = gerarChaveLocalStorage(userId, tipoConteudo, aulaId);
    localStorage.setItem(chave, status);
  };

  function recuperarStatusVisualizacao(userId, tipoConteudo, aulaId) {
    const chave = gerarChaveLocalStorage(userId, tipoConteudo, aulaId);
    return localStorage.getItem(chave) === 'true';
  };

const aprovações = computed(() => {
  if (!cadastro || !cadastro.envios) return 0;
  return aulas.value.filter(aula => {
    const envio = cadastro.envios.find(envio => envio.aulaId === aula._id);
    return envio && envio.questoes.filter(q => q.correta).length >= 2;
  }).length;
});

const reprovações = computed(() => {
  if (!cadastro || !cadastro.envios) return 0;
  return aulas.value.filter(aula => {
    const envio = cadastro.value.envios.find(envio => envio.aulaId === aula._id);
    if (envio) {
      return envio.questoes.filter(q => q.correta).length < 2;
    } else {
      return !(new Date(aula.dataFechamento) > new Date());
    }
  }).length;
});


</script>

<template>
  <Header v-if="!isAuthLoading" />
  <Loading v-if="isAuthLoading" />

  <div v-else class="space-y-8 px-6 py-8">
  <section class="space-y-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold px-4 pt-0.5">Aulas</h1>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="segoe-ui text-2xl font-medium text-green-600">{{ aprovações }}</span>
          <span class="segoe-ui text-lg text-gray-600">{{ aprovações === 1 ? 'aprovação' : 'aprovações' }}</span>
        </div>
        <div class="h-6 w-px bg-gray-300"></div>
        <div class="flex items-center gap-2">
          <span class="segoe-ui text-2xl font-medium text-red-600">{{ reprovações }}</span>
          <span class="segoe-ui text-lg text-gray-600">{{ reprovações === 1 ? 'reprovação' : 'reprovações' }}</span>
        </div>
      </div>
    


      </div>

    <div v-if="aulas.length === 0" class="bg-white p-6 rounded-lg shadow">
      <p class="text-gray-600">Ainda não há aulas disponíveis.</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="aula in [...aulas].sort((a, b) => b.numero - a.numero)" :key="aula.numero" class="space-y-2">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="font-semibold text-lg mb-2">
            <span class="font-bold text-xl">Aula {{ aula.numero < 10 ? `0${aula.numero}` : aula.numero.toString() }}</span>
            <span class="text-gray-600"> | {{ aula.titulo }}</span>
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Disponível: {{ formatarData(aula.dataAbertura) }}<br>
            Envio até: {{ formatarData(aula.dataFechamento) }}
          </p>

<!-- Vídeo-aula -->
<NuxtLink
  :to="aula.linkVideo"
  class="block p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center mb-2"
  @click="salvarStatusVisualizacao(cadastro.userId, 'video', aula._id, true)"
>
  <div class="flex items-center">
    <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
    <span class="text-gray-600 text-lg">Vídeo-aula</span>
  </div>
  <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'video', aula._id)" class="ml-2">
    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </span>
</NuxtLink>

<!-- Material -->
<NuxtLink
  :to="aula.linkMaterial"
  class="block p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center mb-2"
  @click="salvarStatusVisualizacao(cadastro.userId, 'material', aula._id, true)"
>
  <div class="flex items-center">
    <img src="/icons/materialIcon.png" alt="Material" class="w-8 h-8 mr-2" />
    <span class="text-gray-600 text-lg">Material</span>
  </div>
  <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'material', aula._id)" class="ml-2">
    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </span>
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
            <span
  class="text-sm font-medium px-3 py-1 rounded-full"
  :class="{
    'bg-green-100 text-green-800':
      cadastro?.envios?.find(envio => envio.aulaId === aula._id) &&
      cadastro.envios.find(envio => envio.aulaId === aula._id).questoes.filter(q => q.correta).length >= 2,
    'bg-red-100 text-red-800':
      cadastro?.envios?.find(envio => envio.aulaId === aula._id) &&
      cadastro.envios.find(envio => envio.aulaId === aula._id).questoes.filter(q => q.correta).length < 2,
    'bg-blue-100 text-blue-800':
      !cadastro?.envios?.find(envio => envio.aulaId === aula._id) &&
      new Date(aula.dataFechamento) > new Date(),
    'bg-gray-100 text-gray-800':
      !cadastro?.envios?.find(envio => envio.aulaId === aula._id) &&
      !(new Date(aula.dataFechamento) > new Date())
  }"
>
  <template v-if="cadastro?.envios?.find(envio => envio.aulaId === aula._id)">
    {{ cadastro.envios.find(envio => envio.aulaId === aula._id).questoes.filter(q => q.correta).length }}/{{ cadastro.envios.find(envio => envio.aulaId === aula._id).questoes.length }} acertos
  </template>
  <template v-else>
    <template v-if="new Date(aula.dataFechamento) > new Date()">
      Aberto
    </template>
    <template v-else>
      Expirado
    </template>
  </template>
</span>

          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</div>


</template>