import BaseChart, {ChartData} from "./BaseChart";

export default class StackedBarChart extends BaseChart {
    constructor(props) {
        super(props);
        this.options.fromColor = '#e9c46a';
        this.options.toColor = '#e76f51';
    }

    roundedCorner(radius: number = 5) {
        this.svg.selectAll('rect').attr('rx', radius).attr('ry', radius);
        return this;
    }

    data(data: StackedBarChartData | any): this {
        return super.data(data);
    }

    build(): this {
        const mergedData = [];
        this._data.forEach((data: any) => {
            data.data.forEach((d) => {
                mergedData.push(d);
            })
        })
        const scaleX = this.buildAxisBottom(mergedData);
        const scaleY = this.buildAxisLeft(mergedData);
        const colors = this.getColors(this._data.length);
        const that = this;
        this._data.forEach((data, index) => {
            const name = data.name;
            let bars = this.svg.selectAll(`.bar.${name}`)
                .data(data.data)
            bars.join(
                enter => {
                    enter = enter.append("rect")
                        .attr('class', `bar ${name}`)
                        .attr("x", function (d: ChartData) {
                            return scaleX(d.name) - (index * 10);
                        })
                        .attr("width", scaleX.bandwidth())
                    if (that.options.animation.enabled) {
                        enter = enter.attr('height', 0)
                            .attr("y", function (d) {
                                return scaleY(0);
                            })
                            .transition()
                            .duration(that.options.animation.duration)
                    }
                    enter
                        .attr('height', (d: ChartData) => {
                            return that.height - scaleY(d.value);
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
                    if (that.options.animation.enabled) {
                        update = update
                            .transition()
                            .duration(that.options.animation.duration)
                    }
                    update.attr('y', function (d: ChartData) {
                        return scaleY(d.value);
                    }).attr('height', (d: ChartData) => {
                        return that.height - scaleY(d.value);
                    })
                },
                exit => exit.transition(400)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", 0)
                    .remove()
            )
        })
        return this;
    }
}

type StackedBarChartData = Array<{
    name: string,
    data: Array<ChartData>
}>
