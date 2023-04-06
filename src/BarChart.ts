import BaseChart, {ChartData} from "./BaseChart";

export default class BarChart extends BaseChart {
    roundedCorner(radius: number = 5) {
        this.svg.selectAll('rect').attr('rx', radius).attr('ry', radius);
    }

    public build() {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft();

        let bars = this.svg.selectAll('.bar')
            .data(this._data)

        let that = this;

        bars.join(
            enter => {
                enter = enter.append("rect")
                    .attr('class', 'bar')
                    .attr("x", function (d: ChartData) {
                        return scaleX(d.name);
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
                    .attr("fill", that.options.fillColor ?? '#72aaff')
                    .delay(function (d, i) {
                        return i * 10;
                    });
                return enter;
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


        return this;
    }


}
