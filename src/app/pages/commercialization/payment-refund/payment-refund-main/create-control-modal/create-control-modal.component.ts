import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
import { ADD_RELATED_EVENT_COLUMNS } from './create-modal-columns';

@Component({
  selector: 'app-create-control-modal',
  templateUrl: './create-control-modal.component.html',
  styles: [],
})
export class CreateControlModalComponent extends BasePage implements OnInit {
  title: string = 'Control de Devolución';
  controlForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onControlAdded = new EventEmitter<boolean>();
  selectedRows: any[] = [];
  totalItems: number = 0;
  controlColumns: any[] = [];
  controlSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  // Control
  dataTableControl: LocalDataSource = new LocalDataSource();
  dataTableParamsControl = new BehaviorSubject<ListParams>(new ListParams());
  loadingControl: boolean = false;
  totalControl: number = 0;
  testDataControl: any[] = [];
  columnFiltersControl: any = [];
  //
  @Input() ind_garant: number = 0;
  @Input() ind_disp: number = 0;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private msPaymentService: PaymentService
  ) {
    super();
    this.controlSettings.columns = ADD_RELATED_EVENT_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.controlForm = this.fb.group({
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      direction: [null],
      dispersionType: [null],
      origin: [null],
      // events: this.fb.array([null]),
    });
    setTimeout(() => {
      if (this.ind_disp == 1) {
        this.controlForm.get('origin').setValue('2');
      }
      if (this.ind_garant == 1) {
        this.controlForm.get('origin').setValue('1');
      }
      if (this.ind_disp != 0 || this.ind_garant != 0) {
        this.controlForm.get('direction').setValue('M');
        this.controlForm.get('dispersionType').setValue('1');
      }
      this.loadingDataTableControl();
    }, 300);
  }

  search() {
    // this.controlColumns = this.eventsTestData;
    // this.totalItems = this.controlColumns.length;

    // if (this.controlForm.invalid) {
    //   return;
    // }
    let params = {
      dispTypeId: this.controlForm.get('dispersionType').value,
      originId: this.controlForm.get('origin').value,
      direction: this.controlForm.get('direction').value,
    };
    this.msPaymentService.getDataFromView(params).subscribe({
      next: res => {
        console.log('DATA Control', res);
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  select(rows: any[]) {
    this.selectedRows = rows;
    console.log(this.selectedRows);
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    if (this.controlForm.invalid) {
      this.alert('warning', 'Ingresa una clave', '');
      return;
    }
    let confirm = await this.alertQuestion(
      'question',
      'Control de devoluciones',
      '¿Desea generar el control de devoluciones?'
    );
    if (confirm.isConfirmed) {
      // PETICIONES AL REQUERIMIENTO FCOMERCTLDPAG-3
      this.handleSuccess();
    } else {
      this.handleSuccess();
    }
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onControlAdded.emit(true);
    this.modalRef.hide();
  }

  loadingDataTableControl() {
    //Filtrado por columnas
    this.dataTableControl
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
              id: () => (searchFilter = SearchFilter.EQ),
              key: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersControl[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersControl[field];
            }
          });
          this.dataTableParamsControl = this.pageFilter(
            this.dataTableParamsControl
          );
          //Su respectivo metodo de busqueda de datos
          this.getControlData();
        }
      });
    //observador para el paginado
    this.dataTableParamsControl
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getControlData());
  }

  getControlData() {
    this.loadingControl = true;
    let params = {
      ...this.dataTableParamsControl.getValue(),
      ...this.columnFiltersControl,
    };
    this.testDataControl = [
      {
        id: 1,
        key: 'KEY1',
        quantity: 1,
        amount: 10,
      },
      {
        id: 2,
        key: 'KEY2',
        quantity: 2,
        amount: 20,
      },
      {
        id: 3,
        key: 'KEY3',
        quantity: 3,
        amount: 30,
      },
      {
        id: 4,
        key: 'KEY4',
        quantity: 4,
        amount: 40,
      },
      {
        id: 5,
        key: 'KEY5',
        quantity: 5,
        amount: 50,
      },
    ];
    // CONSULTAR DEL REQUERIMIENTO FCOMERCTLDPAG-2
    // this.svPaymentDevolutionService.getCtlDevPagP(params).subscribe({
    //   next: (res: any) => {
    //     console.log('DATA Control', res);
    //     this.testDataControl = res.data;
    this.dataTableControl.load(this.testDataControl);
    this.loadingControl = false;
    //   },
    //   error: error => {
    //     console.log(error);
    //     this.testDataControl = [];
    //     this.dataTableControl.load([]);
    //     this.loadingControl = false;
    //   },
    // });
  }
}
