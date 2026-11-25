import { NgClass } from '@angular/common';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, input, signal } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.html',
    styleUrls: ['./card.scss'],
    imports: [NgClass],
})
export class CardComponent {
    data = input<any>();

    formatPopulation(value: unknown) {
        if (value == null || value === '') {
            return '—';
        }

        const number = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''));

        return Number.isFinite(number) ? new Intl.NumberFormat('en-US').format(number) : String(value);
    }
}
