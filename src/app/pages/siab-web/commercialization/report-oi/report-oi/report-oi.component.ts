import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { REPORT_OI_COLUMNS } from './report-oi-columns';

@Component({
  selector: 'app-report-oi',
  templateUrl: './report-oi.component.html',
  styles: [],
})
export class reportOiComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;
  show = false;
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
      columns: { ...REPORT_OI_COLUMNS },
    };
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      typeAuction: [null, [Validators.required]],
      idEvent: [null, [Validators.required]],
    });
  }

  data = [
    {
      coordRegional: 'coordRegional',
      autoridad: 'autoridad',
      noBienSiab: 'noBienSiab',
      descBien: 'descBien',
      cant: 'cant',
      uniMedida: 'uniMedida',
      lote: 'lote',
      actaEntregaRecep: 'actaEntregaRecep',
      fechaDelActa: 'fechaDelActa',
      importGravIva: 'importGravIva',
      ivaV: 'ivaV',
      importExcIva: 'importExcIva',
      retenIva: 'retenIva',
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
