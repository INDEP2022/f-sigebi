import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceOfCoveragesService {
  private passFolioUniv = new BehaviorSubject<any>(undefined);
  currentFolioUniv = this.passFolioUniv.asObservable();

  constructor() {}

  setFolioUniversal(value: number) {
    this.passFolioUniv.next(value);
  }
}
