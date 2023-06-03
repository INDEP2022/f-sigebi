import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingPercentService {
  private loading = new Subject<boolean>();

  constructor() {}

  public set load(load: boolean) {
    this.loading.next(load);
  }

  get loaderProgress(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
