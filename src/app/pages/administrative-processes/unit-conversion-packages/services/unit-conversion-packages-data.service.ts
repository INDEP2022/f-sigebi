import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitConversionPackagesDataService {
  clearPrevisualizationData = new Subject<boolean>();
  updatePrevisualizationData = new Subject<boolean>();
  dataPrevisualization: any[] = [];
  selectedPackage: string;
  constructor() {}
}
