<template>
  <div class="sm:flex items-start px-10 gap-x-[4%]">
    <div>
      <Datepicker v-model="selectedDate" dark inline auto-apply/>
    </div>
    <div class="sm:w-[80%]">
      <div class="bg-darker rounded-lg p-5 my-5 sm:mt-0">
        <h1 class="text-primary text-2xl ml-5 mb-4">Active trips by time</h1>
        <ConcurrentTripsByTimeChart :selected-date-trips="selectedDateTrips"></ConcurrentTripsByTimeChart>
      </div>
      <div class="sm:flex gap-x-5">
        <div class="bg-darker rounded-lg p-5 mt-5 sm:mt-0 sm:w-[50%]">
          <h1 class="text-primary text-2xl ml-5 mb-4">Trips by pickup location</h1>
          <PickupLocationChart :selected-date-trips="selectedDateTrips"></PickupLocationChart>
        </div>
        <div class="bg-darker rounded-lg p-5 mt-5 sm:mt-0 sm:w-[50%]">
          <h1 class="text-primary text-2xl ml-5 mb-4">Trips by target location</h1>
          <TargetLocationChart :selected-date-trips="selectedDateTrips"></TargetLocationChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css';
import ConcurrentTripsByTimeChart from "~/components/Charts/ConcurrentTripsByTimeChart.vue";
import {Trip} from "~/models/apiModels";
import {useIntervalFn} from "@vueuse/core";
import {fetchTripsByDate} from "~/utils/pocketbase";
import TargetLocationChart from "~/components/Charts/TargetLocationChart.vue";
import PickupLocationChart from "~/components/Charts/PickupLocationChart.vue";

const selectedDate = ref<Date>(new Date())
const selectedDateTrips = ref<Trip[]>([])

useIntervalFn(() => fetchData(),5000)
onMounted(() => fetchData())
watch(selectedDate, () => fetchData())
async function fetchData() {
  selectedDateTrips.value = await fetchTripsByDate(selectedDate.value);
}
</script>

<style>
.dp__theme_dark {
  --dp-background-color: #211F26;
  --dp-text-color: #ffffff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #1eb980;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>