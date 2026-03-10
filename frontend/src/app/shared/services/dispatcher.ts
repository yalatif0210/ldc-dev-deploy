import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Dispatcher<T = any> {
  protected readonly notify$ = new BehaviorSubject<T | null>(null);

  dispatch(payload: T): void {
    this.notify$.next(payload);
  }

  get dispatch$() {
    return this.notify$.asObservable();
  }

  clear() {
    this.notify$.next([] as any);
  }
}
