<template>
  <nav :class="{ 'navbar--hidden': !showNavbar }"
       style="z-index: 999"
       class="px-2.5 shadow-md sticky top-0 sm:px-4 bg-dark">
    <div class="flex flex-wrap items-center h-10 h-full justify-between w- mx-auto">
      <a href="/" class="flex items-center w-[20%]">
        <img src="../assets/images/adaptive-icon.png" class="h-10" alt="">
      </a>
      <div class="text-primary flex justify-between h-[3.4rem] gap-2 tracking-wide hidden sm:flex">
        <nuxt-link v-if="isAdmin" to="/drivers" class="w-[6rem] flex items-center justify-center border-b-2 border-elevated opacity-60 font-semibold">Drivers</nuxt-link>
        <nuxt-link v-if="isAdmin" to="/trips" class="w-[6rem] flex items-center justify-center border-b-2 border-elevated opacity-60 font-semibold">Trips</nuxt-link>
        <nuxt-link v-if="isAdmin" to="/dashboard" class="w-[6rem] flex items-center justify-center border-b-2 border-elevated opacity-60 font-semibold">Dashboard</nuxt-link>
      </div>

      <div class="flex items-center hidden sm:flex md:order-2 justify-end w-[20%]">
        <div class="flex lg:w-[192px] justify-end">
          <button v-if="isLoggedIn" @click="logout" class="bg-primary py-1 rounded-md px-1.5 text-sm font-semibold">
            Logout
          </button>
        </div>
        <!-- Dropdown menu -->
      </div>
      <button v-if="!showMobileMenu && isLoggedIn" @click="showMobileMenu=true" type="button" class="inline-flex sm:hidden text-primary items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        <span class="sr-only">Open main menu</span>
        <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button v-else-if="showMobileMenu && isLoggedIn" @click="showMobileMenu=false" type="button" class="inline-flex sm:hidden text-primary items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        <span class="sr-only">Open main menu</span>
        <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </nav>
  <div v-if="showMobileMenu && isLoggedIn" class="sm:hidden text-primary rounded mt-2 bg-elevated rounded w-[85%] right-0 mr-2.5 absolute z-50" ref="mobileMenu" id="mobile-menu">
    <div class="space-y-2 px-2 pb-3 pt-2">
      <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
      <nuxt-link v-if="isAdmin" to="/drivers" class="text-gray-300 text-center hover:bg-gray-700 hover:text-white block px-3 rounded-md py-1.5 text-base font-medium">Drivers</nuxt-link>
      <nuxt-link v-if="isAdmin" to="/trips" class="text-gray-300 text-center hover:bg-gray-700 hover:text-white block px-3 rounded-md py-1.5 text-base font-medium">Trips</nuxt-link>
      <nuxt-link v-if="isAdmin" to="/dashboard" class="text-gray-300 text-center hover:bg-gray-700 hover:text-white block px-3 rounded-md py-1.5 text-base font-medium">Dashboard</nuxt-link>
      <button v-if="isLoggedIn" @click="logout" class="bg-primary py-1.5 rounded-md px-1.5 text-secondary text-sm font-semibold w-full">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/store/UserStore";
import {navigateTo} from "#app";
import {onClickOutside} from "@vueuse/core";
onMounted(()=>{
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(()=>{
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0) {
    return
  }
  // Stop executing this function if the difference between
  // current scroll position and last scroll position is less than some offset
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 30) {
    return
  }
  showNavbar.value = currentScrollPosition < lastScrollPosition.value
  lastScrollPosition.value= currentScrollPosition
}
function toggleMobileMenu() {
  console.log(showMobileMenu.value)
  showMobileMenu.value = !showMobileMenu.value;
}
const showNavbar = ref(true);
const showMobileMenu = ref(false);
const mobileMenu = ref<HTMLElement>();
const lastScrollPosition = ref(0);
const userStore = useUserStore()
const isLoggedIn = computed(() => useUserStore().loggedIn)
const isAdmin = computed(() => useUserStore().isAdmin)
function logout() {
  userStore.logout();
  navigateTo('/')
}
onClickOutside(mobileMenu, () => {
  showMobileMenu.value = false;
})
</script>

<style>
@media screen and (min-width: 500px) {
  sm\:ml-125 {
    margin-left: 125px
  }
}
.navbar--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
  transition: all 0.3s ease-in-out; /* add this line */
}
.router-link-active {
  border-bottom: 2px solid #CAC4D0;
  opacity: 100;
}
@media screen and (max-width: 640px) {
  .router-link-active {
    border-bottom: 0px;
    background: rgba(255,255,255,0.08);
    opacity: 100;
  }
}


</style>