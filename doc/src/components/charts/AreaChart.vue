<template>
    <div id="area-chart-demo" class="w-full h-full flex flex-col">
        <div id="area-chart" class="w-full h-1/2"></div>
    </div>
</template>

<script setup>
import {AreaChart} from "d3z";
import {onMounted} from "vue";

onMounted(() => {
    const areaChart = new AreaChart(document.getElementById('area-chart'));
    const generateRandomData = (length = 20) => {
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

    areaChart.data(data).build().pretty()
})


</script>

<style scoped>

</style>
