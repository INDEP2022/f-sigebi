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
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { IApplicationFComerCtldPag3 } from 'src/app/core/services/ms-payment/payment-service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
@Component({
  selector: 'app-create-control-modal',
  templateUrl: './create-control-modal.component.html',
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
    // selectMode: 'multi',
  };
  // Control
  dataTableControl: LocalDataSource = new LocalDataSource();
  dataTableParamsControl = new BehaviorSubject<ListParams>(new ListParams());
  loadingControl: boolean = false;
  totalControl: number = 0;
  columnFiltersControl: any = [];
  //
  @Input() ind_garant: number = 0;
  @Input() ind_disp: number = 0;

  selectedbillings: any[] = [];
  selectEventsCheck: any[] = [];

  btnLoading: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private msPaymentService: PaymentService,
    private goodprocessService: GoodprocessService
  ) {
    super();
    this.controlSettings.hideSubHeader = false;
    this.controlSettings.columns = {
      selection: {
        filter: false,
        sort: false,
        title: 'Selección',
        type: 'custom',
        showAlways: true,
        width: '10%',
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isBillingDetSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onBillingDetSelect(instance),
      },
      eventId: {
        title: 'Id. Evento',
        type: 'number',
        sort: false,
        width: '15%',
      },
      processKey: {
        title: 'Clave',
        type: 'string',
        sort: false,
        width: '35%',
      },
      cantPayments: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
        width: '20%',
      },
      amountPayments: {
        title: 'Monto',
        type: 'html',
        sort: false,
        width: '20%',
        valuePrepareFunction: (amount: string) => {
          const numericAmount = parseFloat(amount);

          if (!isNaN(numericAmount)) {
            const a = numericAmount.toLocaleString('en-US', {
              // style: 'currency',
              // currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return '<p class="cell_right">' + a + '</p>';
          } else {
            return amount;
          }
        },
        filterFunction(cell?: any, search?: string): boolean {
          return true;
        },
      },
    };
  }

  onBillingDetSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingDetSelectedChange(data.row, data.toggle),
    });
  }
  isBillingDetSelected(data: any) {
    const exists = this.selectEventsCheck.find(
      (item: any) => item.eventId == data.eventId
    );
    return !exists ? false : true;
  }
  billingDetSelectedChange(data: any, selected: boolean) {
    const { origin } = this.controlForm.value;
    if (selected) {
      this.selectEventsCheck.push(data);
      for (const data of this.selectEventsCheck) {
        if (origin == 2) {
          this.controlForm.get('key').setValue(data.processKey);
          this.controlForm.get('txtBan').setValue(1);
        }
      }
    } else {
      this.selectEventsCheck = this.selectEventsCheck.filter(
        (item: any) => item.eventId != data.eventId
      );
      if (origin == 2) {
        this.controlForm.get('key').setValue('');
        this.controlForm.get('txtBan').setValue(0);
      }
    }
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
      txtBan: [null],
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
    this.btnLoading = true;
    let params = {
      dispTypeId: this.controlForm.get('dispersionType').value,
      originId: this.controlForm.get('origin').value,
      direction: this.controlForm.get('direction').value,
    };
    this.msPaymentService.getDataFromView(params).subscribe({
      next: res => {
        if (res.data == 0) {
          this.alert('warning', 'No se tienen Eventos con este criterio.', '');
          this.btnLoading = false;
        } else {
          this.controlForm.get('key').setValue('');
          this.controlForm.get('txtBan').setValue('0');
          this.getControlData('si');
        }
      },
      error: error => {
        this.alert('warning', 'No se tienen Eventos con este criterio.', '');
        this.btnLoading = false;
      },
    });
  }
  select(event: any) {}
  close() {
    this.modalRef.hide();
  }

  async confirm() {
    const { key } = this.controlForm.value;
    const data = await this.dataTableControl.getAll();
    // let c_REL_EVENTOS: string = '';
    if (!key) {
      this.alert('warning', 'Debe especificar la Clave', '');
      return;
    }

    if (data.length == 0)
      return this.alert('warning', 'No se tienen Eventos a relacionar.', '');

    if (this.selectEventsCheck.length == 0) {
      this.alert('warning', 'No se seleccionó al menos un Evento.', '');
    }
    let arrayEvents = [];
    let result = this.selectEventsCheck.map(item => {
      arrayEvents.push(item.eventId);
    });

    Promise.all(result).then(resp => {
      this.alertQuestion(
        'question',
        'Se generará el control de devoluciones',
        '¿Desea continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          // PETICIONES AL REQUERIMIENTO FCOMERCTLDPAG-3
          this.createControlDevolutions(arrayEvents);
        }
      });
    });
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
              eventId: () => (searchFilter = SearchFilter.EQ),
              processKey: () => (searchFilter = SearchFilter.ILIKE),
              cantPayments: () => (searchFilter = SearchFilter.EQ),
              amountPayments: () => (searchFilter = SearchFilter.EQ),
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
          this.getControlData('no');
        }
      });
    //observador para el paginado
    this.dataTableParamsControl
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.totalControl > 0) this.getControlData('no');
      });
  }

  getControlData(filter: string) {
    this.loadingControl = true;
    let params = {
      ...this.dataTableParamsControl.getValue(),
      ...this.columnFiltersControl,
    };
    this.loadingControl = false;
    const { dispersionType, origin, direction } = this.controlForm.value;
    params['filter.typeDisp'] = `$eq:${dispersionType}`;
    params['filter.address'] = `$eq:${direction}`;
    params['filter.originId'] = `$eq:${origin}`;
    this.goodprocessService.getvwComerPaymentsReturn(params).subscribe({
      next: (res: any) => {
        console.log('DATA Control', res);
        this.totalControl = res.count;
        this.dataTableControl.load(res.data);
        this.dataTableControl.refresh();
        this.loadingControl = false;
        if (filter == 'si') {
          this.btnLoading = false;
        }
      },
      error: error => {
        console.log(error);
        this.dataTableControl.load([]);
        this.dataTableControl.refresh();
        this.totalControl = 0;
        this.loadingControl = false;
        if (filter == 'si') {
          this.btnLoading = false;
        }
      },
    });
  }
  createControlDevolutions(arrayEvents: any) {
    console.log(this.controlForm.value);
    let params: IApplicationFComerCtldPag3 = {
      dispTypeId: this.controlForm.get('dispersionType').value,
      originId: this.controlForm.get('origin').value,
      direction: this.controlForm.get('direction').value,
      ctldevpagKey: this.controlForm.get('key').value,
      cRelEvents: arrayEvents,
    };
    this.svPaymentDevolutionService.getFComerCtldPag3(params).subscribe({
      next: (res: any) => {
        this.alert('success', res.message[0], '');
        this.onControlAdded.emit(true);
        this.close();
        console.log('Crear control', res);
      },
      error: error => {
        this.alert(
          'warning',
          'No se pudo generar el control de devoluciones',
          ''
        );
        console.log(error);
      },
    });
  }
}
