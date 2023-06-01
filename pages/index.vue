<template>
  <div class="flex flex-col gap-10 h-full w-full justify-center items-center fixed" style="top:50%; transform:translateY(-55%)">
    <img src="../assets/images/adaptive-icon.png" class="h-28" alt="">
    <div class="">
      <p class="text-primary font-bold text-center pb-2">Enter Your ID:</p>
      <input v-model="userId" type="text" class="border border-light bg-dark text-primary rounded p-1">
    </div>
    <button
        @click="authenticate"
        :disabled="userId===''"
        :class="userId==='' ? 'bg-secondary border border-light text-primary' : 'bg-primary border'"
        class="bg-primary rounded px-2 py-1">
      Authenticate
    </button>
  </div>
</template>

<script setup lang="ts">
import {checkUserRole} from "~/utils/pocketbase";
import {UserRole} from "~/models/apiModels";
import {useUserStore} from "~/store/UserStore";
import {navigateTo} from "#app";

const userId = ref('')
async function authenticate() {
  const role = await checkUserRole(userId.value);
  await useUserStore().authenticate(role)
  console.log(useUserStore().isAdmin)
  if(useUserStore().isAdmin) {
    navigateTo('/drivers')
  }
}
</script>

<style scoped>

</style>