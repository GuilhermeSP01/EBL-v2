<script setup>
    const { $auth } = useNuxtApp();
    const showAuthCard = ref(false);

    const handleLogin = async () => {
        if ($auth.currentUser) {
            navigateTo('/aulas');
        } else {
            showAuthCard.value = true;
        };
    }
</script>

<template>
    <CardAuth v-show="showAuthCard" @close="showAuthCard = false" />

    <header class="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4">
        <h1 class="text-2xl text-white font-extrabold tracking-wide"><a href="#inicio"> Escola da Bíblia </a></h1>

        <div class="gap-8 text-white flex">
            <div class=" hidden md:flex gap-8">
                <a href="#inicio" class="bg-white/10 px-4 py-2 rounded-xl"> Início </a>
                <a href="#sobre" class="bg-white/10 px-4 py-2 rounded-xl"> Sobre </a>
                <a href="#depoimentos" class="hidden bg-white/10 px-4 py-2 rounded-xl"> Depoimentos </a>
            </div>

            <button
                @click="handleLogin"
                class="border-2 border-white text-white hover:bg-white/10 hover:border-yellow-400 hover:text-yellow-400 font-medium px-4 py-2 rounded-xl transition-colors"
                >
                Entrar
            </button>
        </div>

        
    </header>

    <main id="inicio" class="flex min-h-screen w-full bg-gradient-to-r from-blue-900 to-[#00105C]">
        <div class="w-1/2 flex flex-col justify-center items-center">
            <h2 class="text-4xl text-white font-extrabold tracking-wide mb-4"> Bem vindo! </h2>

            <h3 class="text-2xl font-semibold text-blue-100"> Turma 2 - 2025 </h3>
            <p class="text-lg text-blue-200 mb-6"> As inscrições estão abertas! </p>

            <button
                    @click="handleLogin"
                    class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                Inscreva-se
            </button>
        </div>

        <div class="w-1/2 min-h-screen bg-[url('/background/facebook2c.png')] bg-cover bg-center" style="background-position: 30% center;">
            <!-- Imagem -->
        </div>
    </main>



    <section id="sobre" class="flex min-h-screen w-full bg-gradient-to-r from-blue-900 to-[#00105C]">
        <div class="w-1/2 min-h-screen bg-[url('/background/facebook4c.png')] bg-cover bg-center" style="background-position: 100% center;">
            <!-- Imagem -->
        </div>

        <div class="w-1/2 flex flex-col justify-center items-center">
            <h1 class="text-4xl text-white font-extrabold tracking-wide mb-4 pt-4">Sobre a EBL</h1>
            <article class="w-full max-h-[80vh] overflow-y-auto rounded-lg p-2 text-white">
                <h2 class="text-2xl font-bold mb-4">Quem somos</h2>
                <p class="mb-4 leading-relaxed">
                    A Escola da Bíblia nasceu em 2007, mantida 100% por voluntários apaixonados pela Palavra.
                    Acreditamos, como ensinou Jesus, que “conhecereis a verdade, e a verdade vos libertará”
                    (Jo 8.32) e que “de graça recebestes, de graça dai” (Mt 10.8). Por isso, todos os nossos
                    cursos são inteiramente gratuitos — sempre foram, sempre serão.
                </p>

                <h2 class="text-2xl font-bold mb-4">Nosso curso destaque</h2>
                <h3 class="text-xl font-semibold mb-2">Intensivo de Teologia Bíblica</h3>
                <ul class="list-disc pl-6 mb-4 leading-relaxed">
                    <li><strong>Formato:</strong> semestral</li>
                    <li><strong>Carga horária:</strong> 120 h/aula presenciais ou ao vivo on-line</li>
                    <li><strong>Foco:</strong> panorama bíblico de Gênesis a Apocalipse, com ênfase em história, teologia e aplicação prática.</li>
                </ul>

                <h3 class="text-xl font-semibold mb-2">Metodologia</h3>
                <ul class="list-disc pl-6 mb-4 leading-relaxed">
                    <li>Exposição direta dos textos bíblicos (nada além da Bíblia)</li>
                    <li>Aulas dinâmicas, debates e tarefas devocionais</li>
                    <li>Material digital gratuito em PDF</li>
                    <li><strong>Certificação:</strong> declaração de conclusão emitida ao final do semestre</li>
                </ul>

                <h2 class="text-2xl font-bold mb-4">Modalidades de estudo</h2>
                <div class="overflow-x-auto mb-4">
                    <table class="min-w-full bg-white/5 rounded-lg">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 text-left">Modalidade</th>
                                <th class="px-4 py-2 text-left">Onde acontece</th>
                                <th class="px-4 py-2 text-left">Para quem é ideal</th>
                                <th class="px-4 py-2 text-left">Quando começa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2">Presencial</td>
                                <td class="px-4 py-2">Sede São Vicente (SP)</td>
                                <td class="px-4 py-2">Moradores da Baixada Santista ou visitantes</td>
                                <td class="px-4 py-2">Fevereiro / Agosto</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2">On-line ao vivo</td>
                                <td class="px-4 py-2">Plataforma interativa (Zoom + Classroom)</td>
                                <td class="px-4 py-2">Alunos de qualquer país e fuso horário</td>
                                <td class="px-4 py-2">Fevereiro / Agosto</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 class="text-2xl font-bold mb-4">Por que escolher a Escola da Bíblia?</h2>
                <ul class="list-disc pl-6 mb-4 leading-relaxed">
                    <li><strong>Ensino centrado somente nas Escrituras</strong> – sem acréscimos doutrinários.</li>
                    <li><strong>Custo zero</strong> – apostilas, aulas e apoio acadêmico totalmente gratuitos.</li>
                    <li><strong>Voluntariado comprometido</strong> – professores e monitores atuam por amor ao Reino.</li>
                    <li><strong>Comunidade global</strong> – turmas com alunos de diversos estados e continentes.</li>
                    <li><strong>Ambiente acolhedor</strong> – acolhemos iniciantes e estudiosos experientes igualmente.</li>
                </ul>

                <h2 class="text-2xl font-bold mb-4">Como se inscrever</h2>
                <ol class="list-decimal pl-6 mb-4 leading-relaxed">
                    <li>Preencha o formulário de inscrição (link no topo da página).</li>
                    <li>Escolha a modalidade (Presencial São Vicente ou On-line).</li>
                    <li>Aguarde o e-mail de confirmação com orientações e calendário.</li>
                    <li>Participe da aula inaugural e receba seu kit de boas-vindas digital.</li>
                </ol>

                <h2 class="text-2xl font-bold mb-4">Nossa missão</h2>
                <p class="mb-4 leading-relaxed italic">
                    “Formar discípulos que manejem bem a Palavra da verdade, capacitando-os a viver, ensinar e compartilhar o evangelho em qualquer contexto.”
                </p>

                <h2 class="text-2xl font-bold mb-4">Venha estudar conosco!</h2>
                <p class="leading-relaxed">
                    Se você deseja aprofundar-se na Bíblia, crescer em fé e servir melhor à sua comunidade, a Escola da Bíblia no Litoral é para você. Inscreva-se hoje mesmo — e descubra como a verdade liberta.
                </p>
            </article>
        </div>
    </section>



    <section id="depoimentos" class="hidden flex min-h-screen w-full bg-gradient-to-r from-blue-900 to-[#00105C]">
        <div class="w-1/2 min-h-screen bg-[url('/background/facebook1c.png')] bg-cover bg-center" style="background-position: 100% center;">
            <!-- Imagem -->
        </div>

        <div class="w-1/2 flex flex-col justify-center items-center">
            <h1 class="text-4xl text-white font-extrabold tracking-wide mb-4"> Depoimentos </h1>
        </div>
    </section>



    <button
        class="fixed bottom-4 left-4 flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
        >
        <!-- Ícone WhatsApp SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M19.05 4.94A9.94 9.94 0 0 0 12 2a9.94 9.94 0 0 0-7.05 2.94A9.94 9.94 0 0 0 2 12c0 1.68.41 3.29 1.19 4.73L2 22l5.41-1.17A9.94 9.94 0 0 0 12 22c2.64 0 5.14-1.03 7.05-2.94A9.94 9.94 0 0 0 22 12c0-2.64-1.03-5.14-2.95-7.06zM12 20c-2.14 0-4.19-.83-5.72-2.36A8.06 8.06 0 0 1 4 12c0-2.14.83-4.19 2.36-5.72A8.06 8.06 0 0 1 12 4c2.14 0 4.19.83 5.72 2.36A8.06 8.06 0 0 1 20 12c0 2.14-.83 4.19-2.36 5.72A8.06 8.06 0 0 1 12 20zm4.13-6.56c-.22-.11-1.3-.64-1.5-.71-.2-.07-.34-.11-.48.11-.14.22-.55.71-.67.86-.12.15-.25.16-.47.05-.22-.11-.93-.34-1.77-1.09-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.07-.11-.48-1.16-.66-1.6-.17-.44-.35-.38-.48-.39-.12-.01-.27-.01-.41-.01-.14 0-.37.05-.56.27-.19.22-.74.73-.74 1.78s.76 2.07.87 2.22c.11.15 1.5 2.29 3.64 3.12.51.18.9.29 1.21.37.51.13.97.11 1.34.07.41-.05 1.3-.53 1.48-1.04.18-.51.18-.94.13-1.04-.05-.1-.2-.16-.42-.27z"/>
        </svg>
        Fale conosco
    </button>
</template>