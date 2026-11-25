import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartStyleBuilder } from '../components/chart-style/chart-style.builder';
import { ChartStyle } from '../components/chart-style/chart-style';
import { HttpClient, httpResource } from '@angular/common/http';
import * as d3 from 'd3';
import { LegendComponent } from '../components/legend/legend';
import { CardComponent } from '../components/card/card';
import { NgClass } from '@angular/common';
import { ChartComponent } from '../components/chart/chart.component';
import { MapSeriesChartComponent } from '../components/map-series/map-series.component';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DataService } from '../services/data-service';
import { computeMsgId } from '@angular/compiler';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [RouterOutlet, NgClass, LegendComponent, CardComponent, ChartComponent, MapSeriesChartComponent],
})
export class App {
    protected readonly title = signal('map');

    protected readonly dataService = inject(DataService);

    show = false;
    data: any = null;

    readonly level = signal<'state' | 'district'>('state');

    stateColor = d3.scaleLinear<string>()
        .domain([700000, 6000000, 18100000])
        .range(['#f3ead7', '#c4a15a', '#1d3b2f']);

    districtColor = d3.scaleSqrt<string>()
        .domain([40000, 200000, 1000000])
        .range(['#f3ead7', '#c4a15a', '#1d3b2f'])
        .clamp(true);

    readonly results = rxResource({
        params: () => ({ level: this.level() }),
        stream: ({ params }) => params.level === 'district' ? this.dataService.getDistrictsData(): this.dataService.getCountryData()
    });

    constructor() {
        effect(() => {
            console.log(this.level())
            console.log(this.results.value())
        })
    }

    private color = this.stateColor;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d) => {
            const population = d.properties?.population;
            const district = this.level() === 'district';

            return {
                fill: this.color(population == null ? this.color.domain()[0] : population),
                strokeWidth: district ? 0.45 : 1.25,
                stroke: '#fbf8f2',
                fillHover: '#330033',
            };
        });

    private readonly http = inject(HttpClient);
    private readonly cd = inject(ChangeDetectorRef);

    ngOnInit() {
    }

    get legend() {
        return this.level() === 'district'
            ? [
                { label: '50k', color: this.districtColor(50000) },
                { label: '150k', color: this.districtColor(150000) },
                { label: '300k', color: this.districtColor(300000) },
                { label: '500k', color: this.districtColor(500000) },
                { label: '1M', color: this.districtColor(1000000) },
            ]
            : [
                { label: '4M', color: this.stateColor(4000000) },
                { label: '8M', color: this.stateColor(8000000) },
                { label: '12M', color: this.stateColor(12000000) },
                { label: '16M', color: this.stateColor(16000000) },
                { label: '20M', color: this.stateColor(18000000) },
            ];
    }

    get panelTitle() {
        if (!this.show) {
            return 'Germany';
        }

        return this.data?.properties?.name || 'Germany';
    }

    get panelSubtitle() {
        if (!this.show) {
            return 'Federal parliamentary republic';
        }

        if (this.level() === 'district') {
            return this.data?.properties?.state || 'District';
        }

        return this.data?.properties?.capital ? `Capital · ${this.data.properties.capital}` : 'Federal state';
    }

    // get mapData() {
    //     return this.level() === 'district' ? null : null;
    // }

    setLevel(level: 'state' | 'district') {
        if (level === this.level()) {
            return;
        }

        this.level.set(level);
        this.color = level === 'district' ? this.districtColor : this.stateColor;
        this.show = false;
        this.data = null;
    }

    showData(data: any) {
        this.show = true;
        this.data = data;
    }

    logoName(feature: any) {
        if (!feature?.properties) {
            return '';
        }

        return this.level() === 'district' ? feature.properties.state : feature.properties.name;
    }

    getLogo(name: string) {
        return name ? `logo logo-${this.convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }

    getLogoBig(name: string) {
        return name ? `logo-big logo-${this.convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }

    convertUmlauts(value: string) {
        return value.replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe');
    }
}
