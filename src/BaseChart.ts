import {
    axisBottom,
    axisLeft, interpolate,
    max,
    scaleBand,
    scaleLinear,
    scaleTime,
    select, timeFormat,
} from "d3";
import Stats from 'stats.js'
import BuildXAxis from "./mixins/BuildXAxis";
import BuildYAxis from "./mixins/BuildYAxis";

function endall(transition, callback) {
    if (typeof callback !== "function") throw new Error("Wrong callback in endall");
    if (transition.size() === 0) {
        callback()
    }
    let timeout
    transition
        .on("end", function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                callback()
            }, 300);
        });
}

export default abstract class BaseChart {

    protected _options: ChartOptions = {
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
        gap: 10,
        fillColor: null,
        textColor: null,
        strokeColor: null,
        colors: null,
        fromColor: null,
        toColor: null,
        orientation: 'vertical',
        animation: {
            enabled: true,
            duration: 1000,
        },
        debug: false,
        reverse: false,
        tooltip: true,
        legend: true,
    }

    getOptions() {
        return this._options;
    }

    stroke(color: string) {
        this.getOptions().strokeColor = color;
        return this;
    }

    public abstract build(): this;

    protected _data: Array<ChartData> | any;

    protected afterBuildCallbacks: Array<() => void> = [];

    protected beforeBuildCallbacks: Array<() => void> = [];

    protected _svg = null;

    protected onEndAnimationCallbacks: Array<() => void> = [];

    protected constructor(protected container: HTMLElement) {
        const prototype = Object.getPrototypeOf(this);
        const that = this;

        Object.getOwnPropertyNames(prototype).forEach(f => {
            if (f === 'build') {
                const oldBuild = prototype[f];
                prototype[f] = function () {
                    that.beforeBuildCallbacks.forEach((callback) => {
                        callback();
                    });
                    oldBuild.apply(this, arguments);
                    that.afterBuildCallbacks.forEach((callback) => {
                        callback();
                    });

                    that.svg().transition().call(endall, () => {
                        that.onEndAnimationCallbacks.forEach((callback) => {
                            callback();
                        });
                    })
                    return this;
                }
            }
        })
    }


    public beforeBuild(callback: () => void) {
        this.beforeBuildCallbacks.push(callback);
        return this;
    }

    public afterBuild(callback: () => void) {
        this.afterBuildCallbacks.push(callback);
        return this;
    }

    public onEndAnimation(callback: () => void) {
        this.onEndAnimationCallbacks.push(callback);
        return this;
    }

    gap(gap: number) {
        this.getOptions().gap = gap;
        return this;
    }

    public data(data: any) {
        this._data = data;
        return this;
    }

    getData() {
        return this._data;
    }

    sortData(ascending = true) {
        console.log(this._data.sort((a, b) => {
            if (a.value > b.value) return -1;
            if (a.value < b.value) return 1;
            return 0;
        }))
    }

    update(data: any): this {
        if (!document.body.contains(this.svg().node())) {
            return;
        }
        this._data = data;
        select(this.container).select('.axis-x').selectChildren('g').remove();
        select(this.container).select('.axis-y').selectChildren('g').remove();
        // select(this.container).select('svg').remove();
        return this.build();
    }

    /**
     * @param data ChartData[] or number of colors to be returned
     * @protected
     */
    protected getColors(data: Array<ChartData> | number = null) {
        if (this.getOptions().colors) {
            return this.getOptions().colors;
        }
        const interpolateColor = interpolate(this.getOptions().fromColor ?? 'red', this.getOptions().toColor ?? 'blue')
        let dataSource;
        if (typeof data === 'number') {
            dataSource = [];
            for (let i = 0; i <= data; i++) {
                dataSource.push(i);
            }
        } else {
            dataSource = data ?? this.getData();
        }
        return dataSource.map((d, i) => interpolateColor(i / this.getData().length));
    }


    protected svg() {
        if (!this._svg) {
            this._svg = select(this.container)
                .append("svg")
                .attr("width", this.width() + this.getOptions().margin.left + this.getOptions().margin.right)
                .attr("height", this.height() + this.getOptions().margin.top + this.getOptions().margin.bottom)
                // .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
                .append("g")
                .attr('class', 'main-group')
                .attr("transform",
                    "translate(" + this.getOptions().margin.left + "," + this.getOptions().margin.top + ")");
        }
        return this._svg
    }

    protected width() {
        return this.container.getBoundingClientRect().width - this.getOptions().margin.left - this.getOptions().margin.right;
    }

    protected height() {
        return this.container.getBoundingClientRect().height - this.getOptions().margin.top - this.getOptions().margin.bottom;
    }


    public margin(margin = {}) {
        for (let property of Object.keys(margin)) {
            this.getOptions().margin[property] = margin[property];
        }
        return this;
    }

    public reverse() {
        this.getOptions().reverse = true;
        return this;
    }


    rotateLabels(xAxis = true, yAxis = true) {
        if (xAxis) {
            this.svg().selectAll('.axis-x text')
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'end');
        }
        if (yAxis) {
            this.svg().selectAll('.axis-y text')
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'end');
        }
        return this;
    }
}

export type ChartData = {
    name: any,
    value: any,

    meta: any,
}


export type ChartOptions = {
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number,
    },
    gap: number,
    fillColor?: string,
    textColor?: string,
    strokeColor?: string,
    colors?: Array<string>,
    fromColor?: string,
    toColor?: string,
    orientation: string,
    animation: {
        enabled: boolean,
        duration: number,
    },
    debug: boolean,
    reverse: boolean,
    tooltip: boolean,
    legend: boolean,
}
