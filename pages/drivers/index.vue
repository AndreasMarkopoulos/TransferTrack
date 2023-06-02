<template>
  <div id="driver-list-tabs" class="h-7 justify-between flex w-[95%] mx-auto mb-2.5 items-center">
    <button class="w-[33%] border-b-2 text-primary bg-semidark py-0.5 mb-2 rounded-sm" @click="activeTab=0" :class="activeTab===0 ? 'opacity-100 border-primary' : 'opacity-60 border-semidark'">
      Free ({{ drivers.filter(x => x.present && !x.busy).length }})
    </button>
    <button class="w-[33%] border-b-2 text-primary bg-semidark py-0.5 mb-2 rounded-sm" @click="activeTab=1" :class="activeTab===1 ? 'opacity-100 border-primary' : 'opacity-60 border-semidark'">
      Busy ({{ drivers.filter(x => x.present && x.busy).length }})
    </button>
    <button class="w-[33%] border-b-2 text-primary bg-semidark py-0.5 mb-2 rounded-sm" @click="activeTab=2" :class="activeTab===2 ? 'opacity-100 border-primary' : 'opacity-60 border-semidark'">
      Absent ({{ drivers.filter(x => !x.present).length }})
    </button>
  </div>
  <div id="driver-list-actions" class="h-8 flex items-center justify-between px-2 bg-dark bg-opacity-60 rounded w-[95%] mx-auto mb-2">
    <font-awesome-icon size="lg" @click="quickRefresh" :icon="faRefresh" :spin="localLoading" class="text-primary cursor-pointer"/>
    <button v-if="activeTab===2" @click="callResetAttendance" class="text-link">Reset Attendance</button>
    <div class="flex gap-4">
      <font-awesome-icon size="lg" @click="sortType='tripcount-desc'" v-if="sortType!=='tripcount-desc' && sortType!=='tripcount-asc'" :icon="faSortAmountDesc" class="text-primary cursor-pointer"/>
      <font-awesome-icon size="lg" @click="sortType='tripcount-desc'" v-if="sortType==='tripcount-asc'" :icon="faSortAmountDesc" class="text-link cursor-pointer"/>
      <font-awesome-icon size="lg" @click="sortType='tripcount-asc'" v-if="sortType==='tripcount-desc'" :icon="faSortAmountAsc" class="text-link cursor-pointer"/>

      <font-awesome-icon size="lg" @click="sortType='alpha-desc'" v-if="sortType!=='alpha-desc' && sortType!=='alpha-asc'" :icon="faSortAlphaDesc" class="text-primary cursor-pointer"/>
      <font-awesome-icon size="lg" @click="sortType='alpha-asc'" v-if="sortType==='alpha-desc'" :icon="faSortAlphaDesc" class="text-link cursor-pointer"/>
      <font-awesome-icon size="lg" @click="sortType='alpha-desc'" v-if="sortType==='alpha-asc'" :icon="faSortAlphaAsc" class="text-link cursor-pointer"/>
    </div>
  </div>
  <div id="driver-list" v-for="driver of driversToShow" class="flex justify-center">
    <DriverListItem
                    :driver="driver"
                    :active-tab="activeTab"
                    @end-trip="openEndTripModal"
                    @new-trip="openNewTripModal"
                    @set-present="setDriverPresent"/>
  </div>
  <transition>
    <NewTripModal v-if="showNewTripModal"
                  :driver="selectedDriver"
                  @update="fetchData"
                  @close="showNewTripModal = false"/>
  </transition>
  <transition>
    <EndTripModal v-if="showEndTripModal"
                  :driver="selectedDriver"
                  @update="fetchData"
                  @close="showEndTripModal = false"/>
  </transition>
</template>

<script setup lang="ts">
import {Driver} from "~/models/apiModels";
import DriverListItem from "~/components/DriverListItem.vue";
import {useIntervalFn} from "@vueuse/core";
import {Ref} from "vue";
import {useGlobalStore} from "~/store/GlobalStore";
import {resetAttendance, updateDriverAttendance} from "~/utils/pocketbase";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faRefresh,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faSortAmountAsc,
  faSortAmountDesc
} from "@fortawesome/free-solid-svg-icons";
import {useUserStore} from "~/store/UserStore";

import {navigateTo} from "#app";
if(!useUserStore().isAdmin) {
  navigateTo('/')
}
type SortingOption = 'alpha-desc' | 'alpha-asc' | 'tripcount-asc' | 'tripcount-desc' | null;

const drivers = ref<Driver[]>([])
const activeTab: Ref<number> = ref(0)
const sortType: Ref<SortingOption> = ref('tripcount-asc')
const showNewTripModal = ref(false)
const showEndTripModal = ref(false)
const selectedDriver: Ref<Driver | undefined> = ref()
const localLoading = ref(false)
const driversToShow = computed<Driver[]>(() => {
  switch (activeTab.value) {
    case 0:
      return sortDrivers(drivers.value.filter(driver => !driver.busy && driver.present))
    case 1:
      return sortDrivers(drivers.value.filter(driver => driver.busy && driver.present))
    case 2:
      return sortDrivers(drivers.value.filter(driver => !driver.present))
    default:
      return []
  }
})
function sortDrivers(driversList: Driver[]): Driver[] {
  switch (sortType.value) {
    case 'alpha-desc':
      return driversList.sort((a, b) => b.name.localeCompare(a.name));
    case 'alpha-asc':
      return driversList.sort((a, b) => a.name.localeCompare(b.name));
    case 'tripcount-asc':
      return driversList.sort((a, b) => (a.tripCount || 0) - (b.tripCount || 0));
    case 'tripcount-desc':
      return driversList.sort((a, b) => (b.tripCount || 0) - (a.tripCount || 0));
    default:
      return driversList;
  }
}
onMounted(async () => {
  useGlobalStore().startLoading();
  await fetchData();
  useGlobalStore().stopLoading();
})
useIntervalFn(() => {
  fetchData();
}, 10000)
async function fetchData() {
  try {
    const data = await fetchDrivers();
    const todayTrips = await fetchTodayTrips();
    drivers.value = data.map((driver) => {
      const tripCount = todayTrips.filter((trip) => trip.driverId === driver.id).length;
      return { ...driver, tripCount };
    });
  } catch (error) {
    console.error(error);
  }
}
function openNewTripModal(driver: Driver) {
  selectedDriver.value = driver;
  showNewTripModal.value = true;
}
function openEndTripModal(driver: Driver) {
  selectedDriver.value = driver;
  showEndTripModal.value = true;
}
async function setDriverPresent(driver: Driver) {
  useGlobalStore().startLoading();
  await updateDriverAttendance(driver.id,true)
  await fetchData()
  useGlobalStore().stopLoading();
}

async function callResetAttendance() {
  useGlobalStore().startLoading();
  await resetAttendance()
  await fetchData();
  useGlobalStore().stopLoading();
}
async function quickRefresh() {
  localLoading.value = true;
  await fetchData();
  localLoading.value = false;
}
</script>

<style scoped>
.tab-row {
  left: 50%;
  transform: translateX(-50%);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>