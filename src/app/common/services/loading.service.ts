import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new Subject<boolean>();

  constructor() {}

  public set load(load: boolean) {
    this.loading.next(load);
  }

  get loader(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
