/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IDepositaryAppointments,
  IPersonsModDepositary,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IPaymentsGensDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { ConciliationDepositaryPaymentsService } from '../../conciliation-depositary-payments/services/conciliation-depositary-payments.service';
import { DataConfigurationModalComponent } from '../data-configuration-modal/data-configuration-modal.component';
import { ERROR_GOOD_PARAM } from '../utils/conciliation-depositary-payments.messages';
import { TABLE_SETTINGS_1 } from './dispersal-depositary-payments-columns';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-dispersal-depositary-payments',
  templateUrl: './dispersal-depositary-payments.component.html',
  styleUrls: ['./dispersal-depositary-payments.component.scss'],
})
export class DispersalDepositaryPaymentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // CONCILIACIÓN DE PAGOS
  public form: FormGroup;
  public formDepositario: FormGroup;
  public noBienReadOnly: number = null;
  depositaryAppointment: IDepositaryAppointments;
  good: IGood;
  dataPagosRecibidos: IPaymentsGensDepositary[] = [];
  dataPersonsDepositary: IPersonsModDepositary;
  screenKey: string = 'FCONDEPOCONDISPAG';
  origin: string = null;
  noBienParams: number = null;
  // Dispersion de pagos
  dataTable: LocalDataSource = new LocalDataSource();
  dataTableParams = new BehaviorSubject<ListParams>(new ListParams());
  total: number = 0;
  testData: any[] = [];
  columnFilters: any = [];
  //
  TABLE_SETTINGS = TABLE_SETTINGS_1;
  P_CONTRA: string = '';
  P_FECHA: string = '';
  P_PERSONA: string = '';
  P_APPOINTMENT: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private personService: PersonService,
    private msMsDepositaryPaymentService: MsDepositaryPaymentService,
    private svConciliationDepositaryPaymentsService: ConciliationDepositaryPaymentsService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.noBienParams = params['p_nom_bien']
          ? Number(params['p_nom_bien'])
          : null;
        this.P_CONTRA = params['P_CONTRA'] ?? null;
        this.P_FECHA = params['P_FECHA'] ?? null;
        this.P_PERSONA = params['P_PERSONA'] ?? null;
        this.P_APPOINTMENT = params['P_APPOINTMENT'] ?? null;
        this.origin = params['origin'] ?? null;
        console.log(params);
      });
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      if (!isNaN(Number(id))) {
        this.noBienReadOnly = Number(id);
        // this.form.get('noBien').setValue(this.noBienReadOnly);
        this.loadingDataTable();
      } else {
        this.loading = false;
        this.alert('warning', 'No. Bien', ERROR_GOOD_PARAM);
      }
    } else {
      this.loading = false;
    }
  }

  loadingDataTable() {
    //Filtrado por columnas
    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              email: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.dataTableParams = this.pageFilter(this.dataTableParams);
          //Su respectivo metodo de busqueda de datos
          this.getData();
        }
      });

    // this.columnFilters['filter.originId'] = `$eq:${this.originId}`;
    //observador para el paginado
    this.dataTableParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.dataTableParams.getValue(),
      ...this.columnFilters,
    };
    console.log('PARAMS ', params);
    this.msMsDepositaryPaymentService.getTmpPagosGensDep(params).subscribe({
      next: res => {
        console.log('DATA ', res);
        this.testData = res.data.map((i: any) => {
          i['statusDep'] = i.status;
          i['reconocimiento'] =
            '' + i.xcentdedu == null
              ? '0/' + Number(i.paymentAct) * (i.xcentdedu / 100) ?? '0'
              : i.xcentdedu == null
              ? '0/' + Number(i.paymentAct) * (i.xcentdedu / 100) ?? '0'
              : i.xcentdedu +
                  '/' +
                  Number(i.paymentAct) * (i.xcentdedu / 100) ?? '0';
          return i;
        });
        this.dataTable.load(this.testData);
        this.total = res.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.testData = [];
        this.dataTable.load([]);
        this.total = 0;
        this.loading = false;
      },
    });
  }

  editData(event: any) {
    console.log('EDITAR ', event);
    if (event) {
      this.openModalData({
        provider: event.data,
        edit: true,
        P_CONTRA: Number(this.P_CONTRA),
      });
    }
  }

  openModalData(context?: Partial<DataConfigurationModalComponent>) {
    const modalRef = this.modalService.show(DataConfigurationModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTable();
    });
  }

  async execDeductions() {
    if (this.testData.length == 0) {
      this.alert('warning', 'No se tienen registros para procesar', '');
      return;
    }
    let date = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    console.log(new Date(), date);
    let params: any = {
      pOne: Number(this.P_APPOINTMENT),
      pTwo: this.P_PERSONA,
      pDate: date,
    };
    console.log(params);
    this.loading = true;
    await this.svConciliationDepositaryPaymentsService
      .execDeductions(params)
      .subscribe({
        next: res => {
          console.log(res.data);
          this.loading = false;
          this.alert('success', 'El Proceso se ha completado', '');
          this.loadingDataTable();
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Dispersión de pagos',
            'Error al procesar la dispersión de pagos'
          );
        },
      });
  }

  async insertDispersionDB() {
    if (this.testData.length == 0) {
      this.alert('warning', 'No se tienen registros para procesar', '');
      return;
    }
    let params: any = {
      pOne: Number(this.P_APPOINTMENT),
      pTwo: null,
    };
    this.loading = true;
    await this.svConciliationDepositaryPaymentsService
      .insertDispersionDB(params)
      .subscribe({
        next: res => {
          console.log(res.data);
          this.loading = false;
          this.alert('success', 'El Proceso se ha completado', '');
          this.loadingDataTable();
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Dispersión de pagos',
            'Error al procesar la dispersión de pagos'
          );
        },
      });
  }

  goBack() {
    if (this.origin == 'FCONDEPOCONCILPAG') {
      const value = this.noBienParams ? this.noBienParams : this.noBienReadOnly;
      this.router.navigate([
        '/pages/juridical/depositary/payment-dispersion-process/conciliation-depositary-payments/' +
          value,
      ]);
    }
  }
}
