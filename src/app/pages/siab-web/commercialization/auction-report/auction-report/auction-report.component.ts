import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AUCTION_REPORT_COLUMNS } from './auction-report-columns';

@Component({
  selector: 'app-auction-report',
  templateUrl: './auction-report.component.html',
  styles: [],
})
export class auctionReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formReport: FormGroup = new FormGroup({});
  showLiquidacion = false;
  showGarantia = false;
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: true,
      columns: { ...AUCTION_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareFormReport();
    this.prepareFormFilter();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      filter01: [null, []],
      filter02: [null, []],
      filter03: [null, []],
      filter04: [null, []],
    });
  }

  private prepareFormFilter() {
    this.formReport = this.fb.group({
      nameReport: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  private prepareFormReport() {
    this.formReport = this.fb.group({
      nameReport: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  data = [
    {
      allotment: 159,
      discountLot: '15%',
      type: 'Subasta',
      amount: '$123,123.00',
      validity: '20/02/2025',
      captureLine: '32132416549462136',
      status: 'Disponible',
      client: 'Juan Trejo Ramirez',
      rfc: 'XXXX0000',
      idClient: 645,
      discount: 'N/A',
    },
    {
      allotment: 987,
      discountLot: '5%',
      type: 'Venta',
      amount: '$654,321.00',
      validity: '18/02/2028',
      captureLine: '987946131654613',
      status: 'Disponible',
      client: 'Maria Cervantes Martinez',
      rfc: 'XXXX0000',
      idClient: 987,
      discount: 'N/A',
    },
    {
      allotment: 852,
      discountLot: '%10',
      type: 'Venta',
      amount: '$156,000.00',
      validity: '01/02/2023',
      captureLine: '456498732198762',
      status: 'No disponible',
      client: 'Enrique Baez Castillo',
      rfc: 'XXXX0000',
      idClient: 9876,
      discount: '$2,500.00',
    },
  ];

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
