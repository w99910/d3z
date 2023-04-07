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
        tooltip: true,
        legend: true,
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

    sortData(ascending = true) {
        console.log(this._data.sort((a, b) => {
            if (a.value > b.value) return -1;
            if (a.value < b.value) return 1;
            return 0;
        }))
    }

    update(data: any): this {
        if (!document.body.contains(this.svg.node())) {
            return;
        }
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
        const range = this.options.orientation === 'vertical' ? [0, this.width] : [this.height, 0];
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

    public tooltip(enabled: boolean) {
        this.options.tooltip = enabled;
        return this;
    }

    protected buildTooltip(element, text: (d: ChartData) => string, styles = {}) {
        // Tooltip
        const tooltip = select(this.svg.node().parentElement.parentElement).append('div').attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'fixed')
            .style('background-color', 'white')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '2px')
            .style('font-size', '12px')
            .style('z-index', '1000')
            .style('pointer-events', 'none')

        for (let property of Object.keys(styles)) {
            const resolveCamma = (property) => {
                return property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
            }
            tooltip.style(resolveCamma(property), styles[property]);
        }

        this.svg.selectAll(element).on('mouseover', function (event, d) {
            tooltip.transition().duration(100)
                .style('opacity', 1)
                .style('left', (event.pageX + 2) + 'px')
                .style('top', (event.pageY + 2) + 'px')
                .text(text(d));
        }).on('mouseout', function (event, d) {
            tooltip.transition().duration(100)
                .style('opacity', 0);
        })
    }

    legend(enabled: boolean) {
        this.options.legend = enabled;
        return this;
    }

    protected buildLegends(data, colors) {
        data.forEach((d, index) => {
            const legend = this.svg
                .append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${(this.width - 100) + (index * 60)}, ${this.options.margin.top})`)
            legend.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', colors[index])
            legend.append('text')
                .attr('x', 15)
                .attr('y', 10)
                .text(d.name)
        })
    }

    rotateLabels(xAxis = true, yAxis = true) {
        if (xAxis) {
            this.svg.selectAll('.axis-x text')
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'end');
        }
        if (yAxis) {
            this.svg.selectAll('.axis-y text')
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
