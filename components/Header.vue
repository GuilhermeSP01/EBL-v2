<script setup>
  const navItems = [
    { name: 'Fale conosco', link: 'https://wa.me/5513988542892' },
    { name: 'Aulas', link: '/aulas' },
    { name: 'Perfil', link: '/perfil' }
  ];

  const isMenuOpen = ref(false);
</script>

<template>
  <header class="bg-[#00105C] text-white px-6 py-4">
    <div class="mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <NuxtLink to="/aulas" class="text-xl font-bold">
          Escola da Bíblia
        </NuxtLink>
      </div>
      <!-- Menu Mobile -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-white focus:outline-none"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <!-- Menu Desktop -->
      <ul
        :class="[
          'md:flex gap-6',
          isMenuOpen
            ? 'flex flex-col gap-2 absolute top-[4.5rem] left-0 w-full bg-[#00105C] px-6 py-4 z-50'
            : 'hidden'
        ]"
      >
        <li v-for="item in navItems" :key="item.name">
          <NuxtLink
            :to="item.link"
            class="hover:text-yellow-400 transition-colors"
            :target="item.link.startsWith('http') ? '_blank' : '_self'"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>