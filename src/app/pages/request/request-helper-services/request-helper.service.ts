import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestHelperService {
  private refresh = new BehaviorSubject<any>(undefined);
  currentRefresh = this.refresh.asObservable();

  private expedient = new BehaviorSubject<any>(undefined);
  currentExpedient = this.expedient.asObservable();

  private readOnly = new BehaviorSubject<any>(undefined);
  currentReadOnly = this.readOnly.asObservable();

  private formLoading = new BehaviorSubject<any>(undefined);
  currentFormLoading = this.formLoading.asObservable();

  private turnarVerifiCumpli = new BehaviorSubject<any>(undefined);
  currentTurnarVerificacion = this.turnarVerifiCumpli.asObservable();

  constructor() {}

  isComponentSaving(menaje: boolean) {
    this.refresh.next(menaje);
  }

  associateExpedient(state: boolean) {
    this.expedient.next(state);
  }

  changeReadOnly(isreadOnly: boolean) {
    this.readOnly.next(isreadOnly);
  }

  loadingForm(loading: boolean) {
    this.formLoading.next(loading);
  }

  consultarSiCumple(consultar: boolean) {
    this.turnarVerifiCumpli.next(consultar);
  }
}
