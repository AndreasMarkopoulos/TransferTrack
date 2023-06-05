<template>
  <div>
  <div v-if="driver" class="text-primary sm:flex sm:items-center sm:justify-between sm:w-[35rem] mx-auto">
    <div class="flex justify-center mb-10 sm:mb-0">
      <div v-if="activeTrip" @click="showEndTripModal = true" class="status-circle border-2 border-success w-[15rem] h-[15rem] rounded-full cursor-pointer hover:bg-dark">
        <div class="flex flex-col items-center justify-center h-full w-full gap-y-3 text-xl tracking-wider">
            {{activeTrip.pickupLocation}}
          <font-awesome-icon :icon="faArrowDown" class="text-success"></font-awesome-icon>
            {{activeTrip.targetLocation}}
        </div>
      </div>
      <div v-else class="border-4 border-elevated w-[15rem] h-[15rem] rounded-full">
        <div class="flex flex-col items-center justify-center h-full w-full gap-y-3">
          <font-awesome-icon :icon="faHourglassHalf" fade style="--fa-animation-duration: 3s;"></font-awesome-icon>
          <div>No Active Trip</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-5 sm:h-[10rem] bg-dark sm:bg-secondary py-4 w-[80%] mx-auto rounded">
      <img :src="`https://mealmind-pocketbase.fly.dev/api/files/drivers/${driver.id}/${driver.picture}`"
           onerror="this.src='https://www.stignatius.co.uk/wp-content/uploads/2020/10/default-user-icon.jpg'"
           class="w-28 h-28 sm:w-[10rem] sm:h-[10rem] rounded border border-dark">
      <div class="flex flex-col justify-between">
        <div class=" border-b border-light pb-0.5 border-opacity-75">
          <div class="text-lg">{{driver.name}}</div>
          <div class="text-2xl font-bold">{{driver.nickname}}</div>
        </div>
        <div class="flex items-end gap-2">
          <div class="text-5xl">{{paginationInfo.totalItems}}</div>
          <div class="text-xs">Total <br/> Trips</div>
        </div>

      </div>
    </div>
  </div>
    <EndTripModal v-if="showEndTripModal"
                  :driver="driver"
                  @update="fetchData"
                  @close="showEndTripModal = false">
    </EndTripModal>
  </div>
  <div class="w-[95%] sm:w-[80%] mx-auto mt-10">
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
</template>

<script setup lang="ts">
import {fetchDriver} from "~/utils/pocketbase";
import {useUserStore} from "~/store/UserStore";
import {Driver, PaginationInfo, Trip} from "~/models/apiModels";
import {navigateTo} from "#app";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faArrowDown, faHourglassHalf, faRightLeft} from "@fortawesome/free-solid-svg-icons";
import {useGlobalStore} from "~/store/GlobalStore";
import {useIntervalFn} from "@vueuse/core";

const driverId = useUserStore().userId;
const driver = ref<Driver>();
const trips = ref<Trip[]>([]);
const showEndTripModal = ref(false);
const showPickup = ref(false);
const activeTrip = computed(():Trip | null => {
  if(!trips.value.length) return null;
  if(!trips.value[0].finishedAt) {
    return trips.value[0];
  }
  else return null
})
const paginationInfo = ref<PaginationInfo>({
  page: 1,
  perPage: 0,
  totalPages:0,
  totalItems: 0
})

if(!useUserStore().isDriver || !useUserStore().loggedIn) {
  navigateTo('/')
}

onMounted(async () => {
  useGlobalStore().startLoading();
  await fetchData();
  useGlobalStore().stopLoading();
})

useIntervalFn(() => {
  fetchData();
}, 5000)

async function fetchData() {
  await getDriverInformation();
  await getPage(paginationInfo.value.page)
}
async function getDriverInformation() {
  driver.value = await fetchDriver(driverId)
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
  const response = await fetchTrips(driverId,{page:page, pageSize:10})
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
.status-circle {
  box-shadow: inset 0px -8px 8px 0px #37efba;
  animation: glow 3s linear infinite alternate;
}
@keyframes glow {
  to {
    box-shadow: inset 0px 8px 8px 0px #37efba;
  }
}
img {
}

</style>