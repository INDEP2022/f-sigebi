import { Injectable } from '@angular/core';
import { PackageGoodEndpoints } from 'src/app/common/constants/endpoints/ms-package-good';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IpackageValidGood,
  PrepDestinationPackage,
} from '../../models/catalogs/Ipackage-valid-good';
import {
  IDecPackage,
  IFoliovInvoice,
  IPackage,
  IPrincipalPackageDec,
} from '../../models/catalogs/package.model';
import { IPackageGoodDec } from '../../models/ms-package-good/package-good-dec';
import { IPackageGoodEnc } from '../../models/ms-package-good/package-good-enc';

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

  insertPaqDestDec(body: IDecPackage) {
    const route = `${PackageGoodEndpoints.paqDestinationDet}`;
    return this.post(route, body);
  }

  updatePaqDestDec(body: IDecPackage) {
    const route = `${PackageGoodEndpoints.paqDestinationDet}`;
    return this.put(route, body);
  }

  deletePaqDestDec(body: IPrincipalPackageDec) {
    const route = `${PackageGoodEndpoints.paqDestinationDet}`;
    return this.delete(route, body);
  }

  getPaqDestinationEnc(params?: any) {
    const route = `${PackageGoodEndpoints.paqDestinationEnc}`;
    return this.get<IListResponseMessage<IPackageGoodEnc>>(route, params);
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
    return this.get<IListResponseMessage<IPackageGoodDec>>(route, params);
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
