import { map } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { count } from 'd3';

export interface SeasonData {
    club: string;
    twoLinesName: string;
    goals: {
        for: {
            home: number;
            away: number;
        },
        against: {
            home: number;
            away: number;
        }
    };
}

interface SeasonRawData {
    info: string;
    data: SeasonData[];
}
@Injectable({ providedIn: 'root' })
export class DataService {
    private readonly http = inject(HttpClient);

    getCountryData(): Observable<any[]> {
        return this.http
            .get<any>(`assets/germany.json`)
    }

    getDistrictsData(): Observable<any[]> {
        return this.http
            .get<any>(`assets/germany-districts.json`);
    }

    getHistoryData(): Observable<any> {
        return this.http
            .get<any>(`assets/epl-clubs-position.json`)
            .pipe(map(data => data.data));
    }
}
