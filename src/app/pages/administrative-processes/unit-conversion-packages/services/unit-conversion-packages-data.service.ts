import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitConversionPackagesDataService {
  clearPrevisualizationData = new Subject<boolean>();
  dataPrevisualization: any[] = [];
  constructor() {}
}
