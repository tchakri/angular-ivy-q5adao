import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import { IChartMeasure, INineBoxMatrixModel } from '../model/chartmodel';
import { chartMeasure, data } from '../data/data';

@Component({
  selector: 'ftr-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() data: INineBoxMatrixModel[] = [];
  @Input() chartMeasure: IChartMeasure;
  private width: number;
  private height: number;
  private height2 = 40;
  private margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  };
  private margin2 = {
    top: 430,
    right: 20,
    bottom: 30,
    left: 40
  };
  private x: any;
  private y: any;
  private x2: any;
  private y2: any;
  private svg: any;
  private brush: any;
  private zoom: any;
  private focus: any;
  private context: any;
  private xAxis: any;
  private xAxis2: any;
  private fixedWidthSlider: boolean = true;
  private tooltip: any;

  constructor() {}

  ngOnInit() {
    this.data = data;
    this.chartMeasure = chartMeasure;
    this.initSvg();
    this.initAxis();
    this.drawChart();
  }

  initSvg() {
    this.svg = d3.select('figure#bar svg');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height =
      +this.svg.attr('height') - this.margin.top - this.margin.bottom;
  }

  private initAxis() {
    this.x = d3Scale
      .scaleBand()
      .domain(this.data.map((d: any) => d[this.chartMeasure.dimension1]))
      .range([0, this.width])
      .padding(0.2);
    this.x2 = d3Scale
      .scaleBand()
      .domain(this.data.map((d: any) => d[this.chartMeasure.dimension1]))
      .range([0, this.width])
      .padding(0.2);
    this.y = d3Scale
      .scaleLinear()
      .domain([
        0,
        d3Array.max(this.data, (d: any) => d[this.chartMeasure.dimension2] + 20)
      ])
      .range([this.height - 100, 0]);
    this.y2 = d3Scale
      .scaleLinear()
      .domain([
        0,
        d3Array.max(this.data, (d: any) => d[this.chartMeasure.dimension2])
      ])
      .range([this.height2, 0]);
    this.brush = d3Brush
      .brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush', this.brushed.bind(this));
    this.zoom = d3Zoom
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]]);
  }

  private drawChart() {
    this.svg
      .append('g')
      .attr('transform', 'translate(' + 10 + ', ' + 200 + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(this.chartMeasure.yAxisLabel);

    this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', 350);

    this.focus = this.svg
      .append('g')
      .attr('class', 'focus')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.context = this.svg
      .append('g')
      .attr('class', 'context')
      .attr(
        'transform',
        'translate(' + this.margin2.left + ',' + this.margin2.top + ')'
      );

    this.xAxis = d3Axis
      .axisBottom(this.x)
      .tickSizeInner(0)
      .tickSizeOuter(0);
    this.xAxis2 = d3Axis
      .axisBottom(this.x2)
      .tickSizeInner(0)
      .tickSizeOuter(0);

    this.focus
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + 350 + ')')
      .call(this.xAxis);

    this.focus
      .append('g')
      .attr('class', 'axis')
      .call(d3Axis.axisLeft(this.y));

    let focus_group = this.focus.append('g');
    focus_group.attr('clip-path', 'url(#clip)').attr('height', 370);

    let rects = focus_group.selectAll('rect').data(this.data);

    const newRects1 = rects.enter();

    newRects1
      .append('rect')
      .attr('class', 'bar bottomBars')
      .attr('x', (d: any) => this.x(d[this.chartMeasure.dimension1]))
      .attr('y', (d: any) => {
        if (this.y(d[this.chartMeasure.dimension2]) > 348) {
          return 347;
        }
        return this.y(d[this.chartMeasure.dimension2]);
      })
      .attr('height', (d: any) => {
        if (this.height - this.y(d[this.chartMeasure.dimension2]) - 50 < 102) {
          return 104;
        }

        return this.height - this.y(d[this.chartMeasure.dimension2]) - 50;
      })
      .attr('opacity', 0.85)
      .attr('width', 10)
      .attr('fill', '#E4801C')
      .attr('transform', () => {
        `translate(${4}, {-100})`;
      })
      .on('click', this.clicked.bind(this));

    newRects1
      .append('text')
      .text((d: any) => {
        return d[this.chartMeasure.dimension2];
      })
      .attr('text-anchor', 'middle')
      .attr('x', (d: any) => this.x(d[this.chartMeasure.dimension1]))
      .attr('y', (d: any) => this.y(d[this.chartMeasure.dimension2]))
      .attr('font-family', 'sans-serif')
      .attr('font-size', '18px')
      .attr('fill', '#000')
      .attr('class', 'barValue');

    newRects1
      .append('image')
      .attr('class', 'img')
      .attr('width', '28px')
      .attr('x', (d: any) => this.x(d[this.chartMeasure.dimension1]))
      .attr('y', (d: any) => this.y(d[this.chartMeasure.dimension2]))
      .attr('height', '28px')
      .attr('transform', () => {
        `translate(${4}, {-100})`;
      })
      .attr('id', (d: { StaffNumber: string }) => {
        return d.StaffNumber + 'pattern';
      });

    // circle on image - added
    newRects1
      .append('circle')
      .attr('class', 'cir')
      .attr('r', 16)
      // .attr('cy', 16)
      // .attr('cx', 16)
      .attr('cx', (d: any) => this.x(d[this.chartMeasure.dimension1]))
      .attr('cy', (d: any) => this.y(d[this.chartMeasure.dimension2]))
      .style('fill', (d: { StaffNumber: string }) => {
        return 'url(#' + d.StaffNumber + 'pattern)';
      });

    focus_group = this.context.append('g');
    focus_group.attr('clip-path', 'url(#clip)');

    const brushRects = focus_group.selectAll('rect').data(this.data);

    const brushRects1 = brushRects.enter();

    brushRects1
      .append('rect')
      .attr('class', 'bar bottomBars')
      .attr('x', (d: any) => this.x2(d[this.chartMeasure.dimension1]))
      .attr('y', (d: any) => {
        if (this.y2(d[this.chartMeasure.dimension2]) > 39) {
          return 38;
        }
        return this.y2(d[this.chartMeasure.dimension2]);
      })
      .attr('height', (d: any) => {
        if (this.height2 - this.y2(d[this.chartMeasure.dimension2]) < 1) {
          return 2;
        }
        return this.height2 - this.y2(d[this.chartMeasure.dimension2]);
      })
      .attr('opacity', 0.85)
      .attr('width', this.x.bandwidth())
      .attr('fill', '#E4801C')
      .attr('transform', 'translate(' + 4 + ',0)');

    this.context
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + this.height2 + ')')
      .call(this.xAxis2)
      .selectAll('text')
      .remove();

    this.context
      .append('g')
      .attr('class', 'brush')
      .call(this.brush)
      .call(this.brush.move, () => {
        if (this.fixedWidthSlider) {
          return [0, 240];
        }
        return this.x.range();
      });

    d3.selectAll('.brush>.handle').remove();
    d3.selectAll('.brush>.overlay').remove();

    this.tooltip = this.svg
      .append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    this.tooltip
      .append('rect')
      .attr('width', 50)
      .attr('height', 40)
      .attr('fill', '#E4801C')
      .style('opacity', 0.5);

    this.tooltip
      .append('text')
      .attr('class', 'id_feature')
      .attr('x', 25)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '14px');

    this.tooltip
      .append('text')
      .attr('class', 'value_feature')
      .attr('x', 25)
      .attr('dy', '2.4em')
      .style('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold');
  }

  private brushed(
    event: {
      sourceEvent: {
        type: string;
      };
      selection: any;
    },
    d: any
  ) {
    if (event.sourceEvent && event.sourceEvent.type === 'zoom') return;
    let s = event.selection;
    let nD: any = [];
    this.x2.domain().forEach((d: any) => {
      let pos = this.x2(d) + this.x2.bandwidth() / 2;
      if (pos > s[0] && pos < s[1]) {
        nD.push(d);
      }
    });
    this.x.domain(nD);
    this.focus
      .selectAll('.bottomBars')
      .style('opacity', (d: any) =>
        this.x.domain().indexOf(d[this.chartMeasure.dimension1]) === -1
          ? 0
          : 100
      )
      .attr('x', (d: any) => {
        let xValue: any;
        if (
          this.x(d[this.chartMeasure.dimension1]) +
          this.x.bandwidth() / 2 -
          30
        ) {
          xValue =
            this.x(d[this.chartMeasure.dimension1]) +
            this.x.bandwidth() / 2 -
            30;
        }
        return xValue;
      })
      .attr('y', (d: any) => {
        if (this.y(d[this.chartMeasure.dimension2]) > 348) {
          return 347;
        }
        return this.y(d[this.chartMeasure.dimension2]);
      })
      .attr('height', (d: any) => {
        if (this.height - this.y(d[this.chartMeasure.dimension2]) < 102) {
          return 104;
        }

        return this.height - this.y(d[this.chartMeasure.dimension2]);
      })
      .attr('opacity', 0.85)
      .attr('width', this.x.bandwidth());
    this.focus
      .select('.x.axis')
      .call(this.xAxis)
      .selectAll('text')
      .remove();

    this.focus
      .selectAll('.img')
      .attr('xlink:href', (d: any) => {
        return d.imageUrl;
      })
      .style('opacity', (d: any) =>
        this.x.domain().indexOf(d[this.chartMeasure.dimension1]) === -1
          ? 0
          : 100
      )
      .attr('width', 30)
      .attr('x', (d: any) => {
        if (this.x(d[this.chartMeasure.dimension1]) + 9 > 0) {
          return this.x(d[this.chartMeasure.dimension1]) + 9;
        }
      })
      .attr('y', (d: any) => this.y(d[this.chartMeasure.dimension2]) - 40)
      .attr('height', 30)
      .attr('transform', () => {
        `translate(${4}, {-100})`;
      });

    this.focus
      .selectAll('.cir')
      .style('opacity', (d: any) =>
        this.x.domain().indexOf(d[this.chartMeasure.dimension1]) === -1
          ? 0
          : 100
      )
      .attr('x', (d: any) => {
        if (this.x(d[this.chartMeasure.dimension1]) + 9 > 0) {
          return this.x(d[this.chartMeasure.dimension1]) + 9;
        }
      })
      .attr('y', (d: any) => this.y(d[this.chartMeasure.dimension2]) - 40);

    this.focus
      .selectAll('.barValue')
      .text((d: any) => {
        return d[this.chartMeasure.dimension2];
      })
      .attr('text-anchor', 'middle')
      .style('opacity', (d: any) =>
        this.x.domain().indexOf(d[this.chartMeasure.dimension1]) === -1
          ? 0
          : 100
      )
      .attr('x', (d: any) => {
        if (this.x(d[this.chartMeasure.dimension1]) + 24 > 0)
          return this.x(d[this.chartMeasure.dimension1]) + 24;
      })
      .attr('y', (d: any) => {
        if (this.y(d[this.chartMeasure.dimension2]) + 25 > 0)
          return this.y(d[this.chartMeasure.dimension2]) + 25;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '18px')
      .attr('fill', 'white');
  }

  private clicked(event: any) {
    this.svg.node().getBoundingClientRect();
    let x = event.pageX - this.svg.node().getBoundingClientRect().x - 50;
    let y = event.pageY - this.svg.node().getBoundingClientRect().y - 50;
    this.tooltip.select('text.id_feature').text(`${x}`);
    this.tooltip.select('text.value_feature').text(`${y}`);
    this.tooltip.attr('transform', `translate(${x}, ${y})`);

    this.svg.select('.tooltip').style('display', null);
    setTimeout(() => {
      this.svg.select('.tooltip').style('display', 'none');
    }, 2000);
  }

  ngOnDestroy(): void {
    this.svg.remove();
  }
}
