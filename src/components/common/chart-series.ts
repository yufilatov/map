import { ChartStyleBuilder } from '../chart-style/chart-style.builder';
import { IChartMargin } from './chart-margin';
import { IChartScale } from './chart-scale';
import { IChartRect } from './chart-rect';

export interface IChartSeriesState {
    id?: string;
    type?: string;
    data?: any[];
    style?: ChartStyleBuilder;
    scaleX?: IChartScale;
    scaleY?: IChartScale;
    rect?: IChartRect;
    margin?: IChartMargin;
    selectX?: string;
    selectY?: string;
}

export const CHART_DEFAULT_SERIES_STATE: IChartSeriesState = {
    data: [],
    style: new ChartStyleBuilder(),
};