<template xmlns="http://www.w3.org/1999/html">
    <div class="w-screen h-screen flex">
        <nav class="pl-6 w-3/12 pr-8 py-2 border-r gap-y-4 shadow flex flex-col">
            <h1 class="font-bold text-xl">D3Z</h1>
            <div v-for="component in Object.keys(components)">
                <button v-if="typeof components[component] === 'string'"
                        @click="_component = component">
                    {{ components[component] }}
                </button>
                <custom-detail v-if="typeof components[component] === 'object'">
                    {{ component[0].toUpperCase() + component.slice(1) }}
                    <template #items>
                        <button @click="_component = subComponent"
                                v-for="subComponent in Object.keys(components[component])">
                            {{ components[component][subComponent] }}
                        </button>
                    </template>
                </custom-detail>
            </div>
        </nav>
        <div class="w-full h-full p-4">
            <!--            <keep-alive>-->
            <component :is="currentComponent"></component>
            <!--            </keep-alive>-->
        </div>

    </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import CustomDetail from "./components/custom-detail.vue";

const components = {
    'introduction': 'Introduction',
    'installation': 'Installation',
    'charts': {
        'barChart': 'Bar Chart',
        'lineChart': 'Line Chart',
        'networkgraphChart': 'Networkgraph Chart',
        'pieChart': 'Pie Chart',
        'scatterPlotChart': 'ScatterPlot Chart',
        'stackedBarChart': 'Stacked Bar Chart',
        'areaChart': 'Area Chart',
    },
};

const _component = ref('introduction');

const currentComponent = computed(() => {
    return _component.value
});

</script>

<style scoped>

</style>
