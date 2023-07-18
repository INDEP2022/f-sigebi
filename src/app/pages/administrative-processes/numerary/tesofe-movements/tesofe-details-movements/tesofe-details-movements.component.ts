import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IAccountMovement,
  IDetailAccountMovement,
  IMovementDetail,
  IPupInterestsDetail,
} from 'src/app/core/models/ms-account-movements/account-movement.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankAccount } from '../list-banks/bank';
import { DET_MOV_COLUMNS } from './columns-listDetail';

@Component({
  selector: 'app-tesofe-details-movements',
  templateUrl: './tesofe-details-movements.component.html',
  styles: [],
})
export class TesofeDetailsMovementsComponent
  extends BasePage
  implements OnInit
{
  banks = new DefaultSelect<any>();
  data: BankAccount = {} as BankAccount;
  no_cuenta: number;
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  details: IDetailAccountMovement;
  di_puntos_extras: any;
  di_dias_x_anio: any;
  additionalData: any;
  descMoneda: any;
  total: number = 0;
  source: LocalDataSource = new LocalDataSource();
  data2 = new LocalDataSource();
  columnFilters: any = [];

  detailsMovement: IMovementDetail[] = [];

  constructor(
    private accountService: BankAccountService,
    private changeDetectorRef: ChangeDetectorRef,
    private modal: BsModalRef,
    private goodParametersService: GoodParametersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: DET_MOV_COLUMNS,
    };
    this.source.load(this.detailsMovement);
    //console.log('Data modal -> ', this.details);
  }

  ngOnInit(): void {
    //console.log("Data modal -> ",this.details);
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'periodo':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dias':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'Tasa':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'Importe':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getParameterByDetails();
        }
      });
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.source) this.getParameterByDetails();
      },
    });

    //this.getParameterByDetails();
  }

  getParameterByDetails() {
    this.loading = true;
    const param = 'TASAPROYEC';
    this.goodParametersService.getById(param).subscribe({
      next: resp => {
        //this.di_puntos_extras = resp.initialValue;
        this.di_puntos_extras =
          resp.initialValue !== undefined ? resp.initialValue : 0;

        //console.log('TASAPROYEC -> ', this.di_puntos_extras);
        this.getParameterByDetails2();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getParameterByDetails2() {
    this.loading = true;
    const param = 'DIASCALINT';
    this.goodParametersService.getById(param).subscribe({
      next: resp => {
        this.di_dias_x_anio = resp.initialValue;
        //console.log('DIASCALINT -> ', this.di_dias_x_anio);
        this.pupInterestsDetail();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  selectItem(data: any) {
    //this.data = data;
  }

  sendData() {
    if (this.data.cve_banco) {
      this.modal.content.callback(true, this.data);
      this.modal.hide();
    } else {
      this.onLoadToast('info', 'Debe seleccionar un detalle primero', '');
    }
  }

  close() {
    this.modal.hide();
  }

  pupInterestsDetail() {
    const model = {} as IPupInterestsDetail;
    model.pAmount = this.additionalData.selectedRow['deposit'];
    model.pDateToday = String(new Date());
    model.pDateStartMov = this.additionalData.selectedRow['dateMotion'];
    model.pMoneyDi = this.descMoneda;
    model.pCalculationRate =
      this.additionalData.selectedRow.accountNumber['cveInterestCalcRate'];
    model.pBonusPoints = parseInt(this.di_puntos_extras) ?? 0;
    model.pDayxAnio = parseInt(this.di_dias_x_anio) ?? 0;
    console.log(' msg pup details', model);

    this.accountService.pupInterestsDetail(model).subscribe({
      next: response => {
        let aux = 0;
        for (let i = 0; response.data.length; i++) {
          if (response.data[i] != undefined) {
            aux++;
            let item = {
              periodo: this.additionalData.selectedRow['dateMotion'], //response.data[i].di_periodo_x as any,
              dias: response.data[i].di_dias_x,
              Tasa: response.data[i].di_tasa_x,
              importe: response.data[i].di_monto_x,
            };
            this.detailsMovement.push(item);
            this.changeDetectorRef.detectChanges();
          } else {
            this.source.load(this.detailsMovement);
            this.source.refresh();
            break;
          }
        }
        this.total = aux;
        this.data2.load(this.detailsMovement);
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
        //this.close();
      },
    });
  }
}
