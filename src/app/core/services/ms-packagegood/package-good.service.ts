import { Injectable } from '@angular/core';
import { PackageGoodEndpoints } from 'src/app/common/constants/endpoints/ms-package-good';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IpackageValidGood,
  PrepDestinationPackage,
} from '../../models/catalogs/Ipackage-valid-good';
import { IFoliovInvoice, IPackage } from '../../models/catalogs/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = PackageGoodEndpoints.BasePath;
  }

  insertPaqDestionarioEnc(body: IPackage) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}`;
    return this.post(route, body);
  }

  getPaqDestinationEnc(params?: any) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}`;
    return this.get(route, params);
  }

  updatePaqDestinationEnc(id: string | number, good: Partial<IPackage>) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}/${id}`;
    return this.put(route, good);
  }

  getFolio(model: IFoliovInvoice) {
    const route = `application/get-vInvoice`;
    return this.post(route, model);
  }

  //paq-destination - det
  getPaqDestinationDet(params?: any) {
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

  pubCancelPackage(value: any) {
    const route = `${PackageGoodEndpoints.pubCancelPackage}`;
    return this.post(route, value);
  }
}
