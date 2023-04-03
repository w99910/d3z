<template>
    <div class="w-full h-full items-start flex flex-col cursor-pointer">
        <button @click="toggleShow" class="flex items-center gap-x-2 justify-center">
            <span><slot>Read More</slot></span>
            <svg v-show="!show" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mt-0.5" width="24" height="24"
                 viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <svg v-show="show" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mt-0.5" width="24" height="24"
                 viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div v-show="show" class="pl-4 flex flex-col items-start relative gap-y-4 mt-4">
            <span class="w-[1px] h-full absolute left-1 top-0 bg-gray-400"></span>
            <slot name="items">

            </slot>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'

const show = ref(false);

const toggleShow = () => {
    console.log('toggle')
    show.value = !show.value;
}

</script>

<style scoped>

</style>
