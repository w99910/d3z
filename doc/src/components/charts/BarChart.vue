<template>
    <div id="bar-chart-demo" class="w-full h-full flex flex-col">
        <div id="bar-chart" class="w-full h-1/2"></div>
    </div>
</template>

<script setup>
import {BarChart} from "d3z";

import {onMounted} from "vue";

onMounted(() => {
    let barChartBuilder = new BarChart(document.getElementById('bar-chart'));

    const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon'];

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
        .pretty();
})

</script>

<style scoped>

</style>
