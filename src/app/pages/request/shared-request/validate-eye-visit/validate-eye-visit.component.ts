import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
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
import { SeeExpedientComponent } from './see-expedient/see-expedient.component';
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
    console.log('validate visita', this.idRequest);
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
      //borrar
      //this.idRequest = 56817;
      //fin
      if (this.idRequest) {
        this.getData(data);
      }
    });
  }

  getData(params?: ListParams) {
    this.loading = true;
    this.selectedGoodColumns = new LocalDataSource();
    params['filter.applicationId'] = `$eq:${this.idRequest}`;
    this.rejectedGoodService
      .getAll(params)
      .pipe(
        catchError(err => {
          this.loading = false;
          return of({ data: [], count: 0 });
        })
      )
      .subscribe({
        next: (resp: any) => {
          const result = resp.data.map(async (item: any, _i: number) => {
            item.select = false;
            //borrar solo de prueba
            /* if (_i == 0) {
            item.resultTaxpayer = 'ACEPTADO';
            item.resultFinal = 'Y';
          } */
            //fin

            item['validated'] =
              item.resultFinal == 'Y' || item.resultFinal == 'P' ? true : false;
            item['maneuverRequired'] =
              item.requiresManeuver == 'Y' ? true : false;

            item.startVisitDate = item.startVisitDate
              ? moment(item.startVisitDate).format('DD-MM-YYYY, h:mm:ss a')
              : null;
            item.endVisitDate = item.endVisitDate
              ? moment(item.endVisitDate).format('DD-MM-YYYY, h:mm:ss a')
              : null;
            /* item['unitExtentDescrip'] = await this.getDescripUnit(
              item.unitExtent
            );*/
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
              this.setContributorValidatorRows();
            }, 600);
            this.loading = false;
          });
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

  getFraction(code: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.code'] = `$eq:${code}`;
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

    if (index == -1) {
      this.selectedList.push(event.row);
    } else {
      this.selectedList.splice(index, 1);
    }
    /*const index2 = this.selectedGoodColumns['data'].indexOf(event.row);
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
    }*/
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
          this.bsModalRef.content.event.subscribe((res: any) => {
            if (res == true) {
              const params = new ListParams();
              this.getData(params);
            }
          });
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

  /* METODO QUE ESTABLECE LOS ESTILOS DE LAS COLUMNAS */
  setContributorValidatorRows() {
    this.selectedGoodColumns.getElements().then(data => {
      data.map((item: any, i: number) => {
        const tabla = document.getElementById('selectedGoodsTable');
        const tbody = tabla.children[0].children[1].children;
        if (item.resultTaxpayer == 'ACEPTADO') {
          const elem = tbody[i].children[2].setAttribute(
            'style',
            'background-color:green;color:white;'
          );
        }
        if (item.resultFinal == 'Y' || item.resultFinal == 'P') {
          const elem = tbody[i].children[1].setAttribute(
            'style',
            'color:green;'
          );
        }
      });
    });
  }

  approveAcceptGood() {
    if (this.selectedList.length == 0 || this.selectedList.length > 1) {
      this.onLoadToast('info', 'Se tiene que tener un bien seleccionado');
      return;
    }

    const codigoAlmacen = this.selectedList[0].codeStore; //codigo almacen seleccionado
    const codigoAlmacenTarea = ''; //
    const resultadoFinal = this.selectedList[0].resultFinal;

    if (resultadoFinal == 'P') {
      this.alertQuestion(
        'question',
        'Aceptar Bien Ajeno',
        'Se aceptara provisionalmente un bien de otro almacen'
      ).then(questionResult => {
        if (questionResult.isConfirmed) {
          this.iterateAcceptGood();
        }
      });
    } else {
      this.onLoadToast(
        'info',
        'No es posible aprobar el bien seleccionado',
        ''
      );
      return;
    }
  }

  iterateAcceptGood() {
    this.selectedList.map(async (item: any, _i: any) => {
      if (item.resultFinal != 'Y') {
        item.resultTaxpayer = 'RECHAZADO';
        item.resultFinal = 'Y';
      } else {
        item.resultTaxpayer = 'ACEPTADO';
        item.resultFinal = 'Y';
      }

      const updateItem: any = {
        goodresdevId: item.goodresdevId,
        resultFinal: item.resultadoFinal,
        resultTaxpayer: item.resultTaxpayer,
      };

      await this.updateGoodResDev(updateItem);
    });
    /* ACTUALIZA LA TABLA */
    this.selectedGoodColumns.getElements().then(data => {
      //debugger;
      for (let i = 0; i < data.length; i++) {
        const dataColumns = data[i];
        for (let j = 0; j < this.selectedList.length; j++) {
          const listSelected = this.selectedList[j];

          if (dataColumns.goodresdevId == listSelected.goodresdevId) {
            dataColumns.resultTaxpayer = listSelected.resultTaxpayer;
            dataColumns.resultFinal = listSelected.resultFinal;
          }
        }
      }
      this.selectedGoodColumns.load(data);
    });
    const params = new ListParams();
    this.getData(params);
  }

  seeExpedients() {
    const config: ModalOptions = {
      initialState: {
        idRequest: this.idRequest,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(SeeExpedientComponent, config);
  }

  updateGoodResDev(body: any) {
    return new Promise((resolve, reject) => {
      const id = body.goodresdevId;
      this.rejectedGoodService.updateGoodsResDev(id, body).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }
}
