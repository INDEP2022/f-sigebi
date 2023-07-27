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
import { CheckboxSelectElementComponent } from './checkbox-selected/checkbox-select-element';
import { ConfirmValidationModalComponent } from './confirm-validation-modal/confirm-validation-modal.component';
import { GOODS_EYE_VISIT_COLUMNS } from './validate-eye-visit-columns';

@Component({
  selector: 'app-validate-eye-visit',
  templateUrl: './validate-eye-visit.component.html',
  styleUrls: ['./validate-eye-visit.component.scss'],
})
export class ValidateEyeVisitComponent extends BasePage implements OnInit {
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @Input() idRequest: number;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns = new LocalDataSource();
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedList: any = [];
  maneuverReqList: any[] = [];

  inst: any = null;

  constructor() {
    super();
    this.selectedGoodSettings.columns = GOODS_EYE_VISIT_COLUMNS;
  }

  /* INJECTION */
  private modalService = inject(BsModalService);
  private bsModalRef = inject(BsModalRef);
  private rejectedGoodService = inject(RejectedGoodService);
  private goodsQueryService = inject(GoodsQueryService);
  private delegationService = inject(DelegationService);
  private fractionService = inject(FractionService);

  ngOnInit(): void {
    const self = this;
    this.selectedGoodSettings.columns = {
      select: {
        title: 'Bienes del Almacén',
        type: 'custom',
        sort: false,
        renderComponent: CheckboxSelectElementComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          self.inst = instance;
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
            component.goodsSelected(data);
          });
        },
      },
      validated: {
        title: 'Validado',
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
      ...this.selectedGoodSettings.columns,
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      //if (this.idRequest) {
      this.getData(data);
      //}
    });
  }

  getData(params: ListParams) {
    this.loading = true;
    params['filter.applicationId'] = `$eq:56817`; // ${this.idRequest}
    this.rejectedGoodService.getAll(params).subscribe({
      next: resp => {
        //setTimeout(() => {
        const result = resp.data.map(async (item: any) => {
          item.select = false;
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
          setTimeout(() => {
            this.disableValidateColumn();
          }, 600);
          this.loading = false;
        });
        //}, 600);
      },
    });
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

  /* METODO PARA DESHABILITAR EL CAMPO VALIDADO
  ============================================= */
  disableValidateColumn() {
    const tabla = document.getElementById('selectedGoodsTable');
    const tbody = tabla.children[0].children[1].children;
    for (let index = 0; index < tbody.length; index++) {
      const element = tbody[index];
      element.children[1].classList.add('not-press');
    }
  }

  goodsSelected(event: any) {
    const index = this.selectedList.indexOf(event.row);
    const index2 = this.selectedGoodColumns['data'].indexOf(event.row);
    if (index == -1) {
      if (this.selectedList.length >= 1) {
        this.selectedGoodColumns.getElements().then(data => {
          data.map((item: any) => {
            if (item.goodresdevId == event.row.goodresdevId) {
              item.select = false;
            }
          });
          this.selectedGoodColumns.load(data);
        });
        this.onLoadToast('info', 'Solo se puede seleccionar un bien a la vez');
        return;
      }

      this.selectedGoodColumns['data'][index2].select = true;
      this.selectedList.push(event.row);
    } else {
      this.selectedGoodColumns['data'][index2].select = false;
      this.selectedList.splice(index, 1);
    }
  }

  validateVisitResult() {
    if (this.selectedList.length != 0) {
      if (this.selectedList[0].codeStore == null) {
        if (
          this.selectedList[0].resultFinal != 'Y' &&
          this.selectedList[0].resultFinal != 'P'
        ) {
          const config: ModalOptions = {
            initialState: {
              requestId: this.idRequest,
              goods: this.selectedList,
            },
            class: 'modal-md modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.bsModalRef = this.modalService.show(
            ConfirmValidationModalComponent,
            config
          );
        } else {
          this.onLoadToast(
            'info',
            'El bien ya cuenta con un resultado validado'
          );
        }
      } else {
        this.onLoadToast(
          'info',
          'El resultado de la visita ocular para el bien no es editable en este almacen'
        );
      }
    } else {
      this.onLoadToast('info', 'Se tiene que seleccionar un bien');
    }
  }
}
