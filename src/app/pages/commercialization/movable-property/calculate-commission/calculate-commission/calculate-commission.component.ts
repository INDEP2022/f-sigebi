import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent2 } from 'src/app/core/models/ms-event/event.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  IComerComCalculated,
  IComerCommissionsPerGood,
  IThirdParty,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { CommissionsProcessService } from 'src/app/core/services/ms-commisions/commissions.service';
import { ComerComCalculatedService } from 'src/app/core/services/ms-thirdparty/comer-comcalculated';
import { ComerCommissionsPerGoodService } from 'src/app/core/services/ms-thirdparty/comer-commissions-per-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ComcalculatedModalComponent } from '../comcalculated-modal/comcalculated-modal.component';
import { CommissionsModalComponent } from '../commissions-modal/commissions-modal.component';
import {
  COMCALCULATED_COLUMS,
  COMISIONESXBIEN_COLUMNS,
} from './caculate-comission-columns';

@Component({
  selector: 'app-calculate-commission',
  templateUrl: './calculate-commission.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class CalculateCommissionComponent extends BasePage implements OnInit {
  data: any;

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  settings2;
  comerComCalculatedList: IComerComCalculated[] = [];
  comerComCalculated: any = null;

  comerCommissionsList: IComerCommissionsPerGood[] = [];

  thirdParty: IThirdParty;
  good: IGood;
  event: IComerEvent2;
  loading2: boolean = false;
  acordionOpen: boolean = false;
  disabledBtnCerrar: boolean = false;

  columnFilters: any = [];
  columnFilters2: any = [];

  comCalculate: LocalDataSource = new LocalDataSource(); // COMER_COMCALCULADA
  comCommisionXGood: LocalDataSource = new LocalDataSource(); // COMER_COMISIONESXBIEN
  totalForm: FormGroup = new FormGroup({});
  loadingBtnExcel1: boolean = false;
  loadingBtnExcel2: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerComCalculatedService: ComerComCalculatedService,
    private comerCommissionsPerGoodService: ComerCommissionsPerGoodService,
    private commissionsProcessService: CommissionsProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-2"></i>',
      },
      columns: { ...COMCALCULATED_COLUMS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-3"></i>',
      },
      columns: { ...COMISIONESXBIEN_COLUMNS },
    };
  }

  ngOnInit(): void {
    // COMER_COMCALCULADA
    this.comCalculate
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              comCalculatedId: () => (searchFilter = SearchFilter.EQ),
              thirdComerId_Id: () => (searchFilter = SearchFilter.EQ),
              nameReason: () => (searchFilter = SearchFilter.ILIKE),
              startDate: () => (searchFilter = SearchFilter.EQ),
              endDate: () => (searchFilter = SearchFilter.EQ),
              eventId: () => (searchFilter = SearchFilter.EQ),
              changeType: () => (searchFilter = SearchFilter.EQ),
              processKey: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter', filter.field);
              // if (filter.field === "thirdComerId") {
              //   this.columnFilters[field] = `${filter.search}`;
              // } else {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              // }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getComCalculated();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComCalculated());

    // COMER_COMISIONESXBIEN
    this.comCommisionXGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              event: () => (searchFilter = SearchFilter.EQ),
              batch: () => (searchFilter = SearchFilter.EQ),
              good: () => (searchFilter = SearchFilter.EQ),
              cvman: () => (searchFilter = SearchFilter.EQ),
              sale: () => (searchFilter = SearchFilter.EQ),
              amountCommission: () => (searchFilter = SearchFilter.EQ),
              processIt: () => (searchFilter = SearchFilter.EQ),
              comments: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters2[field] = `${filter.search}`;
              // this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getComPerGood(this.comerComCalculated);
        }
      });

    this.params2
      .pipe(
        skip(1),
        tap(() => {
          this.getComPerGood(this.comerComCalculated);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});

    this.prepareForm();
  }
  prepareForm() {
    this.totalForm = this.fb.group({
      totalVenta: [''],
      totalMonto: [''],
    });
  }

  getComCalculated() {
    this.loading = true;
    this.comCalculate.load([]);
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.nameReason']) {
      params['filter.thirdComerId.nameReason'] = params['filter.nameReason'];
      delete params['filter.nameReason'];
    }

    if (params['filter.processKey']) {
      params['filter.comerEvents.processKey'] = params['filter.processKey'];
      delete params['filter.processKey'];
    }

    if (params['filter.thirdComerId_Id']) {
      var texto = params['filter.thirdComerId_Id'];
      var partes = texto.split(':');
      var valor = partes[1];
      params['filter.thirdComerId'] = valor;
      delete params['filter.thirdComerId_Id'];
    }
    this.comerComCalculatedService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map((item: any) => {
          item['nameReason'] = item.thirdComerId.nameReason;
          item['processKey'] = item.comerEvents
            ? item.comerEvents.processKey
            : null;
          item['thirdComerId_Id'] = item.thirdComerId.thirdComerId;

          item['IdAndNameReason'] = item.thirdComerId
            ? item.thirdComerId.thirdComerId +
              ' - ' +
              item.thirdComerId.nameReason
            : null;
          // item.amountCommission = Number(item.amountCommission)
          item['idAndProcessKey'] = item.comerEvents
            ? item.comerEvents.id + ' - ' + item.comerEvents.processKey
            : null;
        });
        Promise.all(result).then(resp => {
          this.comCalculate.load(response.data);
          this.comCalculate.refresh();
          // this.comerComCalculatedList = ;
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: error => {
        this.comCalculate.load([]);
        this.comCalculate.refresh();
        this.totalItems = 0;
        this.loading = false;
        console.log(error);
      },
    });
  }

  getComPerGood(comerComCalculated: any): void {
    this.loading2 = true;
    this.comCommisionXGood.load([]);
    this.totalItems2 = 0;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    if (params['event']) {
      params['filter.eventId'] = params['event'];
      delete params['event'];
    }

    if (params['good']) {
      params['filter.goodNumber'] = params['good'];
      delete params['good'];
    }

    this.comerCommissionsPerGoodService
      .getFilter(comerComCalculated.comCalculatedId, params)
      .subscribe({
        next: response => {
          console.log(response);
          let totalVenta = 0;
          let totalMonto = 0;
          let result = response.data.map((item: any) => {
            item['good'] = item.goodNumber ? item.goodNumber.id : null;
            item['event'] = item.eventId ? item.eventId.eventId : null;
            const a = item.sale ? Number(item.sale) : 0;
            const b = item.amountCommission ? Number(item.amountCommission) : 0;
            totalVenta = totalVenta + a;
            totalMonto = totalMonto + b;
          });
          Promise.all(result).then(resp => {
            this.totalForm.get('totalVenta').setValue(totalVenta);
            this.totalForm.get('totalMonto').setValue(totalMonto);
            this.comCommisionXGood.load(response.data);
            this.comCommisionXGood.refresh();
            this.totalItems2 = response.count;
            // this.comerCommissionsList = response.data;
            this.loading2 = false;
          });
        },
        error: error => {
          this.comCommisionXGood.load([]);
          this.comCommisionXGood.refresh();
          this.totalItems2 = 0;
          this.loading2 = false;
        },
      });
  }

  valAcc: any = null;
  rowsSelected(event: any) {
    if (event == this.valAcc) {
      this.acordionOpen = false;
      this.disabledBtnCerrar = false;
      this.valAcc = null;
    } else {
      this.acordionOpen = true;
      this.disabledBtnCerrar = true;
      this.valAcc = event;
    }
    this.totalItems2 = 0;
    this.comerCommissionsList = [];
    this.comerComCalculated = event;
    this.rowsSelectedGetComissions(this.comerComCalculated);
  }

  rowsSelectedGetComissions(event: any) {
    this.totalItems2 = 0;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComPerGood(event));
  }

  openForm1(calculated?: any) {
    const idT = { ...this.thirdParty };
    if (calculated) {
      if (calculated == this.valAcc) {
        this.acordionOpen = false;
        this.disabledBtnCerrar = false;
        this.valAcc = null;
      } else {
        this.acordionOpen = true;
        this.disabledBtnCerrar = true;
        this.valAcc = calculated;
      }
    }

    let config: ModalOptions = {
      initialState: {
        calculated,
        idT,
        callback: (next: boolean) => {
          if (next) this.getComCalculated();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ComcalculatedModalComponent, config);
  }

  openForm2(commissions?: IComerCommissionsPerGood) {
    const idEvent = { ...this.event };
    const idGood = { ...this.good };
    const comerComCalculated = this.comerComCalculated;
    let config: ModalOptions = {
      initialState: {
        commissions,
        idEvent,
        idGood,
        comerComCalculated,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CommissionsModalComponent, config);
  }

  async calculateCommision() {
    if (!this.comerComCalculated) {
      this.alert('warning', 'Debe seleccionar un registro', '');
    }
    let obj = {
      idCom: this.comerComCalculated.comCalculatedId,
      goodsCalc: 0,
    };
    this.loadingBtnExcel2 = true;
    const commissionsProcessServiceConst: any =
      await this.commissionsProcessServiceFunct(obj);

    if (commissionsProcessServiceConst.status == 200) {
      this.loadingBtnExcel2 = false;
      this.rowsSelectedGetComissions(this.comerComCalculated);
      this.alert(
        'success',
        'Proceso Terminado Correctamente',
        commissionsProcessServiceConst.message
      );
    } else {
      this.loadingBtnExcel2 = false;
      this.rowsSelectedGetComissions(this.comerComCalculated);
      this.alert(
        'warning',
        'Ha ocurrido un error',
        commissionsProcessServiceConst.message
      );
    }
  }

  async goods() {
    if (!this.comerComCalculated) {
      this.alert('warning', 'Debe seleccionar un registro', '');
    }
    let obj = {
      idCom: this.comerComCalculated.comCalculatedId,
      goodsCalc: 1,
    };
    this.loadingBtnExcel1 = true;
    const commissionsProcessServiceConst: any =
      await this.commissionsProcessServiceFunct(obj);

    if (commissionsProcessServiceConst.status == 200) {
      this.loadingBtnExcel1 = false;
      this.rowsSelectedGetComissions(this.comerComCalculated);
      this.alert(
        'success',
        'Proceso Terminado Correctamente',
        commissionsProcessServiceConst.message
      );
    } else {
      this.loadingBtnExcel1 = false;
      this.rowsSelectedGetComissions(this.comerComCalculated);
      this.alert(
        'warning',
        'Ha ocurrido un error',
        commissionsProcessServiceConst.message
      );
    }
  }

  async questionDelete(data: any) {
    console.log(data);

    if (await this.returnCommisionXGood(data)) {
      this.alert(
        'warning',
        'No puede eliminar el registro',
        'Tiene comisiones relacionadas'
      );
      return;
    }

    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.comerComCalculatedService.deleteW(data.comCalculatedId).subscribe({
          next: response => {
            this.getComCalculated();
            this.alert('success', 'Registro eliminado correctamente', '');
            console.log('res', response);
          },
          error: err => {
            this.alert('error', 'Error al eliminar el registro', '');
          },
        });
      }
    });
  }

  async returnCommisionXGood(comerComCalculated: any) {
    return new Promise((resolve, reject) => {
      this.comerCommissionsPerGoodService
        .getFilter(comerComCalculated.comCalculatedId)
        .subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
    });
  }

  async commissionsProcessServiceFunct(body: any) {
    return new Promise((resolve, reject) => {
      this.commissionsProcessService
        .comissionCentralCoordinate(body)
        .subscribe({
          next: response => {
            console.log('resp', response);
            let obj = {
              status: 200,
              message: response.message[0],
            };
            resolve(obj);
          },
          error: error => {
            console.log('err', error);
            let obj = {
              status: error.status,
              message: error.error.message[0],
            };
            resolve(obj);
          },
        });
    });
  }
}
