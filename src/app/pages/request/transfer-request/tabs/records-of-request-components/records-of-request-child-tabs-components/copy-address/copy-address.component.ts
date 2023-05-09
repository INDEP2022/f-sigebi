import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodAddress } from 'src/app/core/models/good/good-address';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  addresses: any[];
  selectAdrress: IGoodAddress[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTown = new BehaviorSubject<ListParams>(new ListParams());
  paramsMun = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearch = new BehaviorSubject<ListParams>(new ListParams());
  typesAddress = new DefaultSelect<any>();
  constructor(
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private stateService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private goodInvService: GoodsInvService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOOD_ADDRESS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAddress());
  }

  prepareForm() {
    this.form = this.fb.group({
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      warehouseAlias: [null, [Validators.pattern(STRING_PATTERN)]],
      correspondence: ['TODO', [Validators.pattern(STRING_PATTERN)]],
      typeAddress: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getAddress() {
    this.loading = true;
    this.params.getValue()['filter.regionalDelegationId'] = this.idDelegation;
    this.params.getValue()['filter.municipalityKey'] = '$not:$null';
    this.params.getValue()['filter.localityKey'] = '$not:$null';
    this.params.getValue()['filter.code'] = '$not:$null';
    this.goodService.getGoodsDomicilies(this.params.getValue()).subscribe({
      next: async (data: any) => {
        console.log(data);
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

          item['warehouseAliasName'] = item.warehouseAlias?.id;
          item['stateName'] = stateName;
          item['municipalityName'] = municipality;
          item['localityName'] = locality;
          item['idRequest'] = item.requestId.id;
        });

        Promise.all(info).then(() => {
          this.addresses = data.data;
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getStateName(id: number) {
    return new Promise((resolve, reject) => {
      this.stateService.getById(id).subscribe({
        next: data => {
          resolve(data?.descCondition);
        },
        error: error => {
          console.log('error estado', error);
        },
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
              resolve(item.municipality);
            });
          },
          error: error => {
            console.log('error munici', error);
          },
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
            data.data.map((item: any) => {
              resolve(item?.township);
            });
          },
          error: error => {
            console.log('error localidad', error);
          },
        });
    });
  }

  addressSelect(address: IGoodAddress) {
    this.selectAdrress.push(address);
  }

  searchAddress() {
    const request = this.form.get('requestId').value;
    const akaWarehouse = this.form.get('warehouseAlias').value;
    const correspondence = this.form.get('correspondence').value;
    const typeAddress = this.form.get('typeAddress').value;

    if (request) {
      console.log('solicitud', request);
      this.paramsSearch.getValue()['filter.requestId'] = request;
    }

    if (akaWarehouse) {
      console.log('alias', akaWarehouse);
      //this.paramsSearch.getValue()['filter.aliasWarehouse'] = akaWarehouse;
    }

    if (correspondence) {
      console.log('correspondence', correspondence);
      //this.paramsSearch.getValue()['filter.correspondence'] = correspondence;
    }

    if (typeAddress) {
      console.log('typeAddress', typeAddress);
      //this.paramsSearch.getValue()['filter.typeAddress'] = typeAddress;
    }

    if (request || akaWarehouse || correspondence || typeAddress) {
      this.getSearchAddress();
    } else {
      this.onLoadToast(
        'info',
        'Acción no permitida',
        'Debes realizar al menos un filtro de búsqueda'
      );
    }
  }

  resetSearch() {
    this.form.reset();
    this.paramsSearch = new BehaviorSubject<ListParams>(new ListParams());
    this.getAddress();
  }

  getSearchAddress() {
    this.loading = true;
    this.paramsSearch.getValue()['filter.regionalDelegationId'] =
      this.idDelegation;
    this.paramsSearch.getValue()['filter.municipalityKey'] = '$not:$null';
    this.paramsSearch.getValue()['filter.localityKey'] = '$not:$null';
    this.paramsSearch.getValue()['filter.code'] = '$not:$null';
    this.goodService
      .getGoodsDomicilies(this.paramsSearch.getValue())
      .subscribe({
        next: async (data: any) => {
          console.log(data);
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

            item['warehouseAliasName'] = item.warehouseAlias?.id;
            item['stateName'] = stateName;
            item['municipalityName'] = municipality;
            item['localityName'] = locality;
            item['idRequest'] = item.requestId.id;
          });

          Promise.all(info).then(() => {
            this.addresses = data.data;
            this.totalItems = data.count;
            this.loading = false;
          });
        },
        error: error => {
          console.log(error);
        },
      });
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
