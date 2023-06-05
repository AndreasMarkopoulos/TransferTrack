<template>
  <div class="bg-semidark w-[90%] p-1.5 pr-4 my-1.5 text-primary rounded-sm flex items-center justify-between border-r-2" :class="statusColorClass">
    <router-link :to="`/drivers/${props.driver.id}`" class="flex items-center gap-4">
      <img :src="`https://mealmind-pocketbase.fly.dev/api/files/drivers/${props.driver.id}/${props.driver.picture}`"
           onerror="this.src='https://www.stignatius.co.uk/wp-content/uploads/2020/10/default-user-icon.jpg'"
           class="w-10 h-10 rounded border border-dark">
      <div>
        <p class="text-primary font-semibold">{{props.driver.nickname ?? props.driver.name}}</p>
        <p class="text-light text-xs">{{props.driver.carModel}}</p>
      </div>
    </router-link>
    <button v-if="props.activeTab === 0"
            @click="$emit('newTrip',props.driver)"
            class="flex gap-5 items-center" >
      <p class="text-xs">{{props.driver.tripCount}}</p>
      <font-awesome-icon :icon="faLocationArrow" size="xl" class="text-primary"/>
    </button>
    <button v-else-if="props.activeTab === 1"
            @click="$emit('endTrip',props.driver)"
            class="flex gap-5 items-center">
      <p class="text-xs">{{props.driver.tripCount}}</p>
      <font-awesome-icon :icon="faFlagCheckered" size="lg" class="text-primary"/>
    </button>
    <button v-else-if="props.activeTab === 2"
            @click="$emit('setPresent',props.driver)">
      <font-awesome-icon :icon="faHand" size="lg" class="text-primary"/>
    </button>
  </div>
</template>

<script setup lang="ts">
import {faFlagCheckered, faHand, faLocationArrow} from '@fortawesome/free-solid-svg-icons'
import {PropType} from "@vue/runtime-core";
import {Driver} from "~/models/apiModels";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const statusColorClass = computed(() => !props.driver.present ? 'border-error' : (props.driver.busy ? 'border-warning' : 'border-success') )
const props = defineProps({
  driver: {
    type: Object as PropType<Driver>,
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  }
})
</script>

<style scoped>

</style>