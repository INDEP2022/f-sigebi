import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ShowDocumentsGoodComponent } from '../expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { RequestSiabFormComponent } from '../request-siab-form/request-siab-form.component';
import { AddGoodsButtonComponent } from './add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './reserve-good-modal/reserve-good-modal.component';
import { SELECT_GOODS_COLUMNS } from './select-goods-columns';
import { ViewFileButtonComponent } from './view-file-button/view-file-button.component';

@Component({
  selector: 'app-select-goods',
  templateUrl: './select-goods.component.html',
  styles: [],
})
export class SelectGoodsComponent extends BasePage implements OnInit {
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoods: any[] = [];
  goodTotalItems: number = 0;
  selectedGoodTotalItems: number = 0;
  goodColumns: any[] = [];
  selectedGoodColumns: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idRequest: number = 0;
  goodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private goodService: GoodService,
    private genericService: GenericService,
    private goodProcessService: GoodProcessService,
    private requestService: RequestService,
    private rejectedGoodService: RejectedGoodService,
    private affairService: AffairService
  ) {
    super();
    this.goodSettings.columns = SELECT_GOODS_COLUMNS;
    this.selectedGoodSettings.columns = SELECT_GOODS_COLUMNS;
  }

  ngOnInit(): void {
    const self = this;
    this.goodSettings.columns = {
      addGood: {
        title: 'Agregar Bien',
        type: 'custom',
        sort: false,
        renderComponent: AddGoodsButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe(async (row: any) => {
            const process = await component.checkInfoProcess(row);
            if (process) {
              console.log('process', process);
              component.openReserveModal(row);
            }
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
            component.requesInfo(row.requestId);
            //component.viewFile(row);
          });
        },
      },
      ...this.goodSettings.columns,
    };
    this.selectedGoodSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.requesInfo(row.requestId);
          });
        },
      },
      ...this.selectedGoodSettings.columns,
    };
  }

  requesInfo(idRequest: number) {
    this.requestService.getById(idRequest).subscribe({
      next: response => {
        response.recordId;
        this.openModalDocument(idRequest, response.recordId);
      },
      error: error => {},
    });
  }

  openModalDocument(idRequest: number, recordId: number) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };

    config.initialState = {
      idRequest,
      recordId,
      callback: (next: boolean) => {},
    };

    this.modalService.show(ShowDocumentsGoodComponent, config);
  }

  getInfoGoods(filters: any) {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(filters));
  }

  getGoods(filters: any) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.rejectedGoodService.getAll(params.getValue()).subscribe({
      next: response => {
        this.goodColumns = response.data;
        this.goodTotalItems = response.count;
        /* const info = response.data.map(item => {
          return item.good;
        });
         */
      },
      error: error => {},
    });
    /*this.goodProcessService
      .getGoodPostQuery(this.params.getValue(), filters)
      .subscribe({
        next: response => {
          console.log('response', response);
          this.goodColumns = response.data;
          this.goodTotalItems = response.count;
          const filterData = response.data.map(async (item: any) => {
          const destinyName: any = await this.destinyInfo(item.destiny);
          item.destinyName = destinyName;
          return item;
        });

        Promise.all(filterData).then(data => {
          console.log('bienes', data);
          
        }); 
        },
      }); */
    /*const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.delegationNumber'] = filters.regionalDelegationId;
    params.getValue()['filter.origin'] = '$not:$null';

    this.goodService.getAll(params.getValue()).subscribe({
      next: response => {
        const filterData = response.data.map(async item => {
          const destinyName: any = await this.destinyInfo(item.destiny);
          item.destinyName = destinyName;
          return item;
        });

        Promise.all(filterData).then(data => {
          console.log('bienes', data);
          this.goodColumns = data;
          this.goodTotalItems = response.count;
        });
      },
      error: error => {},
    }); */
    //params.getValue()['filter.delegationNumber'] = this.regio;
    //Llamar servicio para obtener bienes
    /* let columns = this.goodTestData;
    columns.forEach(c => {
      c = Object.assign({ addGood: '' }, { viewFile: '' }, c);
    }); */
    //
  }

  destinyInfo(idDestiny: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.name'] = '$eq:Destino';
      params.getValue()['filter.keyId'] = idDestiny;
      this.genericService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].description);
        },
        error: error => {},
      });
    });
  }

  viewFile(file: any) {}

  checkInfoProcess(goodsResDev: IGoodsResDev) {
    return new Promise((resolve, reject) => {
      this.requestService.getById(this.idRequest).subscribe({
        next: response => {
          const params = new BehaviorSubject<ListParams>(new ListParams());
          params.getValue()['filter.nbOrigen'] = 'SAMI';
          params.getValue()['filter.id'] = response.affair;
          this.affairService.getAll(params.getValue()).subscribe({
            next: response => {
              const processDetonate = response.data[0].processDetonate;
              if (
                processDetonate == 'DEVOLUCION' ||
                processDetonate == 'RES_NUMERARIO'
              ) {
                goodsResDev.amountToReserve = null;
                resolve(true);
              } else if (processDetonate != 'INFORMACION') {
                goodsResDev.amountToReserve = null;
                resolve(true);
              } else {
                console.log('goodsResDev', goodsResDev);
              }
            },
            error: error => {},
          });
        },
        error: error => {},
      });
    });
  }

  openReserveModal(good: any) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };

    config.initialState = {
      good,
      callback: (next: boolean) => {
        if (next) {
        }
      },
    };

    this.modalService.show(ReserveGoodModalComponent, config);
    /*const modalRef = this.modalService.show(ReserveGoodModalComponent, {
      initialState: { good },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReserve.subscribe((data: boolean) => {
      if (data) this.addGood(data);
    }); */
  }

  addGood(good: any) {
    console.log(good);
    delete good.addGood;
    good = Object.assign({ viewFile: '' }, good);
    this.selectedGoodColumns = [...this.selectedGoodColumns, good];
    this.selectedGoodTotalItems = this.selectedGoodColumns.length;
  }

  selectGoods(rows: any[]) {
    this.selectedGoods = rows;
  }

  removeGoods() {
    this.alertQuestion(
      'question',
      '¿Desea eliminar los bienes seleccionados?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        this.selectedGoodColumns.forEach((g: any, i: number) => {
          this.selectedGoods.forEach((d: any, j: number) => {
            if (g.key == d.key) {
              this.selectedGoodColumns.splice(i, 1);
              this.selectedGoods.splice(j, 1);
            }
          });
        });
        this.selectedGoodColumns = [...this.selectedGoodColumns];
        this.selectedGoodTotalItems = this.selectedGoodColumns.length;
        console.log(this.selectedGoods, this.selectedGoodColumns);
      }
    });
  }

  openSiabSearch() {
    const modalRef = this.modalService.show(RequestSiabFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
