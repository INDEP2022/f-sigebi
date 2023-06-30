import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGetSigned } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { Ssf3SignatureElecDocsService } from 'src/app/core/services/ms-electronicfirm/ms-ssf3-signature-elec-docs.service';
import { ProcessgoodreportService } from 'src/app/core/services/ms-processgoodreport/ms-processgoodreport.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MailboxModalTableComponent } from 'src/app/pages/general-processes/work-mailbox/components/mailbox-modal-table/mailbox-modal-table.component';
import { RELATED_FOLIO_COLUMNS } from 'src/app/pages/general-processes/work-mailbox/utils/related-folio-columns';
import { UploadDictamenElectronicModalComponent } from '../upload-dictamen-files-modal/upload-dictamen-files-modal.component';
import { ELECTRONICSIGNATURE_COLUMNS } from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signature',
  templateUrl: './electronic-signature.component.html',
  styles: [],
})
export class ElectronicSignatureComponent extends BasePage implements OnInit {
  data1: IGetSigned[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  electronicSignatureForm: ModelForm<any>;
  dictaminationSelect: IGetSigned;
  enableSend: boolean = false;
  loadingText: string = '';
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  get userAuth() {
    return this.authService.decodeToken().preferred_username;
  }
  constructor(
    private fb: FormBuilder,
    private readonly ssf3SignatureElecDocsService: Ssf3SignatureElecDocsService,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private dictationService: DictationService,
    private msProcessgoodreportService: ProcessgoodreportService,
    private documentsService: DocumentsService
  ) {
    super();
    this.settings.hideSubHeader = false;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ELECTRONICSIGNATURE_COLUMNS,
    };
  }
  ngOnInit(): void {
    this.prepareForm();
    this.electronicSignatureForm.disable();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            if (filter.field === 'fec_dictaminacion') {
              console.log('dddd', filter.search);
              if (filter.search != null) {
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
              } else {
                filter.search = '';
              }
            } else {
              searchFilter = SearchFilter.ILIKE;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log('this.param:', this.params);
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDictamen();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDictamen());
  }
  private prepareForm() {
    this.electronicSignatureForm = this.fb.group({
      no_expediente: [null],
      no_volante: [null],
    });
  }

