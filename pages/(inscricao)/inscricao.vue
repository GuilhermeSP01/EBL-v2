<script setup>
  definePageMeta({ middleware: ['auth', 'cadastro'] });
  const { isAuthLoading } = useAuth();
  const { turmas, loadTurmas } = useTurmas();

  onMounted(() => {
    loadTurmas();
  });
</script>

<template>
  <Loading v-if="isAuthLoading" />
  <div v-else class="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-6 py-12">
    <div v-if="turmas.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl w-full">
      <p class="text-gray-800 text-lg">Nenhuma há nenhuma turma aberta no momento.</p>
    </div>
    <div v-else class="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full">
      <p class="text-gray-800 text-lg mb-4">
        As inscrições estão abertas para a turma <span class="font-bold">{{ turmas[0].nome }}</span>
        até <span class="font-bold">{{ new Date(turmas[0].dataFechamento).toLocaleDateString('pt-BR') }}</span>
      </p>
      <p class="text-gray-800 text-lg mb-8">Complete sua inscrição para participar!</p>
      <FormInscricao :turma="turmas[0]" />
    </div>
  </div>
</template>
