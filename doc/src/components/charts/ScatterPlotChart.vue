<template>
    <div id="scatterplot-chart-demo" class="w-full h-full flex flex-col">
        <div id="scatterplot-chart" class="w-1/2 h-4/6"></div>
    </div>
</template>

<script setup>
import {ScatterPlotChart} from 'd3z';
import {onMounted} from "vue";

onMounted(() => {
    const chart = new ScatterPlotChart(document.getElementById('scatterplot-chart'));
    const generateRandomData = (length = 20) => {
        const data = [];
        for (let i = 0; i <= length; i++) {
            data.push({
                name: Math.floor(Math.random() * 100),
                value: Math.floor(Math.random() * 100)
            })
        }
        return data;
    }

    const data = generateRandomData(100);

    chart.data(data).radius(2.5).build().pretty()

    setInterval(() => {
        chart.update(generateRandomData(100)).pretty()
    }, 2000)
})
</script>

<style scoped>

</style>
