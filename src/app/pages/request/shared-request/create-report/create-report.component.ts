import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import * as moment from 'moment';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ReportService } from 'src/app/core/services/catalogs/reports.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { SignatureTypeComponent } from '../signature-type/signature-type.component';

import Quill from 'quill';

const parchment = Quill.import('parchment');
const block = parchment.query('block');
block.tagName = 'DIV';
// or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
Quill.register(block /* or NewBlock */, true);

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
  @Input() reVersion: string = null; // default value

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
    private wContentService: WContentService,
    private samplingGoodService: SamplingGoodService,
    private htmlConversionService: HtmlConversionService //private readonly bankService: BankService
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
        this.format.documentTypeId = this.format.doctoTypeId.id;
      }
    });
  }

  async getCatFormats(params: ListParams) {
    console.log('getCatFormats', this.documentTypeId);

    params['shortBy'] = 'reportName';
    params['limit'] = 100;

    this.reportService.getAll(params).subscribe({
      next: resp => {
        let ids = this.documentTypeId.split(',');
        let list = resp.data.filter(x => ids.includes(x.doctoTypeId.id));

        if (list.length > 0) {
          this.format = list[0];
          this.form.get('template').setValue(list[0].id);
          this.format.documentTypeId = list[0].doctoTypeId.id;
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
    params['filter.version'] = `$eq:${this.reVersion}`;

    this.reportgoodService.getReportDynamic(params).subscribe({
      next: async resp => {
        this.template = resp.data.length > 0;
        if (this.template) {
          this.version = resp.data[0];
          this.isSigned = this.version.signedReport == 'Y';
        }
      },
      error: err => {},
    });
  }

  async saveVersionsDoc(close = true, data = null) {
    if (isNullOrEmpty(this.version.content)) return;

    const user: any = this.authService.decodeToken();
    let format = this.formats.data.find(
      x => x.id == this.form.get('template').value
    );

    // Aplicar la conversión aquí
    const convertedContent =
      this.htmlConversionService.convertClassesToAlignAttributes(
        this.version.content
      );

    let doc: any = {
      tableName: this.tableName,
      registryId: this.requestId,
      documentTypeId: this.format.doctoTypeId.id,
      content: convertedContent, // Usar contenido convertido
      signedReport: 'N',
      version: this.reVersion,
      ucmDocumentName: null,
      reportFolio: null,
      folioDate: null,
      reportTemplateId: format.id,
      creationUser: user.username,
      creationDate: moment(new Date()).format('YYYY-MM-DD'),
      modificationUser: user.username,
      modificationDate: moment(new Date()).format('YYYY-MM-DD'),
    };

    if (!isNullOrEmpty(data)) {
      doc = { ...data, content: convertedContent }; // Asegurarse de que el contenido convertido se use también aquí
      doc.modificationUser = user.username;
      doc.modificationDate = moment(new Date()).format('YYYY-MM-DD');
    }

    let create = isNullOrEmpty(this.version.version);

    if (this.reVersion != '1') {
      doc.version = this.reVersion;
      create = false;
    }

    this.reportgoodService.saveReportDynamic(doc, create).subscribe({
      next: resp => {
        this.template = true;
        if (create) {
          this.version = resp;
        }
        if (close) {
          this.onLoadToast('success', 'Documento guardado correctamente', '');
        }
      },
      error: err => {
        this.reportgoodService.saveReportDynamic(doc, !create).subscribe({
          next: resp => {
            this.template = true;
            if (create) {
              this.version = resp;
            }
            if (close) {
              this.onLoadToast(
                'success',
                'Documento guardado correctamente',
                ''
              );
            }
          },
        });
      },
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

  generateReport() {
    let documentTypeId = !isNullOrEmpty(this.version.documentTypeId)
      ? this.version.documentTypeId
      : this.format.documentTypeId;

    this.wContentService
      .downloadDinamycReport(
        'sae.rptdesign',
        'SOLICITUDES',
        this.requestId,
        documentTypeId
      )
      .subscribe({
        next: response => {
          //let blob = this.dataURItoBlob(response);
          //let file = new Blob([response], { type: 'application/pdf' });
          //const fileURL = URL.createObjectURL(file);
          //this.openPrevPdf(fileURL);

          /*
           nombreDoc: string,
    contentType: string,
    docData: any,
    file: any,
    extension: string
          */
          let token = this.authService.decodeToken();

          const formData = {
            keyDoc: 'SOLICITUDES',
            xDelegacionRegional: 0, //this.programming?.regionalDelegationNumber,
            dDocTitle: 'Reporte',
            xNombreProceso: 'SOLICITUDES',
            xTipoDocumento: this.version.documentTypeId,
            xNivelRegistroNSBDB: 'NA',
            dDocType: '.pdf',
            dDocAuthor: token.name,
            dInDate: new Date(),
            xidProgramacion: '',
          };

          this.wContentService
            .addDocumentToContent(
              'Reporte',
              '.pdf',
              JSON.stringify(formData),
              response,
              '.pdf'
            )
            .subscribe({
              next: async resp => {
                //this.version.ucmDocumentName = resp.dDocName;

                const sample: any = {
                  regionalDelegationId: 0,
                  startDate: moment(new Date()).format('YYYY-MM-DD'),
                  endDate: moment(new Date()).format('YYYY-MM-DD'),
                  speciesInstance: 'DOC_COMPLEMENTARIA',
                  numeraryInstance: 'DOC_COMPLEMENTARIA',
                  warehouseId: this.requestId,
                  version: 1,
                  transfereeId: this.version.documentTypeId,
                  contentId: resp.dDocName,
                };

                this.samplingGoodService.createSample(sample).subscribe({
                  next: response => {
                    this.version.reportFolio = response.sampleId;
                    this.saveVersionsDoc(false, this.version);

                    this.sign.emit(this.version);
                    this.close();
                  },
                  error: error => {
                    this.alert('error', 'Error', 'Error al crear');
                  },
                });
              },
              error: error => {},
            });
        },
        error: error => {
          this.alert(
            'error',
            'Error en el reporte',
            'No se pudo generar el reporte'
          );
        },
      });
  }

  showFile() {
    this.version.isSigned = this.isSigned;
    let version = !isNullOrEmpty(this.version.documentTypeId)
      ? this.version
      : this.format;

    console.log('showFile', version);
    console.log('showFile', this.version);
    console.log('showFile', this.format);

    this.show.emit(version);
  }

  openSignature() {
    this.sign.emit(this.version);
    this.close();

    /*if (isNullOrEmpty(this.version.ucmDocumentName)) {
      this.generateReport();
    } else {
      
    }*/
  }
}

@Injectable({
  providedIn: 'root',
})
export class HtmlConversionService {
  constructor(private sanitizer: DomSanitizer) {}

  convertClassesToAlignAttributes(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const alignments = ['right', 'center', 'justify']; // Añade 'left' si es necesario
    alignments.forEach(align => {
      doc.querySelectorAll(`.ql-align-${align}`).forEach(el => {
        el.removeAttribute('class'); // Considera conservar otras clases si es necesario
        el.setAttribute('align', align);
      });
    });

    return (
      this.sanitizer.sanitize(SecurityContext.HTML, doc.body.innerHTML) || ''
    );
  }
}
