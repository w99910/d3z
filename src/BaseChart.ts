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

    protected options = {
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
    }

    colors(a: Array<string> | string, b?: string) {
        if (Array.isArray(a)) {
            this.options.colors = a;
        } else {
            this.options.fromColor = a;
            this.options.toColor = b;
        }

        return this;
    }

    /**
     * @param data ChartData[] or number of colors to be returned
     * @protected
     */
    protected getColors(data: Array<ChartData> | number = null) {
        if (this.options.colors) {
            return this.options.colors;
        }
        const interpolateColor = interpolate(this.options.fromColor ?? 'red', this.options.toColor ?? 'blue')
        let dataSource;
        if (typeof data === 'number') {
            dataSource = [];
            for (let i = 0; i <= data; i++) {
                dataSource.push(i);
            }
        } else {
            dataSource = data ?? this._data;
        }
        return dataSource.map((d, i) => interpolateColor(i / this._data.length));
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

                    that.svg.transition().call(endall, () => {
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

    enableDebug() {
        let stats = new Stats()
        stats.showPanel(0)
        document.querySelector('body').appendChild(stats.dom)
    }

    gap(gap: number) {
        this.options.gap = gap;
        return this;
    }


    public data(data: any) {
        this._data = data;
        return this;
    }

    update(data: any): this {
        this._data = data;
        select(this.container).select('.axis-x').selectChildren('g').remove();
        select(this.container).select('.axis-y').selectChildren('g').remove();
        // select(this.container).select('svg').remove();
        return this.build();
    }

    protected getScaleY(data: Array<ChartData>) {
        return scaleLinear()
            .domain([0, max(data, function (d: any) {
                return +d.value;
            })])
            .range([this.height, 0]).nice();
    }

    protected getScaleX(data: Array<ChartData>) {
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
        switch (scaleType) {
            case 'time':
                // sort by date
                data = data.sort((a, b) => {
                    return a.name.getTime() - b.name.getTime();
                });
                scale = scaleTime()
                    .domain([data[0].name, data[data.length - 1].name]).range([0, this.width]).nice();
                break;
            case 'band':
                scale = scaleBand().range([0, this.width])
                    .domain(data.map(function (d: ChartData) {
                        return d.name;
                    })).padding(0.4);
                break;
            case 'linear':
                scale = scaleLinear()
                    .domain([0, max(data, function (d: any) {
                        return +d.name;
                    })])
                    .range([0, this.width]).nice();
        }
        return scale;
    }


    protected buildAxisLeft(data: Array<ChartData> = null) {
        const scale = this.getScaleY(data ?? this._data);
        let axisLeftGroup = this.svg.select('.axis-y');
        if (axisLeftGroup.empty()) {
            axisLeftGroup = this.svg.append('g')
                .attr('class', 'axis-y')
        }

        axisLeftGroup
            .call(this.options.reverse ? axisBottom(scale) : axisLeft(scale));
        return scale;
    }


    protected buildAxisBottom(data: Array<ChartData> = null) {
        const scale = this.getScaleX(data ?? this._data)
        const axis = this.options.reverse ? axisLeft(scale) : axisBottom(scale);

        let axisBottomGroup = this.svg.select('.axis-x');
        if (axisBottomGroup.empty()) {
            axisBottomGroup = this.svg.append('g')
                .attr('class', 'axis-x')
                .attr("transform", "translate(0," + this.height + ")")
        }
        axisBottomGroup.call(axis);

        return scale;
    }

    protected get svg() {
        if (!this._svg) {
            this._svg = select(this.container)
                .append("svg")
                .attr("width", this.width + this.options.margin.left + this.options.margin.right)
                .attr("height", this.height + this.options.margin.top + this.options.margin.bottom)
                // .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
                .append("g")
                .attr('class', 'main-group')
                .attr("transform",
                    "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");
        }
        return this._svg
    }

    protected get width() {
        return this.container.getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
    }

    protected get height() {
        return this.container.getBoundingClientRect().height - this.options.margin.top - this.options.margin.bottom;
    }


    public margin(margin = {}) {
        for (let property of Object.keys(margin)) {
            this.options.margin[property] = margin[property];
        }
        return this;
    }

    public reverse() {
        this.options.reverse = true;
        return this;
    }

    public pretty() {

        let xAxisGroup = this.container.querySelector('g.axis-x');
        let yAxisGroup = this.container.querySelector('g.axis-y');

        xAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');
        yAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');

        if (this.options.orientation === 'vertical') {
            yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.setAttribute('x2', this.width.toString())
                tick.setAttribute('stroke', 'lightgrey')
            });
            xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.remove();
            });
        } else {
            xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.setAttribute('y2', this.height.toString())
            });
            yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.remove()
            });
        }
    }

    public enableAnimation(duration: number) {
        if (duration) {
            this.options.animation.duration = duration;
        }
        this.options.animation.enabled = true;
        return this;
    }

    public disableAnimation() {
        this.options.animation.enabled = false;
        return this;
    }
}

export type ChartData = {
    name: any,
    value: any,

    meta: any,
}
