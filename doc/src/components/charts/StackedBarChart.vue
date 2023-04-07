<template>
    <div id="stackedbar-chart-demo" class="w-full h-full flex flex-col">
        <div id="stackedbar-chart" class="w-1/2 h-4/6"></div>
    </div>
</template>

<script setup>
import {StackedBarChart} from "d3z";
import {onMounted} from "vue";

onMounted(() => {
    const generateData = () => {
        const totalData = [];
        const usedData = [];
        const randomDate = () => {
            const start = new Date(2022, 0, 1);
            const end = new Date();
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }
        for (let i = 0; i < 30; i++) {
            const total = Math.floor(Math.random() * 100)
            const used = Math.floor(Math.random() * total)
            const date = randomDate()
            totalData.push({
                name: date,
                value: total,
            })
            usedData.push({
                name: date,
                value: used,
            })
        }
        return [{
            name: 'Total',
            data: totalData,
        }, {
            name: 'Used',
            data: usedData,
        }]
    }
    const chart = new StackedBarChart(document.getElementById('stackedbar-chart'));
    const fruits = ['Apple', 'Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon'];

    const generateDataa = () => {
        const generate = () => {
            const data = [];
            for (let fruit of fruits) {
                data.push({
                    name: fruit,
                    value: Math.floor(Math.random() * 100)
                })
            }
            return data;
        }
        return [{
            name: 'A',
            data: generate(),
        }, {
            name: 'B',
            data: generate(),
        }];
    }
    chart.data(generateData()).stroke('#848484').margin({bottom: 50}).build().rotateLabels().pretty();
    // setInterval(() => {
    //     chart.update().pretty()
    // }, 2000)


})
</script>

<style scoped>

</style>
