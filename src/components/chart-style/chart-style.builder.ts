import { IChartStyle } from './chart-style';

export type ChartStyleMake<T extends IChartStyle> = (d: any, i: number, context: any) => T;

export class ChartStyleBuilder {
    private styles = new Map<string, ChartStyleMake<any>>();

    for<T extends IChartStyle>(style: T, make: ChartStyleMake<T>) {
        if (style.key) {
            this.styles.set(style.key, make);
        }
        return this;
    }

    compile<T extends IChartStyle>(chartStyle: T, defaults?: T): (d: any, i?: number) => T {
        const { key } = chartStyle;
        const context = {
        };

        const makeStyle = key ? this.styles.get(key) : undefined;
        const cache: T[] = [];
        if (makeStyle) {
            return (d, i = 0): T => {
                const cached = cache[i];
                if (cached) {
                    return cached;
                }

                const style = makeStyle(d, i, context);
                const compStyle = {
                    ...chartStyle,
                    ...(defaults ?? {}),
                    ...style,
                } as T;

                cache[i] = compStyle;
                compStyle.changeSet = new Set(Object.keys(style));

                return compStyle;
            };
        }

        return () => ({
            ...chartStyle,
            ...(defaults ?? {}),
            changeSet: new Set<string>(),
        } as T);
    }
}
