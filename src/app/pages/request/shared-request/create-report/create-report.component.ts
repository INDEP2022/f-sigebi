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
import { takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ReportService } from 'src/app/core/services/catalogs/reports.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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

  @Output() refresh = new EventEmitter<true>();

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
    //this.tableName = 'SOLICITUDES';
    //this.documentTypeId = '26';

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
      this.format = this.formats.data.find(x => x.id == value);
    });
  }

  async getCatFormats(params: ListParams) {
    params['shortBy'] = 'reportName';
    params['limit'] = 100;

    this.reportService.getAll(params).subscribe({
      next: resp => {
        this.formats = new DefaultSelect(resp.data, resp.count);
        let select = this.formats.data.find(
          x => x.doctoTypeId.id == this.documentTypeId
        );
        this.format = select;
        this.form.get('template').setValue(select.id);
        this.form.get('template').disable();
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
      next: resp => {
        if (resp.data.length > 0) {
          this.loadDoc = resp.data[0];
          this.version = this.loadDoc;
        }

        this.loadData();
      },
      error: err => {},
    });
  }

  async saveVersionsDoc() {
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
          this.onLoadToast('success', 'Documento guardado correctamente', '');
          this.close();
        },
        error: err => {},
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

  openDoc(data: any): void {
    this.wContentService
      .obtainFile(data.dDocName)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        let blob = this.dataURItoBlob(data);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfurl: string) {
    console.log(pdfurl);
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
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
    this.refresh.emit(true);
    this.modalRef.hide();
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

  sign(context?: Partial<SignatureTypeComponent>): void {
    const modalRef = this.modalService.show(SignatureTypeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.signatureType.subscribe(next => {
      /*if (next) {
        this.isSigned = true;
        this.tabsReport.tabs[0].active = true;
      } else {
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

  /*pdfCreate(): void {
    const quillDelta = this.quillInstance
    console.log(quillDelta)
    pdfExporter.generatePdf(quillDelta,).then((blob:any)=>{
          console.log(blob)
          let pdfurl = window.URL.createObjectURL(blob);
          this.openPrevPdf(pdfurl)
          // open the window
          //let newWin = window.open(downloadURL,"newpdf.pdf");
    }).catch(err=>{
      console.log(err)
    });
  }*/
}
