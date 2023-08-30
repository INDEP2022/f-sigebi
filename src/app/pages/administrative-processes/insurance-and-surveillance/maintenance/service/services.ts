import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private sharedVariableSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  private currentTabSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(1); // Valor predeterminado para la primera pestaña

  setSharedVariable(value: any): void {
    console.log('valor', value);
    this.sharedVariableSubject.next(value);
  }

  getSharedVariable(): Observable<any> {
    return this.sharedVariableSubject.asObservable();
  }

  setCurrentTab(tabNumber: number): void {
    console.log('TAB', tabNumber);
    this.currentTabSubject.next(tabNumber);
  }

  getCurrentTab(): Observable<number> {
    return this.currentTabSubject.asObservable();
  }
}
