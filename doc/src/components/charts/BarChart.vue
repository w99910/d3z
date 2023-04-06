<template>
    <div id="bar-chart-demo" class="w-full h-full flex flex-col">
        <div id="bar-chart" class="w-full h-1/2"></div>
    </div>
</template>

<script setup>
import {BarChart} from "d3z";

import {onActivated, onDeactivated, onMounted, ref} from "vue";

const shouldRender = ref(true);

onActivated(() => {
    shouldRender.value = true;
})

onDeactivated(() => {
    shouldRender.value = false;
});

onMounted(() => {
    let barChartBuilder = new BarChart(document.getElementById('bar-chart'));

    const fruits = ['Apple', 'Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon'];

    const generateData = () => {
        const data = [];
        for (let fruit of fruits) {
            data.push({
                name: fruit,
                value: Math.floor(Math.random() * 100)
            })
        }
        return data;
    }

    const data = generateData();

    barChartBuilder.data(data).margin({top: 40, bottom: 60, left: 40}).build()
        .pretty()

    setInterval(() => {
        if (shouldRender.value) {
            barChartBuilder.update(generateData()).pretty();
        }
    }, 3000);
})

</script>

<style scoped>

</style>
