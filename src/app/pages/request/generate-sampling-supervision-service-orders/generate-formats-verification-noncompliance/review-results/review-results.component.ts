import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../../generate-sampling-supervision/generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';

@Component({
  selector: 'app-review-results',
  templateUrl: './review-results.component.html',
  styleUrls: ['./review-results.component.scss'],
})
export class ReviewResultsComponent extends BasePage implements OnInit {
  title: string = 'Recisión Resultados 758';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  //pasar datos a los detalle de muestreo
  samplingDetailData: any;
  sampleOrderForm: FormGroup = new FormGroup({});
  //
  @Input() searchForm: any;
  //datos anexo para pasar
  dataAnnex: any;
  //Id del Muestreo del orden obtener de taras el id
  sampleOrderId: number = null;
  //en el caso de que sera una aprovacion de resultados se pone true
  isApprovalResult: boolean = false;
  input = '<input type="text" (keyup)="keyFunc($event)">';
  lsEstatusMuestreo: string = 'MUESTREO_NO_CUMPLE';

  private orderService = inject(OrderServiceService);
  private fb = inject(FormBuilder);
  private authServeice = inject(AuthService);
  private wContentService = inject(WContentService);
  private sanitizer = inject(DomSanitizer);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    //setTimeout(() => {
    this.sampleOrderId = 3;
    //}, 2000);
    this.initAnexForm();
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
    const sampleOrder = await this.getSampleOrder();
    if (this.lsEstatusMuestreo == 'MUESTREO_NO_CUMPLE') {
      this.validateTurn(sampleOrder);
    } else if (this.lsEstatusMuestreo == 'MUESTREO_PENDIENTE_APROBACION') {
      this.sentRevision();
    }

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
    //verificar anexo k desde donde se llama si es aprobacion de resultados o generacion de formato
    const annextForm: ISamplingOrder = await this.getSampleOrder();
    if (annextForm.idcontentksae == null) {
      this.openModal(AnnexKFormComponent, annextForm, 'revition-results');
      //this.openModal(AnnexKComponent, annextForm, 'revition-results');
    } else {
      this.openReport(annextForm);
    }
  }

  searchEvent(event: any) {
    this.searchForm = event;
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        annexData: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
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
        this.lsEstatusMuestreo = 'MUESTREO_PENDIENTE_APROBACION';
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
        this.lsEstatusMuestreo = 'MUESTREO_NO_CUMPLE';
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
        this.lsEstatusMuestreo = 'MUESTREO_TERMINA';
        const userTE = this.authServeice.decodeToken().username;

        window.alert('turnar registro');
      }
    });
  }

  openReport(annextForm: ISamplingOrder) {
    this.wContentService
      .obtainFile(annextForm.idcontentksae)
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
