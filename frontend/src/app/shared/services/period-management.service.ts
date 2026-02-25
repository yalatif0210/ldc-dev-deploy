import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { FormGroup } from '@angular/forms';
import { PeriodModel } from '@shared/models/period.model';
import { forkJoin, Observable } from 'rxjs';
import { frenchDate } from '@shared/utils/french-date';

@Injectable({
  providedIn: 'root',
})
export class PeriodManagementService extends SharedService {
  private start_date?: string;
  private end_date?: string;
  private period: any;

  constructor() {
    super();
  }

  onWeekChange(week: string) {
    this.setWeekRange(week);
  }

  submit(form: FormGroup) {
    if (form.valid) {
      this.rest.setRestEndpoint('/api/period/create-period');
      this.rest
        .query({
          startDate: this.formatDateToYYYYMMDD(form.value.start_date),
          endDate: this.formatDateToYYYYMMDD(form.value.end_date),
          monthName: this.getMonthYearInFrench(form.value.start_date),
          periodName: this.getPeriodName(form.value)
        })
        .subscribe({
          next: response => this.onPeriodCreate(),
          error: error => {},
        });
    }
  }

  onPeriodCreate() {
    forkJoin([this.getPeriods()]).subscribe(([response]) => {
      this.setList(this.periodToList(response.data.periods as any[]));
    });
  }

  getPeriods(): Observable<any> {
    return this.query(PeriodModel.periods());
  }

  periodToList(periods: any[]) {
    console.log('periods', periods);
    const result: any[] = [];
    if (periods.length) {
      periods.length &&
        periods.map((period: any, index: number) =>
          result.push({
            id: index + 1,
            mois: period.month?.month || '',
            ['début période']: frenchDate(period.startDate) || '',
            ['fin période']: frenchDate(period.endDate) || '',
            ['nom période']: period.periodName || ''
          })
        );
    }
    return result;
  }

  formatDateToYYYYMMDD(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getPeriodName(data: any): string {
    const month_name = this.getMonthYearInFrench(data.start_date);
    return `SEM ${this.formatDateToYYYYMMDD(data.start_date).split('-')[2]}-AU-${this.formatDateToYYYYMMDD(data.end_date).split('-')[2]} ${month_name}`;
  }

  getMonthYearInFrench(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }

    const moisFrancais = [
      'JANVIER',
      'FÉVRIER',
      'MARS',
      'AVRIL',
      'MAI',
      'JUIN',
      'JUILLET',
      'AOÛT',
      'SEPTEMBRE',
      'OCTOBRE',
      'NOVEMBRE',
      'DÉCEMBRE',
    ];

    const month = moisFrancais[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }

  getWeekRange(form: FormGroup) {
    if (form.valid) {
      this.onWeekChange(form.value.week);
    }
    return {
      start_date: this.start_date,
      end_date: this.end_date,
    };
  }

  setWeekRange(weekString: any) {
    const [year, week] = weekString.split('-W').map(Number);

    // ISO week 1 starts with the Monday of the week containing Jan 4
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay(); // 0=Sunday, 1=Monday...

    // Adjust back to Monday
    const diff = (dayOfWeek <= 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(simple);
    monday.setDate(simple.getDate() + diff);

    // Sunday is Monday + 6 days
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    this.start_date = monday.toISOString().split('T')[0];
    this.end_date = sunday.toISOString().split('T')[0];
  }
}
