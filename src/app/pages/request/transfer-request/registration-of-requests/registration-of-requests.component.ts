import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup } from 'src/app/core/interfaces/model-form';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
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
    private registrationHelper: RegistrationHelper
  ) {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.title = 'Registro de solicitud con folio: ' + id;
    let path: any = window.location.pathname.split('/');
    this.setView(path[4]);
    this.intiTabs();
    this.prepareForm();
    this.getRequest(id);
    this.associateExpedientListener();
    this.dinamyCallFrom();
  }

  //cambia el estado del tab en caso de que se asocie un expediente a la solicitud
  associateExpedientListener() {
    this.requestHelperService.currentExpedient.subscribe({
      next: resp => {
        if (resp === true) {
          this.isExpedient = resp;
          this.staticTabs.tabs[0].active = true;
        }
      },
    });
  }

  prepareForm() {
    //formulario de solicitudes
    this.registRequestForm = this.fb.group({
      applicationDate: [null],
      recordId: [null],
      paperNumber: [null, [Validators.required, Validators.maxLength(30)]],
      regionalDelegationId: [null],
      keyStateOfRepublic: [null],
      transferenceId: [null],
      stationId: [null],
      authorityId: [null],
      //typeUser: [''],
      //receiUser: [''],
      id: [null],
      urgentPriority: [null],
      priorityDate: [null],
      originInfo: [null],
      receptionDate: [{ value: null, disabled: true }],
      paperDate: [null, [Validators.required]],
      typeRecord: [null],
      publicMinistry: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      nameOfOwner: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //nombre remitente
      holderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //cargo remitente
      phoneOfOwner: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(30)],
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
      receiptRoute: [null],
      destinationManagement: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      indicatedTaxpayer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      affair: [null],
      transferEntNotes: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      transferenceFile: [null],
      previousInquiry: [null],
      trialType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      circumstantialRecord: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      lawsuit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      tocaPenal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      protectNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  getRequest(id: any) {
    this.requestService.getById(id).subscribe({
      next: data => {
        this.infoRequest = data;
        this.getTransferent(data.transferenceId);
        this.getRegionalDelegation(data.regionalDelegationId);
        this.getStateOfRepublic(data.keyStateOfRepublic);
        this.getAuthority(data.authorityId);
        this.getStation(data.stationId);
        //verifica si la solicitud tiene expediente, si tiene no muestra el tab asociar expediente
        this.isExpedient = data.recordId ? true : false;

        this.registRequestForm.patchValue(data);
        /*request.receptionDate = new Date().toISOString();
      this.object = request as IRequest;
      this.requestData = request as IRequest;
      this.getData(request); */
      },
      error: error => {
        console.log(error.error.message);
        /*if (error.error.message === 'No se encontraron registros.') {
          this.router.navigate(['pages/request/list']);
        }*/
      },
    });
  }

  // private getData({
  //   idTransferent,
  //   regionalDelegationId,
  //   keyStateOfRepublic,
  //   authorityId,
  //   stationId,
  // }: any) {
  //   const obsTransferent = this.transferentService.getById(idTransferent);
  //   const obsDelegation = this.delegationService.getById(regionalDelegationId);
  //   const obsStateOfRepublic =
  //     this.stateOfRepublicService.getById(keyStateOfRepublic);
  //   const obsAuthority = this.authorityService.getById(authorityId);
  //   const obsStation = this.stationService.getById(stationId);
  //   forkJoin([
  //     obsTransferent,
  //     obsDelegation,
  //     obsStateOfRepublic,
  //     obsAuthority,
  //     obsStation,
  //   ]).subscribe({
  //     next: ([transferent, delegation, stateRepublic, authority, station]) => {
  //       if (transferent) {
  //         this.transferentName = transferent.nameTransferent;
  //       }
  //       if (delegation) {
  //         this.delegationName = delegation.description;
  //       }
  //       if (stateRepublic) {
  //         this.stateOfRepublicName = stateRepublic.descCondition;
  //       }
  //       if (authority) {
  //         this.authorityName = authority.authorityName;
  //       }
  //       if (station) {
  //         this.stationName = station.stationName;
  //       }
  //     },
  //   });
  // }

  getTransferent(idTransferent: number) {
    this.transferentService.getById(idTransferent).subscribe(data => {
      this.transferentName = data.nameTransferent;
    });
  }

  getRegionalDelegation(idDelegation: number) {
    this.delegationService.getById(idDelegation).subscribe(data => {
      this.delegationName = data.description;
    });
  }

  getStateOfRepublic(idState: number) {
    this.stateOfRepublicService.getById(idState).subscribe(data => {
      this.stateOfRepublicName = data.descCondition;
    });
  }

  getAuthority(idAuthority: number) {
    this.authorityService.getById(idAuthority).subscribe(data => {
      this.authorityName = data.authorityName;
    });
  }

  getStation(idStation: number) {
    this.stationService.getById(idStation).subscribe(data => {
      this.stationName = data.stationName;
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
      this.btnTitle = 'Aprovar';
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
      });
    });
  }

  finish() {
    this.requestData.requestStatus = 'FINALIZADA';
    const typeCommit = 'finish';
    this.msgSaveModal(
      'Finalizar Solicitud',
      'Asegurse de guardar toda la información antes de Finalizar la solicitud!',
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
        });
      } else {
        resolve(null);
      }
    });
  }

  finishMethod() {
    this.requestService
      .update(this.requestData.id, this.requestData)
      .subscribe({
        next: resp => {
          if (resp.statusCode !== null) {
            this.message('error', 'Error', 'Ocurrio un error al guardar');
          }
          if (resp.id !== null) {
            this.message(
              'success',
              'Solicitud Guardada',
              'Se guardo la solicitud correctamente'
            );
          }
        },
      });
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

  //metodo que guarda la verificacion
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

  verifyComplianceMethod() {}

  saveClarification(): void {
    this.saveClarifiObject = true;
  }

  close() {
    this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  signDictum() {
    this.openModal(GenerateDictumComponent, '', 'approval-request');
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
        if (typeCommit === 'captura-solicitud') {
          this.confirmMethod();
        }

        if (typeCommit === 'verificar-cumplimiento') {
          this.verifyComplianceMethod();
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

    /*  this.BsModal.content.event.subscribe((res: any) => {
      console.log(res);
    }); */
  }

  dinamyCallFrom() {
    this.registRequestForm.valueChanges.subscribe(data => {
      this.requestData = data;
    });
  }
}
