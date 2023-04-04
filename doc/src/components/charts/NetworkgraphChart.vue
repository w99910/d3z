<template>
    <div id="networkgraph-chart-demo" class="w-full h-full flex flex-col">
        <div id="networkgraph-chart" class="w-1/2 h-4/6"></div>
    </div>
</template>

<script setup>
import {NetworkgraphChart} from 'd3z';

import {onMounted} from 'vue';

onMounted(() => {
    setTimeout(() => {
        let data = {
            nodes: [],
            links: [],
        };
        let linkableNodes = [];
        let maxLinks = 40;

        for (let i = 0; i < maxLinks; i++) {
            let source = Math.floor(Math.random() * maxLinks);
            let target = Math.floor(Math.random() * maxLinks);

            if (linkableNodes.indexOf(source) === -1) {
                data.nodes.push({
                    id: source,
                    name: Math.random()
                });
                linkableNodes.push(source);
            }

            if (linkableNodes.indexOf(target) === -1) {
                data.nodes.push({
                    id: target,
                    name: Math.random()
                });
                linkableNodes.push(target);
            }

            data.links.push({
                source: source,
                target: target,
            })
        }

        let networkGraphChart = new NetworkgraphChart(document.getElementById('networkgraph-chart'));
        networkGraphChart.data(data).margin({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }).build();
    }, 300)


})

</script>

<style scoped>

</style>
