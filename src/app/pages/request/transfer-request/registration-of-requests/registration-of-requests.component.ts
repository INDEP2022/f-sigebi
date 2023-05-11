import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  SPECIAL_STRING_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { IRequest } from '../../../../core/models/requests/request.model';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';
import { RequestService } from '../../../../core/services/requests/request.service';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { SelectTypeUserComponent } from '../select-type-user/select-type-user.component';
import { GenerateDictumComponent } from '../tabs/approval-requests-components/generate-dictum/generate-dictum.component';
import { RegistrationHelper } from './registrarion-of-request-helper.component';

@Component({
  selector: 'app-registration-of-requests',
  templateUrl: './registration-of-requests.component.html',
  styleUrls: ['./registration-of-requests.component.scss'],
  providers: [RegistrationHelper],
})
export class RegistrationOfRequestsComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  idTypeDoc: number = 50; //Tipo de documento, aprobar, dictamen, es 50
  registRequestForm: IFormGroup<IRequest>; //solicitudes
  edit: boolean = false;
  title: string = 'Registro de solicitud con folio: ';
  parameter: any;
  object: any = '';
  requestData: any;
  btnTitle: string = '';
  btnSaveTitle: string = '';
  saveClarifiObject: boolean = false;
  bsValue = new Date();
  isExpedient: boolean = false;
  infoRequest: IRequest;
  typeDocument: string = '';
  process: string = '';
  //tabs
  tab1: string = '';
  tab2: string = '';
  tab3: string = '';
  tab4: string = '';
  tab5: string = '';
  tab6: string = '';

  //registro de solicitudos o bienes
  requestRegistration: boolean = false;
  //verificacion de cumplimientos tab
  complianceVerifi: boolean = false; //ok
  //clasificacion de bienes
  classifyAssets: boolean = false;
  //validar destino del bien(documento)
  validateDocument: boolean = false;
  //notificar aclaraciones o improcedencias
  notifyClarifiOrImpropriety: boolean = false;
  //aprovacion del proceso
  approvalProcess: boolean = false;

  stateOfRepublicName: string = '';
  transferentName: string = '';
  stationName: string = '';
  delegationName: string = '';
  authorityName: string = '';
  haveDictamen: boolean = false;

  requestList: IRequest;

  formLoading: boolean = true;

  question: boolean = false;
  verifyResp: string = null;
  task: any = null;
  statusTask: any = '';
  pgr: boolean = false;

  constructor(
    public fb: FormBuilder,
    private bsModalRef: BsModalRef,
    public modalService: BsModalService,
    public route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private requestService: RequestService,
    private requestHelperService: RequestHelperService,
    private stateOfRepublicService: StateOfRepublicService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private delegationService: RegionalDelegationService,
    private authorityService: AuthorityService,
    private goodService: GoodService,
    private fractionService: FractionService,
    private goodEstateService: RealStateService,
    private registrationHelper: RegistrationHelper,
    private taskService: TaskService,
    private authService: AuthService,
    private orderService: OrderServiceService,
    private wcontentService: WContentService,
    private goodResDevService: GetGoodResVeService
  ) {
    super();
  }

  ngOnInit(): void {
    const authService: any = this.authService.decodeToken();
    console.log(authService);
    const id = this.route.snapshot.paramMap.get('id');
    this.task = JSON.parse(localStorage.getItem('Task'));

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;

    this.title = 'Registro de solicitud con folio: ' + id;
    let path: any = window.location.pathname.split('/');
    this.processView();
    this.setView(path[4]);
    this.intiTabs();
    this.prepareForm();
    this.getRequest(id);
    this.associateExpedientListener();
    //this.dinamyCallFrom();
  }

  //Obtenemos el tipo de proceso//
  processView() {
    this.route.data.forEach((item: any) => {
      this.process = item.process;
    });
  }

  //cambia el estado del tab en caso de que se asocie un expediente a la solicitud
  associateExpedientListener() {
    this.requestHelperService.currentExpedient.subscribe({
      next: async resp => {
        if (resp === true) {
          const request: any = await this.getAsyncRequestById();
          this.registRequestForm.controls['recordId'].setValue(
            request.recordId
          );
          this.isExpedient = true;
          this.staticTabs.tabs[0].active = true;
        }
      },
      error: error => {},
    });
  }

  prepareForm() {
    //formulario de solicitudes
    this.registRequestForm = this.fb.group({
      applicationDate: [null],
      recordId: [null],
      paperNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      regionalDelegationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      keyStateOfRepublic: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      transferenceId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      stationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      authorityId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      //typeUser: [''],
      //receiUser: [''],
      id: [null],
      urgentPriority: [
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      priorityDate: [null],
      originInfo: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      receptionDate: [null],
      paperDate: [null],
      typeRecord: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      publicMinistry: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      nameOfOwner: [
        null,
        [Validators.pattern(SPECIAL_STRING_PATTERN), Validators.maxLength(100)],
      ], //nombre remitente
      holderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //cargo remitente
      phoneOfOwner: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ], //telefono remitente
      emailOfOwner: [
        null,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(100)],
      ], //email remitente
      court: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      crime: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      receiptRoute: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      destinationManagement: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      indicatedTaxpayer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      affair: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      transferEntNotes: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      transferenceFile: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      previousInquiry: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      trialType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      circumstantialRecord: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      lawsuit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      tocaPenal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      protectNumber: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(15)],
      ],
      typeOfTransfer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      domainExtinction: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
    this.registRequestForm.get('receptionDate').disable();
    this.registRequestForm.updateValueAndValidity();
  }

  getRequest(id: any) {
    this.requestService.getById(id).subscribe({
      next: async (data: any) => {
        this.infoRequest = data;
        this.setRequiredFields(data);
        await this.getTransferent(data.transferenceId);
        await this.getRegionalDelegation(data.regionalDelegationId);
        await this.getStation(data.transferenceId, data.stationId);
        await this.getStateOfRepublic(data.keyStateOfRepublic);
        await this.getAuthority(
          data.transferenceId,
          data.stationId,
          data.authorityId
        );
        if (data.urgentPriority === null) data.urgentPriority = 'N';

        /* verifica si existe un dictamen en la solicitud */
        if (this.typeDocument === 'proceso-aprovacion') {
          await this.getDictamen(data.id);
        }

        this.verifyTransDelegaStatiAuthoExist(data);

        //verifica si la solicitud tiene expediente, si tiene no muestra el tab asociar expediente
        this.isExpedient = data.recordId ? true : false;
        this.registRequestForm.patchValue(data);
        if (!data?.typeOfTransfer) {
          data.typeOfTransfer = 'MANUAL';
        }
        this.requestData = data as IRequest;
        this.formLoading = false;
        /*request.receptionDate = new Date().toISOString();
        this.object = request as IRequest;
        this.requestData = request as IRequest;
        this.getData(request); */
      },
      error: error => {
        this.formLoading = false;
        this.onLoadToast('error', 'Error', 'No se encontro la solicitud');
        console.log(error.error.message);
      },
    });
  }

  verifyTransDelegaStatiAuthoExist(data: any) {
    if (
      !data.transferenceId ||
      !data.regionalDelegationId ||
      !data.stationId ||
      !data.authorityId
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Sin los campos de transferente, emisora y autoridad no se podran realizar las documentaciones requeridas! ',
        icon: 'error',
        width: 450,
        showCancelButton: false,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#b38e5d',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(async result => {
        if (result.isConfirmed) {
        }
      });
    }
  }

  setRequiredFields(data: any) {
    if (data.transferenceId == 1 || data.transferenceId == 120) {
      this.registRequestForm.controls['paperDate'].setValidators([
        Validators.required,
      ]);
      this.registRequestForm.controls['previousInquiry'].setValidators([
        Validators.required,
      ]);
      this.registRequestForm.controls['circumstantialRecord'].setValidators([
        Validators.required,
      ]);
      this.pgr = true;
    } else {
      this.registRequestForm.controls['paperDate'].setValidators([
        Validators.required,
      ]);
      this.pgr = false;
    }
    this.registRequestForm.updateValueAndValidity();
  }

  getTransferent(idTransferent: number) {
    return new Promise((resolve, reject) => {
      if (idTransferent) {
        this.transferentService.getById(idTransferent).subscribe(data => {
          this.transferentName = data.nameTransferent;
          resolve(true);
        });
      } else {
        this.transferentName = '';
      }
    });
  }

  getRegionalDelegation(idDelegation: number) {
    return new Promise((resolve, reject) => {
      this.delegationService.getById(idDelegation).subscribe(data => {
        this.delegationName = data.description;
        resolve(true);
      });
    });
  }

  getStateOfRepublic(idState: number) {
    return new Promise((resolve, reject) => {
      this.stateOfRepublicService.getById(idState).subscribe(data => {
        this.stateOfRepublicName = data.descCondition;
        resolve(true);
      });
    });
  }

  getAuthority(idTransferent: number, idStation: number, idAuthority: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idStation'] = `$eq:${idStation}`;
      params['filter.idTransferer'] = `$eq:${idTransferent}`;
      params['filter.idAuthority'] = `$eq:${idAuthority}`;
      this.authorityService.getAll(params).subscribe({
        next: data => {
          this.authorityName = data.data[0].authorityName;
          resolve(true);
        },
        error: error => {
          this.authorityName = '';
          resolve(true);
        },
      });
    });
  }

  getStation(idTransferent: number, idStation: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${idStation}`;
      params['filter.idTransferent'] = `$eq:${idTransferent}`;
      this.stationService.getAll(params).subscribe({
        next: data => {
          this.stationName = data.data[0].stationName;
          resolve(true);
        },
        error: error => {
          this.stationName = '';
          resolve(true);
        },
      });
    });
  }

  setView(path: string): void {
    switch (path) {
      case 'registration-request':
        this.requestRegistration = true;
        break;
      case 'verify-compliance':
        this.complianceVerifi = true;
        break;
      case 'classify-assets':
        this.classifyAssets = true;
        break;
      case 'validate-document':
        this.validateDocument = true;
        break;
      case 'notify-clarification-inadmissibility':
        this.notifyClarifiOrImpropriety = true;
        break;
      case 'process-approval':
        this.approvalProcess = true;
        break;
      default:
        this.requestRegistration = true;
        break;
    }
  }

  intiTabs(): void {
    if (this.requestRegistration == true) {
      this.tab1 = 'Registro de Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Domicilio de la Transferente';
      this.tab4 = 'Asociar Expediente';
      this.tab5 = 'Expediente';
      this.btnTitle = 'Verificar Cumplimiento';
      this.typeDocument = 'captura-solicitud';
    } else if (this.complianceVerifi == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Verificar Cumplimiento';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Clasificar Bien';
      this.typeDocument = 'verificar-cumplimiento';
    } else if (this.classifyAssets == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Clasificación de Bienes';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Destino Documental';
      this.typeDocument = 'clasificar-bienes';
    } else if (this.validateDocument) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Aclaraciones';
      this.tab3 = 'Identifica Destino Documental';
      this.btnTitle = 'Solicitar Aprobación';
      this.typeDocument = 'validar-destino-bien';
    } else if (this.notifyClarifiOrImpropriety) {
      this.tab1 = 'Detalle de la Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Terminar';
      this.btnSaveTitle = 'Guardar';
      this.typeDocument = 'validar-notificar-aclaracion';
    } else if (this.approvalProcess) {
      this.tab1 = 'Detalle de la Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Domicilio de la Transferente';
      this.tab4 = 'Verificación del Cumplimiento';
      this.tab5 = 'Expediente';
      this.btnTitle = 'Aprobar';
      this.btnSaveTitle = '';
      this.typeDocument = 'proceso-aprovacion';
    }
  }

  getFractionCode(fractionId: number) {
    return new Promise((resolve, reject) => {
      this.fractionService.getById(fractionId).subscribe({
        next: resp => {
          if (resp.fractionCode) {
            resolve(resp.fractionCode);
          } else {
            resolve('');
          }
        },
        error: error => {},
      });
    });
  }

  //obtiene el bien inmueble
  getGoodRealEstate(id: number | string) {
    return new Promise((resolve, reject) => {
      this.goodEstateService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {},
      });
    });
  }

  finish() {
    const typeCommit = 'finish';
    this.msgSaveModal(
      'Finalizar Solicitud',
      '¿Está seguro de finalizar la solicitud actual?',
      'Confirmación',
      undefined,
      typeCommit
    );
  }

  returnar() {
    const typeCommit = 'returnar';
    this.msgSaveModal(
      'Finalizar Solicitud',
      '¿Está seguro de finalizar la solicitud actual?',
      'Confirmación',
      undefined,
      typeCommit
    );
  }

  getAsyncRequestById() {
    return new Promise((resolve, reject) => {
      if (this.requestData.id) {
        this.requestService.getById(this.requestData.id).subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {},
        });
      } else {
        resolve(null);
      }
    });
  }

  async finishMethod() {
    const request = this.requestData;
    request.requestStatus = 'FINALIZADA';
    const updateReq = await this.updateRequest(this.requestData);
    if (updateReq) {
      //const oldTask: any = await this.getOldTask();
      //if (oldTask.assignees != '') {
      const user: any = this.authService.decodeToken();
      const title = `Registro de solicitud (Aprobar Solicitud) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/process-approval';
      const from = 'DESTINO_DOCUMENTAL';
      const to = 'SOLICITAR_APROBACION';
      const taskRes = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        true,
        this.task.id,
        user.username,
        'SOLICITUD_TRANSFERENCIA',
        'Registro_Solicitud',
        'FINALIZAR'
      );
      if (taskRes) {
        this.msgGuardado(
          'success',
          'Solicitud Finalizada',
          `Se finalizo la solicitud con el folio: ${this.requestData.id}`
        );
      }
      // }
    }
  }

  returnarMethod() {
    this.openModal(SelectTypeUserComponent, this.requestData, 'returnado');
  }

  confirm() {
    this.msgSaveModal(
      'Aceptar',
      'Asegúrese de haber guardado la información antes de turnar la solicitud',
      'Confirmación',
      undefined,
      this.typeDocument
    );
  }

  //metodo que guarda la captura de solivitud
  public async confirmMethod() {
    /* trae solicitudes actualizadas */
    const request = await this.getAsyncRequestById();
    if (request) {
      /* valida campos */
      const result = await this.registrationHelper.validateForm(request);
      if (result === true) {
        /* abre modal del elegir usuario */
        this.cambiarTipoUsuario(this.requestData);
      }
    }
  }

  cambiarTipoUsuario(request: any) {
    this.openModal(
      SelectTypeUserComponent,
      request,
      'commit-request',
      this.task
    );
  }
  /* Fin guardar captura de solicitud */

  getResponse(event: any) {
    console.log('respuesta: ', event);
    this.verifyResp = event;
  }

  /* Metodo para guardar la Verificacion de cumplimientos */
  async verifyComplianceMethod() {
    this.loader.load = true;
    const title = `Registro de solicitud (Clasificar Bien) con folio: ${this.requestData.id}`;
    const url = 'pages/request/transfer-request/classify-assets';
    const from = 'VERIFICAR_CUMPLIMIENTO';
    const to = 'CLASIFICAR_BIEN';
    console.log(this.task);
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Verificar_Cumplimiento',
      'APPROVE'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Turnado Exitoso',
        `Se guardó la solicitud con el folio: ${this.requestData.id}`
      );
    }
  }
  /* Fin Metodo para guardar verifucacion cumplimiento */

  /* Metodo para guardar la clasificacion de bienes */
  async classifyGoodMethod() {
    this.loader.load = true;
    const title = `Registro de solicitud (Destino Documental) con folio: ${this.requestData.id}`;
    const url = 'pages/request/transfer-request/validate-document';
    const from = 'CLASIFICAR_BIEN';
    const to = 'DESTINO_DOCUMENTAL';
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Clasificar_Bien',
      'VALIDAR_DOCUMENTACION'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Turnado Exitoso',
        `Se guardó la solicitud con el folio: ${this.requestData.id}`
      );
    }
    //}
  }
  /* Fin Metodo para guardar clasificacion de bienes */

  /* Metodo de destino documental */
  async destinyDocumental() {
    this.loader.load = true;
    const title = `Registro de solicitud (Aprobar Solicitud) con folio: ${this.requestData.id}`;
    const url = 'pages/request/transfer-request/process-approval';
    const from = 'DESTINO_DOCUMENTAL';
    const to = 'SOLICITAR_APROBACION';
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Destino_Documental',
      'APROBAR_SOLICITUD'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Turnado Exitoso',
        `Se guardó la solicitud con el folio: ${this.requestData.id}`
      );
    }
  }
  /* Fin metodo destino documental */

  saveClarification(): void {
    this.saveClarifiObject = true;
  }

  /* Metodo para notificacion de aclaraciones */
  async notifyClarificationsMethod() {
    this.loader.load = true;
    const title = `Notificar Aclaración-Improcedencia, No. Solicitud: ${this.requestData.id}`;
    const url =
      'pages/request/transfer-request/notify-clarification-inadmissibility';
    const from = 'VERIFICAR_CUMPLIMIENTO';
    const to = 'NOTIFICAR_ACLARACIONES';
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Destino_Documental',
      'NOTIFICAR_ACLARACIONES'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Notificación Creada',
        `Se generó una Notificación de Aclaración con el folio: ${this.requestData.id}`
      );
    }
  }
  /* Fin Metodo para guardar verifucacion cumplimiento */

  /* Metodo para crear solo aprovacion de solicitud */
  createApprovalProcessOnly() {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let task: any = {};
      task['id'] = 0;
      task['assignees'] = this.task.assignees;
      task['assigneesDisplayname'] = this.task.displayName;
      task['creator'] = user.username;
      task['taskNumber'] = Number(this.requestData.id);
      task[
        'title'
      ] = `Registro de solicitud (Aprobar Solicitud) con folio: ${this.requestData.id}`;
      task['programmingId'] = 0;
      task['requestId'] = this.requestData.id;
      task['expedientId'] = this.requestData.recordId;
      task['urlNb'] = 'pages/request/transfer-request/process-approval';

      this.taskService.createTask(task).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error);
          reject(false);
          this.onLoadToast(
            'error',
            'Error',
            'No se pudo crear la tarea de Aprovación de Solicitud'
          );
        },
      });
    });
  }
  /* FIN CREAR SOLO TAREA APROVACION DE SOLICITUD */

  /* Cerrar la tarea de validacion documental */
  async closeValidateDocumentation() {
    const title = `Cerrar tarea de (Destino-Documental), No. Solicitud: ${this.requestData.id}`;
    const url =
      'pages/request/transfer-request/notify-clarification-inadmissibility';
    const from = 'VERIFICAR_CUMPLIMIENTO';
    const to = 'NOTIFICAR_ACLARACIONES';
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Destino_Documental',
      'APROBAR_SOLICITUD_AA'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Turnado Exitoso',
        `Se Turno la solicitud con el folio: ${this.requestData.id}`
      );
      console.log('Tarea Cerrada');
    }
  }
  /* FIN CERRAR VALIDACION DOCUMENTAL */

  close() {
    this.registRequestForm.reset();
    this.router.navigate(['pages/siab-web/sami/consult-tasks']);
  }

  async signDictum() {
    const idSolicitud = this.route.snapshot.paramMap.get('id');
    const idTypeDoc = this.idTypeDoc;
    const typeAnnex = 'approval-request';
    const sign: boolean = await this.ableToSignDictamen();
    if (sign == false) {
      this.onLoadToast(
        'error',
        'Bienes no aclarados',
        'Algunos bienes aun no se aclarar'
      );
      return;
    }

    this.requestService.getById(idSolicitud).subscribe({
      next: response => {
        const requestData = response;

        let config: ModalOptions = {
          initialState: {
            idSolicitud,
            idTypeDoc,
            typeAnnex,
            requestData,
            callback: (next: boolean) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.bsModalRef = this.modalService.show(
          GenerateDictumComponent,
          config
        );
      },
      error: error => (this.loading = false),
    });
  }

  /** Proceso de aprobacion */
  async approveRequest() {
    const sign: boolean = await this.ableToSignDictamen();

    if (sign == false) {
      this.onLoadToast(
        'error',
        'Bienes no aclarados',
        'Algunos bienes aun no se aclarar'
      );
      return;
    }

    this.msgSaveModal(
      'Aprobar',
      '¿Desea turnar la solicitud con folio: ' + this.requestData.id + '?',
      'Confirmación',
      undefined,
      this.typeDocument
    );
  }

  async approveRequestMethod() {
    this.loader.load = true;
    //no tiene aclaraciones
    const haveClarifications = await this.haveNotificacions();
    if (haveClarifications === 'POR_ACLARAR') {
      this.onLoadToast(
        'info',
        'No se puede aprobar la solicitud',
        'La solicitud aun cuenta con bienes por aclarar!'
      );
      this.loader.load = false;
      return;
    }

    /*const existDictamen = await this.getDictamen(this.requestData.id);
    if (existDictamen === false) {
      this.onLoadToast(
        'info',
        'No se puede aprobar la solicitud',
        'Es requerido previamente tener firmado el dictamen'
      );
      this.loader.load = false;
      return;
    }*/

    const title = ``;
    const url = '';
    const from = 'SOLICITAR_APROBACION';
    const to = 'APROBADO';
    const user: any = this.authService.decodeToken();
    const taskResult = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Aprobar_Solicitud',
      'TURNAR'
    );
    if (taskResult === true) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Turnado Exitoso',
        `Se guardó la solicitud con el folio: ${this.requestData.id}`
      );
    }
  }
  /** fin de proceso */

  /* Inicio de rechazar aprovacion */
  async refuseRequest() {
    const sign: boolean = await this.ableToSignDictamen();

    if (sign == false) {
      this.onLoadToast(
        'error',
        'Bienes no aclarados',
        'Algunos bienes aun no se aclarar'
      );
      return;
    }

    this.msgSaveModal(
      'Rechazar',
      '¿Desea rechazar la solicitud con el folio: ' + this.requestData.id + '?',
      'Confirmación',
      undefined,
      'refuse'
    );
  }

  async refuseMethod() {
    const haveClarifications = await this.haveNotificacions();
    if (haveClarifications === 'POR_ACLARAR') {
      this.onLoadToast(
        'info',
        'No se puede rechazar la solicitud',
        'La solicitud aun cuenta con bienes por aclarar!'
      );
      this.loader.load = false;
      return;
    }

    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Registro de solicitud (Verificar Cumplimiento) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/verify-compliance';
      const from = 'SOLICITAR_APROBACION';
      const to = 'VERIFICAR_CUMPLIMIENTO';
      const user: any = this.authService.decodeToken();
      const taskResult = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        false,
        this.task.id,
        user.username,
        'SOLICITUD_TRANSFERENCIA',
        'Aprobar_Solicitud',
        'RECHAZAR'
      );
      if (taskResult === true) {
        this.msgGuardado(
          'success',
          'Turnado Exitoso',
          `Se guardó la solicitud con el folio: ${this.requestData.id}`
        );
      }
    }
  }
  /* Fin rechazo de aprovacion */

  updateRequest(request: any) {
    return new Promise((resolve, reject) => {
      this.requestService.update(request.id, request).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          reject(true);
        },
      });
    });
  }

  createTaskOrderService(
    request: any,
    title: string,
    url: string,
    from: string,
    to: string,
    closetask: boolean,
    taskId: string | number,
    userProcess: string,
    type: string,
    subtype: string,
    ssubtype: string
  ) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: any = {};

      if (closetask) {
        body['idTask'] = taskId;
        body['userProcess'] = userProcess;
      }
      body['type'] = type;
      body['subtype'] = subtype;
      body['ssubtype'] = ssubtype;

      let task: any = {};
      task['id'] = 0;
      task['assignees'] = this.task.assignees;
      task['assigneesDisplayname'] = this.task.displayName;
      task['creator'] = user.username;
      task['taskNumber'] = Number(request.id);
      task['title'] = title;
      task['programmingId'] = 0;
      task['requestId'] = request.id;
      task['expedientId'] = request.recordId;
      task['urlNb'] = url;
      body['task'] = task;

      let orderservice: any = {};
      orderservice['pActualStatus'] = from;
      orderservice['pNewStatus'] = to;
      orderservice['pIdApplication'] = request.id;
      orderservice['pCurrentDate'] = new Date().toISOString();
      orderservice['pOrderServiceIn'] = '';

      body['orderservice'] = orderservice;

      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  getOldTask() {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('requestId', this.requestData.id);
      const filter = params.getParams();
      this.taskService.getAll(filter).subscribe({
        next: resp => {
          const task = {
            assignees: resp.data[0].assignees,
            assigneesDisplayname: resp.data[0].assigneesDisplayname,
          };
          resolve(task);
        },
        error: error => {
          this.message('error', 'Error', 'Error al obtener la tarea antigua');
          reject(error.error.message);
        },
      });
    });
  }

  getDictamen(id: number) {
    return new Promise((resolve, reject) => {
      let body: any = {};
      body['xidSolicitud'] = id;
      body['xTipoDocumento'] = 50;
      this.wcontentService.getDocumentos(body, new ListParams()).subscribe({
        next: resp => {
          if (resp.data.length > 0) {
            this.haveDictamen = true;
            resolve(true);
          } else {
            this.haveDictamen = false;
            resolve(false);
          }
        },
        error: error => {
          this.haveDictamen = false;
          resolve(false);
        },
      });
    });
  }

  msgSaveModal(
    btnTitle: string,
    message: string,
    title: string,
    typeMsg: any,
    typeCommit?: string
  ) {
    Swal.fire({
      title: title,
      text: message,
      icon: typeMsg,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: btnTitle,
      cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        if (typeCommit === 'finish') {
          this.finishMethod();
        }
        if (typeCommit === 'returnar') {
          this.returnarMethod();
        }
        if (typeCommit === 'captura-solicitud') {
          this.confirmMethod();
        }
        if (typeCommit === 'verificar-cumplimiento') {
          this.question = true;
          setTimeout(async () => {
            console.log('estado verificar:', this.verifyResp);
            if (this.verifyResp === 'turnar') {
              await this.updateGoodStatus('CLASIFICAR_BIEN');
              this.verifyComplianceMethod();
            } else if (this.verifyResp === 'sin articulos') {
              this.verifyCumplianteMsg(
                'Error',
                'Para que la solicitud pueda turnarse es requerido seleccionar al menos los primeros 3 cumplimientos del Articulo 3 Ley y 3 del Articulo 12',
                'error'
              );
            } else if (this.verifyResp === 'sin guardar') {
              this.verifyCumplianteMsg(
                'No se pudo turnar la solicitud',
                'Guarde el formulario antes de turnar la solicitud',
                'info'
              );
            }
            this.question = false;
          }, 400);
        }
        if (typeCommit === 'clasificar-bienes') {
          await this.updateGoodStatus('DESTINO_DOCUMENTAL');
          //creat tarea para destino documental
          this.classifyGoodMethod();
        }
        if (typeCommit === 'validar-destino-bien') {
          this.loader.load = true;
          await this.updateGoodStatus('SOLICITAR_APROBACION');
          const clarification = await this.haveNotificacions();
          console.log(clarification);
          this.loader.load = false;
          if (clarification === 'POR_ACLARAR') {
            const result = await this.createApprovalProcessOnly();
            if (result) {
              await this.notifyClarificationsMethod();
            }
          } else if (clarification === 'ACLARADO') {
            const user: any = this.authService.decodeToken();
            const body: any = {};
            body.id = this.requestData.id;
            body.rulingCreatorName = user.name;
            await this.updateRequest(body);
            await this.closeValidateDocumentation();
          } else if (clarification === 'SIN_ACLARACIONES') {
            const user: any = this.authService.decodeToken();
            const body: any = {};
            body.id = this.requestData.id;
            body.rulingCreatorName = user.name;
            await this.updateRequest(body);
            await this.destinyDocumental();
          }
        }
        if (typeCommit === 'proceso-aprovacion') {
          await this.updateGoodStatus('APROBADO');
          this.approveRequestMethod();
        }

        if (typeCommit === 'refuse') {
          await this.updateGoodStatus('VERIFICAR_CUMPLIMIENTO');
          this.refuseMethod();
        }
      }
    });
  }

  //revisar las pruebas
  haveNotificacions() {
    return new Promise((resolve, reject) => {
      let params = new FilterParams();
      params.addFilter('applicationId', this.requestData.id);
      //params.addFilter('processStatus', '$not:VERIFICAR_CUMPLIMIENTO'); //ACLARADO
      let filter = params.getParams();
      this.goodResDevService.getAllGoodResDev(filter).subscribe({
        next: (resp: any) => {
          const goodsClarified = resp.data.filter(
            (x: any) => x.good.goodStatus === 'ACLARADO'
          );

          const goodsImprocedente = resp.data.filter(
            (x: any) => x.good.goodStatus === 'IMPROCEDENTE'
          );

          if (goodsClarified.length > 0 || goodsImprocedente.length > 0) {
            resolve('ACLARADO');
          } else {
            resolve('POR_ACLARAR');
          }
          console.log(goodsClarified);
        },
        error: (error: any) => {
          resolve('SIN_ACLARACIONES');
          this.loader.load = false;
          /*this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo obtener el bien-res-dev'
          );*/
        },
      });
    });
  }

  async updateGoodStatus(newProcessStatus: string) {
    let goods: any = await this.getAllGood();
    goods.data.map(async (good: any) => {
      //consultar si aclarado puede volver a modificarse
      if (
        good.processStatus != 'SOLICITAR_ACLARACION' &&
        good.processStatus != 'IMPROCEDENTE' &&
        good.processStatus != 'SOLICITAR_APROBACION'
      ) {
        let body: any = {};
        body.id = good.id;
        body.goodId = good.goodId;
        body.processStatus = newProcessStatus;
        await this.updateGood(body);
      }
    });
  }

  getAllGood() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.requestId'] = `$eq:${this.requestData.id}`;
      this.goodService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject('error');
          console.log(error);
          this.onLoadToast(
            'error',
            'Error en los bienes',
            'Error al obtener los bienes'
          );
        },
      });
    });
  }

  updateGood(body: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error);
          reject(false);
        },
      });
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  openModal(
    component: any,
    data?: any,
    typeAnnex?: String,
    task?: number
  ): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        task: task,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }

  async ableToSignDictamen() {
    const goods: any = await this.getAllGood();
    let canSign: boolean = false;
    const filter = goods.data.filter(
      (x: any) =>
        x.processStatus == 'SOLICITAR_APROBACION' ||
        x.processStatus == 'IMPROCEDENTE'
    );

    return filter.length == goods.count ? true : false;
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.close();
      }
    });
  }

  verifyCumplianteMsg(title: string, text: string, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#AD4766',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
      }
    });
  }
}
