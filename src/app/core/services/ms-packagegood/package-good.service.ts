import { Injectable } from '@angular/core';
import { PackageGoodEndpoints } from 'src/app/common/constants/endpoints/ms-package-good';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IpackageValidGood,
  PrepDestinationPackage,
} from '../../models/catalogs/Ipackage-valid-good';
import { IPackage } from '../../models/catalogs/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = PackageGoodEndpoints.BasePath;
  }

  getPaqDestinationEnc(params?: ListParams) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}`;
    return this.get(route, params);
  }

  updatePaqDestinationEnc(id: string | number, good: Partial<IPackage>) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}/${id}`;
    return this.put(route, good);
  }

  //paq-destination - det
  getPaqDestinationDet(params?: ListParams) {
    const route = `${PackageGoodEndpoints.paqDestinationDet}`;
    return this.get(route, params);
  }

  pubValidGood(good: IpackageValidGood) {
    const route = `${PackageGoodEndpoints.paqDestinationDet}/${PackageGoodEndpoints.pubValidGood}`;
    return this.post(route, good);
  }

  prepDestinationPackage(data: PrepDestinationPackage) {
    const route = `${PackageGoodEndpoints.prepDestinationPackage}`;
    return this.post(route, data);
  }
}
