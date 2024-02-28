import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ITypeDocument } from 'src/app/core/models/ms-wcontent/type-document';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss'],
})
export class NewDocumentComponent extends BasePage implements OnInit {
  title: string = 'Nuevo Documento';
  newDocForm: ModelForm<IRequest>;
  selectTypeDoc = new DefaultSelect<IRequest>();
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());
  request: any;
  idRequest: number = 0;
  idExpedient: number = 0;
  idGood: number = 0;
  typeDoc: string = '';
  selectedFile: File;
  toggleSearch: boolean = true;
  regDelName: string = '';
  stateName: string = '';
  nameTransferent: string = '';
  idTransferent: number = 0;
  typeTransfer: string = '';
  regionalDelId: number = 0;
  stateId: number = 0;
  userLogName: string = '';
  programming: Iprogramming;
  process: string = '';
  date: string = '';
  typesDocuments: any = [];
  transferences = new DefaultSelect<ITransferente>();
  typeDocument: number = 0;
  states = new DefaultSelect<IDelegationState>();
  validateSizePDF: boolean = false;
  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    private requestService: RequestService,
    private regionalDelService: RegionalDelegationService,
    private stateOfrepublic: StateOfRepublicService,
    private transferentService: TransferenteService,
    private wContentService: WContentService,
    private programmingService: ProgrammingRequestService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private stateService: DelegationStateService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getInfoUserLog();
    this.initForm();
    if (this.idRequest) this.getInfoRequest();

    if (this.programming) {
      this.getRegionalDelegation(this.programming.regionalDelegationNumber);
      this.getstate(this.programming.stateKey);
      this.getTransferent(this.programming.tranferId);
    }
    this.typedocuments(new ListParams());
    this.obtainDate();
  }

  obtainDate() {
    const date = new Date();
    this.date = this.datePipe.transform(date, 'yyyy_MM_dd');
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.userLogName = data.preferred_username;
      if (this.process == 'sampling-assets') {
        this.getTransferentSelect(new ListParams());
        this.getRegionalDelegation(data.department);
      }
    });
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      id: [null],
      docType: [null, [Validators.required]],
      docFile: [null, [Validators.required]],
      docTit: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      contributor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      noOfi: [null, [Validators.maxLength(60)]],
      sender: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      senderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      responsible: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      returnOpinionFolio: [null, [Validators.pattern(STRING_PATTERN)]],
      noSiab: [null, [Validators.pattern(STRING_PATTERN)]],

      //Information adiotional
      bank: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      keyValidate: [null, [Validators.pattern(STRING_PATTERN)]],
      count: [null, [Validators.pattern(STRING_PATTERN)]],
      dependecyEmitDoc: [null, [Validators.pattern(STRING_PATTERN)]],
      depositDate: [null, [Validators.pattern(STRING_PATTERN)]],
      folioAct: [null, [Validators.pattern(STRING_PATTERN)]],
      folioActDes: [null, [Validators.pattern(STRING_PATTERN)]],
      folioActDev: [null, [Validators.pattern(STRING_PATTERN)]],
      contractFolio: [null, [Validators.pattern(STRING_PATTERN)]],
      folioDen: [null, [Validators.pattern(STRING_PATTERN)]],
      folioDicDes: [null, [Validators.pattern(STRING_PATTERN)]],
      folioDicRes: [null, [Validators.pattern(STRING_PATTERN)]],
      folioContract: [null, [Validators.pattern(STRING_PATTERN)]],
      folioDicDev: [null, [Validators.pattern(STRING_PATTERN)]],
      folioFac: [null, [Validators.pattern(STRING_PATTERN)]],
      folioNomb: [null, [Validators.pattern(STRING_PATTERN)]],
      folioSISE: [null, [Validators.pattern(STRING_PATTERN)]],
      amount: [null, [Validators.pattern(STRING_PATTERN)]],
      noAgreement: [null, [Validators.pattern(STRING_PATTERN)]],
      noAutDes: [null, [Validators.pattern(STRING_PATTERN)]],
      noConvColb: [null, [Validators.pattern(STRING_PATTERN)]],
      folioReg: [null, [Validators.pattern(STRING_PATTERN)]],
      oficioNoAuth: [null, [Validators.pattern(STRING_PATTERN)]],
      oficioNoAvaluo: [null, [Validators.pattern(STRING_PATTERN)]],
      oficioNoCan: [null, [Validators.pattern(STRING_PATTERN)]],
      oficioNoProg: [null, [Validators.pattern(STRING_PATTERN)]],
      oficioNoSolAvaluo: [null, [Validators.pattern(STRING_PATTERN)]],
      noOfNotification: [null, [Validators.pattern(STRING_PATTERN)]],
      noRegistro: [null, [Validators.pattern(STRING_PATTERN)]],
      stateKey: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      tranferId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
  }

  getInfoRequest() {
    this.requestService.getById(this.idRequest).subscribe(data => {
      this.idTransferent = data.transferenceId;
      this.regionalDelId = data.regionalDelegationId;
      this.stateId = data.keyStateOfRepublic;

      this.request = data;
      this.getRegionalDelegation(data.regionalDelegationId);
      this.getstate(data.keyStateOfRepublic);
      this.getTransferent(data.transferenceId);
    });
  }

  typedocuments(params: ListParams) {
    params['filter.ddescription'] = params['text'];
    console.log(params);
    this.wContentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = resp.data;
      },
    });
  }

  getRegionalDelegation(id: number) {
    this.regionalDelId = id;
    this.regionalDelService.getById(id).subscribe(data => {
      this.regDelName = data.description;
    });

    this.getStateSelect(new ListParams());
  }

  getstate(id: number) {
    this.stateOfrepublic.getById(id).subscribe(data => {
      this.stateName = data.descCondition;
    });
  }

  getTransferent(id: number) {
    this.transferentService.getById(id).subscribe(data => {
      this.nameTransferent = data.nameTransferent;
    });
  }

  typeDocumentSelect(item: ITypeDocument) {
    this.typeDocument = item.ddocType;
  }

  selectFile(event?: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile?.size > 100000000) {
      this.validateSizePDF = true;
      this.alertInfo(
        'warning',
        'Acción Inválida',
        'Se debe cargar un documento menor a 100MB'
      ).then(question => {
        if (question.isConfirmed) {
          this.newDocForm.get('docFile').reset;
        }
      });
    }
    const extension = this.selectedFile?.name.split('.').pop();
    if (extension != 'pdf') {
      this.alertInfo(
        'warning',
        'Acción Inválida',
        'Solo se aceptan documentos tipo PDF'
      ).then(question => {
        if (question.isConfirmed) {
          this.newDocForm.get('docFile').reset;
        }
      });
    }
  }

  validatePDF() {
    if (this.validateSizePDF === true) {
      //this.alert('warning', 'Se debe cargar un documentos menor a 10MB', '');
      this.validateSizePDF = false;
      this.newDocForm.get('docFile').setValue(null);
      this.newDocForm.get('docFile').reset;
    } else {
      this.confirm();
    }
  }

  confirm() {
    if (this.typeDoc == 'good' && this.process == 'programming') {
      this.loading = true;
      const formData = {
        dInDate: moment(new Date()).format('DD-MMM-YYYY'),
        dDocAuthor: this.userLogName,
        dSecurityGroup: 'Public',
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xidSolicitud: this.idRequest,
        xidTransferente: this.programming.tranferId,
        xtipoTransferencia: this.programming.typeTransfer,
        xdelegacionRegional: this.programming.regionalDelegationNumber,
        xnivelRegistroNSBDB: 'bien',
        xidBien: this.idGood,
        xestado: this.programming.stateKey,
        xfolioProgramacion: this.programming.folio,
        xnoProgramacion: this.programming.id,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xcomments: this.newDocForm.get('observations').value,
        xNombreProceso: 'Ejecutar Recepcion',
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,

        //Información adicional
        xbanco: this.newDocForm.get('bank').value,
        xclaveValidacion: this.newDocForm.get('keyValidate').value,
        xcuenta: this.newDocForm.get('count').value,
        xdependenciaEmiteDoc: this.newDocForm.get('dependecyEmitDoc').value,
        xfechaDeposito: this.newDocForm.get('depositDate').value,
        xfolioActa: this.newDocForm.get('folioAct').value,
        xfolioActaDestruccion: this.newDocForm.get('folioActDes').value,
        xfolioActaDevolucion: this.newDocForm.get('folioActDev').value,
        xfolioContrato: this.newDocForm.get('contractFolio').value,
        xfolioDenuncia: this.newDocForm.get('folioDen').value,
        xfolioDictamenDestruccion: this.newDocForm.get('folioDicDes').value,
        xfolioFactura: this.newDocForm.get('folioFac').value,
        xfolioNombramiento: this.newDocForm.get('folioNomb').value,
        xfolioSISE: this.newDocForm.get('folioSISE').value,
        xmonto: this.newDocForm.get('amount').value,
        xnoAcuerdo: this.newDocForm.get('noAgreement').value,
        xnoAutorizacionDestruccion: this.newDocForm.get('noAutDes').value,
        xnoConvenioColaboracion: this.newDocForm.get('noConvColb').value,
        xnoFolioRegistro: this.newDocForm.get('folioReg').value,
        xnoOficioAutorizacion: this.newDocForm.get('oficioNoAuth').value,
        xnoOficioAvaluo: this.newDocForm.get('oficioNoAvaluo').value,
        xnoOficioCancelacion: this.newDocForm.get('oficioNoCan').value,
        xnoOficioProgramacion: this.newDocForm.get('oficioNoProg').value,
        xnoOficioSolAvaluo: this.newDocForm.get('oficioNoSolAvaluo').value,
        xnoOficoNotificacion: this.newDocForm.get('noOfNotification').value,
        xnoRegistro: this.newDocForm.get('noRegistro').value,
      };
      const extension = '.pdf';
      const docName = this.newDocForm.get('docTit').value;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.loading = false;
            this.alertInfo(
              'success',
              'El Documento ha sido Agregado',
              `ID: ${resp.dDocName}`
            ).then(question => {
              if (question.isConfirmed) {
                this.modalRef.content.callback(true);
                this.modalRef.hide();
              }
            });
          },
          error: error => {},
        });
      return;
    }

    if (
      this.typeDoc == 'good' &&
      this.process != 'programming' &&
      this.process != 'sampling-assets'
    ) {
      this.loading = true;
      const user: any = this.authService.decodeToken();
      const formData = {
        dInDate: moment(new Date()).format('DD-MMM-YYYY'),
        dDocAuthor: this.userLogName,
        dSecurityGroup: 'Public',
        xidExpediente: this.idExpedient,
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xidSolicitud: this.idRequest,
        xidTransferente: this.idTransferent,
        xdelegacionRegional: user.department,
        xnivelRegistroNSBDB: 'bien',
        xidBien: this.idGood,
        xestado: this.stateId,
        xidSIAB: this.newDocForm.get('noSiab').value,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xcomments: this.newDocForm.get('observations').value,
        xnombreProceso: 'Clasificar Bien',
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,

        //Información adicional
        xbanco: this.newDocForm.get('bank').value,
        xclaveValidacion: this.newDocForm.get('keyValidate').value,
        xcuenta: this.newDocForm.get('count').value,
        xdependenciaEmiteDoc: this.newDocForm.get('dependecyEmitDoc').value,
        xfechaDeposito: this.newDocForm.get('depositDate').value,
        xfolioActa: this.newDocForm.get('folioAct').value,
        xfolioActaDestruccion: this.newDocForm.get('folioActDes').value,
        xfolioActaDevolucion: this.newDocForm.get('folioActDev').value,
        xfolioContrato: this.newDocForm.get('contractFolio').value,
        xfolioDenuncia: this.newDocForm.get('folioDen').value,
        xfolioDictamenDestruccion: this.newDocForm.get('folioDicDes').value,
        xfolioFactura: this.newDocForm.get('folioFac').value,
        xfolioNombramiento: this.newDocForm.get('folioNomb').value,
        xfolioSISE: this.newDocForm.get('folioSISE').value,
        xmonto: this.newDocForm.get('amount').value,
        xnoAcuerdo: this.newDocForm.get('noAgreement').value,
        xnoAutorizacionDestruccion: this.newDocForm.get('noAutDes').value,
        xnoConvenioColaboracion: this.newDocForm.get('noConvColb').value,
        xnoFolioRegistro: this.newDocForm.get('folioReg').value,
        xnoOficioAutorizacion: this.newDocForm.get('oficioNoAuth').value,
        xnoOficioAvaluo: this.newDocForm.get('oficioNoAvaluo').value,
        xnoOficioCancelacion: this.newDocForm.get('oficioNoCan').value,
        xnoOficioProgramacion: this.newDocForm.get('oficioNoProg').value,
        xnoOficioSolAvaluo: this.newDocForm.get('oficioNoSolAvaluo').value,
        xnoOficoNotificacion: this.newDocForm.get('noOfNotification').value,
        xnoRegistro: this.newDocForm.get('noRegistro').value,
      };

      const extension = '.pdf';
      const docName = this.newDocForm.get('docTit').value;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.alertInfo(
              'success',
              'El Documento ha sido Agregado',
              `ID: ${resp.dDocName}`
            ).then(question => {
              if (question.isConfirmed) {
                this.modalRef.content.callback(true);
                this.loading = false;
                this.loader.load = false;
                this.modalRef.hide();
              }
            });
          },
          error: error => {},
        });
      return;
    }

    if (this.typeDoc == 'doc-request' && this.process != 'sampling-assets') {
      console.log('doc-request y diferente a sampling-assets');
      this.loading = true;
      const formData = {
        dDocAuthor: this.userLogName,
        xidSIAB: this.newDocForm.get('noSiab').value,
        //dActionDate: '2024-02-27 17:11:00',
        //dInDate: '2024-02-27 17:11:00',
        //dDocLastModifiedDate: '2024-02-27 17:11:00',
        //dCreateDate: '2024-02-27 17:11:00',
        dSecurityGroup: 'Public',
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xnombreProceso: 'Clasificar Bien',
        xidSolicitud: this.idRequest,
        xnivelRegistroNSBDB: 'Solicitud',
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xestado: this.stateId,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xcomments: this.newDocForm.get('observations').value,
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,

        //Información adicional
        xbanco: this.newDocForm.get('bank').value,
        xclaveValidacion: this.newDocForm.get('keyValidate').value,
        xcuenta: this.newDocForm.get('count').value,
        xdependenciaEmiteDoc: this.newDocForm.get('dependecyEmitDoc').value,
        xfechaDeposito: this.newDocForm.get('depositDate').value,
        xfolioActa: this.newDocForm.get('folioAct').value,
        xfolioActaDestruccion: this.newDocForm.get('folioActDes').value,
        xfolioActaDevolucion: this.newDocForm.get('folioActDev').value,
        xfolioContrato: this.newDocForm.get('contractFolio').value,
        xfolioDenuncia: this.newDocForm.get('folioDen').value,
        xfolioDictamenDestruccion: this.newDocForm.get('folioDicDes').value,
        xfolioFactura: this.newDocForm.get('folioFac').value,
        xfolioNombramiento: this.newDocForm.get('folioNomb').value,
        xfolioSISE: this.newDocForm.get('folioSISE').value,
        xmonto: this.newDocForm.get('amount').value,
        xnoAcuerdo: this.newDocForm.get('noAgreement').value,
        xnoAutorizacionDestruccion: this.newDocForm.get('noAutDes').value,
        xnoConvenioColaboracion: this.newDocForm.get('noConvColb').value,
        xnoFolioRegistro: this.newDocForm.get('folioReg').value,
        xnoOficioAutorizacion: this.newDocForm.get('oficioNoAuth').value,
        xnoOficioAvaluo: this.newDocForm.get('oficioNoAvaluo').value,
        xnoOficioCancelacion: this.newDocForm.get('oficioNoCan').value,
        xnoOficioProgramacion: this.newDocForm.get('oficioNoProg').value,
        xnoOficioSolAvaluo: this.newDocForm.get('oficioNoSolAvaluo').value,
        xnoOficoNotificacion: this.newDocForm.get('noOfNotification').value,
        xnoRegistro: this.newDocForm.get('noRegistro').value,
      };

      const extension = '.pdf';
      const docName = this.newDocForm.get('docTit').value;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.loading = false;
            this.alertInfo(
              'success',
              'El Documento ha sido Agregado',
              `ID: ${resp.dDocName}`
            ).then(question => {
              if (question.isConfirmed) {
                this.modalRef.content.callback(true);
                this.modalRef.hide();
              }
            });
          },
          error: error => {},
        });
      return;
    }

    if (this.typeDoc == 'doc-expedient' && this.process != 'sampling-assets') {
      console.log('doc-expedient y sampling-assets');
      const formData = {
        dInDate: moment(new Date()).format('DD-MMM-YYYY'),
        dSecurityGroup: 'Public',
        xidcProfile: 'NSBDB_Gral',
        xNombreProceso: 'Clasificar Bien',
        xnivelRegistroNSBDB: 'expediente',
        xestado: this.stateId,
        xidSIAB: this.newDocForm.get('noSiab').value,
        dDocAuthor: this.userLogName,
        xidExpediente: this.idExpedient,
        ddocCreator: this.userLogName,
        xidSolicitud: this.idRequest,
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xcomments: this.newDocForm.get('observations').value,
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,

        //Información adicional
        xbanco: this.newDocForm.get('bank').value,
        xclaveValidacion: this.newDocForm.get('keyValidate').value,
        xcuenta: this.newDocForm.get('count').value,
        xdependenciaEmiteDoc: this.newDocForm.get('dependecyEmitDoc').value,
        xfechaDeposito: this.newDocForm.get('depositDate').value,
        xfolioActa: this.newDocForm.get('folioAct').value,
        xfolioActaDestruccion: this.newDocForm.get('folioActDes').value,
        xfolioActaDevolucion: this.newDocForm.get('folioActDev').value,
        xfolioContrato: this.newDocForm.get('contractFolio').value,
        xfolioDenuncia: this.newDocForm.get('folioDen').value,
        xfolioDictamenDestruccion: this.newDocForm.get('folioDicDes').value,
        xfolioFactura: this.newDocForm.get('folioFac').value,
        xfolioNombramiento: this.newDocForm.get('folioNomb').value,
        xfolioSISE: this.newDocForm.get('folioSISE').value,
        xmonto: this.newDocForm.get('amount').value,
        xnoAcuerdo: this.newDocForm.get('noAgreement').value,
        xnoAutorizacionDestruccion: this.newDocForm.get('noAutDes').value,
        xnoConvenioColaboracion: this.newDocForm.get('noConvColb').value,
        xnoFolioRegistro: this.newDocForm.get('folioReg').value,
        xnoOficioAutorizacion: this.newDocForm.get('oficioNoAuth').value,
        xnoOficioAvaluo: this.newDocForm.get('oficioNoAvaluo').value,
        xnoOficioCancelacion: this.newDocForm.get('oficioNoCan').value,
        xnoOficioProgramacion: this.newDocForm.get('oficioNoProg').value,
        xnoOficioSolAvaluo: this.newDocForm.get('oficioNoSolAvaluo').value,
        xnoOficoNotificacion: this.newDocForm.get('noOfNotification').value,
        xnoRegistro: this.newDocForm.get('noRegistro').value,
      };

      const extension = '.pdf';
      const docName = this.newDocForm.get('docTit').value;
      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.loading = false;
            this.alertInfo(
              'success',
              'El Documento ha sido Agregado',
              `ID: ${resp.dDocName}`
            ).then(question => {
              if (question.isConfirmed) {
                this.modalRef.content.callback(true);
                this.modalRef.hide();
              }
            });
          },
          error: error => {},
        });
      return;
    }

    if (this.process == 'sampling-assets') {
      console.log('sampling-assets');
      const formData = {
        dInDate: new Date(),
        dDocAuthor: this.userLogName,
        dSecurityGroup: 'Public',
        xidExpediente: this.idExpedient,
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xidSolicitud: this.idRequest,
        xidTransferente: this.newDocForm.get('tranferId').value,
        xdelegacionRegional: this.regionalDelId,
        xnivelRegistroNSBDB: 'bien',
        xidBien: this.idGood,
        xestado: this.newDocForm.get('stateKey').value,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xcomments: this.newDocForm.get('observations').value,
        xNombreProceso: 'Aclaración Bien',
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,

        //Información adicional
        xbanco: this.newDocForm.get('bank').value,
        xclaveValidacion: this.newDocForm.get('keyValidate').value,
        xcuenta: this.newDocForm.get('count').value,
        xdependenciaEmiteDoc: this.newDocForm.get('dependecyEmitDoc').value,
        xfechaDeposito: this.newDocForm.get('depositDate').value,
        xfolioActa: this.newDocForm.get('folioAct').value,
        xfolioActaDestruccion: this.newDocForm.get('folioActDes').value,
        xfolioActaDevolucion: this.newDocForm.get('folioActDev').value,
        xfolioContrato: this.newDocForm.get('contractFolio').value,
        xfolioDenuncia: this.newDocForm.get('folioDen').value,
        xfolioDictamenDestruccion: this.newDocForm.get('folioDicDes').value,
        xfolioFactura: this.newDocForm.get('folioFac').value,
        xfolioNombramiento: this.newDocForm.get('folioNomb').value,
        xfolioSISE: this.newDocForm.get('folioSISE').value,
        xmonto: this.newDocForm.get('amount').value,
        xnoAcuerdo: this.newDocForm.get('noAgreement').value,
        xnoAutorizacionDestruccion: this.newDocForm.get('noAutDes').value,
        xnoConvenioColaboracion: this.newDocForm.get('noConvColb').value,
        xnoFolioRegistro: this.newDocForm.get('folioReg').value,
        xnoOficioAutorizacion: this.newDocForm.get('oficioNoAuth').value,
        xnoOficioAvaluo: this.newDocForm.get('oficioNoAvaluo').value,
        xnoOficioCancelacion: this.newDocForm.get('oficioNoCan').value,
        xnoOficioProgramacion: this.newDocForm.get('oficioNoProg').value,
        xnoOficioSolAvaluo: this.newDocForm.get('oficioNoSolAvaluo').value,
        xnoOficoNotificacion: this.newDocForm.get('noOfNotification').value,
        xnoRegistro: this.newDocForm.get('noRegistro').value,
      };

      const extension = '.pdf';
      const docName = this.newDocForm.get('docTit').value;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.alertInfo(
              'success',
              'El Documento ha sido Agregado',
              `ID: ${resp.dDocName}`
            ).then(question => {
              if (question.isConfirmed) {
                this.modalRef.content.callback(true);
                this.loading = false;
                this.loader.load = false;
                this.modalRef.hide();
              }
            });
          },
          error: error => {},
        });
      return;
    }
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {}

  getStateSelect(params?: ListParams) {
    params['filter.sortBy'] = 'descCondition:ASC';
    params['filter.regionalDelegation'] = this.regionalDelId;
    this.stateService.getAll(params).subscribe({
      next: data => {
        const filterStates = data.data.filter(_states => {
          return _states.stateCode;
        });

        const states = filterStates.map(items => {
          return items.stateCode;
        });

        this.states = new DefaultSelect(states, data.count);
      },
      error: error => {
        this.states = new DefaultSelect();
      },
    });
  }

  getTransferentSelect(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          this.typeTransfer = data.typeTransferent;
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferences = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.transferences = new DefaultSelect();
      },
    });
  }
}

//NUEVO DOCUMENTO VALIDAR
