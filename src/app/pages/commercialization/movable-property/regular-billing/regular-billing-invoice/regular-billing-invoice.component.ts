import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { PRE_INVOICING_COLUMNS } from './pre-invoicing-columns';
//XLSX
import { ExcelService } from 'src/app/common/services/excel.service';
import { SeparateFoliosModalComponent } from '../../mass-bill-base-sales/separate-folios-modal/separate-folios-modal.component';
import { REGULAR_GOODS_COLUMN } from './regular-billing-invoice-goods-columns';

@Component({
  selector: 'app-regular-billing-invoice',
  templateUrl: './regular-billing-invoice.component.html',
  styles: [],
})
export class RegularBillingInvoiceComponent extends BasePage implements OnInit {
  show1 = false;

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  form: FormGroup = new FormGroup({});

  settings2 = {
    ...this.settings,
    actions: false,
  };

  get idAllotment() {
    return this.form.get('idAllotment');
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService
  ) {
    super();

    this.settings2.columns = { ...REGULAR_GOODS_COLUMN };

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
        custom: [
          {
            name: 'download',
            title: '<i class="bi bi-download"></i>',
          },
        ],
      },
      edit: {
        editButtonContent: '<i class="bi bi-clipboard-minus"></i>',
      },
      selectMode: 'multi',
      columns: { ...PRE_INVOICING_COLUMNS },
    };
  }

  data = [
    {
      event: 13244,
      allotment: 1,
      client: 'IMPULSORA AZUCARERA',
      regional: '0 - OFICINAS CENTRALES',
      invoice: 'Venta de bases',
      serie: 'INGRA',
      folio: 12521,
      status: 'CAN',
      type2: 'FAC',
      date: '28/06/2010',
    },
    {
      event: 13244,
      allotment: 1,
      client: 'IMPULSORA AZUCARERA',
      regional: '0 - OFICINAS CENTRALES',
      invoice: 'Venta de bases',
      serie: 'INGRA',
      folio: 12532,
      status: 'CAN',
      type2: 'FAC',
      date: '23/06/2010',
    },
    {
      event: 13244,
      allotment: 1,
      client: 'IMPULSORA AZUCARERA',
      regional: '0 - OFICINAS CENTRALES',
      invoice: 'Venta de bases',
      serie: 'INGRA',
      folio: 12510,
      status: 'CAN',
      type2: 'FAC',
      date: '20/06/2010',
    },
  ];

  data2 = [
    {
      noBien: 3747689,
      amount: 1,
      description: 'UN ANILLO PARA DAMA EN ORO BLANCO DE 14K, CON 8 SIN',
      sum: 10000,
      iva: 0.0,
      total: 10000,
      brand: '',
      subBrand: '',
      model: 'ND',
      serie: '',
      mandate: 'SAT FISCO',
      registration: 'SM',
      unit: 'Pieza',
      prod: 'No existe',
    },
  ];

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      idAllotment: [
        null,
        [
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'facturas_de_eventos');
  }

  delete() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  sendPack() {
    this.alertQuestion(
      'warning',
      'Precaución',
      'Se enviará el paquete de los documentos a las regionales ¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  openModal(): void {
    const modalRef = this.modalService.show(SeparateFoliosModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
