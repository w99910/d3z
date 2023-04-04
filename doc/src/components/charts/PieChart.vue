<template>
    <div id="pie-chart-demo" class="w-full h-full flex flex-col">
        <div id="pie-chart" class="w-1/2 h-4/6"></div>
    </div>
</template>

<script setup>
import {PieChart} from "d3z";
import {onMounted} from "vue";

onMounted(() => {
    const data = [
        {
            name: 'Apple',
            value: 10
        },
        {
            name: 'Banana',
            value: 20
        },
        {
            name: 'Orange',
            value: 30
        },
        {
            name: 'Mango',
            value: 40
        },
        {
            name: 'Pineapple',
            value: 50
        },
        {
            name: 'Strawberry',
            value: 60
        },
        {
            name: 'Watermelon',
            value: 70
        }
    ]

    const pieChart = new PieChart(document.getElementById('pie-chart'));

    try {
        pieChart.data(data).colors('brown', 'yellow').build()
    } catch (e) {
        console.log(e)
    }
})
</script>

<style scoped>

</style>
