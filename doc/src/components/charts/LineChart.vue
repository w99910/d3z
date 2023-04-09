<template>
    <div id="line-chart-demo" class="w-full h-full flex flex-col">
        <div id="line-chart" class="w-full h-1/2"></div>
    </div>
</template>

<script setup>
import {LineChart} from 'd3z';

import {onMounted} from "vue";

onMounted(() => {
    const chart = new LineChart(document.getElementById('line-chart'));
    const generateRandomData = (length = 100) => {
        const data = [];
        for (let i = 0; i <= length; i++) {
            data.push({
                name: new Date(new Date() - Math.random() * (1e+12)),
                value: Math.floor(Math.random() * 100)
            })
        }
        return data;
    }

    const data = generateRandomData();

    chart.data(data).build().pretty()

    setInterval(() => {
        chart.update(generateRandomData()).pretty();
    }, 2000)
})

</script>

<style scoped>

</style>
