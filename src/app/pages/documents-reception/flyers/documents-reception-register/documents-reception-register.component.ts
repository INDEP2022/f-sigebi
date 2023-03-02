import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, merge, Observable, takeUntil } from 'rxjs';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { TvalTable1Data } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import {
  ITransferente,
  ITransferingLevelView,
} from 'src/app/core/models/catalogs/transferente.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { ITmpNotification } from 'src/app/core/models/ms-notification/tmp-notification.model';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { TmpExpedientService } from 'src/app/core/services/ms-expedient/tmp-expedient.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { TmpNotificationService } from 'src/app/core/services/ms-notification/tmp-notification.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppState } from '../../../../app.reducers';
import { ITempExpedient } from '../../../../core/models/ms-expedient/tmp-expedient.model';
import { FlyerPersontype } from '../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { ICountAffairOptions } from '../../../../core/models/ms-interfacesat/ms-interfacesat.interface';
import { IInstitutionNumber } from '../../../../core/models/ms-notification/notification.model';
import { IProceduremanagement } from '../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from '../../../../core/services/authentication/auth.service';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from '../../../../core/services/catalogs/issuing-institution.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { TmpGestRegDocService } from '../../../../core/services/ms-flier/tmp-gest-reg-doc.service';
import { CatalExpSatService } from '../../../../core/services/ms-interfacesat/catal-exp-sat.service';
import { SatTransferService } from '../../../../core/services/ms-interfacesat/sat-transfer.service';
import { MassiveGoodService } from '../../../../core/services/ms-massivegood/massive-good.service';
import { ProtectionService } from '../../../../core/services/ms-protection/protection.service';
import { IGlobalVars } from '../../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../../shared/global-vars/services/global-vars.service';
import { DocReceptionTrackRecordsModalComponent } from './components/doc-reception-track-records-modal/doc-reception-track-records-modal.component';
import { DocumentsReceptionFlyerSelectComponent } from './components/documents-reception-flyer-select/documents-reception-flyer-select.component';
import {
  DOCUMENTS_RECEPTION_SELECT_AFFAIR_COLUMNS,
  DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS,
} from './interfaces/columns';
import {
  DocuentsReceptionRegisterFormChanges,
  DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM,
  DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM,
  DOCUMENTS_RECEPTION_REGISTER_FORM,
  DOC_RECEPT_REG_FIELDS_TO_LISTEN,
  IDocReceptionFlyersRegistrationParams,
  IDocumentsReceptionData,
  IGlobalFlyerRegistration,
  ProcedureStatus,
  TaxpayerLabel,
} from './interfaces/documents-reception-register-form';

