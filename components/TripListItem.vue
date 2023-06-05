<template>
  <div v-if="onDriversPage" class="flex items-center bg-semidark rounded mb-1.5 p-2 text-primary">
    <div v-if="showPickup" class="text-center w-[40%] sm:hidden">{{props.trip.pickupLocation}}</div>
    <div v-else class="text-center w-[40%] sm:hidden">{{props.trip.targetLocation}}</div>

    <div class="text-center w-[40%] hidden sm:block">{{props.trip.pickupLocation}}</div>
    <div class="text-center w-[40%] hidden sm:block">{{props.trip.targetLocation}}</div>
    <div class="text-center w-[20%]">{{formatDate(props.trip.created).day}}</div>
    <div class="text-center w-[20%]">{{formatDate(props.trip.created).time}}</div>
    <div v-if="props.trip.finishedAt" class="text-center w-[20%]">{{formatDate(props.trip.finishedAt).time}}</div>
    <font-awesome-icon v-else :icon="faCircle" class="text-center w-[20%] text-success" fade/>
  </div>

  <div v-else class="flex items-center bg-semidark rounded mb-1.5 p-2 text-primary">
    <nuxt-link v-if="props.trip.expand?.driverId.nickname" :to="`/drivers/${props.trip.expand?.driverId.id}`" class="text-center text-link w-[30%] sm:w-[15%] overflow-x-hidden text-ellipsis">
      {{props.trip.expand?.driverId.nickname}}
    </nuxt-link>
    <div v-else class="text-center w-[30%] sm:w-[15%] text-xs text-primary opacity-40 overflow-x-hidden text-ellipsis whitespace-nowrap">[Deleted]</div>
    <div v-if="showPickup" class="text-center w-[36%] sm:w-[36%] sm:hidden overflow-x-hidden text-ellipsis">{{props.trip.pickupLocation}}</div>
    <div v-else class="text-center w-[36%] overflow-x-hidden text-ellipsis sm:hidden">{{props.trip.targetLocation}}</div>

    <div class="text-center w-[36%] hidden sm:block">{{props.trip.pickupLocation}}</div>
    <div class="text-center w-[36%] hidden sm:block">{{props.trip.targetLocation}}</div>
    <div class="text-center w-[20%]">{{formatDate(props.trip.created).day}}</div>

    <div class="text-center w-[15%] hidden sm:block">{{formatDate(props.trip.created).time}}</div>

    <div class="hidden sm:block text-center w-[15%]">
      <div v-if="props.trip.finishedAt" class="text-center hidden sm:block">{{formatDate(props.trip.finishedAt).time}}</div>
      <font-awesome-icon v-else :icon="faCircle" class="text-center w-[15%] text-success" fade/>
    </div>

    <div class="sm:hidden w-[20%] flex justify-center">
      <div v-if="showStartedAt" class="text-center">{{formatDate(props.trip.created).time}}</div>
      <div v-else class="text-center">
        <div v-if="props.trip.finishedAt" class="text-center">{{formatDate(props.trip.finishedAt).time}}</div>
        <font-awesome-icon v-else :icon="faCircle" class="text-center text-success" fade/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Trip} from "~/models/apiModels";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  trip: {
    type: Object as PropType<Trip>,
    required: true,
  },
  showPickup: Boolean,
  showStartedAt: Boolean,
  onDriversPage: Boolean,
})
</script>

<style scoped>

</style>