import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IDomicile } from 'src/app/core/models/catalogs/domicile';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LocalityService } from '../../../../../../../core/services/catalogs/locality.service';
import { MunicipalityService } from '../../../../../../../core/services/catalogs/municipality.service';
import { StateOfRepublicService } from '../../../../../../../core/services/catalogs/state-of-republic.service';
import { GoodDomiciliesService } from '../../../../../../../core/services/good/good-domicilies.service';
import { AddressTransferorTabComponent } from '../../address-transferor-tab/address-transferor-tab.component';
import { SELECT_ADDRESS_COLUMN } from './select-address-columns';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styles: [],
})
export class SelectAddressComponent extends BasePage implements OnInit {
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  title: string = 'Domicilios de la Solicitud';
  totalItems: number = 0;
  public event: EventEmitter<any> = new EventEmitter();
  rowSelected: any;
  request: any;
  onlyOrigin: boolean = false;

  goodDomiciliesService = inject(GoodDomiciliesService);
  route = inject(ActivatedRoute);
  stateOfRepublicService = inject(StateOfRepublicService);
  municipaliService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsinvService = inject(GoodsInvService);

  constructor(
    private modelRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: SELECT_ADDRESS_COLUMN,
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      //var params = new ListParams();
      //params.page = data.inicio;
      //params.limit = data.pageSize;
      this.getData();
    });
  }

  //obtengo los nombres de los campos
  getData() {
    if (this.request.id) {
      var array: any = [];
      this.loading = true;
      this.params.value.addFilter('requestId', this.request.id);
      const filter = this.params.getValue().getParams();
      this.goodDomiciliesService.getAll(filter).subscribe({
        next: resp => {
          const result = resp.data.map(async (item: any) => {
            if (item.warehouseAlias) {
              item['warehouseAlias'] = item.warehouseAlias.id;
            } else {
              item['warehouseAlias'] = '';
            }
            var stateOfRepublic = await this.getStateOfRepublic(item);
            item['stateOfRepublicName'] = stateOfRepublic;

            if (item.statusKey && item.municipalityKey) {
              const municipality = await this.getMunicipality(item);
              item['municipalityName'] = municipality;
            } else {
              item['municipalityName'] = '';
            }

            if (item.statusKey && item.municipalityKey && item.localityKey) {
              const location = await this.getLocation(item);
              item['localityName'] = location;
            } else {
              item['localityName'] = '';
            }
          });

          Promise.all(result).then(x => {
            this.paragraphs = resp.data;
            this.totalItems = resp.count;
            this.loading = false;
          });
        },
        error: error => {
          console.log('Domicillio de bienes ', error.error.message);
          this.loading = false;
        },
      });
    }
  }

  getStateOfRepublic(item: any) {
    return new Promise((resolve, reject) => {
      if (item.statusKey) {
        this.stateOfRepublicService.getById(item.statusKey).subscribe({
          next: resp => {
            resolve(resp.descCondition);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getMunicipality(item: any) {
    return new Promise((resolve, reject) => {
      var param = new ListParams();
      param['filter.municipalityKey'] = `$eq:${item.municipalityKey}`;
      param['filter.stateKey'] = `$eq:${item.statusKey}`;

      this.goodsinvService.getAllMunipalitiesByFilter(param).subscribe({
        next: resp => {
          resolve(resp.data[0].municipality);
        },
      });
      /* this.municipaliService.getAll(param).subscribe({
        next: (data: any) => {
          resolve(data.data[0].nameMunicipality);
        },
      }); */
    });
  }

  getLocation(item: any) {
    return new Promise((resolve, reject) => {
      var param = new ListParams();
      param['filter.municipalityKey'] = `$eq:${item.municipalityKey}`;
      param['filter.stateKey'] = `$eq:${item.statusKey}`;
      param['filter.townshipKey'] = `$eq:${item.localityKey}`;
      this.goodsinvService.getAllTownshipByFilter(param).subscribe({
        next: (data: any) => {
          resolve(data.data[0].township);
        },
      });
    });
  }

  newAddress() {
    let config: ModalOptions = {
      initialState: {
        isNewAddress: true,
        requestId: this.request.id,
        regDelegationId: this.request.regionalDelegationId,
        callback: (next: boolean) => {
          if (next) {
            this.getData();
          }
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AddressTransferorTabComponent, config);

    /*this.modelRef.content.event.subscribe((res: any) => {
      console.log(res);
    });*/
  }

  selectRow(event: any): void {
    this.rowSelected = event.data;
  }

  selectAddress() {
    if (!this.rowSelected) {
      this.onLoadToast(
        'error',
        'No hay direccion',
        'Seleccione una direccion previamente'
      );
      return;
    }
    //delete this.rowSelected.stateOfRepublicName;
    delete this.rowSelected.municipalityName;
    delete this.rowSelected.localityName;
    this.event.emit(this.rowSelected as IDomicile);
    this.close();
  }

  close() {
    this.modelRef.hide();
  }
}
