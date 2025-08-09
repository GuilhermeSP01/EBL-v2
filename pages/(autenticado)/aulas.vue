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
    const envio = cadastro.envios.find(envio => envio.aulaId === aula.id);
    return envio && envio.questoes.filter(q => q.correta).length >= 2;
  }).length;
});

const reprovações = computed(() => {
  if (!cadastro || !cadastro.envios) return 0;
  return aulas.value.filter(aula => {
    const envio = cadastro.value.envios.find(envio => envio.aulaId === aula.id);
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

    
    <div v-if="aulas.length === 0 || (aulas.length === 1 && new Date(aulas[0].dataAbertura) > new Date())" class="bg-white p-6 rounded-lg shadow flex flex-col items-center space-y-4">
  <p class="text-gray-600 text-center">
    <strong>Parabéns, você se inscreveu com sucesso!</strong><br>
    Agora só precisa aguardar o início das aulas, em <strong>02/Agosto, às 15h00</strong>.<br>
    Até breve!
  </p>
  <a
    href="https://chat.whatsapp.com/GFtj5ZtDu8OEGpHRjoFv9m?mode=r_t"
    target="_blank"
    rel="noopener"
    class="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
  >
    Entrar no grupo do WhatsApp
  </a>
</div>

    <div v-if="aulas.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      <div v-for="aula in [...aulas].sort((a, b) => b.numero - a.numero)" :key="aula.numero" class="space-y-2">
        <div v-if="aula.tipo === 'principal'" class="bg-white p-6 rounded-lg shadow md:h-full md:flex md:flex-col">
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
        :to="aula.linkVideo || ''"
        :tabindex="aula.linkVideo ? 0 : -1"
        :aria-disabled="!aula.linkVideo"
        :class="[
          'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center mb-2',
          aula.linkVideo ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
        ]"
        @click="aula.linkVideo && salvarStatusVisualizacao(cadastro.userId, 'video', aula.id, true)"
      >
        <div class="flex items-center">
          <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
          <span class="text-gray-600 text-lg">Vídeo-aula</span>
        </div>
        <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'video', aula.id)" class="ml-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </span>
      </NuxtLink>

      <!-- Material -->
      <NuxtLink
        :to="aula.linkMaterial || ''"
        :tabindex="aula.linkMaterial ? 0 : -1"
        :aria-disabled="!aula.linkMaterial"
        :class="[
          'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center mb-2',
          aula.linkMaterial ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
        ]"
        @click="aula.linkMaterial && salvarStatusVisualizacao(cadastro.userId, 'material', aula.id, true)"
      >
        <div class="flex items-center">
          <img src="/icons/materialIcon.png" alt="Material" class="w-8 h-8 mr-2" />
          <span class="text-gray-600 text-lg">Material</span>
        </div>
        <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'material', aula.id)" class="ml-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </span>
      </NuxtLink>


<!-- Questionário -->
<NuxtLink
  :to="aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date() ? `/atividade/${aula.numero}` : ''"
  :tabindex="aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date() ? 0 : -1"
  :aria-disabled="!(aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date())"
  :class="[
    'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center',
    aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date()
      ? 'hover:shadow-md'
      : 'opacity-60 pointer-events-none cursor-not-allowed'
  ]"
>
  <div class="flex items-center">
    <img src="/icons/formIcon.png" alt="Questionário" class="w-8 h-8 mr-2" />
    <span class="text-gray-600 text-lg">Questionário</span>
  </div>
  <span
  class="text-sm font-medium px-3 py-1 rounded-full"
  :class="{
    'bg-green-100 text-green-800':
      cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
      cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length >= 2,
    'bg-red-100 text-red-800':
      cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
      cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length < 2,
    'bg-blue-100 text-blue-800':
      !cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
      new Date(aula.dataAbertura) <= new Date() && new Date(aula.dataFechamento) > new Date(),
    'bg-gray-100 text-gray-800':
      !cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
      (new Date(aula.dataAbertura) > new Date() || new Date(aula.dataFechamento) <= new Date())
  }"
>
  <template v-if="cadastro?.envios?.find(envio => envio.aulaId === aula.id)">
    {{
      cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length
    }}/
    {{
      cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.length
    }} acertos
  </template>
  <template v-else>
    <template v-if="new Date(aula.dataAbertura) > new Date()">
      Em breve
    </template>
    <template v-else-if="new Date(aula.dataFechamento) > new Date()">
      Aberto
    </template>
    <template v-else>
      Expirado
    </template>
  </template>
</span>

</NuxtLink>

        </div>
        <div v-else-if="aula.tipo === 'complementar'" class="bg-white p-6 rounded-lg shadow md:h-full md:min-h-[320px] md:flex md:flex-col">
    <h3 class="font-semibold text-lg mb-2">
      <span class="font-bold text-xl">Complementar</span>
      <span class="text-gray-600"> | {{ aula.titulo }}</span>
    </h3>
    <p class="text-sm text-gray-500 mb-4">
      Data: {{ formatarData(aula.data) }}<br>
      Professor: {{ aula.professor }}
    </p>
    <NuxtLink
      :to="aula.linkVideo || ''"
      :tabindex="aula.linkVideo ? 0 : -1"
      :aria-disabled="!aula.linkVideo"
      :class="[
        'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center',
        aula.linkVideo ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
      ]"
    >
      <div class="flex items-center">
        <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
        <span class="text-gray-600 text-lg">Vídeo-aula</span>
      </div>
    </NuxtLink>
  </div>
      </div>
    </div>
  </section>
</div>


</template>