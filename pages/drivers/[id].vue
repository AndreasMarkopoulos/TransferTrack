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
            <div class="flex items-center justify-center gap-2 w-10 cursor-pointer">
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
        <div v-for="trip in trips">
          <trip-list-item :trip="trip" :show-pickup="showPickup" :on-drivers-page="true"></trip-list-item>
        </div>
      </div>
      <div v-if="trips.length" class="flex flex-col items-center mt-5">
      <span class="text-sm text-light dark:text-gray-400">
        Showing page <span class="font-semibold dark:text-white">{{ paginationInfo.page }}</span> of <span class="font-semibold dark:text-white">{{paginationInfo.totalPages}}</span>
      </span>
        <div class="inline-flex mt-2 xs:mt-0 border-1 border-light">
          <button @click="getPrevPage"
                  :disabled="paginationInfo.page === 1"
                  :class="paginationInfo.page === 1 ? 'opacity-30' : ''"
                  class="px-4 py-2 text-sm font-medium text-light bg-semidark rounded-l hover:bg-gray-900">
            Prev
          </button>
          <button @click="getNextPage"
                  :disabled="paginationInfo.page === paginationInfo.totalPages"
                  :class="paginationInfo.page === paginationInfo.totalPages ? 'opacity-30' : ''"
                  class="px-4 py-2 text-sm font-medium text-light bg-semidark border-0 border-l border-light rounded-r hover:bg-gray-900">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {fetchDriver, fetchTrips} from "~/utils/pocketbase";
import {Driver, PaginationInfo, Trip} from "~/models/apiModels";
import {Ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircle, faPhone, faRightLeft} from "@fortawesome/free-solid-svg-icons";
import {useUserStore} from "~/store/UserStore";
import {navigateTo} from "#app";
import {useGlobalStore} from "~/store/GlobalStore";
import {useIntervalFn} from "@vueuse/core";
if(!useUserStore().isAdmin) {
  navigateTo('/')
}
const route = useRoute()
const driver: Ref<Driver | undefined> = ref()
const trips: Ref<Trip[]> = ref([])
const showPickup = ref(true)
const paginationInfo = ref<PaginationInfo>({
  page: 1,
  perPage: 0,
  totalPages:0,
  totalItems: 0
})

onMounted(() => {
  fetchData();
})

useIntervalFn(() => {
  fetchData();
},5000)
async function fetchData() {
  await getDriverDetails();
  await getPage(paginationInfo.value.page);
}
async function getDriverDetails() {
  driver.value = await fetchDriver(route.params.id as string)
}
async function getNextPage() {
  useGlobalStore().startLoading();
  if (paginationInfo.value.page < paginationInfo.value.totalPages) {
    await getPage(paginationInfo.value.page + 1);
  }
  useGlobalStore().stopLoading();
}
async function getPrevPage() {
  useGlobalStore().startLoading();
  if(paginationInfo.value.page>1) {
    await getPage(paginationInfo.value.page - 1);
  }
  useGlobalStore().stopLoading();
}
async function getPage(page: number) {
  if(!driver.value) {
    return
  }
  const response = await fetchTrips(driver.value.id,{page:page, pageSize:10})
  trips.value = response.items;
  paginationInfo.value = {
    page: response.page,
    perPage: response.perPage,
    totalPages:response.totalPages,
    totalItems: response.totalItems
  }
}
</script>

<style scoped>

</style>