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
    private wcontentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
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
      next: resp => {
        if (resp === true) {
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
          Validators.maxLength(30),
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
      paperDate: [null, [Validators.required]],
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
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(60))],
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

        //verifica si la solicitud tiene expediente, si tiene no muestra el tab asociar expediente
        this.isExpedient = data.recordId ? true : false;
        this.registRequestForm.patchValue(data);
        this.requestData = data as IRequest;
        this.formLoading = false;
        /*request.receptionDate = new Date().toISOString();
      this.object = request as IRequest;
      this.requestData = request as IRequest;
      this.getData(request); */
      },
      error: error => {
        this.formLoading = false;
        /*if (error.error.message === 'No se encontraron registros.') {
          this.router.navigate(['pages/request/list']);
        }*/
      },
    });
  }

  getTransferent(idTransferent: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(idTransferent).subscribe(data => {
        this.transferentName = data.nameTransferent;
        resolve(true);
      });
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

  getGoodQuantity(requestId: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.requestId'] = `$eq:${requestId}`;
      this.goodService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {},
      });
    });
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
      'Esta seguro de finalizar la solicitud actual?',
      'Confirmación',
      undefined,
      typeCommit
    );
  }

  returnar() {
    const typeCommit = 'returnar';
    this.msgSaveModal(
      'Finalizar Solicitud',
      'Esta seguro de finalizar la solicitud actual?',
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
      const oldTask: any = await this.getOldTask();
      if (oldTask.assignees != '') {
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
          oldTask
        );
        if (taskRes) {
          this.msgGuardado(
            'success',
            'Solicitud Finalizada',
            `Se finalizo la solicitud con el folio: ${this.requestData.id}`
          );
        }
      }
    }
  }

  returnarMethod() {
    this.openModal(SelectTypeUserComponent, this.requestData, 'returnado');
  }

  confirm() {
    this.msgSaveModal(
      'Aceptar',
      'Asegurse de tener guardado los formularios antes de turnar la solicitud!',
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
    this.openModal(SelectTypeUserComponent, request, 'commit-request');
  }
  /* Fin guardar captura de solicitud */

  /* Metodo para guardar la Verificacion de cumplimientos */
  async verifyComplianceMethod() {
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Registro de solicitud (Clasificar Bien) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/classify-assets';
      const from = 'VERIFICAR_CUMPLIMIENTO';
      const to = 'CLASIFICAR_BIEN';

      const taskRes = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        oldTask
      );
      if (taskRes) {
        this.msgGuardado(
          'success',
          'Turnado Exitoso',
          `Se guardó la solicitud con el folio: ${this.requestData.id}`
        );
      }
    }
  }
  /* Fin Metodo para guardar verifucacion cumplimiento */

  /* Metodo para guardar la clasificacion de bienes */
  async classifyGoodMethod() {
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Registro de solicitud (Destino Documental) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/validate-document';
      const from = 'CLASIFICAR_BIEN';
      const to = 'DESTINO_DOCUMENTAL';
      const taskRes = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        oldTask
      );
      if (taskRes) {
        this.msgGuardado(
          'success',
          'Turnado Exitoso',
          `Se guardó la solicitud con el folio: ${this.requestData.id}`
        );
      }
    }
  }
  /* Fin Metodo para guardar clasificacion de bienes */

  /* Metodo de destino documental */
  async destinyDocumental() {
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
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
        oldTask
      );
      if (taskRes) {
        this.msgGuardado(
          'success',
          'Turnado Exitoso',
          `Se guardó la solicitud con el folio: ${this.requestData.id}`
        );
      }
    }
  }
  /* Fin metodo destino documental */

  saveClarification(): void {
    this.saveClarifiObject = true;
  }

  close() {
    this.registRequestForm.reset();
    this.router.navigate(['pages/siab-web/sami/consult-tasks']);
  }

  signDictum() {
    const idDoc = this.route.snapshot.paramMap.get('id');
    const idTypeDoc = this.idTypeDoc;
    const typeAnnex = 'approval-request';

    this.requestService.getById(idDoc).subscribe({
      next: response => {
        this.requestList = response;

        let config: ModalOptions = {
          initialState: {
            idDoc,
            idTypeDoc,
            typeAnnex,
            response,
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

    //this.openModal(GenerateDictumComponent, idDoc, 'approval-request');
  }

  /** Proceso de aprobacion */
  approveRequest() {
    this.msgSaveModal(
      'Aprobar',
      'Deseas turnar la solicitud con folio: ' + this.requestData.id + '?',
      'Confirmación',
      undefined,
      this.typeDocument
    );
  }

  async approveRequestMethod() {
    const existDictamen = await this.getDictamen(this.requestData.id);
    if (existDictamen === false) {
      this.onLoadToast(
        'info',
        'Error',
        'Es requerido tener dictamen previamente generado'
      );
      return;
    }
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Solicitud de Programacion con el folio: ${this.requestData.id}`;
      const url = 'pages/request/programming-request/schedule-reception';
      const from = 'SOLICITAR_APROBACION';
      const to = 'APROBADO';
      const taskResult = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        oldTask
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
  /** fin de proceso */

  /* Inicio de rechazar aprovacion */
  refuseRequest() {
    this.msgSaveModal(
      'Rechazar',
      'Deseas rechazar la solicitud con folio: ' + this.requestData.id + '?',
      'Confirmación',
      undefined,
      'refuse'
    );
  }

  async refuseMethod() {
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Registro de solicitud (Verificar Cumplimiento) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/verify-compliance';
      const from = 'SOLICITAR_APROBACION';
      const to = 'VERIFICAR_CUMPLIMIENTO';
      const taskResult = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        oldTask
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
          if (resp.id !== null) {
            resolve(true);
          }
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
    oldTask: any
  ) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: any = {};
      body['type'] = 'SOLICITUD TRANSFERENCIA'; //
      let task: any = {};
      task['id'] = 0;
      task['assignees'] = oldTask.assignees;
      task['assigneesDisplayname'] = oldTask.assigneesDisplayname;
      task['creator'] = user.username;
      task['taskNumber'] = Number(request.id);
      task['title'] = title;
      task['programmingId'] = 0;
      task['requestId'] = request.id;
      task['expedientId'] = 0;
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
      this.wcontentService.getDocumentos(body).subscribe({
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
    }).then(result => {
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
          this.verifyComplianceMethod();
        }
        if (typeCommit === 'clasificar-bienes') {
          this.classifyGoodMethod();
        }
        if (typeCommit === 'validar-destino-bien') {
          this.destinyDocumental();
        }

        if (typeCommit === 'proceso-aprovacion') {
          this.approveRequestMethod();
        }

        if (typeCommit === 'refuse') {
          this.refuseMethod();
        }
      }
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
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
    this.bsModalRef = this.modalService.show(component, config);
  }

  /* dinamyCallFrom() {
    this.registRequestForm.valueChanges.subscribe(data => {
      this.requestData = data;
    });
  }
 */
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
}
