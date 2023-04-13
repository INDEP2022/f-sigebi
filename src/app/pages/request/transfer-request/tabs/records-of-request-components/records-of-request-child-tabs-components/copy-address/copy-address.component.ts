import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodAddress } from 'src/app/core/models/good/good-address';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOOD_ADDRESS_COLUMNS } from './good-address-columns';

@Component({
  selector: 'app-copy-address',
  templateUrl: './copy-address.component.html',
  styles: [],
})
export class CopyAddressComponent extends BasePage implements OnInit {
  idDelegation: number = 0;
  idState: number = 0;
  idMunicipality: number = 0;
  idLocality: number = 0;

  totalItems: number = 0;
  addresses: any[];
  selectAdrress: IGoodAddress[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTown = new BehaviorSubject<ListParams>(new ListParams());
  paramsMun = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private stateService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private goodInvService: GoodsInvService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOOD_ADDRESS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAddress());
  }

  getAddress() {
    this.loading = true;
    this.params.getValue()['filter.regionalDelegationId'] = this.idDelegation;
    this.params.getValue()['filter.municipalityKey'] = '$not:$null';
    this.params.getValue()['filter.localityKey'] = '$not:$null';
    this.params.getValue()['filter.code'] = '$not:$null';
    this.goodService.getGoodsDomicilies(this.params.getValue()).subscribe({
      next: async (data: any) => {
        const info = data.data.map(async (item: any) => {
          this.idState = item.statusKey;
          this.idMunicipality = item.municipalityKey;
          const stateName = await this.getStateName(item?.statusKey);
          const municipality = await this.getMunicipality(
            item?.municipalityKey,
            item?.statusKey
          );

          const locality = await this.getLocality(
            item?.municipalityKey,
            item?.statusKey,
            item?.localityKey
          );

          /*const cp = await this.getzipCode(
            item?.municipalityKey,
            item?.statusKey,
            item?.localityKey
          ); */

          item['warehouseAliasName'] = item.warehouseAlias?.id;
          item['stateName'] = stateName;
          item['municipalityName'] = municipality;
          item['localityName'] = locality;
        });

        Promise.all(info).then(() => {
          this.addresses = data.data;
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: error => {},
    });
  }

  getStateName(id: number) {
    return new Promise((resolve, reject) => {
      this.stateService.getById(id).subscribe({
        next: data => {
          resolve(data?.descCondition);
        },
        error: error => {},
      });
    });
  }

  getMunicipality(idMun: number, idState: number) {
    return new Promise((resolve, reject) => {
      this.paramsMun.getValue()['filter.stateKey'] = idState;
      this.paramsMun.getValue()['filter.municipalityKey'] = idMun;
      this.goodInvService
        .getAllMunipalitiesByFilter(this.paramsMun.getValue())
        .subscribe({
          next: data => {
            data.data.map((item: any) => {
              resolve(item?.municipality);
            });
          },
          error: error => {},
        });
    });
  }

  getLocality(idMun: number, idState: number, localityId: number) {
    return new Promise((resolve, reject) => {
      this.paramsTown.getValue()['filter.municipalityKey'] = idMun;
      this.paramsTown.getValue()['filter.stateKey'] = idState;
      this.paramsTown.getValue()['filter.townshipKey'] = localityId;
      this.goodInvService
        .getAllTownshipByFilter(this.paramsTown.getValue())
        .subscribe({
          next: data => {
            data.data.map((items: any) => {
              resolve(items.township);
            });
          },
          error: error => {},
        });
    });
  }

  getzipCode(idMun: number, idState: number, localityId: number) {}

  addressSelect(address: IGoodAddress) {
    this.selectAdrress.push(address);
  }

  confirm() {
    if (this.selectAdrress.length == 0) {
      this.onLoadToast('warning', 'Debes seleccionar un domicilio', '');
    } else {
      this.modalRef.content.callback(this.selectAdrress[0]);
      this.close();
    }
  }

  close() {
    this.modalRef.hide();
  }
}
