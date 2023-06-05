<template>
  <div class="relative z-10 bg" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[1px]">

        <div id="modal-content" ref="modalContent" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-[95%] sm:my-8 sm:w-full sm:max-w-lg bg-semidark">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:flex-col sm:items-center">
              <div class="mb-5 px-4">

                <div class="flex justify-center gap-3 items-center">
                  <font-awesome-icon :icon="faCab" class="text-primary "/>
                  <h3 class=" leading-6 text-primary text-center" id="modal-title">Add new driver</h3>
                </div>

              </div>

              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div class="flex-col justify-center items-center flex w-full">
                    <div class="w-[95%]" v-if="activeStep===0">
                      <h3 class="mb-0.5 text-primary text-sm text-left" id="modal-title">Driver's nickname</h3>
                      <input ref="nicknameInput" v-model="newDriver.nickname" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5" @keydown.enter="handleEnterKey"/>
                    </div>
                    <div class="w-[95%]" v-if="activeStep===1">
                      <h3 class="mb-0.5 text-primary text-sm text-left" id="modal-title">Driver's name</h3>
                      <input ref="nameInput" v-model="newDriver.name" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5" @keydown.enter="handleEnterKey"/>
                    </div>
                    <div class="w-[95%]" v-if="activeStep===2">
                      <h3 class="mb-0.5 text-primary text-sm text-left" id="modal-title">Driver's phone number</h3>
                      <input ref="phoneInput" v-model="newDriver.phone" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5" @keydown.enter="handleEnterKey"/>
                    </div>
                    <div class="w-[95%]" v-if="activeStep===3">
                      <h3 class="mb-0.5 text-primary text-sm text-left" id="modal-title">Driver's car model</h3>
                      <input ref="carModelInput" v-model="newDriver.carModel" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5" @keydown.enter="handleEnterKey"/>
                    </div>
                    <div class="w-[95%]" v-if="activeStep===4">
                      <h3 class="mb-0.5 text-primary text-sm text-left" id="modal-title">Driver's car plate</h3>
                      <input ref="carPlateInput" v-model="newDriver.carPlate" type="text" class="p-1 w-full text-primary bg-semidark border border-light rounded mb-5" @keydown.enter="handleEnterKey"/>
                    </div>
                    <label for="file_input" class="my-2 h-[100px] w-[100px] border-2 rounded-full flex items-center justify-center cursor-pointer" :class="newDriver.picture ? 'border-success' : 'border-light'" v-if="activeStep===5">
<!--                      <h3 class="mb-5 text-primary text-sm text-left" id="modal-title">Driver's image</h3>-->
                      <div class=" px-2.5 rounded-full text-primary text-xs text-center ">{{newDriver.picture ? 'Change Image' : 'Add Image'}}</div>
                      <input class="block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer text-primary hidden" id="file_input" @change="handlePictureChange" type="file">
                    </label>
                    <div v-if="newDriver.picture && previewImage" class="w-[100px] h-[100px] mx-auto my-2">
                      <img :src="previewImage" alt="Preview" class="w-full h-full object-cover rounded">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-1 justify-center items-center mb-2">
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 0 ? 'bg-link' : 'bg-light opacity-40'"/>
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 1 ? 'bg-link' : 'bg-light opacity-40'"/>
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 2 ? 'bg-link' : 'bg-light opacity-40'"/>
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 3 ? 'bg-link' : 'bg-light opacity-40'"/>
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 4 ? 'bg-link' : 'bg-light opacity-40'"/>
            <div class="w-1.5 h-1.5 rounded-full" :class="activeStep === 5 ? 'bg-link' : 'bg-light opacity-40'"/>
          </div>
          <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-between">
            <div class="sm:flex sm:flex-row-reverse">
              <button v-if="activeStep===0"
                      @click="activeStep=1"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Next →
              </button>
              <button v-if="activeStep===1"
                      @click="activeStep=2"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Next →
              </button>
              <button v-if="activeStep===2"
                      @click="activeStep=3"
                      :disabled="newDriver.phone===69"
                      type="button"
                      :class="newDriver.phone===69 ? 'opacity-40' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Next →
              </button>
              <button v-if="activeStep===3"
                      @click="activeStep=4"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Next →
              </button>
              <button v-if="activeStep===4"
                      @click="activeStep=5"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Next →
              </button>
              <button v-if="activeStep===5"
                      @click="addDriver"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      ref="nextButton"
                      class="bg-primary min-w-[5.5em] inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                Create
              </button>
              <button v-if="[1,2,3,4,5].includes(activeStep)"
                      @click="activeStep--"
                      :disabled="newDriver.nickname===''"
                      type="button"
                      :class="newDriver.nickname==='' ? 'bg-semidark border border-light text-primary' : 'bg-primary border'"
                      class="bg-transparent mt-3 sm:mt-0 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-primary shadow-sm sm:ml-3 sm:w-auto">
                ← Back
              </button>
            </div>

            <button @click="$emit('close')" type="button" class="bg-error border-error border mt-6 sm:mt-0 inline-flex w-full self-start justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset sm:mt-0 sm:w-auto">Cancel</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Driver, DriverCreateRequest} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCab, faCircle} from "@fortawesome/free-solid-svg-icons";
