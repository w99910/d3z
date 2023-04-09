import {Chartable} from "../interfaces/Chartable";
import {axisBottom, axisLeft, max, scaleLinear} from "d3";
import {ChartData} from "../BaseChart";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        getScaleY(data: Array<ChartData>) {
            const range = [this.height(), 0];
            return scaleLinear()
                .domain([0, max(data, function (d: any) {
                    return +d.value;
                })])
                .range(range).nice();
        }

        buildYAxis(data: Array<ChartData> = null) {
            const scale = this.getScaleY(data ?? this.getData());
            const axisClass = 'axis-y'
            let axisLeftGroup = this.svg().select(`.${axisClass}`);
            if (axisLeftGroup.empty()) {
                axisLeftGroup = this.svg().append('g')
                    .attr('class', axisClass)
            }

            axisLeftGroup
                .call(axisLeft(scale));
            return scale;
        }
    }
}
