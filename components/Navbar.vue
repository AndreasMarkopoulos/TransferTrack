<template>
  <nav :class="{ 'navbar--hidden': !showNavbar }"
       style="z-index: 999"
       class="px-2.5 shadow-md sticky top-0 sm:px-4 bg-dark">
    <div class="container flex flex-wrap items-center h-10  h-full justify-between mx-auto">
      <a href="/" class="flex items-center w-[20%]">
        <img src="../assets/images/adaptive-icon.png" class="h-10" alt="">
      </a>
      <div class="text-primary flex justify-between h-[3.4rem] gap-1 w-32 tracking-wide">
        <nuxt-link v-if="isLoggedIn" to="/drivers" class="w-[4rem] flex items-center justify-center border-b-2 border-elevated opacity-60 font-semibold">Drivers</nuxt-link>
        <nuxt-link v-if="isLoggedIn" to="/trips" class="w-[4rem] flex items-center justify-center border-b-2 border-elevated opacity-60 font-semibold">Trips</nuxt-link>
      </div>
      <div class="flex items-center md:order-2 justify-end w-[20%]">
        <div class="flex lg:w-[192px] justify-end">
          <button v-if="isLoggedIn" @click="logout" class="bg-primary py-1 rounded-md px-1.5 text-sm font-semibold">
            Logout
          </button>
        </div>
        <!-- Dropdown menu -->
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {useUserStore} from "~/store/UserStore";
import {navigateTo} from "#app";
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
const showNavbar = ref(true);
const lastScrollPosition = ref(0);
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.loggedIn)
function logout() {
  userStore.logout();
  navigateTo('/')
}

function handleNavigation() {
  if(isLoggedIn.value) {
    navigateTo('/my-meal-plans')
  }
  else {
    navigateTo('/login')
  }
}
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

</style>