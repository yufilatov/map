import { Component, input } from '@angular/core';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.html',
    styleUrls: ['./legend.scss'],
})
export class LegendComponent {
    legend = input<any[]>([]);
}
