<template>
  <div class="w-[95%] mx-auto">
    <div class="flex items-center p-2 border-b border-t border-light opacity-50 mb-2 text-primary">
      <div class="text-xs text-center w-[30%] sm:w-[15%]">Driver</div>
      <div @click="showPickup=!showPickup" class="text-xs text-link text-center w-[30%] flex items-center justify-center sm:hidden">
        <div class="flex items-center justify-center gap-2 cursor-pointer">
          <font-awesome-icon :icon="faRightLeft"></font-awesome-icon>
          <p>{{ showPickup ? 'Pickup' : 'Target'}}</p>
        </div>
      </div>
      <div class="text-xs text-center w-[36%] hidden sm:block">Pickup</div>
      <div class="text-xs text-center w-[36%] hidden sm:block">Target</div>
      <div class="text-xs text-center w-[20%]">Date</div>
      <div class="text-xs text-center w-[15%] hidden sm:block">Started</div>
      <div class="text-xs text-center w-[15%] hidden sm:block">Finished</div>
      <div @click="showStartedAt=!showStartedAt" class="text-xs text-link text-center w-[20%] flex items-center justify-center sm:hidden">
        <div class="flex items-center justify-center gap-2 cursor-pointer">
          <font-awesome-icon :icon="faRightLeft"></font-awesome-icon>
          <p>{{ showStartedAt ? 'Started' : 'Finished'}}</p>
        </div>
      </div>
    </div>
    <div class="" v-for="trip of trips">
      <TripListItem :trip="trip" :show-pickup="showPickup" :on-drivers-page="false" :showStartedAt="showStartedAt">
      </TripListItem>
    </div>
    <div class="flex flex-col items-center mt-5">
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
</template>

<script setup lang="ts">
import {PaginationInfo, Trip} from "~/models/apiModels";
import TripListItem from "~/components/TripListItem.vue";
import {navigateTo} from "#app";
import {useUserStore} from "~/store/UserStore";
import {faRightLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useGlobalStore} from "~/store/GlobalStore";
import {useIntervalFn} from "@vueuse/core";

const trips = ref<Trip[]>([])
const showPickup = ref(false)
const showStartedAt = ref(false)
const paginationInfo = ref<PaginationInfo>({
  page: 1,
  perPage: 0,
  totalPages:0,
  totalItems: 0
})

if(!useUserStore().isAdmin || !useUserStore().loggedIn) {
  navigateTo('/')
}

onMounted(async () => {
  useGlobalStore().startLoading();
  await getPage(1)
  useGlobalStore().stopLoading();
})

useIntervalFn(() => {
  getPage(paginationInfo.value.page);
}, 5000)
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
  const response = await fetchTrips(undefined,{page:page, pageSize:10})
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