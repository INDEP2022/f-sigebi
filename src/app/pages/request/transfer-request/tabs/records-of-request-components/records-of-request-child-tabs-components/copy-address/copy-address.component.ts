import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private stateService: StateOfRepublicService,
    private localityService: LocalityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOOD_ADDRESS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getAddress();
  }

  getAddress() {
    this.loading = true;
    this.params.getValue()['filter.regionalDelegationId'] = this.idDelegation;
    this.goodService.getGoodsDomicilies(this.params.getValue()).subscribe({
      next: async (data: any) => {
        console.log('cc', data.data);
        const info = data.data.map(async (item: any) => {
          this.idState = item.statusKey;
          this.idMunicipality = item.municipalityKey;
          const stateName = await this.getStateName(item?.statusKey);
          const localityName = await this.getLocality(
            item?.localityKey,
            item?.statusKey,
            item?.municipalityKey
          );
          item['warehouseAliasName'] = item.warehouseAlias?.id;
          item['stateName'] = stateName;
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

  getLocality(idCol: number, idState: number, idMun: number) {
    console.log('estado id', idState);
    console.log('municipio id', idMun);
    console.log('localidad id', idCol);

    const object: Object = {
      id: idCol,
      stateKey: idState,
      municipalityId: 8,
    };

    console.log(object);
    /*this.localityService.postById(object).subscribe({
      next: data => {
        console.log('localidad', data);
      },
      error: error => {},
    }); */
  }

  close() {
    this.modalRef.hide();
  }
}
