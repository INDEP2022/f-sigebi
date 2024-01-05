import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import * as moment from 'moment';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ReportService } from 'src/app/core/services/catalogs/reports.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AnnexJAssetsClassificationComponent } from '../../generate-sampling-supervision/assets-classification/annex-j-assets-classification/annex-j-assets-classification.component';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { SignatureTypeComponent } from '../signature-type/signature-type.component';

const font = Quill.import('formats/font');
font.whitelist = ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'];
Quill.register(font, true);

class Document {
  _id: string;
  content: string;
}

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styles: [
    `
      .ngx-spinner-icon {
        display: none !important;
      }
    `,
  ],
})
export class CreateReportComponent extends BasePage implements OnInit {
  @ViewChild('tabsReport', { static: false }) tabsReport?: TabsetComponent;

  documents = [];

  //VALIDAR
  document: Document = new Document();

  formats: any = [];
  version: any = new Document();
  format: any = new Document();

  // we use this property to store the quill instance
  quillInstance: any;

  status: string = 'Nuevo';
  content: string = '';
  template: boolean = false;

  form: FormGroup = new FormGroup({});
  model: any;

  @Input() requestId: string = null; // default value
  @Input() process: string = null; // default value
  @Input() editReport: boolean = true; // default value
  @Input() signReport: boolean = false; // default value
  @Input() tableName: string = null; // default value
  @Input() documentTypeId: string = null; // default value

  signReportTab: boolean = false;

  @Output() refresh = new EventEmitter<any>();
  @Output() show = new EventEmitter<any>();
  @Output() sign = new EventEmitter<any>();

  isSigned: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private readonly authService: AuthService,
    private reportgoodService: ReportgoodService,
    private reportService: ReportService,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCatFormats(new ListParams());
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      template: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    this.form.get('template').valueChanges.subscribe(value => {
      if (!isNullOrEmpty(this.formats)) {
        this.format = this.formats.data.find(x => x.id == value);
      }
    });
  }

  async getCatFormats(params: ListParams) {
    params['shortBy'] = 'reportName';
    params['limit'] = 100;

    this.reportService.getAll(params).subscribe({
      next: resp => {
        let ids = this.documentTypeId.split(',');
        let list = resp.data.filter(x => ids.includes(x.doctoTypeId.id));

        if (list.length > 0) {
          this.format = list[0];
          this.form.get('template').setValue(list[0].id);
          this.formats = new DefaultSelect(list, list.length);
          this.getVersionsDoc();
        } else {
          this.formats = new DefaultSelect(resp.data, resp.count);
        }
      },
      error: err => {
        this.formats = new DefaultSelect();
      },
    });
  }

  async getVersionsDoc() {
    let params = new ListParams();
    params['filter.documentTypeId'] = `$eq:${this.format.doctoTypeId.id}`;
    params['filter.tableName'] = `$eq:${this.tableName}`;
    params['filter.registryId'] = `$eq:${this.requestId}`;

    this.reportgoodService.getReportDynamic(params).subscribe({
      next: async resp => {
        this.template = resp.data.length > 0;
        if (this.template) {
          this.version = resp.data[0];
          this.isSigned = this.version.signedReport == 'Y';
        }
      },
      error: err => { },
    });
  }

  async saveVersionsDoc(close = true) {
    if (isNullOrEmpty(this.version.content)) return;

    const user: any = this.authService.decodeToken();
    let format = this.formats.data.find(
      x => x.id == this.form.get('template').value
    );

    let doc: any = {
      tableName: this.tableName,
      registryId: this.requestId,
      documentTypeId: this.format.doctoTypeId.id,
      content: this.format.content,
      signedReport: 'N',
      version: '1',
      ucmDocumentName: null,
      reportFolio: null,
      folioDate: null,
      reportTemplateId: format.id,
      creationUser: user.username,
      creationDate: moment(new Date()).format('YYYY-MM-DD'),
      modificationUser: user.username,
      modificationDate: moment(new Date()).format('YYYY-MM-DD'),
    };

    this.reportgoodService.saveReportDynamic(doc, !this.template).subscribe({
      next: resp => {
        this.template = true;
        if (close) {
          this.onLoadToast('success', 'Documento guardado correctamente', '');
        }
      },
      error: err => { },
    });
  }

  onContentChanged = (event: any) => {
    this.version.content = event.html;
    this.form.get('content').setValue(event.html);
  };

  applyFormat() {
    let form = { ...this.format };
    if (!isNullOrEmpty(this.version.registryId)) {
      this.version.content = form.content;
    } else {
      this.version = form;
    }

    this.saveVersionsDoc(false);
  }

  isView() {
    return !isNullOrEmpty(this.version.content);
  }

  HTMLSant(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  confirm() {
    //this.editable ? this.update() : this.create(); //VALIDAR
  }

  close() {
    this.onChange();
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
    //Call Service To Create PDF
    /*this.bankService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  handleSuccess() {
    this.loading = false;
    this.onChange();
    this.modalRef.hide();
  }

  onChange() {
    this.refresh.emit({
      upload: !isNullOrEmpty(this.version.content),
      sign: false,
    });
  }

  update() {
    this.alert(
      'error',
      'Error',
      'No se puede actualizar, por favor intente más tarde.'
    );
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  created(event: any) {
    this.quillInstance = event.getContents();
    //quillDelta = this.quillInstance.getContents();
  }

  sign00(context?: Partial<SignatureTypeComponent>): void {
    const modalRef = this.modalService.show(SignatureTypeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.signatureType.subscribe(next => {
      if (next) {
        this.signReportTab = true;

        this.tabsReport.tabs[1].active = true;
      } /*else {
        this.isSignedReady = false;
        this.isSigned = false;
        this.tabsReport.tabs[0].disabled = false;
        this.tabsReport.tabs[0].active = true;
      }*/
    });
  }

  nextStep($event: any): void {
    /*if ($event) {
      this.isSignedReady = true;
      this.tabsReport.tabs[0].active = true;
    } else {
      this.isSignedReady = false;
    }*/
  }

  attachDocument() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Está seguro que desea adjuntar el documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento adjuntado correctamente', '');
        this.close();
      }
    });
  }

  generateReport() {
    return new Promise((resolve, reject) => {
      this.wContentService
        .downloadDinamycReport(
          'sae.rptdesign',
          'SOLICITUDES',
          this.requestId,
          this.documentTypeId
        )
        .subscribe({
          next: (resp: any) => {
            if (resp) {
              resolve(resp);
            } else {
              resolve(null);
            }
          },
          error: error => {
            this.loader.load = false;
            this.alert(
              'error',
              'Error en el reporte',
              'No se pudo generar el reporte'
            );
            reject('false');
          },
        });
    });
  }

  showFile() {
    this.version.documentTypeId = this.documentTypeId;
    this.version.isSigned = this.isSigned;
    this.show.emit(this.version);
  }

  openSignature() {
    this.sign.emit({

    });
    this.close();
  }

}
