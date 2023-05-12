import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelForm } from '../../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-generate-dictum',
  templateUrl: './generate-dictum.component.html',
  styles: [],
})
export class GenerateDictumComponent extends BasePage implements OnInit {
  idSolicitud: any; //ID de solicitud, viene desde el componente principal
  idTypeDoc: any;
  requestData: IRequest;

  title: string = 'Reporte Dictamen Procedencia';
  edit: boolean = false;

  pdfurl: string = '';
  public event: EventEmitter<any> = new EventEmitter();
  dictumForm: ModelForm<IRequest>;

  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;

  constructor(
    private bsModelRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private requestService: RequestService,
    private authService: AuthService,
    private generateCveService: GenerateCveService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    if (this.folioReporte === null) {
      console.log('Crear folio');
      this.dictamenSeq();
    }
    //Crea la clave armada o el folio

    this.initForm();
  }

  initForm(): void {
    this.dictumForm = this.fb.group({
      id: [null],
      //rejectionNumber: [null],
      reportSheet: [null], //Se agrega información del que elabora
      nameRecipientRuling: [null, [Validators.maxLength(100)]],
      postRecipientRuling: [null, [Validators.maxLength(100)]],
      paragraphOneRuling: [null, [Validators.maxLength(4000)]],
      paragraphTwoRuling: [null, [Validators.maxLength(4000)]],
      nameSignatoryRuling: [null],
      postSignatoryRuling: [null],
      ccpRuling: [null, [Validators.maxLength(200)]],
    });
    if (this.requestData != null) {
      this.edit = true;
      this.dictumForm.patchValue(this.requestData);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    //Objeto para actualizar el reporte con datos del formulario
    const obj: IRequest = {
      ccpRuling: this.dictumForm.controls['ccpRuling'].value,
      //id: this.dictumForm.controls['id'].value,
      nameRecipientRuling:
        this.dictumForm.controls['nameRecipientRuling'].value,
      nameSignatoryRuling:
        this.dictumForm.controls['nameSignatoryRuling'].value,
      paragraphOneRuling: this.dictumForm.controls['paragraphOneRuling'].value,
      paragraphTwoRuling: this.dictumForm.controls['paragraphTwoRuling'].value,
      postRecipientRuling:
        this.dictumForm.controls['postRecipientRuling'].value,
      postSignatoryRuling:
        this.dictumForm.controls['postSignatoryRuling'].value,
      reportSheet: this.folioReporte,
    };
    console.log('Crear reporte', this.folioReporte);

    //const idDoc = this.idSolicitud;
    this.requestService.create(obj).subscribe({
      next: data => {
        this.handleSuccess(), this.signDictum();
      },
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    //Objeto para actualizar el reporte con datos del formulario
    const obj: IRequest = {
      ccpRuling: this.dictumForm.controls['ccpRuling'].value,
      id: this.dictumForm.controls['id'].value,
      nameRecipientRuling:
        this.dictumForm.controls['nameRecipientRuling'].value,
      nameSignatoryRuling:
        this.dictumForm.controls['nameSignatoryRuling'].value,
      paragraphOneRuling: this.dictumForm.controls['paragraphOneRuling'].value,
      paragraphTwoRuling: this.dictumForm.controls['paragraphTwoRuling'].value,
      postRecipientRuling:
        this.dictumForm.controls['postRecipientRuling'].value,
      postSignatoryRuling:
        this.dictumForm.controls['postSignatoryRuling'].value,
      reportSheet: this.folioReporte,
    };
    console.log('Actualizar reporte', this.folioReporte);

    const idDoc = this.idSolicitud;
    this.requestService.update(idDoc, obj).subscribe({
      next: data => {
        this.handleSuccess(), this.signDictum();
      },
      error: error => (this.loading = false),
    });
  }

  signDictum(): void {
    console.log('id de solicitud', this.requestData.id);
    const requestInfo = this.requestData;
    const idReportAclara = this.idSolicitud;
    const typeAnnex = 'approval-request';
    const idTypeDoc = this.idTypeDoc;
    const nameTypeDoc = 'DictamenProcendecia';

    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        idTypeDoc,
        typeAnnex,
        requestInfo,
        nameTypeDoc,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
    //this.modalService.show(PrintReportModalComponent,  config);
  }

  close(): void {
    this.bsModelRef.hide();
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  //Método para crear número secuencial según la no delegación del user logeado
  dictamenSeq() {
    let token = this.authService.decodeToken();
    const pNumber = Number(token.department);

    this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      next: response => {
        // this.noFolio = response.data;
        this.folio = response;
        console.log('No. Folio generado ', this.folio.dictamenDelregSeq);
        this.generateClave(this.folio.dictamenDelregSeq);
      },
      error: error => {
        console.log('Error al generar secuencia de dictamen', error.error);
      },
    });
  }

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    console.log(token);

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Generado' : 'Generado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
