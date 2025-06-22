<script setup> 
    const { $auth } = useNuxtApp();
    const showAuthCard = ref(false);
    const activeSection = ref('sobre');
    const activeFaq = ref(null);

    const handleLogin = async () => {
        if ($auth.currentUser) {
            navigateTo('/aulas');
        } else {
            showAuthCard.value = true;
        };
    }

    const setActiveSection = (section) => {
        activeSection.value = section;
    };

    const toggleFaq = (index) => {
        if (activeFaq.value === index) {
            activeFaq.value = null;
        } else {
            activeFaq.value = index;
        }
    };
</script>

<template>
    <CardAuth v-show="showAuthCard" @close="showAuthCard = false" />
    <div class="relative min-h-screen">
         <div class="h-screen snap-y snap-mandatory overflow-y-auto">
            <div class="snap-start">
                <!-- Imagem de fundo -->
                <div class="absolute inset-0 w-full h-screen bg-blue-900/70">
                    <img src="/public/image.png" alt="Background" class="w-full h-full object-cover"/>
                </div>

                <!-- Header -->
                <header class="relative bg-transparent px-6 py-4 flex justify-between items-center backdrop-blur-sm z-10">
                    <div class="flex items-center">
                        <p class="text-2xl font-bold text-white"> Escola da Bíblia </p>
                    </div>
                    <div class="flex gap-4">
                        <button
                            @click="navigateTo('https://wa.me/5513988542892', { external: true })"
                            class="border-2 border-white text-white hover:bg-white/10 hover:border-yellow-400 hover:text-yellow-400 font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                            Fale conosco
                        </button>

                        <button
                            @click="handleLogin"
                            class="border-2 border-white text-white hover:bg-white/10 hover:border-yellow-400 hover:text-yellow-400 font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                            Entrar
                        </button>
                    </div>
                </header>

                <!-- Conteúdo principal -->
                <main class="relative text-white px-6 pt-12 pb-18 lg:pt-24 lg:pb-30 max-w-4xl mx-auto">
                    <!-- <h1 class="text-4xl font-extrabold mb-4 text-center">Curso de Teologia Bíblica</h1> -->
                    <img src="/public/logo2w.png" alt="Logo" class="w-46 h-36 mx-auto mb-4" />
                    <p class="text-lg mb-8 text-center max-w-3xl mx-auto">
                        Descubra gratuitamente a Palavra de Deus com fé, simplicidade e sem rótulos religiosos
                    </p>
                    <button
                        @click="handleLogin"
                        class="block mx-auto bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Comece agora
                    </button>
                </main>

                <!-- Seção de benefícios -->
                <section class="relative bg-white/80 backdrop-blur-sm text-gray-900 py-8 px-6 sm:py-16">
                    <h2 class="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                        Tudo que você precisa saber para começar
                    </h2>
                    <ul class="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Inscrições abertas semestralmente
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Curso gratuito presencial e online
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Aulas com material acessível e apoio pedagógico
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Frequência adaptada à sua rotina
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Certificado ao final do curso
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="bg-yellow-400 rounded-full p-1">✔️</span>
                            Sem pré-requisitos — só o desejo de aprender mais sobre Deus
                        </li>
                    </ul>
                </section>
            </div>

            <div class="snap-start">
                <div class="h-screen">
                    <!-- Atalhos para navegação, alinhar horizontalmente -->
                    <section class="relative bg-[#00105C] backdrop-blur-sm py-4 px-6">
                        <div class="max-w-6xl mx-auto">
                            <div class="flex flex-nowrap justify-center gap-4 overflow-x-auto py-2">
                            <!-- Sobre o Curso -->
                            <button
                                @click="setActiveSection('sobre')"
                                class="flex flex-col items-center bg-white/10 rounded-xl shadow-sm p-3 w-1/4 sm:w-56 flex-shrink-0 hover:shadow-md hover:border-yellow-400 border-2 border-transparent transition-all backdrop-blur-sm"
                            >
                                <div class="bg-yellow-400 rounded-full p-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                </div>
                                <span class="text-white font-medium text-sm">Sobre o Curso</span>
                            </button>

                            <!-- Depoimentos de Alunos -->
                            <button
                                @click="setActiveSection('depoimentos')"
                                class="flex flex-col items-center bg-white/10 rounded-xl shadow-sm p-3 w-1/4 sm:w-56 flex-shrink-0 hover:shadow-md hover:border-yellow-400 border-2 border-transparent transition-all backdrop-blur-sm"
                            >
                                <div class="bg-yellow-400 rounded-full p-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                </div>
                                <span class="text-white font-medium text-sm">Depoimentos de Alunos</span>
                            </button>

                            <!-- Perguntas Frequentes -->
                            <button
                                @click="setActiveSection('faq')"
                                class="flex flex-col items-center bg-white/10 rounded-xl shadow-sm p-3 w-1/4 sm:w-56 flex-shrink-0 hover:shadow-md hover:border-yellow-400 border-2 border-transparent transition-all backdrop-blur-sm"
                            >
                                <div class="bg-yellow-400 rounded-full p-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                </div>
                                <span class="text-white font-medium text-sm">Perguntas Frequentes</span>
                            </button>
                            </div>
                        </div>
                    </section>


                    <!-- Conteúdo dinâmico -->
                    <div class="relative bg-gray-100 backdrop-blur-sm text-blue-900 py-8 px-6 sm:py-16 w-full mx-auto h-[calc(100vh-10rem)] overflow-y-auto">
                        <!-- Sobre o Curso -->
                        <section v-if="activeSection === 'sobre'" id="sobre" class="space-y-6 max-w-4xl mx-auto px-6">
                            <h2 class="text-3xl font-bold text-center mb-8 text-blue-900">Sobre o Curso</h2>
                            <div class="bg-white rounded-xl shadow-md p-8 space-y-6">
                                <p class="text-lg text-gray-800 leading-relaxed">
                                    A escola da Bíblia foi criada para quem deseja conhecer mais profundamente as Escrituras, sem complicações, sem custos e com o coração aberto para aprender. Já atendemos muitos alunos espalhados pelo Brasil. Esse é o nosso propósito!
                                </p>
                                <p class="text-lg text-gray-800 leading-relaxed">
                                    Nosso curso é teológico e bíblico, mas com linguagem acessível a todos — seja você iniciante na fé ou alguém que já estuda há mais tempo.
                                </p>
                                <p class="text-lg text-gray-800 leading-relaxed">
                                    Aqui, você aprende no seu ritmo, com materiais de apoio, videoaulas e suporte da equipe.
                                </p>
                                <div class="space-y-4">
                                    <h3 class="font-bold text-xl text-blue-900">O que você vai aprender?</h3>
                                    <ul class="list-disc pl-6 text-gray-800 space-y-2">
                                        <li class="text-lg leading-relaxed">Conteúdo do curso...</li>
                                        <li class="text-lg leading-relaxed">Conteúdo do curso...</li>
                                        <li class="text-lg leading-relaxed">Conteúdo do curso...</li>
                                    </ul>
                                </div>
                                <p class="text-lg text-gray-800 leading-relaxed">
                                    Tudo isso com uma linguagem acolhedora, sem exigência de conhecimento prévio e com certificado gratuito ao final.
                                </p>
                            </div>
                        </section>



                        <!-- Depoimentos de Alunos -->
                        <section v-if="activeSection === 'depoimentos'" id="depoimentos" class="space-y-6 max-w-4xl mx-auto px-6">
                            <h2 class="text-3xl font-bold text-center mb-8 text-blue-900">O que os alunos dizem?</h2>
                            <div class="grid sm:grid-cols-2 gap-8">
                                <!-- Depoimento 1 -->
                                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                <div class="flex items-center mb-6">
                                    <div class="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg mr-4">M</div>
                                        <div>
                                            <h3 class="font-semibold text-gray-900 text-lg">Maria Silva</h3>
                                            <p class="text-sm text-gray-600">Aluna do Curso</p>
                                        </div>
                                    </div>
                                    <!-- Estrelas de avaliação -->
                                    <div class="flex mb-4">
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p class="text-gray-800 text-base leading-relaxed italic">"O curso mudou minha forma de ver a Bíblia. Aprendi muito e recomendo para todos!"</p>
                                </div>
                                <!-- Depoimento 2 -->
                                <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                    <div class="flex items-center mb-6">
                                        <div class="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg mr-4">J</div>
                                            <div>
                                                <h3 class="font-semibold text-gray-900 text-lg">João Santos</h3>
                                                <p class="text-sm text-gray-600">Aluno do Curso</p>
                                            </div>
                                    </div>
                                    <!-- Estrelas de avaliação -->
                                    <div class="flex mb-4">
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg class="w-5 h-5 text-yellow-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p class="text-gray-800 text-base leading-relaxed italic">"Muito conteúdo de qualidade e linguagem simples. Foi ótimo para minha jornada de fé."</p>
                                </div>
                            </div>
                        </section>



                        <!-- Perguntas Frequentes -->
                        <section v-if="activeSection === 'faq'" id="faq" class="space-y-6 max-w-4xl mx-auto px-6">
                            <h2 class="text-3xl font-bold text-center mb-8 text-blue-900">Perguntas Frequentes (FAQ)</h2>
                            <div class="space-y-4">
                                <div
                                    v-for="(faq, index) in [
                                        { question: 'Pergunta 1', answer: 'Resposta 1' },
                                        { question: 'Pergunta 2', answer: 'Resposta 2' },
                                        { question: 'Pergunta 3', answer: 'Resposta 3' }
                                    ]"
                                    :key="index"
                                    class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    @click="toggleFaq(index)"
                                    >
                                    <div class="flex justify-between items-center">
                                        <p class="font-semibold text-gray-900">{{ faq.question }}</p>
                                        <svg v-if="activeFaq === index" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div v-show="activeFaq === index" class="mt-4 text-gray-800">
                                        <p>{{ faq.answer }}</p>
                                    </div>
                                </div>
                            </div>
                        </section>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    html {
        scroll-behavior: smooth;
    }
</style>