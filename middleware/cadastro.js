import { useCadastro } from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    
    const { cadastro, load } = useCadastro();
    await load();

    if (!cadastro.value && to.path !== '/inscricao')
        return navigateTo('/inscricao');

    if (cadastro.value && to.path === '/inscricao')
        return navigateTo('/aulas');
});