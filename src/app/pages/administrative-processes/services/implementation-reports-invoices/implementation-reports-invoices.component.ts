import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
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
  @ViewChild('mySmartTable') mySmartTable: any;
  settings2 = { ...this.settings, ...TABLE_SETTINGS, actions: false };
  invoiceDetailsForm: ModelForm<any>;
  delegationForm: ModelForm<any>;
  dataany: any[] = [];
  box: any[] = [];
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsFac = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  billId: boolean | null = null;
  estado: boolean | null = null;
  application: boolean | null = null;
  data = new LocalDataSource();
  strategy = new LocalDataSource();
  proceduralHistoryForm: ModelForm<any>;
  statusDict: any;
  selectedRow: any = null;
  deleteselectedRow: any;
  disponible: string;
  cantidad: any;
  status: boolean = false;
  report: any;
  descripcion: any;
  lnu_folio: number = null;
  t_reportes: string;
  expediente: number;
  zone: any;
  factura: any;
  iddelegation: any;
  idsubdelegation: any;
  datos: any;
  loadingDoc: boolean = false;
  no_report: any;
  bool: boolean = true;
  flagsol: boolean = false;
  totalValue: number = 0;
  folioScan: number;
  contador: number;
  constructor(
    private fb: FormBuilder,
    private strategyProcessService: StrategyProcessService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    private departamentService: DepartamentService,
    private jasperService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService,
    private msInvoiceService: MsInvoiceService
  ) {
    super();
    this.settings.columns = IMPLEMENTATION_COLUMNS;
    this.settings.rowClassFunction = (row: { data: { status: any } }) =>
      row.data.status != null
        ? row.data.status === 'AUTORIZADA'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
              case 'cve_reporte':
                searchFilter = SearchFilter.ILIKE;
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
      subdelegation: [null, [Validators.required]],
      total: [null],
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
  seleccionarSubDelegacion(subdelegacion: any) {
    this.descripcion = subdelegacion.description;
    let iddelegation = this.proceduralHistoryForm.value.delegation;
    this.departament(iddelegation, this.descripcion);
  }

  deleteRowSelect(event: any) {
    this.deleteselectedRow = event.data;
  }

  DelegationI() {
    this.dataany = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    const model = {} as IAccountMovement;
    let token = this.authService.decodeToken();
    model.userinsert = token.name.toUpperCase();
    console.log('Token: ', token.name.toUpperCase());
    this.iddelegation = this.proceduralHistoryForm.value.delegation;
    this.idsubdelegation = this.proceduralHistoryForm.value.subdelegation;
    console.log('Delegacion', this.iddelegation);
    console.log('subdelegacion ', this.idsubdelegation);
    this.strategyProcessService
      .getByDelegation(this.iddelegation, params)
      .subscribe({
        next: response => {
          let lista = [];
          this.totalItems = response.count;
          for (let i = 0; i < response.data.length; i++) {
            const autoriza = new Date(response.data[i].fec_autoriza);
            const formattedfec_autoriza = this.formatDate(autoriza);

            const Capture = new Date(response.data[i].fec_captura);
            const formattedfecCapture = this.formatDate(Capture);
            console.log('prueba: ', response.data[0]);
            let dataForm = {
              cveReport: response.data[i].cve_reporte,
              status: response.data[i].estatus,
              fecAuthorizes: formattedfec_autoriza,
              fecCapture: formattedfecCapture,
              observations: response.data[i].observaciones,
              no_reporte: response.data[i].no_reporte,
              no_formato: response.data[i].no_formato,
              delegation: this.iddelegation,
              subdelegation: this.idsubdelegation,
            };
            this.disponible = 'S';
            this.dataany.push(dataForm);
            this.data.load(this.dataany);
            this.data.refresh();
          }
        },
      });
  }

  departament(id: number, description: string) {
    this.departamentService.getbyDelegation(id, description).subscribe({
      next: response => {
        this.zone = response.data[0].id;
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
        console.log('prueba: ', response.data[0].sum);
        this.cantidad = response.data[0].sum;
      },
    });
  }

  addSelect() {
    console.log('Selected Row: ->', this.selectedRow);
    this.box = this.box;
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
        delegation: this.selectedRow.delegation,
        subdelegation: this.selectedRow.subdelegation,
        zona: this.zone,
      };
      console.log('Prueba: ', dataForm);
      this.box.push(dataForm);
      this.strategy.load(this.box);
      this.selectedRow = null;
      this.clearSelection();
      this.countFacture();
      this.flagsol = true;
      this.countRowTotal();
      this.status = false;
    }
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  removeSelect() {
    if (this.deleteselectedRow == null) {
      this.onLoadToast('error', 'Debe seleccionar un registro');
      return;
    } else {
      console.log('selected Row: ', this.deleteselectedRow);
      this.strategy.remove(this.deleteselectedRow);
      this.strategy.remove(this.box);
      this.contador = 0;
      this.countRowTotal();
      this.clearSelection();
      this.countFacture();
      this.box = [];
    }
  }
  /*
    Application() {
      console.log('Data 2 ', this.data2);
      for (let i = 0; i < this.data2.length; i++) {
        if (this.data2[i].cveReport != null) {
          this.report = this.data2[i].no_report;
          this.detailProceeDelRecService.getReport(this.report).subscribe({
            next: response => {
              this.expediente = response.data[0].max;
              console.log("expediente ", this.expediente);
            },
          });
          this.expediente = this.expediente;
          this.t_reportes = this.data2[i].cveReport + ' ' + this.data2[i].quantity;
        }
        this.documentsDictumStatetMService.getSeqDocument().subscribe({
          next: response => {
            this.lnu_folio = response.data;
          },
        });
        this.factura = this.invoiceDetailsForm.get('invoice').value;
        const item = {
          fileNumber: this.expediente,
          reports: 'FACTURA ' + this.factura + '  REPORTES: ' + this.t_reportes,
          fractureId: this.factura,
          delegationNumber: this.data2[i].delegation,
          subDelegationNumber: this.data2[i].subdelegation,
          departamentNumber: this.data2[i].zona,
        };
        console.log("PRUEBA:  -> ", item)
        //this.documentsTypeService.postDocument().subscribe({});
      }
    }
  */
  ObtenerFolio() {
    this.documentsDictumStatetMService.getSeqDocument().subscribe({
      next: response => {
        this.lnu_folio = response;
      },
    });
  }

  async Application() {
    console.log('Data 2 ', this.box);
    this.ObtenerFolio();
    for (let i = 0; i < this.box.length; i++) {
      this.bool = false;
      let cantidad = this.invoiceDetailsForm.get('quantity').value;
      console.log('Cantidad: ', cantidad);
      if (this.box[i].cveReport != null) {
        if (cantidad > this.totalValue) {
          this.report = this.box[i].no_report;
          try {
            const response = await this.detailProceeDelRecService
              .getReport(this.report)
              .toPromise();
            this.expediente = response.data[0].max;
            this.factura = this.invoiceDetailsForm.get('invoice').value;
            this.t_reportes =
              this.box[i].cveReport + ' ' + this.box[i].quantity;
            const item = {
              fileNumber: this.expediente,
              reports:
                'FACTURA ' + this.factura + '  REPORTES: ' + this.t_reportes,
              fractureId: this.factura,
              delegationNumber: this.box[i].delegation,
              subDelegationNumber: this.box[i].subdelegation,
              departamentNumber: this.box[i].zona,
              reportNumber: this.box[i].no_report,
              folioUniversal: this.lnu_folio,
            };
            console.log('PRUEBA:  -> ', this.no_report);

            this.documentsDictumStatetMService.postPupFol(item).subscribe({
              next: response => {
                console.log('Succefull2: ', response);
                this.invoiceDetailsForm.patchValue({
                  scanFolio: response.message,
                });
                this.folioScan = response.message;
                console.log('folio ', this.folioScan);
              },
            });
          } catch (error) {
            console.error('Error al obtener el reporte:', error);
            this.bool = true;
          }
        } else {
          this.alert(
            'error',
            'La cantidad no puede ser menor que el total el Total',
            ''
          );
          return;
        }
      }
    }
    console.log('BOOL: ', this.bool);
    if (!this.bool) {
      this.proccesReport();
    }
  }

  proccesReport() {
    if (this.folioScan) {
      const msg = setTimeout(() => {
        this.jasperService
          .fetchReport('RGERGENSOLICDIGIT', { pn_folio: this.folioScan })
          .pipe(
            tap(response => {
              this.alert(
                'success',
                'Generado correctamente',
                'Generado correctamente con folio: ' + this.folioScan
              );
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
              this.loadingDoc = false;
              clearTimeout(msg);
            })
          )
          .subscribe();
      }, 1000);
    } else {
      this.alert(
        'error',
        'ERROR',
        'Debe tener el folio en pantalla para poder reimprimir'
      );
    }
  }

  goToScan() {
    localStorage.setItem('numberExpedient', this.folioScan.toString());
    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin:
          '/pages/administrative-processes/services/implementation-reports-invoices',
        folio: this.folioScan,
      },
    });
  }
  openScannerPage() {
    if (this.invoiceDetailsForm.get('scanFolio').value) {
      this.alertQuestion(
        'info',
        'Se abrirá la pantalla de escaneo para el folio de Escaneo del Dictamen. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          this.router.navigate([`/pages/general-processes/scan-documents`], {
            queryParams: {
              origin: 'FREPIMPFAC_0001',
              folio: this.folioScan,
            },
          });
        }
      });
    } else {
      this.alertInfo(
        'warning',
        'No tiene Folio de Escaneo para continuar a la pantalla de Escaneo',
        ''
      );
    }
  }

  countRowTotal() {
    this.totalValue = 0;
    for (let i = 0; i < this.box.length; i++) {
      this.totalValue += Number(this.box[i].quantity);
    }
    this.totalValue = this.roundPercentage(this.totalValue);
    console.log('LONGITUD: ', this.box.length);
  }

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(1));
  }

  countFacture() {
    this.contador = 0;
    for (let i = 0; i < this.box.length; i++) {
      this.contador++;
    }
  }

  PupFolEscMas(datos: any) {
    this.documentsDictumStatetMService.getSeqDocument().subscribe({
      next: response => {
        this.lnu_folio = response;
        const item = {
          fileNumber: datos.fileNumber,
          folioUniversal: this.lnu_folio,
          reports: datos.reports,
          reportNumber: this.no_report,
          fractureId: datos.fractureId,
          delegationNumber: datos.delegationNumber,
          subDelegationNumber: datos.subDelegationNumber,
          departamentNumber: datos.departamentNumber,
        };
        console.log('Prueba: ', item);
        this.invoiceDetailsForm.patchValue({
          scanFolio: this.lnu_folio,
        });
        this.documentsDictumStatetMService.postPupFol(item).subscribe({
          next: response => {
            console.log('Succefull2: ', response);
            this.proccesReport();
          },
        });
      },
    });
  }
}
