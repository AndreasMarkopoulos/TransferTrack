<template>
  <nav :class="{ 'navbar--hidden': !showNavbar }"
       style="z-index: 999"
       class="px-2.5 shadow-md sticky top-0 sm:px-4 py-2.5 bg-dark">
    <div class="container flex flex-wrap items-center h-10 justify-between mx-auto">
      <img src="../assets/images/adaptive-icon.png" class="h-10" alt="">
      <nuxt-link to="/" class="flex items-center">
      </nuxt-link>
      <div class="flex items-center md:order-2">
        <div class="flex lg:w-[192px] justify-end">
          <button v-if="isLoggedIn" @click="logout" class="bg-primary p-0.5 rounded-md px-1.5">
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

<style scoped>
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
</style>