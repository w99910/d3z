import {ChartData} from "./BaseChart";
import Chart from "./Chart";
import {Chartable} from "./interfaces/Chartable";
import B from "./B";

(new B()).test();

const BarChart = <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        roundedCorner(radius: number = 5) {
            this.svg().selectAll('rect').attr('rx', radius).attr('ry', radius);
            return this;
        }

        build() {
            const scaleX = this.buildXAxis();

            const scaleY = this.buildYAxis();

            let bars = this.svg().selectAll('.bar')
                .data(this.getData())

            let that = this;

            bars.join(
                enter => {
                    enter = enter.append("rect")
                        .attr('class', 'bar')
                        .attr("x", function (d: ChartData) {
                            return scaleX(d.name);
                        })
                        .attr("width", scaleX.bandwidth())
                    if (that.getOptions().animation.enabled) {
                        enter = enter.attr('height', 0)
                            .attr("y", function (d) {
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
                        .attr("fill", that.getOptions().fillColor ?? '#72aaff')
                        .delay(function (d, i) {
                            return i * 10;
                        });
                    return enter;
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
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", 0)
                    .remove()
            )
            return this;
        }
    }
}

export default BarChart(Chart());
