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
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ReportService } from 'src/app/core/services/catalogs/reports.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { SignatureTypeComponent } from '../signature-type/signature-type.component';
import { takeUntil } from 'rxjs';
import { UploadReportReceiptComponent } from '../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { AnnexJAssetsClassificationComponent } from '../../generate-sampling-supervision/assets-classification/annex-j-assets-classification/annex-j-assets-classification.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

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
  loadDoc: any = null;

  // we use this property to store the quill instance
  quillInstance: any;

  status: string = 'Nuevo';

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
    this.getVersionsDoc();
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

        console.log(list);

        if (list.length > 0) {
          this.format = list[0];
          this.form.get('template').setValue(list[0].id);
          this.formats = new DefaultSelect(list, list.length);
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
    params['filter.documentTypeId'] = `$eq:${this.documentTypeId}`;
    params['filter.tableName'] = `$eq:${this.tableName}`;
    params['filter.registryId'] = `$eq:${this.requestId}`;

    this.reportgoodService.getReportDynamic(params).subscribe({
      next: async resp => {
        if (resp.data.length > 0) {
          this.loadDoc = resp.data[0];
          this.version = this.loadDoc;
        }

        this.loadData();
      },
      error: err => { },
    });
  }

  async saveVersionsDoc(close = true) {

    if (isNullOrEmpty(this.format)) return;

    const user: any = this.authService.decodeToken();
    let format = this.formats.data.find(
      x => x.id == this.form.get('template').value
    );

    let doc: any = {
      tableName: this.tableName,
      registryId: this.requestId,
      documentTypeId: this.documentTypeId,
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

    this.reportgoodService
      .saveReportDynamic(doc, !isNullOrEmpty(this.loadDoc))
      .subscribe({
        next: resp => {
          this.loadDoc = resp;
          if (close) {
            this.onLoadToast('success', 'Documento guardado correctamente', '');
            this.close();
          }
        },
        error: err => { },
      });
  }

  onContentChanged = (event: any) => {
    this.format.content = event.html;
    this.form.get('content').setValue(event.html);
  };

  applyFormat() {
    this.version = this.format;
    this.loadData();
  }

  loadData() {
    if (isNullOrEmpty(this.format)) return;

    switch (this.process) {
      case 'verify-compliance-return':
        //Genera una tabla html en una cadena de texto
        let table = `<table style="width:100%">
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
</table><br />`;

        /*datos.forEach(dato => {
          tabla += `
        <tr>
          <td>${dato.nombre}</td>
          <td>${dato.edad}</td>
        </tr>`;
        });*/

        let content = this.version.content;
        //content = content.replace('{TABLA_BIENES}', table);
        //content = content.replace('{FOLIO}', '');
        //content = content.replace('{FECHA}', '');

        this.version.content = content;
        this.format.content = content;

        break;
    }
  }

  isView() {
    return !isNullOrEmpty(this.version.content);
  }

  HTMLSant(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  confirm() {
    console.log(this.form.value);
    console.log(this.document);
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
      upload: !isNullOrEmpty(this.loadDoc),
      sign: false
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
        console.log(this.tabsReport.tabs.length);
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
    this.show.emit(true);
  }

  idSample = "328";

  openSignature() {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      this.idSample,
      'sign-annexJ-assets-classification'
    );
    this.close();

  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        idSample: idSample,
        typeAnnex: typeAnnex,
        callback: async (typeDocument: number, typeSign: string) => {

          console.log(typeDocument);
          console.log(typeSign);

          if (typeAnnex == 'sign-annexJ-assets-classification') {
            if (typeDocument && typeSign) {
              this.showReportInfo(typeDocument, typeSign, typeAnnex);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  showReportInfo(typeDocument: number, typeSign: string, typeAnnex: string) {
    const idTypeDoc = typeDocument;
    const idSample = this.idSample;
    const typeFirm = typeSign;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idSample,
        typeFirm,
        typeAnnex,
        callback: (next: boolean) => {
          if (next) {
            if (typeFirm != 'electronica') {
              this.uploadDocument(typeDocument);
            } else {
              //this.getInfoSample();
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  uploadDocument(typeDocument: number) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: typeDocument,
      idSample: this.idSample,
      callback: (data: boolean) => {
        if (data) {
          //this.getInfoSample();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

}
