<template>
  <div class="relative z-10 bg" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[1px]">

        <div id="modal-content" ref="modalContent" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-[95%] sm:my-8 sm:w-full sm:max-w-lg bg-semidark">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:flex-col sm:items-center">
              <div class="flex mb-5 justify-center gap-3 items-center px-4">
                <font-awesome-icon :icon="faCab" class="text-primary "/>
                <h3 class=" leading-6 text-primary text-center" id="modal-title">New trip for {{props.driver.nickname}}</h3>
              </div>

              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div class="flex-col items-center flex">
                  <div v-if="!isPickupLocationSelected">
                    <h3 class="text-primary text-xs text-left" id="modal-title">Pickup Location</h3>
                    <input v-if="!isPickupLocationSelected" v-model="newTrip.pickupLocation" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5"/>
                    <div class="flex gap-2.5 flex-wrap justify-center w-full">
                      <div v-for="option in piers">
                        <button @click="newTrip.pickupLocation = option.value" class="bg-light rounded-full px-5 py-0.5 flex-grow" :class="newTrip.pickupLocation === option.value ? 'opacity-100' : 'opacity-50'">{{option.name}}</button>
                      </div>
                    </div>
                  </div>
                  <div v-if="isPickupLocationSelected">
                    <h3 class="text-primary text-xs text-left" id="modal-title">Target Location</h3>
                    <input v-model="newTrip.targetLocation" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5"/>
                    <div class="flex gap-2.5 flex-wrap justify-center">
                      <div v-for="option in shops">
                        <button @click="newTrip.targetLocation = option" class="bg-light rounded-full px-5 py-0.5 flex-grow" :class="newTrip.targetLocation === option ? 'opacity-100' : 'opacity-50'">{{option}}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button v-if="!isPickupLocationSelected"
                    @click="isPickupLocationSelected=true"
                    :disabled="newTrip.pickupLocation===''"
                    type="button"
                    :class="newTrip.pickupLocation==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                    class="bg-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
              Continue →
            </button>
            <button v-else @click="startTrip" type="button" class="bg-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">Start Trip</button>
            <button @click="$emit('close')" type="button" class="bg-error mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset sm:mt-0 sm:w-auto">Cancel</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Driver, TripCreateRequest} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCab} from "@fortawesome/free-solid-svg-icons";
import {createTrip} from '../utils/pocketbase'
import {useGlobalStore} from "~/store/GlobalStore";
import {onClickOutside} from "@vueuse/core";
const modalContent = ref<HTMLElement | null>(null)
const piers = [{name:'1',value:'ΠΡΟΒΛΗΤΑ 1'}, {name:'2',value:'ΠΡΟΒΛΗΤΑ 2'}, {name:'3',value:'ΠΡΟΒΛΗΤΑ 3'}, {name:'4',value:'ΠΡΟΒΛΗΤΑ 4'}, {name:'5',value:'ΠΡΟΒΛΗΤΑ 5'}, {name:'6',value:'ΠΡΟΒΛΗΤΑ 6'}, {name:'7',value:'ΠΡΟΒΛΗΤΑ 7'}, {name:'8',value:'ΠΡΟΒΛΗΤΑ 8'}, {name:'9',value:'ΠΡΟΒΛΗΤΑ 9'}, {name:'ΧΩΡΙΟ',value:'ΧΩΡΙΟ'}]
const shops = ['ΑΦΡΟΔΙΤΗΣ','ΠΡΙΓΚΙΠΟΣ','ΒΟΥΛΑ']
const props = defineProps({
  driver: {
    type: Object as PropType<Driver>,
    required: true
  }
})
const newTrip = ref<TripCreateRequest>({
  driverId: props.driver?.id,
  pickupLocation: '',
  targetLocation: ''
})
const emit = defineEmits(['close','update'])
const isPickupLocationSelected = ref(false)
onClickOutside(modalContent, () => {
  emit('close');
})
async function startTrip() {
  useGlobalStore().startLoading();
  try {
  await createTrip(newTrip.value)
  }
  catch (error: any) {
    console.log(error)
  }
  emit('close')
  emit('update')
  useGlobalStore().stopLoading();
}
</script>

<style scoped>

</style>