@Component({
  selector: 'app-documents-reception-register',
  templateUrl: './documents-reception-register.component.html',
  styles: [],
})
export class DocumentsReceptionRegisterComponent
  extends BasePage
  implements OnInit
{
  documentsReceptionForm = this.fb.group(DOCUMENTS_RECEPTION_REGISTER_FORM);
  flyerCopyRecipientForm = this.fb.group(
    DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM
  );
  flyerCopyCppForm = this.fb.group(DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM);
  valuesChange: DocuentsReceptionRegisterFormChanges = {
    identifier: (value: string) => this.identifierChange(value),
    wheelType: (value: string) => this.wheelTypeChange(value),
    departamentDestinyNumber: (value: string) =>
      this.destinationAreaChange(value),
    affairKey: (value: string) => this.affairChange(value),
    judgementType: (value: string) => this.changeJudgement(value),
    stage: (value: string) => this.stageChange(value),
    autorityNumber: (value: string) => this.authorityChange(value),
  };
  formData: IDocumentsReceptionData = null;
  initialCondition: string = 'A';
  pgrInterface: boolean = false;
  satInterface: boolean = false;
  expedientRecord: number = null;
  // goodRelatedWheelNumber: boolean = false;
  identifier: string = null;
  //TODO: Dejar la delegacion y subdelegacion nulos
  userDelegation: number = 0;
  userSubdelegation: number = 0;
  userId: string;
  existingNotification: boolean = false;
  procedureBlocked: boolean = false;
  procedureStatus: ProcedureStatus = ProcedureStatus.pending;
  initialDate: Date = new Date();
  maxDate: Date = new Date();
  taxpayerLabel: TaxpayerLabel = TaxpayerLabel.Taxpayer;
  identifiers = new DefaultSelect<IIdentifier>();
  subjects = new DefaultSelect<IAffair>();
  cities = new DefaultSelect<ICity>();
  federalEntities = new DefaultSelect<TvalTable1Data>();
  transferors = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authorities = new DefaultSelect<IAuthority>();
  courts = new DefaultSelect<ICourt>();
  publicMinistries = new DefaultSelect<IMinpub>();
  crimes = new DefaultSelect<TvalTable1Data>();
  defendants = new DefaultSelect<IIndiciados>();
  receptionWays = new DefaultSelect<TvalTable1Data>();
  managementAreas = new DefaultSelect<IManagementArea>();
  uniqueKeys = new DefaultSelect<ITransferingLevelView>();
  users = new DefaultSelect<IUser>();
  usersCopy = new DefaultSelect<IUser>();
  globals: IGlobalFlyerRegistration = {
    gNoExpediente: null,
    noVolante: null,
    bn: 0,
    gCreaExpediente: 'S',
    gstMensajeGuarda: '',
    gnuActivaGestion: 1,
    antecede: 0,
    pSatTipoExp: null,
    pIndicadorSat: null,
    gLastCheck: null,
    vTipoTramite: null,
    gCommit: null,
    gOFFCommit: null,
    noTransferente: null,
    gNoVolante: null,
  };
  pageParams: IDocReceptionFlyersRegistrationParams = null;
  globalVars: IGlobalVars;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private docDataService: DocumentsReceptionDataService,
    private notificationService: NotificationService,
    private tmpNotificationService: TmpNotificationService,
    private affairService: AffairService,
    private dynamicTablesService: DynamicTablesService,
    private cityService: CityService,
    private transferentService: TransferenteService,
    private docRegisterService: DocReceptionRegisterService,
    private courtService: CourtService,
    private defendantService: IndiciadosService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private minpubService: MinPubService,
    private indiciadosService: IndiciadosService,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private departamentService: DepartamentService,
    private procedureManageService: ProcedureManagementService,
    private identifierService: IdentifierService,
    private interfacefgrService: InterfacefgrService,
    private expedientService: ExpedientService,
    private tmpExpedientService: TmpExpedientService,
    private tmpGestRegDocService: TmpGestRegDocService,
    private satTransferService: SatTransferService,
    private catExpSatService: CatalExpSatService,
    private authService: AuthService,
    private institutionService: IssuingInstitutionService,
    private protectionService: ProtectionService,
    private flyerCopiesService: CopiesXFlierService,
    private massiveGoodService: MassiveGoodService,
    private store: Store<AppState>,
    private globalVarsService: GlobalVarsService
  ) {
    super();
    if (this.docDataService.flyersRegistrationParams != null)
      this.pageParams = this.docDataService.flyersRegistrationParams;
  }

  private get formControls() {
    return this.documentsReceptionForm.controls;
  }

  get wheelNumber() {
    return this.documentsReceptionForm.controls['wheelNumber'];
  }

  get expedientNumber() {
    return this.documentsReceptionForm.controls['expedientNumber'];
  }

  get stationNumber() {
    return this.documentsReceptionForm.controls['stationNumber'];
  }

  get endTransferNumber() {
    return this.documentsReceptionForm.controls['endTransferNumber'];
  }

  get affairKey() {
    return this.documentsReceptionForm.controls['affairKey'];
  }

  get wheelType() {
    return this.documentsReceptionForm.controls['wheelType'];
  }

  get entFedKey() {
    return this.documentsReceptionForm.controls['entFedKey'];
  }

  get cityNumber() {
    return this.documentsReceptionForm.controls['cityNumber'];
  }

  get delDestinyNumber() {
    return this.documentsReceptionForm.controls['delDestinyNumber'];
  }

  get subDelDestinyNumber() {
    return this.documentsReceptionForm.controls['subDelDestinyNumber'];
  }

  get userRecipient() {
    return this.flyerCopyRecipientForm.controls['copyuser'];
  }

  get userCpp() {
    return this.flyerCopyRecipientForm.controls['copyuser'];
  }

  ngOnInit(): void {
    this.checkParams();
    this.onFormChanges();
    this.getLoggedUserArea();
    this.setDefaultValues();
    this.checkManagementArea();
    // console.log(this.pageParams.pGestOk, this.pageParams.pNoVolante);
    // console.log((this.pageParams.pGestOk === 1), (this.pageParams.pNoVolante !== null));
    // console.log(this.docDataService.documentsReceptionRegisterForm);
    if (this.docDataService.documentsReceptionRegisterForm == null) {
      if (
        this.pageParams.pGestOk === 1 ||
        (this.pageParams.pNoVolante !== null &&
          this.pageParams.pNoVolante !== undefined)
      ) {
        this.setInitialConditions();
      } else {
        this.selectFlyer();
      }
    }
    console.log(this.docDataService.documentsReceptionRegisterForm);
  }

  checkParams() {
    this.getGlobalVars();
    // this.updateGlobalVars('gCommit', 'S');
    //Parametros para pruebas
    // if (this.pageParams == null) {
    //   this.pageParams = {
    //     pGestOk: 1,
    //     pNoVolante: null,
    //     pSatTipoExp: 'PRUEBA',
    //     pNoTramite: 42384,
    //     noTransferente: null,
    //     pIndicadorSat: null,
    //   };
    // }
    console.log(this.pageParams);
    //TODO: Remover if para pruebas
    // if (this.docDataService.documentsReceptionRegisterForm != null) {
    //   this.updateGlobalVars('gCommit', 'S');
    //   this.updateGlobalVars('gOFFCommit', 'S');
    // }
    if (this.globals.gCommit == 'S') {
      if (this.globals.gOFFCommit == 'N') {
        this.postGoodsCapture();
      } else {
        this.deleteDuplicatedGoods();
        this.postGoodsCapture();
      }
    }
  }

  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
      });
  }

  updateGlobalVars<ParamKey extends keyof IGlobalVars>(
    globalVar: ParamKey,
    value: IGlobalVars[ParamKey]
  ) {
    let newState = { ...this.globalVars };
    newState = {
      ...this.globalVars,
      [globalVar]: value,
    };
    this.globalVarsService.updateGlobalVars(newState);
  }

  resetGlobalVars() {
    this.globalVarsService.resetGlobalVars();
  }

  getLoggedUserArea() {
    const token = this.authService.decodeToken();
    this.userId = token.preferred_username;
    const params = new FilterParams();
    params.addFilter('user', token.preferred_username);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          this.userDelegation = data.data[0].delegation1Number;
          this.userSubdelegation = data.data[0].subdelegationNumber;
        }
      },
      error: () => {},
    });
  }

  setInitialConditions() {
    if (this.pageParams.pSatTipoExp != null) {
      const param = new FilterParams();
      param.addFilter('expSat', this.pageParams.pSatTipoExp);
      this.catExpSatService.getAllWithFilters(param.getParams()).subscribe({
        next: data => {
          this.updateGlobalVars('pIndicadorSat', data.data[0].indicatorSat);
        },
        error: () => {},
      });
    }
    if (
      this.pageParams.pGestOk === 1 ||
      (this.pageParams.pNoVolante !== null &&
        this.pageParams.pNoVolante !== undefined)
    ) {
      if (this.pageParams.pNoVolante === null) {
        this.procedureManageService
          .getById(this.pageParams.pNoTramite)
          .subscribe({
            next: data => {
              console.log(data);
              this.useProcedureData(data);
            },
            error: () => {},
          });
      } else {
        this.initialCondition = 'T';
        this.formControls.wheelNumber.setValue(this.pageParams.pNoVolante);
        const param = new FilterParams();
        param.addFilter('wheelNumber', this.pageParams.pNoVolante);
        this.notificationService.getAllFilter(param.getParams()).subscribe({
          next: data => {
            this.formControls.wheelType.setValue(data.data[0].wheelType);
            const { wheelType } = data.data[0];
            if (['A', 'P'].includes(wheelType)) {
              this.initialCondition = 'A';
            } else if (['AT', 'T'].includes(wheelType)) {
              this.initialCondition = wheelType;
            }
          },
        });
      }
    }
  }

  useProcedureData(procedure?: IProceduremanagement) {
    console.log('Initial Conditions');
    console.log(procedure);
    let volante;
    let {
      descentfed,
      affair,
      affairType,
      officeNumber,
      wheelNumber,
      admissionDate,
      typeManagement,
      affairSij,
      delegation,
    } = procedure;
    affairType = Number(affairType);
    typeManagement = Number(typeManagement);
    this.updateGlobalVars('vTipoTramite', typeManagement);
    if (affairType == 5) {
      this.initialCondition = 'T';
    } else if ([1, 2, 3, 4].includes(affairType)) {
      this.initialCondition = 'A';
    } else {
      this.initialCondition = null;
    }
    if (!procedure) {
      volante = this.pageParams.pNoVolante;
    } else {
      volante = wheelNumber;
    }
    if (volante == null) {
      switch (affairType) {
        case 1:
          this.formControls.circumstantialRecord.setValue(affair);
          break;
        case 2:
          this.formControls.protectionKey.setValue(affair);
          break;
        case 3:
          this.formControls.preliminaryInquiry.setValue(affair);
          break;
        case 4:
          this.formControls.criminalCase.setValue(affair);
          break;
        case 5:
          this.formControls.expedientTransferenceNumber.setValue(affair);
          break;
        default:
          break;
      }
      this.dynamicTablesService
        .getTvalTable1ByTableKey(1, { inicio: 1, text: descentfed })
        .subscribe({
          next: data => this.formControls.entFedKey.setValue(data.data[0]),
          error: () => {},
        });
    }
    if ([1, 2].includes(typeManagement)) {
      this.formControls.goodRelation.setValue('S');
      this.alert(
        'info',
        'Tipo de Trámite',
        'Este registro es parte de la interfaz del SAT, en automático se mostrarán los datos correspondientes.'
      );
      this.fillFormSatPgr(
        typeManagement,
        affair,
        officeNumber,
        affairSij,
        delegation
      );
    } else if (typeManagement == 3) {
      this.formControls.goodRelation.setValue('S');
      //TODO: Comentado para pruebas, descomentar al tener el buzon de tramites listo
      // this.pgrInterface = true;
      this.alert(
        'info',
        'Tipo de Trámite',
        'Este registro es parte de la interfaz del PGR, en automático se mostrarán los datos correspondientes.'
      );
      this.fillFormSatPgr(
        typeManagement,
        affair,
        officeNumber,
        affairSij,
        delegation
      );
    }
  }

  fillFormSatPgr(
    typeManagement: number,
    subject: string,
    officeKey: string,
    folio: number,
    delegation: number
  ) {
    let depa: number = 952;
    if (typeManagement == 1) {
      let affairKey;
      let param = new FilterParams();
      if (folio != null) {
        param.addFilter('affairSijNumber', folio);
        this.tmpGestRegDocService
          .getAllWithFilters(param.getParams())
          .subscribe({
            next: data => {
              const { senderExt, affairKey, officeExternalDate, description } =
                data.data[0];
              this.formControls.externalRemitter.setValue(senderExt);
              this.formControls.externalOfficeDate.setValue(officeExternalDate);
              this.formControls.observations.setValue(description);
              this.formControls.affairKey.setValue(affairKey);
              this.affairService.getById(affairKey).subscribe({
                next: data =>
                  this.formControls.affair.setValue(data.description),
              });
            },
            error: () => {},
          });
      }
      this.formControls.officeExternalKey.setValue(officeKey);
      this.formControls.affair.setValue(affairKey);
      param = new FilterParams();
      param.addFilter('description', affairKey, SearchFilter.EQ);
      this.docRegisterService.getAffairsFiltered(param.getParams()).subscribe({
        next: data =>
          this.formControls.affairKey.setValue(data.data[0].id.toString()),
      });
    }
    if (typeManagement == 2) {
      this.satInterface = true;
      this.formControls.wheelType.setValue('T');
      this.initialCondition = 'T';
      let param = new FilterParams();
      param.addFilter('id', 'TRANS');
      this.docRegisterService.getIdentifiers(param.getParams()).subscribe({
        next: data => this.formControls.identifier.setValue(data.data[0]),
      });
      this.getFieldsByManagementArea(typeManagement, subject, officeKey);
      this.formControls.officeExternalKey.setValue(officeKey);
      this.dynamicTablesService.getByTableKeyOtKey(9, 1).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
      param = new FilterParams();
      param.addFilter('id', depa);
      param.addFilter('numDelegation', delegation);
      this.docRegisterService
        .getDepartamentsFiltered(param.getParams())
        .subscribe({
          next: data => {
            if (data.data.length > 0) {
              this.formControls.departamentDestinyNumber.setValue(
                data.data[0].id
              );
              this.formControls.destinationArea.setValue(
                data.data[0].description
              );
              const delegation = data.data[0].numDelegation as IDelegation;
              this.formControls.delDestinyNumber.setValue(delegation.id);
              this.formControls.delegationName.setValue(delegation.description);
              const subdelegation = data.data[0]
                .numSubDelegation as ISubdelegation;
              this.formControls.subDelDestinyNumber.setValue(subdelegation.id);
              this.formControls.subDelegationName.setValue(
                subdelegation.description
              );
            }
          },
        });
      param = new FilterParams();
      param.addFilter('id', 'DJ');
      this.procedureManageService
        .getManagementAreasFiltered(param.getParams())
        .subscribe({
          next: data => this.formControls.estatusTramite.setValue(data.data[0]),
        });
      this.docRegisterService.getUserByDelegation(delegation).subscribe({
        next: data => {
          const params = new FilterParams();
          params.addFilter('user', data.user);
          this.docRegisterService
            .getUsersSegAreas(params.getParams())
            .subscribe({
              next: data => {
                this.userRecipient.setValue(data.data[0]);
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    }
    if (typeManagement == 3) {
      this.formControls.wheelType.setValue('P');
      this.initialCondition = 'P';
      let param = new FilterParams();
      param.addFilter('id', 'ASEG');
      this.docRegisterService.getIdentifiers(param.getParams()).subscribe({
        next: data => this.formControls.identifier.setValue(data.data[0]),
      });
      this.getFieldsByManagementArea(typeManagement, subject, officeKey);
      this.formControls.preliminaryInquiry.setValue(subject);
      this.dynamicTablesService.getByTableKeyOtKey(9, 16).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
      param = new FilterParams();
      param.addFilter('id', depa);
      this.docRegisterService
        .getDepartamentsFiltered(param.getParams())
        .subscribe({
          next: data => {
            if (data.data.length > 0) {
              this.formControls.departamentDestinyNumber.setValue(
                data.data[0].id
              );
              this.formControls.destinationArea.setValue(
                data.data[0].description
              );
              const delegation = data.data[0].numDelegation as IDelegation;
              this.formControls.delDestinyNumber.setValue(delegation.id);
              this.formControls.delegationName.setValue(delegation.description);
              const subdelegation = data.data[0]
                .numSubDelegation as ISubdelegation;
              this.formControls.subDelDestinyNumber.setValue(subdelegation.id);
              this.formControls.subDelegationName.setValue(
                subdelegation.description
              );
            }
          },
        });
      param = new FilterParams();
      param.addFilter('pgrOffice', this.formControls.officeExternalKey.value);
      this.interfacefgrService
        .getPgrTransferFiltered(param.getParams())
        .subscribe({
          next: data => {
            if (this.formControls.criminalCase.value == null) {
              this.formControls.criminalCase.setValue(data.data[0].pgrOffice);
            }
          },
          error: () => {},
        });
      param = new FilterParams();
      param.addFilter('id', 'DJ');
      this.procedureManageService
        .getManagementAreasFiltered(param.getParams())
        .subscribe({
          next: data => this.formControls.estatusTramite.setValue(data.data[0]),
        });
      this.docRegisterService.getUserByDelegation(delegation).subscribe({
        next: data => {
          const params = new FilterParams();
          params.addFilter('user', data.user);
          this.docRegisterService
            .getUsersSegAreas(params.getParams())
            .subscribe({
              next: data => {
                this.userRecipient.setValue(data.data[0]);
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    }
  }

  getFieldsByManagementArea(
    typeManagement: number,
    subject: string,
    officeKey: string
  ) {
    let param = new FilterParams();
    if (typeManagement == 2) {
      param.removeAllFilters();
      param.addFilter('affair', subject);
      this.tmpGestRegDocService.getAllWithFilters(param.getParams()).subscribe({
        next: data => {
          const {
            senderExt,
            affairKey,
            affair,
            officeExternalDate,
            description,
            onlyKey,
          } = data.data[0];
          if (this.formControls.externalRemitter.value == null) {
            this.formControls.externalRemitter.setValue(senderExt);
          }
          if (this.formControls.externalOfficeDate.value == null) {
            this.formControls.externalOfficeDate.setValue(officeExternalDate);
          }
          if (this.formControls.observations.value == null) {
            this.formControls.observations.setValue(description);
          }
          if (this.formControls.affairKey.value == null) {
            this.formControls.affairKey.setValue(affairKey);
            this.affairService.getById(affairKey).subscribe({
              next: data => this.formControls.affair.setValue(data.description),
              error: () => {},
            });
          }
          if (this.formControls.expedientTransferenceNumber.value == null) {
            this.formControls.expedientTransferenceNumber.setValue(
              affair as string
            );
          }
          const param = new FilterParams();
          param.addFilter('uniqueCve', Number(onlyKey));
          this.docRegisterService
            .getUniqueKeyData(param.getParams())
            .subscribe({
              next: data => {
                this.setUniqueKeyData(data.data[0], true);
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    }
    if (typeManagement == 3) {
      param.removeAllFilters();
      param.addFilter('officeNumber', officeKey);
      this.tmpGestRegDocService.getAllWithFilters(param.getParams()).subscribe({
        next: data => {
          console.log(data);
          const {
            senderExt,
            affairKey,
            officeExternalDate,
            description,
            onlyKey,
          } = data.data[0];
          if (this.formControls.externalRemitter.value == null) {
            this.formControls.externalRemitter.setValue(senderExt);
          }
          if (this.formControls.externalOfficeDate.value == null) {
            this.formControls.externalOfficeDate.setValue(officeExternalDate);
          }
          if (this.formControls.observations.value == null) {
            this.formControls.observations.setValue(description);
          }
          if (this.formControls.affairKey.value == null) {
            this.formControls.affairKey.setValue(affairKey);
            this.affairService.getById(affairKey).subscribe({
              next: data => this.formControls.affair.setValue(data.description),
              error: () => {},
            });
          }
          const param = new FilterParams();
          param.addFilter('uniqueCve', Number(onlyKey));
          this.docRegisterService
            .getUniqueKeyData(param.getParams())
            .subscribe({
              next: data => {
                this.setUniqueKeyData(data.data[0], true);
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    }
  }

  setDefaultValues() {
    const initialDate = this.parseDatepickerFormat(this.initialDate);
    this.formControls.receiptDate.setValue(initialDate);
  }

  parseDatepickerFormat(date: Date, format?: string): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let dateString = `${day}/${month}/${year}`;
    if (format == 'EN') {
      dateString = `${month}/${day}/${year}`;
    }
    return dateString;
  }

  checkManagementArea() {
    if (this.pageParams.pGestOk == 1 || this.globals.gnuActivaGestion == 1) {
      this.formControls.estatusTramite.addValidators(Validators.required);
    }
  }

  onFormChanges() {
    const $obs = this.detectFormChanges();
    $obs.subscribe({
      next: ({ field, value }) => this.valuesChange[field](value),
    });
  }

  private detectFormChanges() {
    return merge(
      ...DOC_RECEPT_REG_FIELDS_TO_LISTEN.map(field =>
        this.documentsReceptionForm.get(field).valueChanges.pipe(
          map(value => ({ field, value })),
          takeUntil(this.$unSubscribe)
        )
      )
    );
  }

  identifierChange(identifier: string) {
    // if (!identifier) return;
    // if (identifier.includes('4') || identifier === 'MIXTO')
    //   this.formControls.receiptDate.disable();
    // else this.formControls.receiptDate.enable();
    this.identifier = this.formControls.identifier.value.id;
    let initialDate;
    if (['MIXTO', '4', '4MT'].includes(this.identifier)) {
      initialDate = this.parseDatepickerFormat(this.initialDate);
      this.formControls.receiptDate.setValue(initialDate);
    }
  }

  wheelTypeChange(type: string) {
    this.affairKey.setValue(null);
    this.formControls.affair.setValue(null);
    this.formControls.endTransferNumber.setValue(null);
    this.getTransferors({ page: 1, text: '' });
    this.getIdentifiers({ page: 1, text: '' });
    if (['A', 'P'].includes(type)) {
      this.initialCondition = 'A';
    } else if (['AT', 'T'].includes(type)) {
      this.initialCondition = type;
    }
    if (['AT', 'A', 'P'].includes(type))
      this.taxpayerLabel = TaxpayerLabel.Defendant;
    if (type === 'T') {
      this.taxpayerLabel = TaxpayerLabel.Taxpayer;
      this.formControls.crimeKey.clearValidators();
      this.formControls.crimeKey.updateValueAndValidity();
    } else {
      if (!this.formControls.crimeKey.hasValidator(Validators.required))
        this.formControls.crimeKey.addValidators(Validators.required);
    }
    if (type == 'P') {
      this.formControls.circumstantialRecord.addValidators(Validators.required);
      this.formControls.circumstantialRecord.updateValueAndValidity();
      this.formControls.preliminaryInquiry.addValidators(Validators.required);
      this.formControls.preliminaryInquiry.updateValueAndValidity();
      this.formControls.criminalCase.addValidators(Validators.required);
      this.formControls.criminalCase.updateValueAndValidity();
      this.formControls.protectionKey.addValidators(Validators.required);
      this.formControls.protectionKey.updateValueAndValidity();
      this.formControls.touchPenaltyKey.addValidators(Validators.required);
      this.formControls.touchPenaltyKey.updateValueAndValidity();
      this.formControls.indiciadoNumber.addValidators(Validators.required);
      this.formControls.indiciadoNumber.updateValueAndValidity();
    } else {
      this.formControls.circumstantialRecord.clearValidators();
      this.formControls.circumstantialRecord.updateValueAndValidity();
      this.formControls.preliminaryInquiry.clearValidators();
      this.formControls.preliminaryInquiry.updateValueAndValidity();
      this.formControls.criminalCase.clearValidators();
      this.formControls.criminalCase.updateValueAndValidity();
      this.formControls.protectionKey.clearValidators();
      this.formControls.protectionKey.updateValueAndValidity();
      this.formControls.touchPenaltyKey.clearValidators();
      this.formControls.touchPenaltyKey.updateValueAndValidity();
      this.formControls.touchPenaltyKey.clearValidators();
      this.formControls.touchPenaltyKey.updateValueAndValidity();
    }
    if (type != 'A') {
      this.checkDailyEviction();
    }
  }

  destinationAreaChange(area: string) {
    if (this.userRecipient.value.user) {
      const param = new FilterParams();
      param.addFilter('user', this.userRecipient.value.user);
      this.docRegisterService.getUsersSegAreas(param.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            if (data.data[0].delegationNumber != this.userDelegation) {
              this.userRecipient.setValue(null);
              this.onLoadToast(
                'warning',
                'Usuario no asignado',
                'El usuario no esta asignado a la delegación seleccionada.'
              );
            }
          }
        },
      });
    }
  }

  affairChange(affair: string) {
    if (['21', '22'].includes(affair)) {
      this.formControls.observations.setValue(
        'INFORME DE ASEGURAMIENTO DE BIENES NO ADMINISTRABLES'
      );
      this.formControls.dictumKey.setValue('CONOCIMIENTO');
      this.formControls.reserved.setValue(
        'POR ACUERDO DE GRUPO SIAB SE DESAHOGA DE CONOCIMIENTO EN AUTOMATICO POR SER BIENES NO ADMINISTRABLES'
      );
    }
    if (affair == '47') {
      this.formControls.cityNumber.clearValidators();
    } else {
      if (!this.formControls.cityNumber.hasValidator(Validators.required))
        this.formControls.cityNumber.addValidators(Validators.required);
    }
    if (affair == '50') {
      this.formControls.stage.addValidators(Validators.required);
    } else {
      this.formControls.stage.clearValidators();
    }
  }

  cityChange(city: ICity) {
    this.dynamicTablesService
      .getTvalTable1ByTableKey(1, { inicio: 1, text: city.state.descCondition })
      .subscribe({
        next: data => this.entFedKey.setValue(data.data[0]),
      });
    this.getPublicMinistries({ page: 1, text: '' });
  }

  changeJudgement(judgement: string) {
    if (judgement != '' && judgement != null) {
      this.formControls.protectionKey.setValue(judgement);
    }
    // console.log(judgement, this.formControls.protectionKey.value);
  }

  authorityChange(authority: string) {
    this.formControls.originNumber.setValue(
      Number(this.formControls.autorityNumber.value.idAuthority)
    );
  }

  checkDailyEviction() {
    const param = new FilterParams();
    if (this.formControls.expedientNumber.value != null) {
      param.addFilter('fileNumber', this.formControls.expedientNumber.value);
      this.docRegisterService.getGoods(param.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            let goods = [];
            goods = data.data.filter(
              g => !['ROP', 'VXR', 'STA'].includes(g.status)
            );
            if (goods.length > 0) {
              if (data) this.formControls.dailyEviction.disable();
            }
          } else {
            this.formControls.dailyEviction.enable();
          }
        },
        error: () => {},
      });
    }
  }

  fillForm(notif: INotification) {
    this.documentsReceptionForm.reset();
    // this.documentsReceptionForm.get('flyer').setValue(value);
    console.log(notif);
    const filterParams = new FilterParams();
    const values = {
      wheelType: notif.wheelType,
      externalRemitter: notif.externalRemitter,
      affairKey: notif.affairKey,
      priority: notif.priority,
      wheelNumber: notif.wheelNumber,
      consecutiveNumber: notif.consecutiveNumber,
      expedientNumber: notif.expedientNumber,
      addressGeneral: notif.addressGeneral,
      circumstantialRecord: notif.circumstantialRecord,
      preliminaryInquiry: notif.preliminaryInquiry,
      criminalCase: notif.criminalCase,
      protectionKey: notif.protectionKey,
      touchPenaltyKey: notif.touchPenaltyKey,
      officeExternalKey: notif.officeExternalKey,
      observations: notif.observations,
      expedientTransferenceNumber: notif.expedientTransferenceNumber,
      transference: notif.transference,
      officeNumber: notif.officeNumber,
      captureDate: notif.captureDate,
      wheelStatus: notif.wheelStatus,
      entryProcedureDate: notif.entryProcedureDate,
    };
    this.documentsReceptionForm.patchValue({ ...values });
    if (notif.wheelNumber != null) {
      this.existingNotification = true;
    }
    if (notif.dailyEviction == 0) {
      this.formControls.dailyEviction.setValue(false);
    } else if (notif.dailyEviction == 1) {
      this.formControls.dailyEviction.setValue(true);
    }
    const receiptDate = this.parseDatepickerFormat(
      new Date(notif.receiptDate),
      'EN'
    );
    this.formControls.receiptDate.setValue(new Date(receiptDate));
    const externalOfficeDate = this.parseDatepickerFormat(
      new Date(notif.externalOfficeDate),
      'EN'
    );
    this.formControls.externalOfficeDate.setValue(new Date(externalOfficeDate));
    if (notif.wheelStatus == 'PENDIENTE') {
      this.procedureStatus = ProcedureStatus.pending;
    } else if (notif.wheelStatus == 'ENVIADO') {
      this.procedureStatus = ProcedureStatus.sent;
    }
    this.checkProcedureBlock();
    if (notif.wheelType != null)
      this.formControls.wheelType.setValue(notif.wheelType);
    this.initialCondition = notif.wheelType;
    if (notif.identifier != null)
      this.identifierService.getById(notif.identifier).subscribe({
        next: data => {
          this.formControls.identifier.setValue(data);
          this.formControls.identifierExp.setValue(data.id);
        },
      });
    if (notif.affairKey != null)
      this.affairService.getById(notif.affairKey).subscribe({
        next: data => this.formControls.affair.setValue(data.description),
      });
    if (notif.cityNumber != null)
      this.cityService.getById(notif.cityNumber).subscribe({
        next: data => this.formControls.cityNumber.setValue(data),
      });
    if (notif.entFedKey != null) {
      this.dynamicTablesService
        .getByTableKeyOtKey(1, notif.entFedKey)
        .subscribe({
          next: data => {
            this.formControls.entFedKey.setValue(data.data);
          },
        });
    }
    if (notif.endTransferNumber != null)
      this.transferentService.getById(notif.endTransferNumber).subscribe({
        next: data => {
          this.formControls.endTransferNumber.setValue(data);
          this.updateGlobalVars('noTransferente', data.id);
        },
      });
    if (notif.courtNumber != null)
      this.courtService.getById(notif.courtNumber).subscribe({
        next: data => this.formControls.courtNumber.setValue(data),
      });
    if (notif.stationNumber != null)
      this.stationService.getById(notif.stationNumber).subscribe({
        next: data => this.formControls.stationNumber.setValue(data),
      });
    if (notif.autorityNumber != null)
      this.authorityService.getById(notif.autorityNumber).subscribe({
        next: data => this.formControls.autorityNumber.setValue(data),
      });
    if (notif.minpubNumber != null) {
      const minpub = notif.minpubNumber as IMinpub;
      this.minpubService.getById(minpub.id).subscribe({
        next: data => this.formControls.minpubNumber.setValue(data),
      });
    }
    if (notif.crimeKey != null)
      this.dynamicTablesService
        .getByTableKeyOtKey(2, notif.crimeKey)
        .subscribe({
          next: data => this.formControls.crimeKey.setValue(data.data),
        });
    if (notif.indiciadoNumber != null)
      this.indiciadosService.getById(notif.indiciadoNumber).subscribe({
        next: data => this.formControls.indiciadoNumber.setValue(data),
      });
    if (notif.viaKey != null)
      this.dynamicTablesService.getByTableKeyOtKey(9, notif.viaKey).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
    if (notif.delDestinyNumber != null) {
      this.formControls.delDestinyNumber.setValue(notif.delDestinyNumber);
      if (notif.delegation != null) {
        this.formControls.delegationName.setValue(notif.delegation.description);
      } else {
        this.delegationService
          .getById(notif.delDestinyNumber)
          .subscribe(data =>
            this.formControls.delegationName.setValue(data.description)
          );
      }
    }
    if (notif.subDelDestinyNumber != null) {
      this.formControls.subDelDestinyNumber.setValue(notif.subDelDestinyNumber);
      if (notif.subDelegation != null) {
        this.formControls.subDelegationName.setValue(
          notif.subDelegation.description
        );
      } else {
        this.subdelegationService
          .getById(notif.subDelDestinyNumber)
          .subscribe(data =>
            this.formControls.subDelegationName.setValue(data.description)
          );
      }
    }
    if (notif.departamentDestinyNumber != null) {
      this.formControls.departamentDestinyNumber.setValue(
        notif.departamentDestinyNumber
      );
      if (notif.departament != null) {
        this.formControls.destinationArea.setValue(
          notif.departament.description
        );
      } else {
        this.departamentService
          .getById(notif.departamentDestinyNumber)
          .subscribe(data =>
            this.formControls.destinationArea.setValue(data.description)
          );
      }
    }
    if (notif.wheelNumber != null && notif.expedientNumber != null) {
      filterParams.addFilter('noExpediente', notif.expedientNumber);
      filterParams.addFilter('noVolante', notif.wheelNumber);
      this.procedureManageService
        .getAllFiltered(filterParams.getParams())
        .subscribe({
          next: data => {
            console.log(data.data[0].id);
            const { status, areaToTurn, userToTurn } = data.data[0];
            if (status == 'OPI') {
              this.formControls.wheelStatus.setValue(ProcedureStatus.pending);
              this.procedureStatus = ProcedureStatus.pending;
            } else if (status == 'OPS') {
              this.formControls.wheelStatus.setValue(ProcedureStatus.sent);
              this.procedureStatus = ProcedureStatus.sent;
            }
            if (areaToTurn != null) {
              filterParams.removeAllFilters();
              filterParams.addFilter('id', areaToTurn);
              this.procedureManageService
                .getManagementAreasFiltered(filterParams.getParams())
                .subscribe({
                  next: data => {
                    if (data.data.length > 0) {
                      this.formControls.estatusTramite.setValue(data.data[0]);
                    }
                  },
                  error: () => {},
                });
            }
            if (userToTurn != null) {
              filterParams.removeAllFilters();
              filterParams.addFilter('user', userToTurn);
              this.docRegisterService
                .getUsersSegAreas(filterParams.getParams())
                .subscribe({
                  next: data => {
                    if (data.data.length > 0) {
                      this.userRecipient.setValue(data.data[0]);
                    }
                  },
                  error: () => {},
                });
            }
          },
        });
    }
    if (notif.institutionNumber != null) {
      const institution = notif.institutionNumber as IInstitutionNumber;
      this.formControls.institutionName.setValue(institution.name);
      this.formControls.institutionNumber.setValue(institution.id);
    }
    this.checkDailyEviction();
    console.log(this.documentsReceptionForm.value);
  }

  selectFlyer() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (next: INotification) => {
          if (next) this.fillForm(next);
        },
      },
    };
    this.modalService.show(DocumentsReceptionFlyerSelectComponent, modalConfig);
  }

  showTrackRecords(trackRecords: INotification[]) {
    this.openModalTrackRecords({
      trackRecords: trackRecords,
    });
  }

  openModalTrackRecords(
    context?: Partial<DocReceptionTrackRecordsModalComponent>
  ) {
    const modalRef = this.modalService.show(
      DocReceptionTrackRecordsModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onSelect.subscribe(data => {
      if (data) this.trackRecordsCheck(data);
    });
  }

  sendFlyer() {
    this.alertQuestion(
      'question',
      '¿Desea enviar este volante?',
      '',
      'Enviar'
    ).then(question => {
      if (question) {
        if (
          this.pageParams.pGestOk == 1 ||
          this.globals.gnuActivaGestion == 1
        ) {
          if (this.pageParams.pNoTramite != null) {
            this.procedureManageService
              .update(this.pageParams.pNoTramite, { status: 'OPS' })
              .subscribe({
                next: data => {
                  this.formControls.wheelStatus.setValue(ProcedureStatus.sent);
                  this.procedureStatus = ProcedureStatus.sent;
                  this.userRecipient.disable();
                  this.userCpp.disable();
                  this.alert('success', 'Estado actualizado correctamente', '');
                },
                error: () =>
                  this.onLoadToast(
                    'error',
                    'Error',
                    'No se pudo enviar el volante'
                  ),
              });
          } else {
            this.onLoadToast(
              'warning',
              'No se puede actualizar el estado',
              'Parametro faltante: pNoTramtie'
            );
          }
          if (this.wheelNumber.value != null) {
            this.notificationService
              .update(Number(this.wheelNumber.value), {
                wheelStatus: 'ENVIADO',
              })
              .subscribe({
                next: data => {},
              });
          }
        }
      }
    });
  }

  checkProcedureBlock() {
    this.docRegisterService
      .getUserOfficePermission({ toolbarUser: this.userId })
      .subscribe({
        next: data => {
          if (data.val_usr == 0) {
            this.procedureBlocked = true;
          }
        },
        error: () => {},
      });
  }

  viewDocuments() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  chooseOther() {
    this.selectFlyer();
  }

  clear() {
    this.documentsReceptionForm.reset();
  }

  handleSelectErrors(err?: any) {
    let error = '';
    if (err.status === 0) {
      error = 'Revise su conexión de Internet.';
    } else {
      error = err.message;
    }
    this.onLoadToast('error', 'Error', error);
  }

  getSubjects(params?: ListParams) {
    this.affairService.getAll(params).subscribe({
      next: data => {
        this.subjects = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.subjects = new DefaultSelect();
      },
    });
  }

  getIdentifiers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    let type: string;
    if (['A', 'P'].includes(this.wheelType.value)) type = 'A';
    if (['AT', 'T'].includes(this.wheelType.value)) type = 'T';
    if (this.wheelType.value != null) params.addFilter('keyview', type);
    this.docRegisterService.getIdentifiers(params.getParams()).subscribe({
      next: data => {
        this.identifiers = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.identifiers = new DefaultSelect();
      },
    });
  }

  getFederalEntities(params: ListParams) {
    let elements$ = this.getDynamicTables(1, params);
    elements$.subscribe({
      next: data => {
        this.federalEntities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.federalEntities = new DefaultSelect();
      },
    });
  }

  getReceptionWays(params: ListParams) {
    let elements$ = this.getDynamicTables(9, params);
    elements$.subscribe({
      next: data => {
        this.receptionWays = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.receptionWays = new DefaultSelect();
      },
    });
  }

  getCrimes(params: ListParams) {
    let elements$ = this.getDynamicTables(2, params);
    elements$.subscribe({
      next: data => {
        this.crimes = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.crimes = new DefaultSelect();
      },
    });
  }

  getDynamicTables(
    id: number | string,
    params: ListParams
  ): Observable<IListResponse<TvalTable1Data>> {
    return this.dynamicTablesService.getTvalTable1ByTableKey(id, params);
  }

  getTransferors(lparams: ListParams) {
    if (this.formControls.wheelType.value != 'P') {
      this.transferentService.getAll(lparams).subscribe({
        next: data => {
          this.transferors = new DefaultSelect(data.data, data.count);
        },
        error: () => {
          this.transferors = new DefaultSelect();
        },
      });
    } else {
      const body = {
        active: ['1', '2'],
        nameTransferent: lparams.text,
      };
      this.docRegisterService.getActiveTransferents(body).subscribe({
        next: data => {
          this.transferors = new DefaultSelect(data.data, data.count);
        },
        error: () => {
          this.transferors = new DefaultSelect();
        },
      });
    }
  }

  getStations(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('stationName', lparams.text, SearchFilter.LIKE);
    if (this.endTransferNumber.value != null)
      params.addFilter('idTransferent', this.endTransferNumber.value.id);
    this.docRegisterService.getStations(params.getParams()).subscribe({
      next: data => {
        this.stations = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.stations = new DefaultSelect();
      },
    });
  }

  getAuthorities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('authorityName', lparams.text, SearchFilter.LIKE);
    if (this.endTransferNumber.value != null)
      params.addFilter('idTransferer', this.endTransferNumber.value.id);
    if (this.stationNumber.value != null)
      params.addFilter('idStation', this.stationNumber.value.id);
    this.docRegisterService.getAuthorities(params.getParams()).subscribe({
      next: data => {
        this.authorities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authorities = new DefaultSelect();
      },
    });
  }

  getPublicMinistries(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    //TODO: Filtros comentados para prubeas
    // if (this.cityNumber.value != null)
    //   params.addFilter('idCity', this.cityNumber.value.idCity);
    // if (this.delDestinyNumber.value != null)
    //   params.addFilter('noDelegation', this.delDestinyNumber.value);
    // if (this.subDelDestinyNumber.value != null)
    //   params.addFilter('noSubDelegation', this.subDelDestinyNumber.value);
    this.docRegisterService.getPublicMinistries(params.getParams()).subscribe({
      next: data => {
        this.publicMinistries = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.publicMinistries = new DefaultSelect();
      },
    });
  }

  changeTransferor(event: ITransferente) {
    this.formControls.transference.setValue(event.id);
    this.updateGlobalVars('noTransferente', event.id);
  }

  getCourts(lparams: ListParams) {
    this.courtService.getAll(lparams).subscribe({
      next: data => {
        this.courts = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.courts = new DefaultSelect();
      },
    });
  }

  getDefendants(lparams: ListParams) {
    this.defendantService.getAll(lparams).subscribe({
      next: data => {
        this.defendants = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.defendants = new DefaultSelect();
      },
    });
  }

  getCities(lparams: ListParams) {
    this.cityService.getAll(lparams).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  getManagementAreas(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    this.procedureManageService
      .getManagementAreasFiltered(params.getParams())
      .subscribe({
        next: data => {
          this.managementAreas = new DefaultSelect(data.data, data.count);
        },
        error: () => {
          this.managementAreas = new DefaultSelect();
        },
      });
  }

  getUniqueKey(lparams: ListParams) {
    const param = new FilterParams();
    param.addFilter('uniqueCve', Number(lparams.text));
    this.docRegisterService.getUniqueKeyData(param.getParams()).subscribe({
      next: data => {
        this.uniqueKeys = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users = new DefaultSelect();
      },
    });
  }

  getUsers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    if (this.delDestinyNumber.value != null)
      params.addFilter('delegationNumber', this.delDestinyNumber.value);
    if (this.subDelDestinyNumber.value != null)
      params.addFilter('subdelegationNumber', this.subDelDestinyNumber.value);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        this.users = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users = new DefaultSelect();
      },
    });
  }

  getUsersCopy(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        this.usersCopy = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.usersCopy = new DefaultSelect();
      },
    });
  }

  checkDesalojo(event: any) {}

  openModalAreas() {
    this.openModalSelect(
      {
        title: 'Área',
        columnsType: { ...DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS },
        service: this.docRegisterService,
        dataObservableFn: this.docRegisterService.getDepartaments,
        searchFilter: { field: 'description', operator: SearchFilter.LIKE },
      },
      this.selectArea
    );
  }

  openModalAffairs() {
    this.openModalSelect(
      {
        title: 'Asunto',
        columnsType: { ...DOCUMENTS_RECEPTION_SELECT_AFFAIR_COLUMNS },
        service: this.docRegisterService,
        dataObservableFn: this.docRegisterService.getAffairs,
        filters: [
          {
            field: 'referralNoteType',
            value: this.wheelType.value,
          },
        ],
      },
      this.selectAffair
    );
  }
  openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  selectArea(areaData: IDepartment, self: DocumentsReceptionRegisterComponent) {
    const delegation = areaData.numDelegation as IDelegation;
    const subdelegation = areaData.numSubDelegation as ISubdelegation;
    self.formControls.departamentDestinyNumber.setValue(areaData.id);
    self.formControls.destinationArea.setValue(areaData.description);
    self.formControls.delDestinyNumber.setValue(delegation.id);
    self.formControls.delegationName.setValue(delegation.description);
    self.formControls.subDelDestinyNumber.setValue(subdelegation.id);
    self.formControls.subDelegationName.setValue(subdelegation.description);
    self.getPublicMinistries({ page: 1, text: '' });
    self.getUsers({ page: 1, text: '' });
  }

  selectAffair(affair: IAffair, self: DocumentsReceptionRegisterComponent) {
    self.formControls.affairKey.setValue(affair.id.toString());
    self.formControls.affair.setValue(affair.description);
    self.formControls.goodRelation.setValue(affair.clv);
  }

  clearCityState() {
    this.formControls.cityNumber.setValue(null);
    this.formControls.entFedKey.setValue(null);
    this.getPublicMinistries({ page: 1, text: '' });
  }

  stageChange(stage?: string) {
    this.formControls.stageName.setValue(stage);
    // this.formControls.stageName.setValue(this.formControls.stage.value);
  }

  setUniqueKeyData(key: ITransferingLevelView, full?: boolean) {
    if (key.transfereeNum != null)
      this.transferentService.getById(key.transfereeNum).subscribe({
        next: data => {
          this.formControls.endTransferNumber.setValue(data);
          this.updateGlobalVars('noTransferente', data.id);
        },
        error: () => {},
      });
    if (key.stationNum != null)
      this.stationService.getById(key.stationNum).subscribe({
        next: data => this.formControls.stationNumber.setValue(data),
        error: () => {},
      });
    if (key.authorityNum != null)
      this.authorityService.getById(key.authorityNum).subscribe({
        next: data => this.formControls.autorityNumber.setValue(data),
        error: () => {},
      });
    if (full) {
      if (key.cityNum != null) {
        this.cityService.getById(key.cityNum).subscribe({
          next: data => {
            this.formControls.cityNumber.setValue(data);
          },
          error: () => {},
        });
      }
      if (key.federalEntityCve != null) {
        this.dynamicTablesService
          .getByTableKeyOtKey(1, key.federalEntityCve)
          .subscribe({
            next: data => {
              this.formControls.entFedKey.setValue(data.data);
            },
            error: () => {},
          });
      }
    }
  }

  prepareFormData() {
    let formData = {
      ...this.documentsReceptionForm.value,
      identifier: this.formControls.identifier.value?.id,
      cityNumber: this.formControls.cityNumber.value?.idCity,
      endTransferNumber: this.formControls.endTransferNumber.value?.id,
      courtNumber: this.formControls.courtNumber.value?.id,
      courtName: this.formControls.courtNumber.value?.description,
      stationNumber: this.formControls.stationNumber.value?.id,
      autorityNumber: Number(
        this.formControls.autorityNumber.value?.idAuthority
      ),
      minpubNumber: this.formControls.minpubNumber.value?.id,
      minpubName: this.formControls.minpubNumber.value?.description,
      indiciadoNumber: this.formControls.indiciadoNumber.value?.id,
      indiciadoName: this.formControls.indiciadoNumber.value?.name,
      estatusTramite: this.formControls.estatusTramite.value?.id,
      entFedKey: this.formControls.entFedKey.value?.otKey,
      entFedDescription: this.formControls.entFedKey.value?.value,
      crimeKey: this.formControls.crimeKey.value?.otKey,
      viaKey: this.formControls.viaKey.value?.otKey,
      dailyEviction: Number(this.formControls.dailyEviction.value),
      addressGeneral: Number(this.formControls.addressGeneral.value),
    };
    if (typeof formData.receiptDate == 'string') {
      formData.receiptDate = new Date(formData.receiptDate);
    }
    if (this.formControls.institutionName == null) {
      this.institutionService
        .getById(this.formControls.institutionNumber.value)
        .subscribe({
          next: data => {
            this.formControls.institutionName.setValue(data.name);
            formData.institutionName = data.name;
          },
          error: () => {},
        });
    }
    if (this.formControls.affairKey.value == '50') {
      formData.expedientTransferenceNumber = `${formData.stage} ${formData.expedientTransferenceNumber}`;
    }
    // delete formData.stage;
    // delete formData.stageName;
    if ([21, 22, '21', '22'].includes(this.formControls.affairKey.value)) {
      this.formControls.observations.setValue(
        'INFORME DE ASEGURAMIENTO DE BIENES NO ADMINISTRABLES'
      );
      this.formControls.dictumKey.setValue('CONOCIMIENTO');
      this.formControls.reserved.setValue(
        'POR ACUERDO DE GRUPO SIAB SE DESAHOGA DE CONOCIMIENTO EN AUTOMATICO POR SER BIENES NO ADMINISTRABLES'
      );
    } else {
      // delete formData.dictumKey;
      // delete formData.reserved;
    }
    this.formData = formData as IDocumentsReceptionData;
    console.log(this.formData);
  }

  save() {
    for (const key in this.formControls) {
      const control = this.documentsReceptionForm.get(key);
      if (control.errors != null) {
        console.log(key, control.errors);
      }
    }
    if (this.documentsReceptionForm.invalid) {
      this.documentsReceptionForm.markAllAsTouched();
      this.documentsReceptionForm.updateValueAndValidity();
      this.onLoadToast(
        'warning',
        'Campos Faltantes',
        'Complete todos los campos requeridos.'
      );
      return;
    }
    if (this.flyerCopyRecipientForm.invalid) {
      this.flyerCopyRecipientForm.markAllAsTouched();
      this.flyerCopyRecipientForm.updateValueAndValidity();
      this.onLoadToast(
        'warning',
        'Campos Faltantes',
        'Complete todos los campos requeridos.'
      );
      return;
    }
    if (this.globals.gNoExpediente != null) {
      this.formControls.expedientNumber.setValue(
        Number(this.globals.gNoExpediente)
      );
    }
    this.checkGoodsDailyEviction();
    if (this.globals.antecede == 1) {
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
          this.updateROPGoods();
        },
        error: () => {},
      });
    }
    if (this.globals.bn == 0) {
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
        },
        error: () => {},
      });
    }
    if (this.formControls.wheelNumber.value == null) {
      this.existingNotification = true;
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
        },
        error: err => {
          this.onLoadToast('error', 'Error', err);
        },
      });
    }
    this.formControls.consecutiveNumber.setValue(0);
    let iden = this.formControls.identifier.value.id;
    if (this.formControls.expedientNumber.value != null) {
      this.expedientService
        .getById(this.formControls.expedientNumber.value)
        .subscribe({
          next: data => {
            iden = data.identifier;
            if (iden != this.formControls.identifier.value.id) {
              this.identifierService.getById('MIXTO').subscribe({
                next: data => {
                  this.formControls.identifier.setValue(data);
                },
                error: () => {},
              });
            }
          },
          error: () => {},
        });
    }
    this.prepareFormData();
    this.expedientService
      .getById(this.formControls.expedientNumber.value)
      .subscribe({
        next: data => {
          if (data.id) {
            this.updateExpedientData();
          } else {
            this.createExpedient();
          }
        },
        error: err => {
          console.log(err);
          this.createExpedient();
        },
      });
    this.notificationService
      .getDailyConsecutive(this.userDelegation, this.userSubdelegation)
      .subscribe({
        next: data => {
          this.formControls.consecutiveNumber.setValue(data.consecutivedaily);
          const params = new FilterParams();
          params.addFilter(
            'expedientNumber',
            this.formControls.expedientNumber.value
          );
          this.tmpNotificationService
            .getAllWithFilters(params.getParams())
            .subscribe({
              next: data => {
                if (data.data.length > 0) {
                  this.tmpNotificationService.update(data.data[0].wheelNumber, {
                    ...data.data[0],
                    consecutiveNumber:
                      this.formControls.consecutiveNumber.value,
                  });
                }
              },
              error: err => {
                console.log(err);
              },
            });
        },
        error: err => {
          console.log(err);
        },
      });
  }

  updateROPGoods() {
    const params = new FilterParams();
    params.addFilter('fileNumber', this.formControls.expedientNumber.value);
    params.addFilter('status', 'ROP');
    this.docRegisterService.getGoods(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          data.data.forEach(g => {
            const insertRegDate = new Date(g.insertRegDate);
            const date = new Date();
            const diff = (date.getTime() - insertRegDate.getTime()) * 1000 * 60;
            if (diff <= 10) {
              this.docRegisterService
                .updateGood({
                  id: g.id,
                  goodId: g.goodId,
                  flyerNumber: this.formControls.wheelNumber.value,
                })
                .subscribe({
                  next: () => {},
                  error: () => {},
                });
            }
          });
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  updateExpedientData() {
    const expedientData = {
      circumstantialRecord: this.formData.circumstantialRecord,
      preliminaryInquiry: this.formData.preliminaryInquiry,
      criminalCase: this.formData.criminalCase,
      protectionKey: this.formData.protectionKey,
      keyPenalty: this.formData.touchPenaltyKey,
      nameInstitution: this.formData.institutionName,
      courtName: this.formData.courtName,
      mpName: this.formData.minpubName,
      indicatedName: this.formData.indiciadoName,
      courtNumber: this.formData.courtNumber,
      federalEntityKey: this.formData.entFedKey,
      crimeKey: this.formData.crimeKey,
      identifier: this.formData.identifier,
      expTransferNumber: this.formData.expedientTransferenceNumber,
      transferNumber: this.formData.endTransferNumber,
      expedientType: this.formData.wheelType,
      authorityNumber: this.formData.autorityNumber,
      stationNumber: this.formData.stationNumber,
    };
    this.expedientService
      .update(this.formControls.expedientNumber.value, expedientData)
      .subscribe({
        next: data => {
          this.saveNotification();
          this.saveProcedureManagement();
        },
        error: err => {
          console.log(err);
          console.log(expedientData);
          // this.saveNotification();
          // this.saveProcedureManagement();
          // this.sendFlyerCopies();
          this.onLoadToast(
            'error',
            'Error',
            'Error al actualizar datos del expediente.'
          );
        },
      });
  }

  createExpedient() {
    if (
      this.formData.protectionKey != null &&
      ['12', '15'].includes(this.formData.affairKey)
    ) {
      const param = new FilterParams();
      param.addFilter('cveProtection', this.formData.protectionKey);
      this.protectionService.getAllWithFilters(param.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            const body = {
              ...data.data[0],
              proceedingsNumber: this.formControls.expedientNumber.value,
            };
            this.protectionService.update(data.data[0].id, body).subscribe({
              next: () => {},
              error: () => {},
            });
          } else {
            this.insertProtectionKey();
          }
        },
        error: () => {
          this.insertProtectionKey();
        },
      });
    } else {
      this.insertProtectionKey();
    }
    if (this.formControls.expedientNumber.value == null) {
      this.expedientService.getNextVal().subscribe({
        next: data => {
          console.log(data);
          this.formControls.expedientNumber.setValue(Number(data.nextval));
          this.addExpedient();
        },
        error: err => {
          console.log(err);
          this.onLoadToast(
            'error',
            'Error',
            'Error al actualizar datos del expediente.'
          );
        },
      });
    } else {
      this.addExpedient();
    }
  }

  addExpedient() {
    console.log(this.formControls.expedientNumber.value);
    const expedientData = {
      id: this.formControls.expedientNumber.value,
      circumstantialRecord: this.formData.circumstantialRecord,
      preliminaryInquiry: this.formData.preliminaryInquiry,
      criminalCase: this.formData.criminalCase,
      protectionKey: this.formData.protectionKey,
      keyPenalty: this.formData.touchPenaltyKey,
      nameInstitution: this.formData.institutionName,
      courtName: this.formData.courtName,
      mpName: this.formData.minpubName,
      indicatedName: this.formData.indiciadoName,
      courtNumber: this.formData.courtNumber,
      federalEntityKey: this.formData.entFedKey,
      crimeKey: this.formData.crimeKey,
      identifier: this.formData.identifier,
      transferNumber: this.formData.endTransferNumber,
      authorityNumber: this.formData.autorityNumber,
      stationNumber: this.formData.stationNumber,
      expedientType: this.formData.wheelType,
      expTransferNumber: this.formData.expedientTransferenceNumber,
    };
    this.expedientService.create(expedientData).subscribe({
      next: () => {
        this.saveNotification();
        this.saveProcedureManagement();
      },
      error: err => {
        console.log(err);
        console.log(expedientData);
        this.onLoadToast(
          'error',
          'Error',
          'Error al guardar datos del expediente.'
        );
      },
    });
  }

  insertProtectionKey() {
    const body = {
      cveProtection: this.formData.protectionKey,
      protectionDate: this.formData.externalOfficeDate as Date,
      protectionType: 'D',
      courtNumber: this.formData.courtNumber,
      minpubNumber: this.formData.minpubNumber,
      delegationNumber: this.userDelegation,
      subdelegationNumber: this.userDelegation,
      proceedingsNumber: this.formControls.expedientNumber.value,
    };
    this.protectionService.create(body).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  saveProcedureManagement() {
    if (this.pageParams.pGestOk != 1 || this.globals.gnuActivaGestion != 1) {
      return;
    }
    let affair: string,
      affairType: number,
      procedureId: number = 0;
    if (this.formData.expedientTransferenceNumber != null) {
      affair = this.formData.expedientTransferenceNumber;
      affairType = 5;
    } else if (this.formData.protectionKey != null) {
      affair = this.formData.protectionKey;
      affairType = 2;
    } else if (this.formData.criminalCase != null) {
      affair = this.formData.criminalCase;
      affairType = 4;
    } else if (this.formData.preliminaryInquiry != null) {
      affair = this.formData.preliminaryInquiry;
      affairType = 3;
    } else if (this.formData.circumstantialRecord != null) {
      affair = this.formData.circumstantialRecord;
      affairType = 1;
    }
    const param = new FilterParams();
    param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
    if (this.pageParams.pNoTramite == null) {
      this.procedureManageService.getAllFiltered(param.getParams()).subscribe({
        next: data => {
          if (data.data.length == 0) {
            this.createProcedureManagement(affair, affairType);
          }
        },
        error: err => {
          console.log(err);
          this.createProcedureManagement(affair, affairType);
        },
      });
    } else {
      procedureId = this.pageParams.pNoTramite;
    }
    this.updateProcedureOnSave(procedureId, affair, affairType);
  }

  updateProcedureOnSave(
    procedureId: number,
    affair: string,
    affairType: number
  ) {
    const body = {
      expedient: this.formControls.expedientNumber.value,
      wheelNumber: this.formControls.wheelNumber.value,
      status: 'OPS',
      affair,
      affairType,
      officeNumber: this.formData.officeExternalKey,
      descentfed: this.formData.entFedDescription,
      priority: this.formData.priority,
      userToTurn: this.userRecipient.value.user,
      areaToTurn: this.formData.estatusTramite,
    };
    if (procedureId != null) {
      //
    }
    this.procedureManageService.update(procedureId, body).subscribe({
      next: () => {},
      error: err => {
        console.log(err);
      },
    });
    const param = new FilterParams();
    param.addFilter('fileNumber', this.formControls.expedientNumber.value);
    this.docRegisterService.getGoods(param.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          const goods = data.data.filter(g => g.flyerNumber == null);
          if (goods.length > 0) {
            this.docRegisterService
              .updateGood({
                id: goods[0].id,
                goodId: goods[0].goodId,
                flyerNumber: this.formControls.wheelNumber.value,
              })
              .subscribe({
                next: () => {},
                error: () => {},
              });
          }
        }
      },
      error: () => {},
    });
  }

  createProcedureManagement(affair: string, affairType: number) {
    const body: IProceduremanagement = {
      status: 'OPI',
      situation: 1,
      userTurned: this.userId,
      actualDate: new Date(),
      dailyConsecutiveNumber: 0,
      admissionDate: new Date(),
      wheelNumber: null,
      expedient: null,
      affair,
      affairType,
      officeNumber: this.formData.officeExternalKey,
      classificationDicta: null,
      registerUser: this.userId,
      descentfed: this.formData.entFedDescription,
      sheet: 0,
    };
    this.procedureManageService.create(body).subscribe({
      next: data => {
        return this.updateProcedureOnSave(data.id, affair, affairType);
      },
      error: err => {
        console.log(err);
        return this.updateProcedureOnSave(null, affair, affairType);
      },
    });
  }

  saveNotification() {
    console.log('Notificacion');
    if (this.existingNotification) {
      const updateData = {
        ...this.formData,
        consecutive: this.formControls.consecutiveNumber.value,
        wheelNumber: this.formControls.wheelNumber.value,
        receiptDate: this.formData.receiptDate as Date,
        externalOfficeDate: this.formData.externalOfficeDate as Date,
        affair: null as any,
      };
      delete updateData.affair;
      this.notificationService
        .update(this.formControls.wheelNumber.value, updateData)
        .subscribe({
          next: data => {
            this.sendFlyerCopies();
            this.alert(
              'success',
              'Notificación agregada',
              `Se actualizó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
            );
          },
          error: err => {
            console.log(err);
            console.log(updateData);
            this.onLoadToast(
              'error',
              'Error',
              'Hubo un problema al actualizar el volante.'
            );
          },
        });
    } else {
      if (this.formControls.wheelNumber.value == null) {
        this.notificationService.getLastWheelNumber().subscribe({
          next: data => {
            this.formControls.wheelNumber.setValue(data.nextval);
          },
          error: err => {
            console.log(err);
          },
        });
      }
      const insertData = {
        ...this.formData,
        consecutive: this.formControls.consecutiveNumber.value,
        wheelNumber: this.formControls.wheelNumber.value,
        receiptDate: this.formData.receiptDate as Date,
        externalOfficeDate: this.formData.externalOfficeDate as Date,
        delegationNumber: this.userDelegation,
        subDelegationNumber: this.userSubdelegation,
        affair: null as any,
      };
      delete insertData.affair;
      this.notificationService.create(insertData).subscribe({
        next: data => {
          this.sendFlyerCopies();
          this.alert(
            'success',
            'Notificación agregada',
            `Se actualizó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
          );
        },
        error: err => {
          console.log(err);
          console.log(insertData);
          this.onLoadToast(
            'error',
            'Error',
            'Hubo un problema al actualizar el volante.'
          );
        },
      });
    }
  }

  sendFlyerCopies() {
    const params = new FilterParams();
    params.addFilter('flierNumber', this.formControls.wheelNumber.value);
    this.flyerCopiesService.getAllFiltered(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          data.data.forEach(flyer => {
            let body;
            if (flyer.persontype == 'D') {
              body = {
                copyuser: this.userRecipient.value.user,
                flierNumber: this.formControls.wheelNumber.value,
                persontype: FlyerPersontype.D,
                copyNumber:
                  this.flyerCopyRecipientForm.controls[
                    'copyNumber'
                  ].value.toString(),
              };
            } else {
              body = {
                copyuser: this.userCpp.value.user,
                flierNumber: this.formControls.wheelNumber.value,
                persontype: FlyerPersontype.C,
                copyNumber:
                  this.flyerCopyCppForm.controls['copyNumber'].value.toString(),
              };
            }
            this.flyerCopiesService.update(body).subscribe({
              next: data => {},
              error: () => {},
            });
          });
        } else {
          this.createFlyerCopies();
        }
      },
      error: () => {
        this.createFlyerCopies();
      },
    });
  }

  createFlyerCopies() {
    const recepientData = {
      copyuser: this.userRecipient.value.user,
      flierNumber: this.formControls.wheelNumber.value,
      persontype: FlyerPersontype.D,
      copyNumber:
        this.flyerCopyRecipientForm.controls['copyNumber'].value.toString(),
    };
    this.flyerCopiesService.create(recepientData).subscribe({
      next: () => {},
      error: () => {},
    });
    if (this.userCpp.value != null) {
      const copyData = {
        copyuser: this.userCpp.value.user,
        flierNumber: this.formControls.wheelNumber.value,
        persontype: FlyerPersontype.C,
        copyNumber:
          this.flyerCopyCppForm.controls['copyNumber'].value.toString(),
      };
      this.flyerCopiesService.create(copyData).subscribe({
        next: () => {},
        error: () => {},
      });
    }
  }

  checkGoodsDailyEviction() {
    let goods: IGood[] = [];
    let goodsStatus: IGood[] = [];
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.formControls.wheelNumber.value);
    this.docRegisterService.getGoods(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          data.data.forEach(g => {
            goods.push(g);
            if (['VXR', 'ROP', 'STA'].includes(g.status)) {
              this.massiveGoodService
                .countMassiveGood(Number(g.goodId))
                .subscribe({
                  next: data => {
                    if (data.data > 0) {
                      goodsStatus.push(g);
                    }
                  },
                  error: () => {},
                });
            }
          });
          this.massiveGoodCorrections(goods, goodsStatus);
        }
      },
      error: () => {},
    });
  }

  massiveGoodCorrections(goods: IGood[], goodsStatus: IGood[]) {
    if (
      goods.length > 0 &&
      Number(this.formControls.dailyEviction.value) == 0
    ) {
      goods.forEach(g => {
        this.massiveGoodService
          .deleteMassiveGoodComer(Number(g.goodId))
          .subscribe({
            next: () => {},
            error: () => {},
          });
      });
    }
    if (goods.length > 0) {
      goods.forEach(g => {
        const param = new FilterParams();
        param.addFilter('goodNumber', g.goodId);
        this.massiveGoodService.getAllWithFilters(param.getParams()).subscribe({
          next: data => {
            if (data.data.length > 0) {
              const body = {
                daydayEviction: Number(this.formControls.dailyEviction.value),
                user: this.userId,
              };
              this.massiveGoodService.update(data.data[0].id, body).subscribe({
                next: () => {},
                error: () => {},
              });
            }
          },
          error: () => {},
        });
      });
    } else {
      this.insertMassiveGoods(goodsStatus);
    }
    if (this.docDataService.trackRecordGoods.length > 0) {
      const good = this.docDataService.trackRecordGoods[0].goodId;
      const params = new FilterParams();
      params.addFilter('goodId', good);
      this.docRegisterService.getGoods(params.getParams()).subscribe({
        next: data => {
          const goodsToCompare = data.data.filter(
            g => !['VXR', 'ROP', 'STA'].includes(g.status)
          );
          this.massiveGoodService
            .countMassiveGood(data.data[0].goodId)
            .subscribe({
              next: resp => {
                if (goodsToCompare.length > resp.data) {
                  const goodsInsert = goodsStatus.filter(
                    g => !goods.includes(g)
                  );
                  if (goodsInsert.length > 0) {
                    this.insertMassiveGoods(goodsInsert);
                  }
                }
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    }
  }

  insertMassiveGoods(goods: IGood[]) {
    goods.forEach(gi => {
      const body = {
        goodNumber: gi.goodId,
        id: 'Para Comercializar',
        fileNumber: this.formControls.expedientNumber.value,
        flyerNumber: this.formControls.wheelNumber.value,
        user: this.userId,
        massiveChargeDate: new Date(),
        daydayEviction: Number(this.formControls.dailyEviction.value),
      };
      this.massiveGoodService.create(body).subscribe({
        next: () => {},
        error: () => {},
      });
    });
  }

  goodsCaptureCheck() {
    for (const key in this.formControls) {
      const control = this.documentsReceptionForm.get(key);
      if (control.errors != null) {
        console.log(key, control.errors);
      }
    }
    if (this.documentsReceptionForm.invalid) {
      this.documentsReceptionForm.markAllAsTouched();
      this.documentsReceptionForm.updateValueAndValidity();
      this.onLoadToast(
        'warning',
        'Campos Faltantes',
        'Complete todos los campos requeridos.'
      );
      return;
    }
    if (this.flyerCopyRecipientForm.invalid) {
      this.flyerCopyRecipientForm.markAllAsTouched();
      this.flyerCopyRecipientForm.updateValueAndValidity();
      this.onLoadToast(
        'warning',
        'Campos Faltantes',
        'Complete todos los campos requeridos.'
      );
      return;
    }
    this.prepareFormData();
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    console.log(this.docDataService.documentsReceptionRegisterForm);
    // return;
    this.updateGlobalVars('bn', 1);
    if (this.initialCondition == 'T') {
      if (
        this.globals.pIndicadorSat == 0 &&
        this.formControls.expedientTransferenceNumber.value != 'S/N' &&
        !['1', '5', 1, 5].includes(this.formControls.indiciadoNumber.value.id)
      ) {
        const transferentData = {
          city: this.formControls.cityNumber.value.idCity,
          indiciado: this.formControls.indiciadoNumber.value.id,
          transferent: this.formControls.expedientTransferenceNumber.value,
        };
        this.notificationService
          .findTransferentCity(transferentData)
          .subscribe({
            next: data => {
              if (data.data.length > 0) {
                let expedients = data.data.map(n => n.expedientNumber);
                this.expedientRecord = Math.max(...expedients);
                this.showTrackRecords(data.data);
              } else {
                this.trackRecordsCheck();
              }
            },
            error: err => {
              console.log(err);
              this.trackRecordsCheck();
            },
          });
      } else {
        this.trackRecordsCheck();
      }
    } else {
      const inquiryData = {
        protectionKey: this.formControls.protectionKey.value,
        touchPenaltyKey: this.formControls.touchPenaltyKey.value,
        circumstantialRecord: this.formControls.circumstantialRecord.value,
        preliminaryInquiry: this.formControls.preliminaryInquiry.value,
        criminalCase: this.formControls.criminalCase.value,
        entFedKey: this.formControls.entFedKey.value.toString(),
        indiciadoNumber: this.formControls.indiciadoNumber.value?.id,
        minpubNumber: this.formControls.minpubNumber.value?.id,
        cityNumber: this.formControls.cityNumber.value?.idCity,
        courtNumber: this.formControls.courtNumber.value?.id,
        transference: this.formControls.endTransferNumber.value?.id,
        stationNumber: this.formControls.stationNumber.value?.id,
        autorityNumber: Number(
          this.formControls.autorityNumber.value?.idAuthority
        ),
      };
      this.notificationService.findCountByInquiry(inquiryData).subscribe({
        next: data => {
          if (data.data.length > 0) {
            this.showTrackRecords(data.data);
          } else {
            this.trackRecordsCheck();
          }
        },
        error: err => {
          console.log(err);
          this.trackRecordsCheck();
        },
      });
    }
  }

  trackRecordsCheck(trackRecord?: INotification) {
    console.log(trackRecord);
    if (trackRecord) {
      if (this.formControls.expedientNumber.value != null) {
        this.updateGlobalVars(
          'gNoExpediente',
          Number(this.formControls.expedientNumber.value)
        );
      } else if (trackRecord?.expedientNumber) {
        this.updateGlobalVars('gNoExpediente', trackRecord.expedientNumber);
        this.formControls.expedientNumber.setValue(trackRecord.expedientNumber);
      } else if (this.expedientRecord != null) {
        this.updateGlobalVars('gNoExpediente', this.expedientRecord);
      }
      if (this.formControls.wheelNumber.value != null) {
        this.updateGlobalVars(
          'gNoVolante',
          Number(this.formControls.wheelNumber.value)
        );
      } else if (trackRecord?.wheelNumber) {
        this.updateGlobalVars('gNoVolante', trackRecord.wheelNumber);
        this.formControls.wheelNumber.setValue(trackRecord.wheelNumber);
      }
      this.updateGlobalVars('gLastCheck', 1);
      this.updateGlobalVars('antecede', 1);
      this.startGoodsCapture();
    }
    this.startGoodsCapture();
  }

  startGoodsCapture() {
    if (this.formControls.wheelType.value == 'A') {
      this.updateGlobalVars('gCreaExpediente', 'N');
    }
    if (this.globals.gNoExpediente == null) {
      this.expedientService.getNextVal().subscribe({
        next: data => {
          this.updateGlobalVars('gNoExpediente', Number(data.nextval));
          this.formControls.expedientNumber.setValue(Number(data.nextval));
          console.log(this.globals.gNoExpediente);
        },
      });
    }
    if (this.globals.gNoVolante == null) {
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
          this.updateGlobalVars('gNoVolante', data.nextval);
        },
        error: err => {
          console.log(err);
        },
      });
    }
    this.prepareFormData();
    this.procedureManageService.getById(this.pageParams.pNoTramite).subscribe({
      next: data => {
        const { affair, affairSij, typeManagement, officeNumber } = data;
        this.saveTmpExpedients(affair, affairSij, typeManagement, officeNumber);
        this.saveTmpNotifications(affairSij);
        this.captureGoods();
      },
      error: () => {
        this.captureGoods();
      },
    });
  }

  saveTmpExpedients(
    affair: string,
    affairSij: number,
    typeManagement: number,
    officeNumber: string
  ) {
    if (this.formControls.expedientNumber.value != null) {
      this.tmpExpedientService
        .remove(this.formControls.expedientNumber.value)
        .subscribe({
          next: () => {},
          error: err => {
            console.log(err);
          },
        });
    }
    if (this.formControls.expedientNumber.value == null) {
      this.expedientService.getNextVal().subscribe({
        next: data => {
          console.log(data);
          this.formControls.expedientNumber.setValue(Number(data.nextval));
        },
        error: err => {
          console.log(err);
        },
      });
    }
    const expedientData: ITempExpedient = {
      id: this.formControls.expedientNumber.value,
      circumstantialRecord: this.formData.circumstantialRecord,
      preliminaryInquiry: this.formData.preliminaryInquiry,
      criminalCase: this.formData.criminalCase,
      protectionKey: this.formData.protectionKey,
      keyPenalty: this.formData.touchPenaltyKey,
      indicatedName: this.formData.indiciadoName,
      courtNumber: this.formData.courtNumber,
      federalEntityKey: this.formData.entFedKey,
      crimeKey: this.formData.crimeKey,
      identifier: this.formData.identifier,
      transferNumber: this.formData.endTransferNumber,
      authorityNumber: this.formData.autorityNumber,
      stationNumber: this.formData.stationNumber,
      expedientType: this.formData.wheelType,
      expTransferNumber: this.formData.expedientTransferenceNumber,
      observations: this.formData.observations,
      insertDate: this.formData.captureDate,
      subject: affair,
      noSubjectSij: affairSij,
      typeTranssact: typeManagement,
      noOffice: officeNumber,
    };
    this.tmpExpedientService.create(expedientData).subscribe({
      next: () => {},
      error: err => {
        console.log(expedientData);
        console.log(err);
      },
    });
  }

  saveTmpNotifications(affairSij: number) {
    if (this.formControls.wheelNumber.value != null) {
      this.tmpNotificationService
        .remove(this.formControls.wheelNumber.value)
        .subscribe({
          next: () => {},
          error: err => {
            console.log(err);
          },
        });
    }
    if (this.formControls.wheelNumber.value == null) {
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          console.log(data);
          this.formControls.wheelNumber.setValue(data.nextval);
        },
        error: err => {
          console.log(err);
        },
      });
    }
    const notificationData: ITmpNotification = {
      ...this.formData,
      wheelNumber: this.formControls.wheelNumber.value,
      externalOfficeDate: this.formData.externalOfficeDate as Date,
      receiptDate: this.formData.receiptDate as Date,
      hcCaptureDate: new Date(),
      hcEntryProcedureDate: new Date(),
      affairSij,
      delegationNumber: this.userDelegation,
      subDelegationNumber: this.userSubdelegation,
    };
    this.tmpNotificationService.create(notificationData).subscribe({
      next: () => {},
      error: err => {
        console.log(notificationData);
        console.log(err);
      },
    });
  }

  captureGoods() {
    if (this.globals.pIndicadorSat == 0) {
      const options: ICountAffairOptions = {
        office: this.formControls.officeExternalKey.value,
        expedient: this.formControls.expedientTransferenceNumber.value,
      };
      this.satTransferService.getCountAffair(options).subscribe({
        next: data => {
          if (data.count > 1) {
            this.sentToSatBulkLoad();
          } else if (data.count == 1) {
            this.sendToGoodsCapture();
          }
        },
        error: () => {
          this.sendToGoodsCapture();
          this.onLoadToast(
            'error',
            'Error',
            'Error al buscar el oficio del SAT'
          );
        },
      });
    } else if (this.globals.pIndicadorSat == 1) {
      const options: ICountAffairOptions = {
        office: this.formControls.officeExternalKey.value,
      };
      this.satTransferService.getCountAffair(options).subscribe({
        next: data => {
          if (data.count > 1) {
            this.sentToSatBulkLoad();
          } else if (data.count == 1) {
            this.sendToGoodsCapture();
          }
        },
        error: () => {
          this.sendToGoodsCapture();
          this.onLoadToast(
            'error',
            'Error',
            'Error al buscar el oficio del SAT'
          );
        },
      });
    } else if (this.globals.vTipoTramite == 3) {
      this.interfacefgrService
        .getCountAffair(this.formData.officeExternalKey)
        .subscribe({
          next: data => {
            if (data.count > 1) {
              this.sendToPgrBulkLoad();
            } else if (data.count == 1) {
              this.sendToGoodsCapture(true);
            }
          },
          error: () => {
            this.sendToGoodsCapture();
            this.onLoadToast(
              'error',
              'Error',
              'Error al buscar el oficio del PGR'
            );
          },
        });
    } else {
      this.sendToGoodsCapture();
    }
  }

  sentToSatBulkLoad() {
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    this.docDataService.goodsBulkLoadSatSaeParams = {
      asuntoSat: this.formData.expedientTransferenceNumber,
      pNoExpediente: this.formControls.expedientNumber.value,
      pNoOficio: this.formData.officeExternalKey,
      pNoVolante: this.formControls.wheelNumber.value,
      pSatTipoExp: this.pageParams.pSatTipoExp,
      pIndicadorSat: this.pageParams.pIndicadorSat,
    };
    console.log(this.docDataService.goodsBulkLoadSatSaeParams);
    this.alert(
      'info',
      'Información',
      'El asunto registrado por el SAT contiene más de un bien, a continuación se hará la carga masiva de sus bienes'
    );
    this.router.navigateByUrl('pages/documents-reception/goods-bulk-load');
  }

  sendToPgrBulkLoad() {
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    // this.docDataService.setDocumentsReceptionRegisterForm(
    //   this.documentsReceptionForm.value
    // );
    this.docDataService.goodsBulkLoadPgrSaeParams = {
      pNoExpediente: this.formControls.expedientNumber.value,
      pNoVolante: this.formControls.wheelNumber.value,
      pAvPrevia: this.formData.preliminaryInquiry,
    };
    console.log(this.docDataService.goodsBulkLoadPgrSaeParams);
    this.alert(
      'info',
      'Información',
      'El asunto registrado por la PGR contiene más de un bien, a continuación se hará la carga masiva de sus bienes'
    );
    this.router.navigateByUrl('pages/documents-reception/goods-bulk-load');
  }

  sendToGoodsCapture(pgr?: boolean) {
    console.log('Goods Capture');
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    // this.docDataService.setDocumentsReceptionRegisterForm(
    //   this.documentsReceptionForm.value
    // );
    if (pgr) {
      this.docDataService.goodsCaptureTempParams = {
        iden: this.formData.identifier,
        noTransferente: this.pageParams.noTransferente,
        desalojo: this.formData.dailyEviction,
        pNoVolante: null,
        pNoOficio: null,
        asuntoSat: null,
      };
    } else {
      this.docDataService.goodsCaptureTempParams = {
        iden: this.formData.identifier,
        noTransferente: this.pageParams.noTransferente,
        desalojo: this.formData.dailyEviction,
        pNoVolante: this.formControls.wheelNumber.value,
        pNoOficio: this.formData.officeExternalKey,
        asuntoSat: this.formData.expedientTransferenceNumber,
      };
    }
    console.log(this.docDataService.goodsCaptureTempParams);
    this.router.navigateByUrl('pages/documents-reception/goods-capture');
  }

  deleteDuplicatedGoods() {
    if (this.formControls.expedientNumber.value != null) {
      this.docRegisterService
        .deleteGoodByExpedient(this.formControls.expedientNumber.value)
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }
    const params = new FilterParams();
    if (this.userDelegation != null && this.userSubdelegation != null) {
      params.addFilter('fileNumber', this.formControls.expedientNumber.value);
      this.docRegisterService.getGoods(params.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            const body = {
              id: data.data[0].id,
              goodId: data.data[0].goodId,
              delegationNumber: this.userDelegation,
              subDelegationNumber: this.userSubdelegation,
            };
            this.docRegisterService.updateGood(body).subscribe({
              next: () => {},
              error: () => {},
            });
          }
        },
        error: () => {},
      });
    }
  }

  postGoodsCapture() {
    const params = new FilterParams();
    this.tmpExpedientService.getById(this.globals.gNoExpediente).subscribe({
      next: data => {
        if (data.noSubjectSij) {
          params.addFilter('expedientNumber', this.globals.gNoExpediente);
          this.notificationService.getAllFilter(params.getParams()).subscribe({
            next: data => {
              if (data.data.length > 0) {
                this.formControls.expedientNumber.setValue(
                  data.data[0].expedientNumber
                );
                this.formControls.wheelNumber.setValue(
                  data.data[0].wheelNumber
                );
                this.updateProcedureManagement();
              }
            },
            error: () => {},
          });
        }
      },
      error: () => {},
    });
    this.sendFlyerCopies();
  }

  updateProcedureManagement() {
    const params = new FilterParams();
    params.addFilter(
      'expedientNumber',
      this.formControls.expedientNumber.value
    );
    params.addFilter('wheelNumber', this.formControls.wheelNumber.value);
    this.docRegisterService.getGoods(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          this.updateProcedure(true);
        } else {
          this.updateProcedure(false);
        }
      },
      error: () => {
        this.updateProcedure(false);
      },
    });
    this.alert(
      'success',
      'Notificación agregada',
      `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
    );
  }

  updateProcedure(goods: boolean) {
    let areaToTurn = this.formControls.estatusTramite.value.id;
    if (areaToTurn == null) areaToTurn = 'OP';
    let status: string;
    if (goods) {
      status = 'OPS';
    } else {
      status = 'OPP';
    }
    const body = {
      userToTurn: this.userRecipient.value.user,
      areaToTurn,
      wheelNumber: this.formControls.wheelNumber.value,
      expedient: this.formControls.expedientNumber.value,
      status,
    };
    const params = new FilterParams();
    if (this.pageParams.pNoTramite != null) {
      if (goods) {
        this.procedureManageService
          .update(this.pageParams.pNoTramite, body)
          .subscribe({
            next: () => {
              this.endProcess();
            },
            error: () => {
              this.endProcess();
            },
          });
      } else {
        params.addFilter('id', this.pageParams.pNoTramite);
        params.addFilter('status', 'OPI');
        this.procedureManageService
          .getAllFiltered(params.getParams())
          .subscribe({
            next: data => {
              if (data.data.length > 0) {
                this.procedureManageService
                  .update(this.pageParams.pNoTramite, body)
                  .subscribe({
                    next: () => {
                      this.endProcess();
                    },
                    error: () => {
                      this.endProcess();
                    },
                  });
              } else {
                this.endProcess();
              }
            },
            error: () => {
              this.endProcess();
            },
          });
      }
    }
  }

  endProcess() {
    this.resetGlobalVars();
    this.docDataService.flyersRegistrationParams = null;
    this.docDataService.documentsReceptionRegisterForm = null;
    this.docDataService.goodsBulkLoadPgrSaeParams = null;
    this.docDataService.goodsBulkLoadSatSaeParams = null;
    this.docDataService.goodsCaptureTempParams = null;
    this.docDataService.trackRecordGoods = [];
    this.router.navigateByUrl('pages/general-processes/work-mailbox');
  }
}
