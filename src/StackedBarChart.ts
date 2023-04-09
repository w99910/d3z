import BaseChart, {ChartData} from "./BaseChart";
import {select} from "d3";
import {Chartable} from "./interfaces/Chartable";
import Chart from "./Chart";

const StackedBarChart = <T extends Chartable>(Base: T) => {
    return class extends Base {
        constructor(props) {
            super(props);
            this.getOptions().fromColor = '#e9c46a';
            this.getOptions().toColor = '#e76f51';
        }

        roundedCorner(radius: number = 5) {
            this.svg().selectAll('rect').attr('rx', radius).attr('ry', radius);
            return this;
        }

        data(data: StackedBarChartData | any): this {
            return super.data(data);
        }

        build(): this {
            const mergedData = [];
            this.getData().forEach((data: any) => {
                data.data.forEach((d) => {
                    mergedData.push(d);
                })
            })
            const scaleX = this.buildXAxis(mergedData);
            const scaleY = this.buildYAxis(mergedData);
            const colors = this.getColors(this.getData().length);
            const that = this;
            this.getData().forEach((data, index) => {
                const name = data.name;
                let bars = this.svg().selectAll(`.bar.${name}`)
                    .data(data.data)
                bars.join(
                    enter => {
                        enter = enter.append("rect")
                            .attr('class', `bar ${name}`)
                            .attr('stroke', this.getOptions().strokeColor)
                            .attr('x', (d: ChartData) => {
                                return scaleX(d.name) + (index * 10);
                            })
                            .attr('tooltip', (d: ChartData) => d.name + ': ' + d.value)
                            .attr('width', (this.width() / mergedData.length))
                        if (that.getOptions().animation.enabled) {
                            enter = enter.attr('height', 0)
                                .attr('y', function (d) {
                                    return scaleY(0);
                                })
                                .transition()
                                .duration(that.getOptions().animation.duration)
                        }
                        enter
                            .attr('height', (d: ChartData) => {
                                return that.height() - scaleY(d.value);
                            })
                            .attr('y', function (d: ChartData) {
                                return scaleY(d.value);
                            })
                            .attr("fill", colors[index])
                            .delay(function (d, i) {
                                return i * 10;
                            });
                    },
                    update => {
                        if (that.getOptions().animation.enabled) {
                            update = update
                                .transition()
                                .duration(that.getOptions().animation.duration)
                        }
                        update.attr('y', function (d: ChartData) {
                            return scaleY(d.value);
                        }).attr('height', (d: ChartData) => {
                            return that.height() - scaleY(d.value);
                        })
                    },
                    exit => exit.transition(400)
                        .attr('x', 0)
                        .attr('height', 0)
                        .remove()
                )
            })
            if (this.getOptions().tooltip) {
                this.buildTooltip(
                    'rect',
                    (d) => d.name + ': ' + d.value)
            }

            if (this.getOptions().legend) {
                this.buildLegends(this.getData(), colors)
            }
            return this;
        }
    }
}

type StackedBarChartData = Array<{
    name: string,
    data: Array<ChartData>
}>

export default StackedBarChart(Chart())
