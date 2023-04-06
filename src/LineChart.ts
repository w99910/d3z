import BaseChart from "./BaseChart";
import {area, line, max} from "d3";

export default class LineChart extends BaseChart {
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
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft()
        //
        if (this.showPointIndicator) {
            this.svg.selectAll("circle.point")
                .data(this._data)
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
                            .attr("fill", this.options.strokeColor ?? '#72aaff')
                            .attr("stroke", "white")
                        if (this.options.animation.enabled) {
                            enter.attr('clip-path', 'url(#clip)')
                        }
                    },
                    update => {
                        if (this.options.animation.enabled) {
                            update = update.transition().duration(this.options.animation.duration)
                        }
                        update.attr("cx", function (d) {
                            return scaleX(d.name)
                        }).attr("cy", function (d) {
                            return scaleY(d.value)
                        })
                    },
                    exit => {
                        exit.transition().duration(this.options.animation.duration)
                            .attr('r', 20)
                    },
                )
        }

        let linePath = this.svg.select('path.line');

        const lineGenerator = line()
            .x(function (d: any) {
                return scaleX(d.name)
            })
            .y(function (d: any) {
                return scaleY(d.value)
            });
        if (!linePath.empty()) {
            if (this.options.animation.enabled) {
                linePath = linePath.transition().duration(this.options.animation.duration)
            }
            linePath.attr('d', lineGenerator(this._data))
        } else {
            linePath = this.svg.append('path').attr("fill", "none")
                .attr('class', 'line')
                .attr("stroke", this.options.strokeColor ?? '#72aaff')
                .attr("stroke-width", 1.5)
                .attr('clip-path', 'url(#clip)')
                .attr("d", lineGenerator(this._data))

            if (this.options.animation.enabled) {
                linePath.attr('stroke-dasharray', function () {
                    return this.getTotalLength();
                })
                    .attr('stroke-dashoffset', function () {
                        return this.getTotalLength();
                    })
                    .transition()
                    .duration(this.options.animation.duration)
                    .attr('stroke-dashoffset', 0)
                const clip = this.svg.append("clipPath")
                    .attr("id", "clip");
                const clipRect = clip.append("rect")
                    .attr("width", 0)
                    .attr("height", this.height)

                clipRect.transition()
                    .duration(this.options.animation.duration)
                    .attr("width", this.width)
            }
        }


        return this;
    }

}
