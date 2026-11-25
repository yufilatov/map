import * as d3 from 'd3';

// d3 selections are invariant in their element type, so enter/update/exit
// selections are passed through this alias instead of a BaseType | EnterElement union.
export type ChartDrawSelection<T> = d3.Selection<any, T, any, any>;

export interface IChartDrawSettings<T> {
    create?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
    update?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
    delete?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
}

const identity = <T>(selection: ChartDrawSelection<T>) => selection;

export function ChartDrawFactory<T>(
    root: d3.Selection<SVGElement, string, SVGElement, number>,
    datum: T[],
) {
    return (selector: string, settings: IChartDrawSettings<T>) => {
        const create = settings.create ?? identity<T>;
        const update = settings.update ?? identity<T>;
        const remove = settings.delete ?? identity<T>;

        const selection = root
            .selectAll<any, T>(selector)
            .data(datum);

        const enter = create(selection.enter() as ChartDrawSelection<T>)
            .attr('class', selector.slice(1));

        update(enter.merge(selection as ChartDrawSelection<T>));

        remove(selection.exit() as ChartDrawSelection<T>).remove();
    };
}
