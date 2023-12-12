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

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { SignatureTypeComponent } from '../signature-type/signature-type.component';
import { DOCS } from './template';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ReportService } from 'src/app/core/services/catalogs/reports.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import * as moment from 'moment';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

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
  styles: [`
    .ngx-spinner-icon {
      display: none !important;
    }
  `],
})
export class CreateReportComponent extends BasePage implements OnInit {
  @ViewChild('tabsReport', { static: false }) tabsReport?: TabsetComponent;

  documents = [];

  //VALIDAR
  document: Document = new Document();

  editable: boolean = true;
  formats: any = [];
  version: any = null;
  format: any = new Document();

  tableName: string = null;
  documentTypeId: string = null;

  // we use this property to store the quill instance
  quillInstance: any;

  status: string = 'Nuevo';

  form: FormGroup = new FormGroup({});
  model: any;

  isSigned: boolean = false; //VALIDAR
  isSignedReady: boolean = false;

  @Input() signed: boolean = true; // default value
  @Input() requestId: string = null; // default value
  @Input() process: string = null; // default value

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private readonly authService: AuthService,
    private reportgoodService: ReportgoodService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {

    console.log(this.requestId);
    console.log(this.process);

    this.tableName = 'SOLICITUDES';
    this.documentTypeId = '26';

    this.getCatFormats();
    this.getVersionsDoc();
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      template: [null, [Validators.required]],
      content: [null, [Validators.required]],
    });
  }

  async getCatFormats() {

    let params = new ListParams();
    params['filter.id'] = `$eq:${this.documentTypeId}`;
    this.reportService.getAll(params).subscribe({
      next: resp => {
        this.formats = new DefaultSelect(resp.data, resp.count);
      },
      error: err => { },
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
          this.version = resp.data;
        }
      },
      error: err => { },
    });
  }

  async saveVersionsDoc() {

    if (isNullOrEmpty(this.format)) return;

    const user: any = this.authService.decodeToken();
    let format = this.formats.data.find(x => x.id == this.form.get('template').value);

    let doc: any = {
      tableName: this.tableName,
      registryId: this.requestId,
      documentTypeId: this.documentTypeId,
      content: this.format.content,
      signedReport: "N",
      version: "1",
      ucmDocumentName: null,
      reportFolio: null,
      folioDate: null,
      reportTemplateId: format.id
    }

    if (!isNullOrEmpty(this.version)) {
      doc.id = this.version.id;
      doc.modificationUser = user.username;
      doc.modificationDate = moment(new Date()).format('YYYY-MM-DD');
    } else {
      doc.creationUser = user.username;
      doc.creationDate = moment(new Date()).format('YYYY-MM-DD');
    }

    this.reportgoodService.saveReportDynamic(doc).subscribe({
      next: resp => {

      },
      error: err => { },
    });

  }

  onContentChanged = (event: any) => {
    this.format.content = event.html;
    this.form.get('content').setValue(event.html);
  };

  applyFormat() {
    if (isNullOrEmpty(this.form.get('template').value)) return;
    this.format = this.formats.data.find(x => x.id == this.form.get('template').value);
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
      if (next) {
        this.isSigned = true;
        this.tabsReport.tabs[0].active = true;
      } else {
        this.isSignedReady = false;
        this.isSigned = false;
        this.tabsReport.tabs[0].disabled = false;
        this.tabsReport.tabs[0].active = true;
      }
    });
  }

  nextStep($event: any): void {
    if ($event) {
      this.isSignedReady = true;
      this.tabsReport.tabs[0].active = true;
    } else {
      this.isSignedReady = false;
    }
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

  /*openPrevPdf(pdfurl:string) {
    console.log(pdfurl)
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
  }*/
}
