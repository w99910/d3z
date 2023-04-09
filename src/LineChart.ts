import BaseChart from "./BaseChart";
import {line} from "d3";
import {Chartable} from "./interfaces/Chartable";
import Chart from "./Chart";

const LineChart = <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        protected showPointIndicator = false;

        protected pointRadius = 3;

        enablePointIndicator(pointRadius: number = null) {
            if (pointRadius) {
                this.pointRadius = pointRadius;
            }
            this.showPointIndicator = true;
            return this;
        }

        build(): this {
            const scaleX = this.buildXAxis();

            const scaleY = this.buildYAxis()
            //
            if (this.showPointIndicator) {
                this.svg().selectAll("circle.point")
                    .data(this.getData())
                    .join(
                        enter => {
                            enter = enter.append("circle")
                                .attr("class", 'point')
                                .attr("cx", function (d) {
                                    return scaleX(d.name)
                                })
                                .attr("cy", function (d) {
                                    return scaleY(d.value)
                                })
                                .attr("r", this.pointRadius)
                                .attr("fill", this.getOptions().strokeColor ?? '#72aaff')
                                .attr("stroke", "white")
                            if (this.getOptions().animation.enabled) {
                                enter.attr('clip-path', 'url(#clip)')
                            }
                        },
                        update => {
                            if (this.getOptions().animation.enabled) {
                                update = update.transition().duration(this.getOptions().animation.duration)
                            }
                            update.attr("cx", function (d) {
                                return scaleX(d.name)
                            }).attr("cy", function (d) {
                                return scaleY(d.value)
                            })
                        },
                        exit => {
                            exit.transition().duration(this.getOptions().animation.duration)
                                .attr('r', 20)
                        },
                    )
            }

            let linePath = this.svg().select('path.line');

            const lineGenerator = line()
                .x(function (d: any) {
                    return scaleX(d.name)
                })
                .y(function (d: any) {
                    return scaleY(d.value)
                });
            if (!linePath.empty()) {
                if (this.getOptions().animation.enabled) {
                    linePath = linePath.transition().duration(this.getOptions().animation.duration)
                }
                linePath.attr('d', lineGenerator(this.getData()))
            } else {
                linePath = this.svg().append('path').attr("fill", "none")
                    .attr('class', 'line')
                    .attr("stroke", this.getOptions().strokeColor ?? '#72aaff')
                    .attr("stroke-width", 1.5)
                    .attr('clip-path', 'url(#clip)')
                    .attr("d", lineGenerator(this.getData()))

                if (this.getOptions().animation.enabled) {
                    linePath.attr('stroke-dasharray', function () {
                        return this.getTotalLength();
                    })
                        .attr('stroke-dashoffset', function () {
                            return this.getTotalLength();
                        })
                        .transition()
                        .duration(this.getOptions().animation.duration)
                        .attr('stroke-dashoffset', 0)
                    const clip = this.svg().append("clipPath")
                        .attr("id", "clip");
                    const clipRect = clip.append("rect")
                        .attr("width", 0)
                        .attr("height", this.height())

                    clipRect.transition()
                        .duration(this.getOptions().animation.duration)
                        .attr("width", this.width())
                }
            }
            return this;
        }
    }
}

export default LineChart(Chart())
