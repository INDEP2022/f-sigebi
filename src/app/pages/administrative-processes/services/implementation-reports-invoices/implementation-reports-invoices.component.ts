import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  IMPLEMENTATION_COLUMNS,
  INVOICE_COLUMNS,
} from './implementation-reports-invoices-columns';

@Component({
  selector: 'app-implementation-reports-invoices',
  templateUrl: './implementation-reports-invoices.component.html',
  styles: [],
})
export class ImplementationReportsInvoicesComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };
  invoiceDetailsForm: ModelForm<any>;
  delegationForm: ModelForm<any>;
  data1: any[] = [];
  data2: any[] = [];
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  billId: boolean | null = null;
  estado: boolean | null = null;
  application: boolean | null = null;
  data = new LocalDataSource();
  strategy = new LocalDataSource();
  proceduralHistoryForm: ModelForm<any>;
  statusDict: any;
  selectedRow: any;
  disponible: string;
  cantidad: any;
  status: boolean = false;
  report: any;
  lnu_folio: number;
  t_reportes: string;
  expediente: number;

  constructor(
    private fb: FormBuilder,
    private msInvoiceService: MsInvoiceService,
    private authService: AuthService,
    private strategyProcessService: StrategyProcessService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService
  ) {
    super();
    this.settings.columns = IMPLEMENTATION_COLUMNS;
    this.settings.actions = false;
    this.settings.rowClassFunction = (row: { data: { status: any } }) =>
      row.data.status != null
        ? row.data.status === 'AUTORIZADA'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...IMPLEMENTATION_COLUMNS },
    };
    this.settings2.columns = INVOICE_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
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
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'cveReport':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fecAuthorizes':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fecCapture':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'observations':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.DelegationI();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.DelegationI());
  }
  private prepareForm() {
    this.invoiceDetailsForm = this.fb.group({
      invoice: [null, Validators.required],
      dateInvoice: [null, Validators.required],
      quantity: [null, Validators.required],
      status: [null, Validators.required],
      captureDate: [null, Validators.required],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      scanFolio: [null],
    });
    this.delegationForm = this.fb.group({
      number: [null, Validators.required],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.proceduralHistoryForm = this.fb.group({
      delegation: [null, [Validators.required]],
    });
  }
  validNoInvoice(No: string | number) {
    this.msInvoiceService.getByNoInvoice(No).subscribe({
      next: response => {
        if (response.count > 0) {
          this.billId = true;
        } else {
          this.billId = false;
        }
      },
      error: error => {
        console.error('Error en la llamada al servicio:', error);
        this.billId = false;
      },
    });
  }

  onInvoiceInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.validNoInvoice(inputValue);
  }
  onInvoiceInputChangeestate(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.isStatusFieldNull();
  }

  isStatusFieldNull() {
    const statusControl = this.invoiceDetailsForm.get('status');
    this.estado = statusControl ? statusControl.value === null : true;
    if ((this.estado = true)) {
      console.log('es null');
    } else {
      this.estado = false;
    }
  }

  validApplication() {
    if ((this.billId = false) && (this.estado = false)) {
      this.application = true;
    } else {
      this.application = false;
    }
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    if (this.selectedRow.status == 'AUTORIZADA') {
      this.status = true;
    } else {
      this.status = false;
    }
    this.getAmount(this.selectedRow.no_reporte);
  }

  DelegationI() {
    this.data1 = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    const model = {} as IAccountMovement;
    let token = this.authService.decodeToken();
    model.userinsert = token.name.toUpperCase();
    console.log('Token: ', token.name.toUpperCase());
    let iddelegation = this.proceduralHistoryForm.value.delegation;
    console.log('Delegacion', iddelegation);
    this.strategyProcessService
      .getByDelegation(iddelegation, params)
      .subscribe({
        next: response => {
          let lista = [];
          this.totalItems = response.count;
          for (let i = 0; i < response.data.length; i++) {
            const autoriza = new Date(response.data[i].fec_autoriza);
            const formattedfec_autoriza = this.formatDate(autoriza);

            const Capture = new Date(response.data[i].fec_captura);
            const formattedfecCapture = this.formatDate(Capture);

            console.log('fecha: ', response.data[i].fec_autoriza);
            let dataForm = {
              cveReport: response.data[i].cve_reporte,
              status: response.data[i].estatus,
              fecAuthorizes: formattedfec_autoriza,
              fecCapture: formattedfecCapture,
              observations: response.data[i].observaciones,
              no_reporte: response.data[i].no_reporte,
              no_formato: response.data[i].no_formato,
            };
            this.disponible = 'S';
            console.log('pppp ', response.data[i].cve_reporte);
            this.data1.push(dataForm);
            this.data.load(this.data1);
            this.data.refresh();
          }
        },
      });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getAmount(id: number) {
    console.log('id ', id);
    this.strategyProcessService.getByNoReport(id).subscribe({
      next: response => {
        console.log('prueba: ', response.data[0].totalAmount);
        this.cantidad = response.data[0].totalAmount;
      },
    });
  }

  addSelect() {
    if (this.selectedRow == null) {
      this.onLoadToast('error', 'Debe seleccionar un registro');
      return;
    } else {
      let dataForm = {
        cveReport: this.selectedRow.cveReport,
        status: this.selectedRow.status,
        observations: this.selectedRow.observations,
        quantity: this.cantidad,
        no_report: this.selectedRow.no_reporte,
        no_formato: this.selectedRow.no_formato,
      };
      this.data2.push(dataForm);
      this.strategy.load(this.data2);
    }
  }

  removeSelect() {
    if (this.statusDict == 'DICTAMINADO') {
      this.onLoadToast(
        'error',
        'El bien ya esta Dictaminado... Imposible borrar'
      );
      return;
    }
  }

  Application() {
    console.log('Data 2 ', this.data2);
    for (let i = 0; i < this.data2.length; i++) {
      if (this.data2[i].cveReport != null) {
        this.report = this.data2[i].cveReport;
        this.detailProceeDelRecService.getReport(this.report).subscribe({
          next: response => {
            this.expediente = response.data.max;
          },
        });
        this.t_reportes =
          this.t_reportes + this.data2[i].cveReport + this.data2[i].quantity;
      } else {
        return;
      }
      this.documentsDictumStatetMService.getSeqDocument().subscribe({
        next: response => {
          this.lnu_folio = response.data;
        },
      });
      const item = {
        FOLIO_UNIVERSAL: this.lnu_folio,
        NO_EXPEDIENTE: this.expediente,
        CVE_SEPARADOR: '60',
        CVE_TIPO_DOCUMENTO: 'ESTIMP',
        NATURALEZA_DOCUMENTO: 'ORIGINAL',
        DESCRIPCION_DOCUMENTO: 'FACTURA',
      };
      //this.documentsTypeService.postDocument().subscribe({});
    }
  }
}
