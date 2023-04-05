import {
    axisBottom,
    axisLeft, axisRight, axisTop,
    extent,
    max,
    scaleBand,
    scaleLinear,
    scaleTime,
    select, timeFormat,
} from "d3";
import Stats from 'stats.js'

export default abstract class BaseChart {

    protected options = {
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
        fillColor: null,
        textColor: null,
        strokeColor: null,
        orientation: 'vertical',
        animation: {
            enabled: true,
            duration: 1000,
        },
        debug: false,
        reverse: false,
    }

    public abstract build(): this;

    protected _data: Array<ChartData> | any;

    protected afterBuildCallbacks: Array<() => void> = [];

    protected beforeBuildCallbacks: Array<() => void> = [];

    protected _svg = null;

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

    enableDebug() {
        let stats = new Stats()
        stats.showPanel(0)
        document.querySelector('body').appendChild(stats.dom)
    }

    public data(data: any) {
        this._data = data;
        return this;
    }

    update(data: any): this {
        this._data = data;
        select(this.container).select('svg').remove();
        return this.build();
    }

    protected getScaleY() {
        return scaleLinear()
            .domain([0, max(this._data, function (d) {
                return +d.value;
            })])
            .range([this.height, 0]);
    }

    protected getScaleX() {
        if (this._data.length === 0) {
            throw new Error('No data provided')
        }

        let scaleType;

        if (this._data[0].name instanceof Date) {
            scaleType = 'time';
        }

        if (typeof this._data[0].name === 'string') {
            scaleType = 'band';
        }

        if (typeof this._data[0].name === 'number') {
            scaleType = 'linear';
        }

        let scale;
        switch (scaleType) {
            case 'time':
                // sort by date
                this._data = this._data.sort((a, b) => {
                    return a.name.getTime() - b.name.getTime();
                });
                scale = scaleTime()
                    .domain(extent(this._data, function (d) {
                        return d.name;
                    })).range([0, this.width]);
                break;
            case 'band':
                scale = scaleBand().range([0, this.width])
                    .domain(this._data.map(function (d: ChartData) {
                        return d.name;
                    })).padding(0.2);
                break;
            case 'linear':
                scale = scaleLinear()
                    .domain([0, max(this._data, function (d) {
                        return +d.name;
                    })])
                    .range([0, this.width]);
        }
        return scale;
    }


    protected buildAxisLeft() {
        // determine if scale type is band or time
        const scale = this.getScaleY();
        this.svg.append("g")
            .call(this.options.reverse ? axisBottom(scale) : axisLeft(scale));
        return scale;
    }


    protected buildAxisBottom() {
        const scale = this.getScaleX()
        const axis = this.options.reverse ? axisLeft(scale) : axisBottom(scale);

        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(axis);

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
        let mainGroup = this.container.querySelector('svg g');

        let xAxisGroup = mainGroup.children[0];
        let yAxisGroup = mainGroup.children[1]


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
