import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPackageGoodDec } from 'src/app/core/models/ms-package-good/package-good-dec';
import { IPackageGoodError } from 'src/app/core/models/ms-package-good/package-good-error';

@Injectable({
  providedIn: 'root',
})
export class UnitConversionPackagesDataService {
  clearPrevisualizationData = new Subject<boolean>();
  updatePrevisualizationData = new Subject<boolean>();
  dataPrevisualization: IPackageGoodDec[] = [];
  dataErrors: IPackageGoodError[] = [];
  selectedPackage: string;
  constructor() {}
}
