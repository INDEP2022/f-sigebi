import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { ViewFileButtonComponent } from '../select-goods/view-file-button/view-file-button.component';
import { ModifyDatesModalComponent } from './modify-dates-modal/modify-dates-modal.component';
import { SELECT_GOODS_EYE_VISIT_COLUMNS } from './select-good-eye-visit-columns';

@Component({
  selector: 'app-select-good-eye-visit',
  templateUrl: './select-good-eye-visit.component.html',
  styleUrls: ['./select-good-eye-visit.component.scss'],
})
export class SelectGoodEyeVisitComponent extends BasePage implements OnInit {
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @Input() idRequest: number;
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns = new LocalDataSource();
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedList: any = [];
  maneuverReqList: any[] = [];

  /* INJECTION */
  private modalService = inject(BsModalService);
  private bsModalRef = inject(BsModalRef);
  private rejectedGoodService = inject(RejectedGoodService);
  private goodsQueryService = inject(GoodsQueryService);
  private delegationService = inject(DelegationService);
  private fractionService = inject(FractionService);

  constructor() {
    super();
    this.selectedGoodSettings.columns = SELECT_GOODS_EYE_VISIT_COLUMNS;
  }

  goodTestData = [
    {
      origin: 'INVENTARIOS',
      description: 'CANDIL DECORATIVO',
      key: '801-69-68-65-2',
      manageNo: 605,
      transferAmount: 2,
      transactionAmount: 60,
      reservedAmount: 20,
      availableAmount: 40,
      destination: 'Admon',
      fileNo: 141,
      transferRequestNo: 6882,
      saeNo: '',
      requiresManeuver: '',
    },
  ];

  ngOnInit(): void {
    const self = this;
    this.selectedGoodSettings.columns = {
      select: {
        title: '',
        type: 'custom',
        sort: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
            component.checked(data);
          });
        },
      },
      maneuverRequired: {
        title: 'Maniobra Requerida',
        type: 'custom',
        sort: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
            component.requiredVisitChecked(data);
          });
        },
      },
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.selectedGoodSettings.columns,
    };
    //id de prueba borrar
    this.idRequest = 1;
    //
    this.selectedGoodParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        if (this.idRequest) {
          this.getData(data);
        }
      });
  }

  getData(params: ListParams) {
    //const good: any = Object.assign({ viewFile: '' }, this.goodTestData[0]);
    //const good: any = Object.assign(this.goodTestData[0]);
    //this.selectedGoodColumns.load(this.goodTestData) //= [...this.selectedGoodColumns, good];
    //this.selectedGoodTotalItems = this.goodTestData.length;
    this.loading = true;
    params['filter.applicationId'] = `$eq:${this.idRequest}`; //56817
    this.rejectedGoodService.getAll(params).subscribe({
      next: resp => {
        setTimeout(() => {
          const result = resp.data.map(async (item: any) => {
            if (item.resultFinal != null) {
              if (item.resultFinal != 'N') {
                const column = this.tableGoods.grid.getColumns();
                const maneuverReqColumn = column.find(
                  x => x.id == 'maneuverRequired'
                );
                maneuverReqColumn.hide = true;
              }
            }

            item['maneuverRequired'] =
              item.requiresManeuver == 'Y' ? true : false;

            item.startVisitDate = item.startVisitDate
              ? moment(item.startVisitDate).format('DD-MM-YYYY, h:mm:ss a')
              : null;
            item.endVisitDate = item.endVisitDate
              ? moment(item.endVisitDate).format('DD-MM-YYYY, h:mm:ss a')
              : null;
            item['unitExtentDescrip'] = await this.getDescripUnit(
              item.unitExtent
            );
            item['delegationDescrip'] = await this.getDelegation(
              item.delegationRegionalId,
              item.cveState
            );
            item['fractionDescrip'] = await this.getFraction(item.fractionId);
          });

          Promise.all(result).then(x => {
            console.log(resp.data);
            this.selectedGoodColumns.load(resp.data);
            this.selectedGoodTotalItems = resp.count;
            this.loading = false;
          });
        }, 600);
      },
    });
  }

  viewFile(file: any) {
    console.log(file);
  }

  checked(data: any) {
    const index = this.selectedList.indexOf(data.row);
    if (index == -1) {
      delete data.row.unitExtentDescrip;
      delete data.row.fractionDescrip;
      delete data.row.delegationDescrip;
      this.selectedList.push(data.row);
    } else {
      this.selectedList.splice(index, 1);
    }
  }

  requiredVisitChecked(data: any) {
    this.loading = true;
    const id = data.row.goodresdevId;
    const toggle = data.toggle == true ? 'Y' : 'N';
    const body: any = {
      goodresdevId: id,
      requiresManeuver: toggle,
    };
    this.rejectedGoodService.updateGoodsResDev(id, body).subscribe({
      next: resp => {
        console.log('registro actualizado', id);
        this.loading = false;
      },
      error: error => {
        this.onLoadToast(
          'error',
          'No se pudo establecer la maniobra requerida '
        );
        this.loading = false;
      },
    });
  }

  saveManeuverReq() {
    /*this.maneuverReqList.map((item)=>{
      const body:any = {id:item.id, requiresManeuver: item.requiresManeuver}
    })*/
  }

  modifyDate() {
    if (this.selectedList.length == 0) {
      this.alertInfo(
        'info',
        'Se tiene que tener al menos un registro seleccionado',
        ''
      );
      return;
    }
    const result: boolean = this.existDateAlreadyAsigned();
    if (result == true) {
      this.onLoadToast('info', 'Hay bienes que cuentan con visitas');
      return;
    }

    const config: ModalOptions = {
      initialState: {
        requestId: this.idRequest,
        goods: this.selectedList,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(ModifyDatesModalComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      console.log(this.selectedList);
      this.selectedGoodColumns.getElements().then(data => {
        data.map((item: any) => {
          const toUpdate = this.selectedList.indexOf(item);
          if (toUpdate != -1) {
            item.startVisitDate = moment(res.startDate).format(
              'DD-MM-YYYY, h:mm:ss a'
            );
            item.endVisitDate = moment(res.endDate).format(
              'DD-MM-YYYY, h:mm:ss a'
            );
          }
        });
        this.selectedGoodColumns.load(data);
      });
    });
  }

  existDateAlreadyAsigned() {
    let value: boolean = false;
    for (let i = 0; i < this.selectedList.length; i++) {
      const item = this.selectedList[i];
      if (item.startVisitDate != null || item.endVisitDate) {
        value = true;
        break;
      }
    }
    return value;
  }

  getDescripUnit(unit: string) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.unit'] = `$ilike:${unit}`;
      this.goodsQueryService.getAllUnits(params).subscribe({
        next: resp => {
          resolve(resp.data[0].description);
        },
        error: error => {
          resolve(unit);
        },
      });
    });
  }

  getDelegation(idDeleg: number, stateKey?: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${idDeleg}`;
      //params['filter.stateKey'] = `$eq:${stateKey}`
      this.delegationService.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0].description);
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  getFraction(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      //params['filter.stateKey'] = `$eq:${stateKey}`
      this.fractionService.getAll(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data[0].typeRelevant.description);
        },
        error: error => {
          resolve('');
        },
      });
    });
  }
}
