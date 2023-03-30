import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LIST_ASSETS_COLUMNS } from './list-assets-columns';

const defaultData = [
  {
    id: 0,
    noManagement: '',
    descripTransfeAsset: '',
    typeAsset: '',
    physicalState: '',
    conservationState: '',
    tansferUnitMeasure: '',
    transferAmount: '',
    destinyLigie: '',
    destinyTransfer: '',
    householdAsset: '',
  },
];
@Component({
  selector: 'app-approval-assets-tabs',
  templateUrl: './approval-assets-tabs.component.html',
  styles: [],
})
export class ApprovalAssetsTabsComponent extends BasePage implements OnInit {
  @Input() dataObject: string;
  @Input() process: string;
  //bsModalRef: BsModalRef;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  constructor(
    private readonly goodService: GoodService,
    private readonly genericService: GenericService,
    private readonly menageService: MenageService,
    private readonly typeRelevantSevice: TypeRelevantService,
    private readonly route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };
    console.log(this.dataObject);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    this.loading = true;
    this.paragraphs = [];
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.params.value.addFilter('requestId', requestId);
    this.goodService.getAll(this.params.getValue().getParams()).subscribe({
      next: async (data: any) => {
        if (data !== null) {
          const result = data.data.map(async (item: any) => {
            //obtener tipo bien
            const goodType = await this.getGoodType(item.goodTypeId);
            item['goodTypeName'] = goodType;
            //obtener el estado fisico
            const physicalStatus = await this.getPhysicalStatus(
              item.physicalStatus
            );
            item['physicalStatusName'] = physicalStatus;

            //obtener el estado de concervacion
            const stateConservation = await this.getStateConservation(
              item.stateConservation
            );
            item['stateConservationName'] = stateConservation;

            //obtener el destino de la transferencia
            const transferentDestiny = await this.getTransferDestiny(
              item.transferentDestiny
            );
            item['transferentDestinyName'] = transferentDestiny;
            item['destinyLigieName'] = transferentDestiny;

            const goodMenaje = await this.getMenaje(item.id);
            item['goodMenaje'] = goodMenaje;
          });

          Promise.all(result).then(x => {
            this.totalItems = data.count;
            this.paragraphs = data.data;
            this.loading = false;
          });
        } else {
          this.paragraphs = defaultData;
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.paragraphs = [];
      },
    });
  }
  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantSevice.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getPhysicalStatus(physicalState: any) {
    return new Promise((resolve, reject) => {
      if (physicalState !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${physicalState}`;
        params['filter.name'] = `$eq:Estado Fisico`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getStateConservation(stateConcervation: any) {
    return new Promise((resolve, reject) => {
      if (stateConcervation !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${stateConcervation}`;
        params['filter.name'] = `$eq:Estado Conservacion`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getTransferDestiny(transferentDestiny: any) {
    return new Promise((resolve, reject) => {
      if (transferentDestiny !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${transferentDestiny}`;
        params['filter.name'] = `$eq:Destino`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getMenaje(id: number) {
    return new Promise((resolve, reject) => {
      this.menageService.getById(id).subscribe({
        next: (resp: any) => {
          if (resp) {
            resolve(resp['noGood']);
          } else {
            resolve('');
          }
        },
        error: error => {
          resolve('');
        },
      });
    });
  }
  selectRow(event: any): void {
    console.log(event);
  }
}
