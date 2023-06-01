<template>
  <div class="relative z-10 bg" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[1px]">

        <div id="modal-content" ref="modalContent" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-[95%] sm:my-8 sm:w-full sm:max-w-lg bg-semidark">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:flex-col sm:items-center">
              <div class="flex mb-5 justify-center gap-3 items-center px-4">
                <font-awesome-icon :icon="faFlagCheckered" class="text-primary "/>
                <h3 class="leading-6 text-primary text-center text-lg" id="modal-title">End {{props.driver.nickname}}'s trip?</h3>
              </div>
              <p class="text-primary text-center">Are you sure you want to end {{props.driver.nickname}}'s trip?</p>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div class="flex-col items-center flex">


                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="endTrip"
                    type="button"
                    class="bg-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
              End Trip
            </button>
            <button @click="$emit('close')" type="button" class="bg-error mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset sm:mt-0 sm:w-auto">Cancel</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Driver} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircleXmark, faFlagCheckered} from "@fortawesome/free-solid-svg-icons";
import {setTripFinished} from '../utils/pocketbase'
import {useGlobalStore} from "~/store/GlobalStore";
import {onClickOutside} from "@vueuse/core";
const modalContent = ref<HTMLElement | null>(null)
const props = defineProps({
  driver: {
    type: Object as PropType<Driver>,
    required: true
  }
})
const emit = defineEmits(['close','update'])
onClickOutside(modalContent, () => {
  emit('close');
})
async function endTrip() {
  useGlobalStore().startLoading();
  try {
    await setTripFinished(props.driver.id)
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