import {useGlobalStore} from "~/store/GlobalStore";
import {onClickOutside} from "@vueuse/core";

const modalContent = ref<HTMLElement | null>(null);
const activeStep = ref(0);
const previewImage = ref<string>('');
const newDriver = ref<DriverCreateRequest>({
  name: '',
  picture: null,
  phone: 69,
  present: true,
  carModel: '',
  carPlate: '',
  nickname: '',
  busy: false
})
const nicknameInput = ref();
const nameInput = ref();
const phoneInput = ref();
const carModelInput = ref();
const carPlateInput = ref();
const nextButton = ref();
const emit = defineEmits(['close','update'])
const isPickupLocationSelected = ref(false)
onMounted(() => {
  nicknameInput.value.focus();
})
onUpdated(()=>{
  if (activeStep.value === 0) {
    nicknameInput.value.focus();
  } else if (activeStep.value === 1) {
    nameInput.value.focus();
  } else if (activeStep.value === 2) {
    phoneInput.value.focus();
  } else if (activeStep.value === 3) {
    carModelInput.value.focus();
  } else if (activeStep.value === 4) {
    carPlateInput.value.focus();
  }
})
onClickOutside(modalContent, () => {
  emit('close');
})
function handlePictureChange(event: any) {
  const file = event.target.files[0];
  console.log(file)
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxSize = Math.min(img.width, img.height);
      const offsetX = (img.width - maxSize) / 2;
      const offsetY = (img.height - maxSize) / 2;

      canvas.width = 256;
      canvas.height = 256;
      ctx?.drawImage(img, offsetX, offsetY, maxSize, maxSize, 0, 0, 256, 256);

      const dataURL = canvas.toDataURL();
      canvas.toBlob((blob) => {
        newDriver.value.picture = blob;
      })
      previewImage.value = dataURL;

      console.log(newDriver.value.picture)
    };

    img.src = e.target.result as string;
  };

  reader.readAsDataURL(file);
}

function handleEnterKey(event: any) {
  if (event.keyCode === 13) {
    if (!nextButton?.value.disabled) {
      nextButton?.value.click();
    }
  }
}
async function addDriver() {
  useGlobalStore().startLoading();
  try {
    await createDriver(newDriver.value)
  }
  catch (error: any) {
    console.log(error)
  }
  emit('close')
  emit('update')
  useGlobalStore().stopLoading();
}
</script>

<style>
 input#file-upload-button {
   background: #E6E0E9;
   color: #141218;
   font-weight: bold;
 }
</style>