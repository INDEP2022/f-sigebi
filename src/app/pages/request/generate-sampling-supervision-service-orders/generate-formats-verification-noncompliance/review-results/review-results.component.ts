import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../../generate-sampling-supervision/generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { LIST_DEDUCTIVES_VIEW_COLUMNS } from '../../../generate-sampling-supervision/sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';

@Component({
  selector: 'app-review-results',
  templateUrl: './review-results.component.html',
  styleUrls: ['./review-results.component.scss'],
})
export class ReviewResultsComponent extends BasePage implements OnInit {
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;

  samplingDetailData: any;
  sampleOrderForm: FormGroup = new FormGroup({});
  //
  @Input() searchForm: any;

  dataAnnex: any;

  sampleOrderId: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  isApprovalResult: boolean = false;
  lsEstatusMuestreo: string = '';
  title: string = '';
  loadingDeductives: boolean = true;
  paragraphsDeductivas = new LocalDataSource();
  allDeductives: any = [];
  sampleOrderInfo: ISamplingOrder;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderServiceService,
    private fb: FormBuilder,
    private authServeice: AuthService,
    private sanitizer: DomSanitizer,
    private wContentService: WContentService,
    private samplingGoodService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,

      columns: LIST_DEDUCTIVES_VIEW_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.sampleOrderId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.title = `Captura de resultados ${this.sampleOrderId}`;
    this.initAnexForm();
    this.getSampleDeductives();
  }

  getSampleDeductives() {
    this.params.getValue()[
      'filter.orderSampleId'
    ] = `$eq:${this.sampleOrderId}`;
    this.samplingGoodService
      .getAllSampleDeductives(this.params.getValue())
      .subscribe({
        next: response => {
          this.allDeductives = response.data;
          this.getDeductives(response.data);
        },
        error: () => {},
      });
  }

  getDeductives(deductivesRelSample: ISamplingDeductive[]) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        const infoDeductives = response.data.map(item => {
          deductivesRelSample.map(deductiveEx => {
            if (deductiveEx.deductiveVerificationId == item.id) {
              item.observations = deductiveEx.observations;
              item.selected = true;
            }
          });
          return item;
        });
        this.paragraphsDeductivas.load(infoDeductives);
        this.loadingDeductives = false;
      },
      error: () => {},
    });
  }

  initAnexForm() {
    this.sampleOrderForm = this.fb.group({
      idSamplingOrder: [null],
      factsrelevant: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      downloadbreaches: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      datebreaches: [null, [Validators.required]],
      agreements: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      daterepService: [null, [Validators.required]],
      nameManagersoul: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
    });
  }

  async turnSampling() {
    /*const sampleOrder = await this.getSampleOrder();
    if (this.lsEstatusMuestreo == 'MUESTREO_NO_CUMPLE') {
      this.validateTurn(sampleOrder);
    } else if (this.lsEstatusMuestreo == 'MUESTREO_PENDIENTE_APROBACION') {
      this.sentRevision();
    } */
    //verificar anexo k desde donde se llama si es aprobacion de resultados o generacion de formato
    /* if (this.isApprovalResult === false) {
      let title = 'Confirmación turnado';
      let message =
        '¿Esta de acuerdo qeu la información es correcta para turnar?';
      this.alertQuestion(undefined, title, message, 'Aceptar').then(
        question => {
          if (question.isConfirmed) {
            //Ejecutar el servicio
            console.log('guardar documento');
          }
        }
      );
    } else {
      this.confirmTurnModal();
    } */
  }

  async openAnnexK() {
    let config: ModalOptions = {
      initialState: {
        idSampleOrder: this.sampleOrderId,
        typeAnnex: 'revition-results',
        callback: async (typeDocument: number, typeSign: string) => {
          if (typeDocument && typeSign) {
            this.showReportInfo(typeDocument, typeSign, 'revition-results');
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AnnexKFormComponent, config);
  }

  searchEvent(event: any) {
    this.searchForm = event;
  }

  showReportInfo(typeDocument: number, typeSign: string, typeAnnex: string) {
    const idTypeDoc = typeDocument;
    const orderSampleId = this.sampleOrderId;
    const typeFirm = typeSign;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        orderSampleId,
        typeFirm,
        typeAnnex,
        callback: (next: boolean) => {
          if (next) {
            if (typeFirm != 'electronica') {
              this.uploadDocument(typeDocument);
            } else {
              this.getSampleOrder();
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
      idSampleOrder: this.sampleOrderId,
      callback: (data: boolean) => {
        if (data) {
          this.getSampleOrder();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  keyFunc(event: any) {
    let value = event.target.value;
  }

  confirmTurnModal() {
    Swal.fire({
      title: 'Confirmación del Turnado',
      text: 'Observaciones:',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      allowOutsideClick: false,
    }).then(result => {
      console.log(result.value);
    });
  }

  getSampleOrder() {
    return new Promise((resolve, reject) => {
      const id = this.sampleOrderId;
      const params = new ListParams();
      params['filter.idSamplingOrder'] = `$eq:${id}`;
      this.orderService.getAllSampleOrder(params).subscribe({
        next: resp => {
          this.sampleOrderInfo = resp.data[0];
          resolve(resp.data[0]);
        },
      });
    });
  }

  validateTurn(sampleOrder: ISamplingOrder) {
    if (sampleOrder.idcontentksae == null) {
      this.onLoadToast('info', 'Debe firmar el Anexo K para Turnar.');
      return;
    }

    let title = 'Confirmación turnado';
    let message =
      '¿Esta de acuerdo que la información es correcta para turnar?';
    this.alertQuestion('question', title, message, 'Aceptar').then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        //this.lsEstatusMuestreo = 'MUESTREO_PENDIENTE_APROBACION';
        const userTE = this.authServeice.decodeToken().username;

        window.alert('turnar registro');
      }
    });
  }

  sentRevision() {
    Swal.fire({
      title: 'Confirmación Turnado',
      html: '<br/><label style="display:flex;">Observaciones: </label>',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      confirmButtonColor: '#9B2448',
      cancelButtonColor: '#B38E5D',
      preConfirm: login => {
        return login;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(result => {
      if (result.isConfirmed) {
        console.log(result.value);
        const observation = result.value;
        if (observation == null || observation == '') {
          this.onLoadToast('info', 'Debe indicar el motivo del rechazo');
          return;
        }
        //this.lsEstatusMuestreo = 'MUESTREO_NO_CUMPLE';
        window.alert('Turnar registro');
      }
    });
  }

  finish() {
    let title = 'Confirmación turnado';
    let message =
      '¿Esta de acuerdo que la información es correcta para turnar?';
    this.alertQuestion('question', title, message, 'Aceptar').then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        //this.lsEstatusMuestreo = 'MUESTREO_TERMINA';
        const userTE = this.authServeice.decodeToken().username;

        window.alert('turnar registro');
      }
    });
  }

  openReport() {
    this.wContentService
      .obtainFile(this.sampleOrderInfo.idcontentk)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          let blob = this.dataURItoBlob(resp);
          let file = new Blob([blob], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          this.openPrevPdf(fileURL);
        },
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

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
