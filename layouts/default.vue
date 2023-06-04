<template>
  <div class="bg-secondary">
    <navbar/>
    <transition name="fade" mode="out-in">
      <loading class="backdrop-blur-[1px]" v-if="isLoading" />
    </transition>
    <div class="mt-5 mb-10">
      <slot/>
    </div>
<!--    <div class="border-t mt-10 py-3 text-elevated text-sm flex justify-center items-center">TransferTrack® by Dreasa</div>-->
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