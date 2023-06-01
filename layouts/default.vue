<template>
  <div class="bg-secondary">
    <navbar/>
    <transition name="fade" mode="out-in">
      <loading class="backdrop-blur-[1px]" v-if="isLoading" />
    </transition>
    <div class="mt-3">
      <slot/>
    </div>
  </div>
</template>

<script setup>
import {useGlobalStore} from "~/store/GlobalStore";

const isLoading = computed(()=>{
  return useGlobalStore().loading > 0
})
</script>

<style>

</style>