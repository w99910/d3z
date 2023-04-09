import {Chartable} from "../interfaces/Chartable";
import {axisBottom, axisLeft, max, scaleBand, scaleLinear, scaleTime} from "d3";
import {ChartData} from "../BaseChart";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        getScaleX(data: Array<ChartData>) {
            if (data.length === 0) {
                throw new Error('No data provided')
            }

            let scaleType;

            if (data[0].name instanceof Date) {
                scaleType = 'time';
            }

            if (typeof data[0].name === 'string') {
                scaleType = 'band';
            }

            if (typeof data[0].name === 'number') {
                scaleType = 'linear';
            }

            let scale;
            const range = [0, this.width()];
            switch (scaleType) {
                case 'time':
                    // sort by date
                    data = data.sort((a, b) => {
                        return a.name.getTime() - b.name.getTime();
                    });
                    scale = scaleTime()
                        .domain([data[0].name, data[data.length - 1].name]).range(range).nice();
                    break;
                case 'band':
                    scale = scaleBand().range(range)
                        .domain(data.map(function (d: ChartData) {
                            return d.name;
                        })).padding(0.4);
                    break;
                case 'linear':
                    scale = scaleLinear()
                        .domain([0, max(data, function (d: any) {
                            return +d.name;
                        })])
                        .range(range).nice();
            }
            return scale;
        }

        buildXAxis(data: Array<ChartData> = null) {
            const scale = this.getScaleX(data ?? this.getData())
            const axis = axisBottom(scale);
            const axisClass = 'axis-x'
            let axisBottomGroup = this.svg().select(`.${axisClass}`);
            if (axisBottomGroup.empty()) {
                axisBottomGroup = this.svg().append('g')
                    .attr('class', axisClass)
                    .attr("transform", "translate(0," + this.height() + ")")
            }
            axisBottomGroup.call(axis);

            return scale;
        }
    }
}
