<template>
  <div v-if="driver && driver.id" class="items-center flex flex-col">
    <div class="flex gap-5 w-[80%] bg-semidark p-3 rounded">
      <img :src="`https://mealmind-pocketbase.fly.dev/api/files/drivers/${driver.id}/${driver.picture}`" alt=""
           class="w-28 h-28 rounded border">
      <div class="flex flex-col justify-center">
        <p class="text-3xl text-primary font-bold">{{driver.nickname}}</p>
        <p class="text-lg text-light">{{driver.name}}</p>
      </div>
    </div>
    <div class="w-[80%] mt-5">
      <p class="text-xl text-primary font-bold mb-3">Details</p>
      <div class="bg-semidark rounded py-2 mb-1.5 flex gap-2">
        <p class="text-light opacity-50 w-10 text-center">ID</p>
        <p class="text-primary">{{ driver.id }}</p>
      </div>
      <div class="bg-semidark rounded py-2 mb-1.5 flex gap-2">
        <font-awesome-icon class="text-light opacity-50 w-10" :icon="faPhone"/>
        <a :href="`tel:${driver.phone}`" class="text-link">{{ driver.phone }}</a>
      </div>
      <div class="bg-semidark rounded py-2 mb-1.5 flex gap-2">
        <font-awesome-icon class="text-light opacity-50 w-10" :icon="faPhone"/>
        <p class="text-primary">{{ driver.carModel }}</p>
      </div>
      <div class="bg-semidark rounded py-2 mb-1.5 flex gap-2">
        <font-awesome-icon class="text-light opacity-50 w-10" :icon="faPhone"/>
        <p class="text-primary">{{ driver.carPlate }}</p>
      </div>
    </div>
    <div class="mb-3 items-center text-center mt-5 flex gap-2">
      <p class="text-xl text-primary font-bold ">Trips</p>
      <p class="text-xl text-primary opacity-50">({{trips.length}})</p>
    </div>
    <div class="w-[95%] sm:w-[80%]">
      <div class="text-primary">
        <div class="flex items-center p-2 border-b border-t border-light opacity-50 mb-2">
          <div @click="showPickup=!showPickup" class="text-xs text-link text-center w-[40%] flex items-center justify-center sm:hidden">
            <div class="flex items-center justify-between gap-2 w-10">
              <font-awesome-icon :icon="faRightLeft"/>
              <p>{{ showPickup ? 'Pickup' : 'Target'}}</p>
            </div>
          </div>
          <div class="text-xs text-center w-[40%] hidden sm:block">Pickup</div>
          <div class="text-xs text-center w-[40%] hidden sm:block">Target</div>
          <div class="text-xs text-center w-[20%]">Date</div>
          <div class="text-xs text-center w-[20%]">Started</div>
          <div class="text-xs text-center w-[20%]">Finished</div>
        </div>
        <div v-for="trip in trips" class="flex items-center bg-semidark rounded mb-1.5 p-2">

          <div v-if="showPickup" class="text-center w-[40%] sm:hidden">{{trip.pickupLocation}}</div>
          <div v-else class="text-center w-[40%] sm:hidden">{{trip.targetLocation}}</div>

          <div class="text-center w-[40%] hidden sm:block">{{trip.pickupLocation}}</div>
          <div class="text-center w-[40%] hidden sm:block">{{trip.targetLocation}}</div>
          <div class="text-center w-[20%]">{{formatDate(trip.created).day}}</div>
          <div class="text-center w-[20%]">{{formatDate(trip.created).time}}</div>
          <div v-if="trip.finishedAt" class="text-center w-[20%]">{{formatDate(trip.finishedAt).time}}</div>
          <font-awesome-icon v-else :icon="faCircle" class="text-center w-[20%] text-success" fade/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {fetchDriver, fetchTrips} from "~/utils/pocketbase";
import {Driver, Trip} from "~/models/apiModels";
import {Ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircle, faPhone, faRightLeft} from "@fortawesome/free-solid-svg-icons";
import {useUserStore} from "~/store/UserStore";
import {navigateTo} from "#app";
if(!useUserStore().isAdmin) {
  navigateTo('/')
}
const route = useRoute()
const driver: Ref<Driver | undefined> = ref()
const trips: Ref<Trip[]> = ref([])
const showPickup = ref(true)

onMounted(() => {
  getDriverDetails();
  getDriverTrips();
})

async function getDriverDetails() {
  driver.value = await fetchDriver(route.params.id as string)
}
async function getDriverTrips() {
  trips.value = await fetchTrips(route.params.id as string)
}
</script>

<style scoped>

</style>