  getDictamen() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dictationService.getSigned(params).subscribe({
      next: resp => {
        this.data1 = resp.data;
        this.data.load(this.data1);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.alert(
          'error',
          'Ha ocurrido un error',
          'Error al obtener la lista de dictáminaciones'
        );
      },
    });
  }

  change(event: any) {
    console.log(event);
    this.enableSend = false;
    this.dictaminationSelect = event;
    this.electronicSignatureForm
      .get('no_expediente')
      .patchValue(event.no_expediente);
    this.electronicSignatureForm.get('no_volante').patchValue(event.no_volante);
  }

  async print() {
    if (this.dictaminationSelect === undefined) {
      this.alert(
        'info',
        'Firma electrónica dictamen de procedencia',
        'Debe seleccionar un registro de la tabla'
      );
      return;
    }
    const n_COUNT: number = await this.ssf3SignatureElecDocsCount(
      this.dictaminationSelect.no_of_dicta,
      this.dictaminationSelect.tipo_dictaminacion
    );
    console.log(n_COUNT);
    if (n_COUNT > 0) {
      this.PUP_CONSULTA_PDF_BD_SSF3();
    } else if (n_COUNT === 0) {
      const n_COUNT: number = await this.dictaminaCount(
        this.dictaminationSelect.no_of_dicta,
        this.dictaminationSelect.estatus_of
      );
      console.log(n_COUNT);
      if (n_COUNT > 0) {
        /// mandar a llamar al reporte R_FIRMA_DICTAMASIV
        this.downloadReport('blank', null);
        if (this.dictaminationSelect.remitente === this.userAuth) {
          this.enableSend = true;
        }
      }
    }
  }

  async send() {
    if (this.dictaminationSelect.remitente !== this.userAuth) {
      this.alert(
        'warning',
        'Firma electrónica dictamen de procedencia',
        'Usuario inválido para realizar la firma.'
      );
      return;
    }
    if (this.dictaminationSelect.firma !== 'S/FIRMA') {
      this.alert(
        'warning',
        'Firma electrónica dictamen de procedencia',
        'El dictámen se encuentra previamente firmado.'
      );
      return;
    }
    this.PUP_GENERA_XML();
  }

  ssf3SignatureElecDocsCount(
    documentNumber: number | string,
    natureDocument: string
  ) {
    return new Promise<number>((res, _rej) => {
      const params: _Params = {};
      params['filter.documentNumber'] = `$eq:${documentNumber}`;
      params['filter.natureDocument'] = `$eq:${natureDocument}`;
      this.ssf3SignatureElecDocsService.getAllFiltered(params).subscribe({
        next: resp => {
          res(resp.count);
        },
        error: err => res(0),
      });
    });
  }

  dictaminaCount(noOfDicta: number | string, statusOf: string) {
    return new Promise<number>((res, _rej) => {
      const model = {
        dictumNum: noOfDicta,
        statusOf: statusOf,
      };
      this.dictationService.blkControlPrintWhenButtonPressed(model).subscribe({
        next: resp => {
          res(Number(resp.data[0].count));
        },
        error: err => res(0),
      });
    });
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }
  PUP_CONSULTA_PDF_BD_SSF3() {
    this.viewPictures();
  }

  viewPictures() {
    if (!this.dictaminationSelect.no_volante) {
      this.alert(
        'error',
        'Ha ocurrido un error',
        'Este dictamen no tiene volante asignado.'
      );
      return;
    }
    this.getDocumentsByFlyer(this.dictaminationSelect.no_volante);
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al expediente';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => {
        console.log('Aqui los documentos', document);
        this.getPicturesFromFolio(document);
      });
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    console.log('Aqui el Folio', folio);
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      MailboxModalTableComponent<IDocuments>,
      config
    );
  }

  PUP_GENERA_XML() {
    const nameReport: string = 'RGENADBDICTAMASIV';
    const params: any = {
      PELABORO_DICTA: 'drsigebi qa',
      PDEPARTAMENTO: 'DIRECCION DE PROCEDIMIENTOS Y ASUNTOS CONTENCIOSOS',
      POFICIO: 773,
      PDICTAMEN: 'DECOMISO',
      PESTADODICT: 'ENVIADO',
    };
    this.openModalFirm(nameReport, params);
  }

  openModalFirm(nameReport: string, params: any = null) {
    this.hideError(true);
    //this.dictaminationSelect.clave_oficio_armada
    let nameFile =
      'COORD. REGIONAL CENTRO/SUBDELEGACION JURIDICA/SUBDELEGACION JURIDICA/00032/2004'.replaceAll(
        '/',
        '-'
      );
    let paramsData = new ListParams();
    paramsData = {
      ...params,
      nombreReporte: nameReport + '.jasper',
    };
    this.msProcessgoodreportService.getReportXMLToFirm(paramsData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (!response) {
          this.alert(
            'warning',
            'Firma electrónica dictamen de procedencia',
            'Ocurrió un error al cargar el XML con el nombre: ' + nameFile
          );
          return;
        }
        const formData = new FormData();
        const file = new File([response], nameFile + '.xml', {
          type: 'text/xml',
        });
        formData.append('file', file);
        this.startFirmComponent({
          nameFileDictation: nameFile,
          natureDocumentDictation: 'DECOMISO', //this.dictaminationSelect.tipo_dictaminacion,
          numberDictation: '773', //this.dictaminationSelect.no_of_dicta.toString(),
          typeDocumentDictation: 'ENVIADO', //this.dictaminationSelect.estatus_of,
          fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
        });
      },
      error: error => {
        console.log(error);
        if (error.status == 200) {
          let response = error.error.text;
          if (!response) {
            this.alert(
              'warning',
              'Firma electrónica dictamen de procedencia',
              'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
              ''
            );
            return;
          }
          if (!response.includes('xml')) {
            this.alert(
              'warning',
              'Firma electrónica dictamen de procedencia',
              'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
              ''
            );
            return;
          }
          const formData = new FormData();
          const file = new File([response], nameFile + '.xml', {
            type: 'text/xml',
          });
          formData.append('file', file);
          this.startFirmComponent({
            nameFileDictation: nameFile,
            natureDocumentDictation: 'DECOMISO', //this.dictaminationSelect.tipo_dictaminacion,
            numberDictation: '773', //this.dictaminationSelect.no_of_dicta.toString(),
            typeDocumentDictation: 'ENVIADO', //this.dictaminationSelect.estatus_of,
            fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
          });
        } else {
          this.alert(
            'warning',
            'Firma electrónica dictamen de procedencia',
            'Ocurrió un error al CREAR el XML con el nombre: ' + nameFile,
            ''
          );
        }
      },
    });
  }

  startFirmComponent(
    context?: Partial<UploadDictamenElectronicModalComponent>
  ) {
    const modalRef = this.modalService.show(
      UploadDictamenElectronicModalComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.responseFirm.subscribe(async (next: any) => {
      /* 
      
SELECT COUNT(0)
        INTO v_COUNT
        FROM SSF3_FIRMA_ELEC_DOCS
       WHERE NATURALEZA_DOC = :DICTAMINACIONES.TIPO_DICTAMINACION
         AND NO_DOCUMENTO   = :DICTAMINACIONES.NO_OF_DICTA
         AND TIPO_DOCUMENTO = :DICTAMINACIONES.ESTATUS_OF;      */
    });
    modalRef.content.errorFirm.subscribe((next: any) => {
      console.log(next);
    });
  }

  PUP_GENERA_PDF() {}
}
