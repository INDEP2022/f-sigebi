import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { InconsistenciesComponent } from '../inconsistencies/inconsistencies.component';
import { RateChangeComponent } from '../rate-change/rate-change.component';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { ExpenseParametercomerService } from '../../expense-capture/services/expense-parametercomer.service';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-tax-validation-calculation',
  templateUrl: './tax-validation-calculation.component.html',
  styles: [],
})
export class TaxValidationCalculationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  avaluos: any[] = [];

  DIRECCION: 'I';

  TIPO_PROCESO: any;
  V_WHERE_IDAVALUO: any;

  V_IVA: any;
  V_NO_COLUM: any;

  V_TMPBIENES_ERROR: any;
  V_TMPAVALUO_ERROR: any;

  columnFilters: any = [];

  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private expenseParametercomerService: ExpenseParametercomerService,
    private authService: AuthService,
    private comerGoodsRejectedService: ComerGoodsRejectedService,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private officeManagementService: OfficeManagementService,
    private appraiseService: AppraiseService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.getValueIva();

    this.filterTable();
    //let token = this.authService.decodeToken();
    let token = 'JBUSTOS';
    if (token == 'JBUSTOS') {
      //Activar botón Confirmar
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      processKey: [null],
      eventDate: [null],
      observations: [null],
      requestDate: [null],
      requestType: [null],
      status: [null],
      reference: [null],
    });
  }

  openModalRateChange(context?: Partial<RateChangeComponent>): void {
    const modalRef = this.modalService.show(RateChangeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      //if (data)
    });
  }

  openModalInconsistencies(context?: Partial<InconsistenciesComponent>): void {
    const modalRef = this.modalService.show(InconsistenciesComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  getValueIva() {
    this.expenseParametercomerService.getParameterMod().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getValueIva-> ', resp);
          this.V_IVA = '0.' + resp.data[0].value;
          console.log('this.V_IVA-> ', this.V_IVA);
        }
      },
      error => {
        console.log('Error al obtener el valor del IVA. ');
      }
    );
  }

  search() {
    this.getComerEvent(this.form.get('eventId').value);

    this.form.get('processKey').patchValue(null);
    this.form.get('eventDate').patchValue(null);
    this.form.get('observations').patchValue(null);
    this.form.get('requestDate').patchValue(null);
    this.form.get('requestType').patchValue(null);
    this.form.get('status').patchValue(null);
    this.form.get('reference').patchValue(null);
  }

  getComerEvent(idEvent: number) {
    this.comerGoodsRejectedService.getComerEvent('I', idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerEvent-> ', resp);
          this.getComerTpEvent(idEvent);
          this.getComerStatusVta(resp.data[0].statusVtaId);
          this.getComerParameterMod(
            idEvent,
            resp.data[0].address,
            resp.data[0].tpsolavalId
          );
          this.getComerJobs(idEvent);
        }
      },
      error => {
        console.log('Error getComerEvent-> ', error);
      }
    );
  }

  getComerTpEvent(idEvent: number) {
    this.comerUsuauTxEventService.getComerTpEvent(idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerTpEvent-> ', resp);
          this.form.get('requestType').patchValue(resp.data[0].description);
        } else {
          this.form.get('requestType').setValue(null);
        }
      },
      error => {
        console.log('Error getComerTpEvent-> ', error);
      }
    );
  }

  getComerStatusVta(statusVta: string) {
    this.expenseParametercomerService.getComerStatusVta(statusVta).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerStatusVta-> ', resp);
          this.form.get('status').patchValue(resp.data[0].description);
        } else {
          this.form.get('status').setValue(null);
        }
      },
      error => {
        console.log('Error getComerStatusVta-> ', error);
      }
    );
  }

  getComerParameterMod(idEvent: number, address: string, tpsolavalId: any) {
    this.expenseParametercomerService
      .getComerParameterMod(idEvent, address, tpsolavalId, 'TP_SOL_AVAL')
      .subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp ComerParameterMod-> ', resp);
            this.form.get('reference').patchValue(resp.data[0].description);
          } else {
            this.form.get('reference').setValue(null);
          }
        },
        error => {
          console.log('Error ComerParameterMod-> ', error);
        }
      );
  }

  getComerJobs(idEvent: number) {
    this.officeManagementService.getComerJobs(1, idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp ComerJobs', resp);
          this.form
            .get('requestDate')
            .patchValue(this.formatDate(new Date(resp.data[0].sendDate)));
        } else {
          this.form.get('requestDate').setValue(null);
        }
      },
      error => {
        console.log('error ComerJobs-> ', error);
      }
    );
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getComerAvaluo() {
    this.avaluos = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //?filter.type=$eq:${type}
    params['filter.type'] = `$eq:I`;
    console.log('params 1 -> ', params);
    this.appraiseService.getComerAvaluo(params).subscribe(
      resp => {
        console.log('Resp comerAvaluo', resp);
        for (let i = 0; i < resp.count; i++) {
          if (resp.data[i] != null && resp.data[i] != undefined) {
            let params = {
              id: resp.data[i].id,
              appraisalKey: resp.data[i].appraisalKey,
              cveOffice: resp.data[i].cveOffice,
              insertDate: this.formatDate(new Date(resp.data[i].insertDate)),
              idEvent: resp.data[i].idEvent,
              noDelegation: resp.data[i].noDelegation,
              noRegister: resp.data[i].noRegister,
              type: resp.data[i].type,
              userInsert: resp.data[i].userInsert,
            };
            this.avaluos.push(params);
            this.data.load(this.avaluos);
            this.data.refresh();
            this.totalItems = resp.count;

            this.getComerDetAvaluo(resp.data[i].id);
          }
        }
      },
      error => {
        console.log('Error comerAvaluo-> ', error);
      }
    );
  }

  filterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                field = 'filter.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'valueKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fileKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateInsert':
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
          this.params = this.pageFilter(this.params);
          this.getComerAvaluo();
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerAvaluo());
  }

  getComerDetAvaluo(appraisal: number) {
    this.appraiseService.getComerDetAvaluo(appraisal, 'CPV').subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp ComerDetAvaluo-> ', resp);
      }
    });
  }
}
