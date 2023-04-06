<template>
    <div id="stackedbar-chart-demo" class="w-full h-full flex flex-col">
        <div id="stackedbar-chart" class="w-1/2 h-4/6"></div>
    </div>
</template>

<script setup>
import {StackedBarChart} from "d3z";
import {onMounted} from "vue";

onMounted(() => {
    const chart = new StackedBarChart(document.getElementById('stackedbar-chart'));
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
    chart.data([{
        name: 'A',
        data: generateData(),
    }, {
        name: 'B',
        data: generateData(),
    }]).build().roundedCorner(2).pretty();

    setInterval(() => {
        chart.update([{
            name: 'A',
            data: generateData(),
        }, {
            name: 'B',
            data: generateData(),
        }]).pretty()
    }, 2000)

})
</script>

<style scoped>

</style>
