import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { format, parse } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  merge,
  Observable,
  takeUntil,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
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
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { TmpExpedientService } from 'src/app/core/services/ms-expedient/tmp-expedient.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { TmpNotificationService } from 'src/app/core/services/ms-notification/tmp-notification.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MailboxModalTableComponent } from 'src/app/pages/general-processes/work-mailbox/components/mailbox-modal-table/mailbox-modal-table.component';
import { RELATED_FOLIO_TITLE } from 'src/app/pages/general-processes/work-mailbox/utils/modal-titles';
import { RELATED_FOLIO_COLUMNS } from 'src/app/pages/general-processes/work-mailbox/utils/related-folio-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppState } from '../../../../app.reducers';
import { IDocuments } from '../../../../core/models/ms-documents/documents';
import { ITempExpedient } from '../../../../core/models/ms-expedient/tmp-expedient.model';
import { FlyerPersontype } from '../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { ICountAffairOptions } from '../../../../core/models/ms-interfacesat/ms-interfacesat.interface';
import { IInstitutionNumber } from '../../../../core/models/ms-notification/notification.model';
import { IProceduremanagement } from '../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from '../../../../core/services/authentication/auth.service';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from '../../../../core/services/catalogs/issuing-institution.service';
import { DocumentsService } from '../../../../core/services/ms-documents/documents.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { TmpGestRegDocService } from '../../../../core/services/ms-flier/tmp-gest-reg-doc.service';
import { CatalExpSatService } from '../../../../core/services/ms-interfacesat/catal-exp-sat.service';
import { SatTransferService } from '../../../../core/services/ms-interfacesat/sat-transfer.service';
import { MassiveGoodService } from '../../../../core/services/ms-massivegood/massive-good.service';
import { ProtectionService } from '../../../../core/services/ms-protection/protection.service';
import { IGlobalVars } from '../../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../../shared/global-vars/services/global-vars.service';
import { FileUpdateCommunicationService } from '../../../juridical-processes/file-data-update/services/file-update-communication.service';
import { DocReceptionTrackRecordsModalComponent } from './components/doc-reception-track-records-modal/doc-reception-track-records-modal.component';
import { DocumentsReceptionFlyerSelectComponent } from './components/documents-reception-flyer-select/documents-reception-flyer-select.component';
import { IDocReceptionndicatedFormComponent } from './components/indicated-form/indicated-form.component';
import {
  DOCUMENTS_RECEPTION_SELECT_AFFAIR_COLUMNS,
  DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS,
  DOCUMENTS_RECEPTION_SELECT_DOCUMENTS_COLUMNS,
  DOCUMENTS_RECEPTION_SELECT_UNIQUE_KEY_COLUMNS,
} from './interfaces/columns';
import {
  DocuentsReceptionRegisterFormChanges,
  DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_DEFAULT_VALUES,
  DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM,
  DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_DEFAULT_VALUES,
  DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM,
  DOCUMENTS_RECEPTION_REGISTER_FORM,
  DOCUMENTS_RECEPTION_REGISTER_FORM_DEFAULT_VALUES,
  DOC_RECEPT_REG_FIELDS_TO_LISTEN,
  IDocReceptionFlyersRegistrationParams,
  IDocumentsReceptionData,
  ProcedureStatus,
  TaxpayerLabel,
} from './interfaces/documents-reception-register-form';

@Component({
  selector: 'app-documents-reception-register',
  templateUrl: './documents-reception-register.component.html',
  styles: [
    `
      .loader {
        height: 8rem;
      }

      .loader-msg {
        margin-top: 14rem;
      }
    `,
  ],
  animations: [
    trigger('OnShow', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
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
    // departamentDestinyNumber: (value: string) =>
    //   this.destinationAreaChange(value),
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
  canViewDocuments = false;
  identifier: string = null;
  //TODO: Dejar la delegacion y subdelegacion nulos
  userDelegation: number = 0;
  userSubdelegation: number = 0;
  userId: string;
  existingNotification: boolean = false;
  procedureBlocked: boolean = false;
  changeFlyerOption: boolean = false;
  transferorLoading: boolean = false;
  cityLoading: boolean = false;
  stationLoading: boolean = false;
  populatingForm: boolean = false;
  procedureId: number;
  reprocessFlag: boolean = false;
  showTransference: boolean = false;
  procedureStatusCode: string = '';
  pgrGoodsProcessed: boolean = true;
  loadingPostCapture: boolean = false;
  formLoading: boolean = false;
  captureAfterSave: boolean = false;
  procedureOfficeKey: string = '';
  enableSaveFlyer: boolean = false;
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
  transferees = new DefaultSelect<ITransferente>();
  users = new DefaultSelect<IUser>();
  usersCopy = new DefaultSelect<IUser>();
  // globals: IGlobalFlyerRegistration = {
  //   gNoExpediente: null,
  //   noVolante: null,
  //   bn: 0,
  //   gCreaExpediente: 'S',
  //   gstMensajeGuarda: '',
  //   gnuActivaGestion: 1,
  //   antecede: 0,
  //   pSatTipoExp: null,
  //   pIndicadorSat: null,
  //   gLastCheck: null,
  //   vTipoTramite: null,
  //   gCommit: null,
  //   gOFFCommit: null,
  //   noTransferente: null,
  //   gNoVolante: null,
  // };
  pageParams: IDocReceptionFlyersRegistrationParams = null;
  globals: IGlobalVars;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private docDataService: DocumentsReceptionDataService,
    private notificationService: NotificationService,
    private tmpNotificationService: TmpNotificationService,
    private affairService: AffairService,
    private docRegisterService: DocReceptionRegisterService,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private procedureManageService: ProcedureManagementService,
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
    private documentsService: DocumentsService,
    private store: Store<AppState>,
    private globalVarsService: GlobalVarsService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private fileUpdComService: FileUpdateCommunicationService,
    private changeDetectorRef: ChangeDetectorRef
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

  get departmentName() {
    return this.documentsReceptionForm.controls['destinationArea'].value;
  }

  get delegationName() {
    return this.documentsReceptionForm.controls['delegationName'].value;
  }

  get subDelegationName() {
    return this.documentsReceptionForm.controls['subDelegationName'].value;
  }

  get userRecipient() {
    return this.flyerCopyRecipientForm.controls['copyuser'];
  }

  get userCpp() {
    return this.flyerCopyCppForm.controls['copyuser'];
  }

  get flyerEditMode() {
    return this.docDataService.flyerEditMode;
  }

  get flyerReceptionMode() {
    return this.docDataService.flyerReceptionMode;
  }

  ngOnInit(): void {
    let main = document.documentElement.querySelector('.init-page');
    main.scroll(0, 0);
    this.checkParams();
    this.onFormChanges();
    this.getLoggedUserArea();
    this.setDefaultValues();
    this.checkManagementArea();
    if (this.docDataService.documentsReceptionRegisterForm == null) {
      if (
        this.pageParams.pGestOk === 1 ||
        (this.pageParams.pNoVolante !== null &&
          this.pageParams.pNoVolante !== undefined)
      ) {
        // this.formControls.wheelNumber.setValue(null);
        // this.formControls.expedientNumber.setValue(null);
        this.documentsReceptionForm.reset();
        this.flyerCopyRecipientForm.reset();
        this.flyerCopyCppForm.reset();
        this.documentsReceptionForm.patchValue(
          DOCUMENTS_RECEPTION_REGISTER_FORM_DEFAULT_VALUES
        );
        this.flyerCopyRecipientForm.patchValue(
          DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_DEFAULT_VALUES
        );
        this.flyerCopyCppForm.patchValue(
          DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_DEFAULT_VALUES
        );
        this.formControls.externalOfficeDate.enable();
        //this.reprocessFlag = true;
        this.setDefaultValues();
        this.setInitialConditions();
        this.checkPgrGoods();
      } else if (!this.docDataService.flyerEditMode) {
        //if (Object.keys(this.pageParams).length > 0) {}
        this.documentsReceptionForm.reset();
        this.documentsReceptionForm.patchValue(
          DOCUMENTS_RECEPTION_REGISTER_FORM_DEFAULT_VALUES
        );
        this.formControls.externalOfficeDate.enable();
        this.setDefaultValues();
        this.selectFlyer();
      } else if (Object.keys(this.pageParams).length == 0) {
        console.log('params empty');
        this.canViewDocuments = true;
        const param = new FilterParams();
        param.addFilter('flierNumber', this.formControls.wheelNumber.value);
        this.procedureManageService
          .getAllFiltered(param.getParams())
          .subscribe({
            next: data => {
              this.procedureId = data.data[0].id;
              console.log(this.procedureId);
            },
          });
      }
    } else if (
      this.pageParams.pNoTramite != null &&
      this.globals.gCommit == null
    ) {
      this.docDataService.documentsReceptionRegisterForm = null;
      this.documentsReceptionForm.reset();
      this.flyerCopyRecipientForm.reset();
      this.flyerCopyCppForm.reset();
      // this.documentsReceptionForm = this.fb.group(
      //   DOCUMENTS_RECEPTION_REGISTER_FORM
      // );
      this.documentsReceptionForm.patchValue(
        DOCUMENTS_RECEPTION_REGISTER_FORM_DEFAULT_VALUES
      );
      this.flyerCopyRecipientForm.patchValue(
        DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_DEFAULT_VALUES
      );
      this.flyerCopyCppForm.patchValue(
        DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_DEFAULT_VALUES
      );
      this.reprocessFlag = true;
      this.setDefaultValues();
      this.setInitialConditions();
    } else if (
      this.pageParams.pGestOk == 0 &&
      this.pageParams.pNoTramite == null
    ) {
      this.documentsReceptionForm.patchValue(
        this.docDataService.documentsReceptionRegisterForm
      );
    } else if (
      this.formControls.wheelNumber.value != null &&
      this.globals.gCommit == null
    ) {
      console.log('Forma restablecida automaticamente');
      this.formControls.wheelType.setValue(
        this.docDataService.documentsReceptionRegisterForm.wheelType
      );
      this.canViewDocuments = true;
      const param = new FilterParams();
      param.addFilter('flierNumber', this.formControls.wheelNumber.value);
      this.procedureManageService.getAllFiltered(param.getParams()).subscribe({
        next: data => {
          this.procedureId = data.data[0].id;
          this.checkPgrGoods(
            data.data[0].id,
            this.formControls.wheelNumber.value
          );
        },
      });
      if (this.docDataService.documentsReceptionRegisterForm != null) {
        if (this.formControls.affair.value == null) {
          this.formControls.affair.setValue(
            this.docDataService.documentsReceptionRegisterForm.affair
          );
          this.formControls.affairKey.setValue(
            this.docDataService.documentsReceptionRegisterForm.affairKey
          );
        }
        if (this.formControls.endTransferNumber.value == null) {
          this.formControls.endTransferNumber.setValue(
            this.docDataService.documentsReceptionRegisterForm.endTransferNumber
          );
        }
        if (this.formControls.identifier.value == null) {
          this.formControls.identifier.setValue(
            this.docDataService.documentsReceptionRegisterForm.identifier
          );
        }
        console.log(this.documentsReceptionForm.value);
      }
    }
    console.log(this.docDataService.documentsReceptionRegisterForm);
    console.log(
      Object.keys(this.pageParams).length == 0,
      this.wheelNumber.value != null
    );
  }

  checkParams() {
    this.getGlobalVars();
    console.log(this.pageParams);
    if (this.globals.gCommit == 'S') {
      if (Object.keys(this.pageParams).length > 0) {
        this.loadingPostCapture = true;
        this.formControls.identifier.setValue(
          this.docDataService.documentsReceptionRegisterForm.identifier
        );
        this.formControls.affair.setValue(
          this.docDataService.documentsReceptionRegisterForm.affair
        );
        this.formControls.endTransferNumber.setValue(
          this.docDataService.documentsReceptionRegisterForm.endTransferNumber
        );
        this.documentsReceptionForm.disable();
        if (this.globals.gOFFCommit == 'N') {
          this.checkPgrGoods();
          this.postGoodsCapture();
        } else {
          this.checkPgrGoods();
          ///this.deleteDuplicatedGoods();
          this.postGoodsCapture();
        }
      } else {
        console.log(
          'Bien capturado sin el flujo completo desde buzon de trabajo'
        );
      }
    }
  }

  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globals = globalVars;
        console.log(this.globals);
      });
  }

  updateGlobalVars<ParamKey extends keyof IGlobalVars>(
    globalVar: ParamKey,
    value: IGlobalVars[ParamKey]
  ) {
    let newState = { ...this.globals };
    newState = {
      ...this.globals,
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
    this.hideError();
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          this.userDelegation = data.data[0].delegationNumber;
          this.userSubdelegation = data.data[0].subdelegationNumber;
          console.log(this.userDelegation, this.userSubdelegation);
        }
      },
      error: () => {},
    });
    this.userProcedureBlockedCheck();
  }

  userProcedureBlockedCheck() {
    if (this.userId) {
      const params = new FilterParams();
      params.addFilter('reading', 'S');
      params.addFilter('writing', 'S');
      params.addFilter('typeNumber', 'OFICIALIA');
      params.addFilter('user', this.userId);
      this.loading = true;
      this.docRegisterService.userAreaCheck(params.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            if (this.procedureStatus == ProcedureStatus.sent) {
              this.procedureBlocked = true;
            } else {
              this.procedureBlocked = false;
            }
            this.loading = false;
          } else {
            if (this.procedureStatus == ProcedureStatus.sent) {
              this.procedureBlocked = true;
            }
          }
          this.loading = false;
        },
        error: err => {
          if (this.procedureStatus == ProcedureStatus.sent) {
            this.procedureBlocked = true;
          }
          this.loading = false;
        },
      });
    }
  }

  checkPgrGoods(processId?: number, flyerId?: number) {
    let processData: IProceduremanagement;
    console.log('Check Pgr Goods');
    console.log(this.pageParams.pNoTramite);
    console.log(this.globals.noVolante);
    const params = new FilterParams();
    // params.addFilter('id', this.pageParams.pNoTramite);
    this.hideError();
    let process: number, flyer: number;
    if (processId) {
      process = processId;
    } else {
      process = this.pageParams.pNoTramite;
    }
    if (flyerId) {
      flyer = flyerId;
    } else {
      flyer = this.globals.noVolante;
    }
    this.procedureManageService.getById(process).subscribe({
      next: data => {
        console.log(data);
        processData = data;
        const { status, typeManagement } = data;
        if (!['', null, undefined].includes(status) && status.includes('OP')) {
          params.removeAllFilters();
          params.addFilter('flyerNumber', flyer);
          this.docRegisterService.getGoods(params.getParams()).subscribe({
            next: data => {
              console.log(data);
              if (data.count > 0) {
                if ([3, '3'].includes(typeManagement)) {
                  this.pgrGoodsProcessed = true;
                }
                if ([2, '2'].includes(typeManagement)) {
                  this.pgrGoodsProcessed = true;
                } else if (typeManagement == null) {
                  params.removeAllFilters();
                  params.addFilter('pgrOffice', processData.officeNumber);
                  this.interfacefgrService
                    .getPgrTransferFiltered(params.getParams())
                    .subscribe({
                      next: data => {
                        this.pgrGoodsProcessed = true;
                      },
                      error: err => {
                        this.pgrGoodsProcessed = false;
                      },
                    });
                } else {
                  this.pgrGoodsProcessed = false;
                }
              } else {
                this.pgrGoodsProcessed = false;
              }
            },
            error: err => {
              console.log(err);
              this.pgrGoodsProcessed = false;
            },
          });
        } else {
          this.pgrGoodsProcessed = false;
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  setInitialConditions() {
    this.formLoading = true;
    if (this.globals.pSatTipoExp != null) {
      const param = new FilterParams();
      param.addFilter('expSat', this.globals.pSatTipoExp);
      this.hideError();
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
      this.docDataService.currentProcessId = this.pageParams.pNoTramite;
      this.docDataService.flyerReceptionMode = true;
      if (
        this.pageParams.pNoVolante === null ||
        this.pageParams.pNoVolante === undefined
      ) {
        this.hideError();
        this.procedureManageService
          .getById(this.pageParams.pNoTramite)
          .subscribe({
            next: data => {
              console.log(data);
              const procedure = data;
              if (data.flierNumber == null) {
                this.useProcedureData(data);
              } else {
                const param = new FilterParams();
                param.addFilter('wheelNumber', data.flierNumber);
                this.notificationService
                  .getAllFilter(param.getParams())
                  .subscribe({
                    next: data => {
                      this.fillForm(data.data[0]);
                    },
                    error: err => {
                      console.log(err);
                      this.alert(
                        'warning',
                        'Volante no encontrado',
                        'No se encontró la información del volante registrado en el trámite'
                      );
                      this.useProcedureData(procedure);
                    },
                  });
              }
            },
            error: () => {
              this.formLoading = false;
            },
          });
      } else {
        this.initialCondition = 'T';
        this.formControls.wheelNumber.setValue(this.pageParams.pNoVolante);
        const param = new FilterParams();
        param.addFilter('wheelNumber', this.pageParams.pNoVolante);
        this.notificationService.getAllFilter(param.getParams()).subscribe({
          next: data => {
            this.fillForm(data.data[0]);
            // this.formControls.wheelType.setValue(data.data[0].wheelType);
            // const { wheelType } = data.data[0];
            // if (['A', 'P'].includes(wheelType)) {
            //   this.initialCondition = 'A';
            // } else if (['AT', 'T'].includes(wheelType)) {
            //   this.initialCondition = wheelType;
            // }
          },
          error: () => {
            this.formLoading = false;
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
      flierNumber,
      admissionDate,
      typeManagement,
      affairSij,
      delegation,
    } = procedure;
    affairType = Number(affairType);
    typeManagement = Number(typeManagement);
    this.procedureOfficeKey = officeNumber;
    this.updateGlobalVars('vTipoTramite', typeManagement);
    if (affairType == 5) {
      this.initialCondition = 'T';
    } else if ([1, 2, 3, 4].includes(affairType)) {
      this.initialCondition = 'A';
    } else {
      this.initialCondition = 'T';
    }
    if (!procedure) {
      volante = this.pageParams.pNoVolante;
    } else {
      volante = flierNumber;
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
      this.formControls.officeExternalKey.setValue(officeNumber);
      this.hideError();
      this.docRegisterService
        .getDynamicTables(1, { inicio: 1, text: descentfed })
        .subscribe({
          next: data => {
            this.formControls.entFedKey.setValue(data.data[0]);
            console.log(this.formControls.entFedKey.value);
            this.getCities({ page: 1, text: '' });
          },
          error: () => {},
        });
    }
    if ([1, 2].includes(typeManagement)) {
      this.formControls.goodRelation.setValue('S');
      this.checkPgrGoods();
      this.alert(
        'info',
        'Tipo de Trámite',
        'Este registro es parte de la interfaz de SAT, en automático se mostrarán los datos correspondientes.'
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
      this.pgrInterface = true;
      this.checkPgrGoods();
      this.alert(
        'info',
        'Tipo de Trámite',
        'Este registro es parte de la interfaz de FGR, en automático se mostrarán los datos correspondientes.'
      );
      this.fillFormSatPgr(
        typeManagement,
        affair,
        officeNumber,
        affairSij,
        delegation
      );
    } else {
      this.checkPgrGoods();
      this.formLoading = false;
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
        this.hideError();
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
              this.affairService.getByIdAndOrigin(affairKey, 'SIAB').subscribe({
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
      this.hideError();
      this.docRegisterService.getAffairsFiltered(param.getParams()).subscribe({
        next: data =>
          this.formControls.affairKey.setValue(data.data[0].id.toString()),
      });
      this.formLoading = false;
    }
    if (typeManagement == 2) {
      this.satInterface = true;
      this.formControls.wheelType.setValue('T');
      this.initialCondition = 'T';
      let param = new FilterParams();
      param.addFilter('id', 'TRANS');
      this.hideError();
      this.docRegisterService.getIdentifiers(param.getParams()).subscribe({
        next: data => this.formControls.identifier.setValue(data.data[0]),
      });
      this.getFieldsByManagementArea(typeManagement, subject, officeKey);
      this.formControls.officeExternalKey.setValue(officeKey);
      this.hideError();
      this.docRegisterService.getByTableKeyOtKey(9, 1).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
      this.hideError();
      this.docRegisterService.getPhaseEdo().subscribe({
        next: data => {
          param = new FilterParams();
          param.addFilter('id', depa);
          param.addFilter('numDelegation', delegation);
          param.addFilter('phaseEdo', data.stagecreated);
          console.log(param.getParams());
          this.hideError();
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
                  const delegation = data.data[0].delegation as IDelegation;
                  this.formControls.delDestinyNumber.setValue(delegation.id);
                  this.formControls.delegationName.setValue(
                    delegation.description
                  );
                  const subdelegation = data.data[0]
                    .numSubDelegation as ISubdelegation;
                  this.formControls.subDelDestinyNumber.setValue(
                    subdelegation.id
                  );
                  this.formControls.subDelegationName.setValue(
                    subdelegation.description
                  );
                }
              },
            });
        },
        error: () => {},
      });
      param = new FilterParams();
      param.addFilter('id', 'DJ');
      this.hideError();
      this.docRegisterService
        .getManagementAreasFiltered(param.getParams())
        .subscribe({
          next: data => this.formControls.estatusTramite.setValue(data.data[0]),
        });
      this.hideError();
      this.docRegisterService.getUserByDelegation(delegation).subscribe({
        next: data => {
          const params = new FilterParams();
          params.addFilter('user', data.user);
          this.hideError();
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
      this.destinationAreaChange();
      this.formLoading = false;
    }
    if (typeManagement == 3) {
      this.formControls.wheelType.setValue('P');
      this.initialCondition = 'P';
      let param = new FilterParams();
      param.addFilter('id', 'ASEG');
      this.hideError();
      this.docRegisterService.getIdentifiers(param.getParams()).subscribe({
        next: data => this.formControls.identifier.setValue(data.data[0]),
      });
      this.getFieldsByManagementArea(typeManagement, subject, officeKey);
      this.formControls.preliminaryInquiry.setValue(subject);
      this.formControls.officeExternalKey.setValue(officeKey);
      this.hideError();
      this.docRegisterService.getByTableKeyOtKey(9, 16).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
      this.hideError();
      this.docRegisterService.getPhaseEdo().subscribe({
        next: data => {
          param = new FilterParams();
          param.addFilter('id', depa);
          param.addFilter('numDelegation', delegation);
          param.addFilter('phaseEdo', data.stagecreated);
          console.log(param.getParams());
          this.hideError();
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
                  const delegation = data.data[0].delegation as IDelegation;
                  this.formControls.delDestinyNumber.setValue(delegation.id);
                  this.formControls.delegationName.setValue(
                    delegation.description
                  );
                  const subdelegation = data.data[0]
                    .numSubDelegation as ISubdelegation;
                  this.formControls.subDelDestinyNumber.setValue(
                    subdelegation.id
                  );
                  this.formControls.subDelegationName.setValue(
                    subdelegation.description
                  );
                }
              },
            });
        },
        error: () => {},
      });
      param = new FilterParams();
      param.addFilter('pgrOffice', this.formControls.officeExternalKey.value);
      this.hideError();
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
      this.hideError();
      this.docRegisterService
        .getManagementAreasFiltered(param.getParams())
        .subscribe({
          next: data => this.formControls.estatusTramite.setValue(data.data[0]),
        });
      this.hideError();
      this.docRegisterService.getUserByDelegation(delegation).subscribe({
        next: data => {
          const params = new FilterParams();
          params.addFilter('user', data.user);
          this.hideError();
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
      this.destinationAreaChange();
      this.formControls.circumstantialRecord.disable();
      this.formControls.protectionKey.disable();
      this.formControls.touchPenaltyKey.disable();
      this.formLoading = false;
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
      this.hideError();
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
            const officeDate = new Date(officeExternalDate);
            const officeDateStr = this.parseDatepickerFormat(officeDate);
            // this.formControls.externalOfficeDate.setValue(officeDateStr);
            this.formControls.externalOfficeDate.setValue(
              format(
                parse(officeExternalDate, 'yyyy-MM-dd', new Date()),
                'dd/MM/yyyy'
              )
            );
          }
          if (this.formControls.observations.value == null) {
            this.formControls.observations.setValue(description);
          }
          if (this.formControls.affairKey.value == null) {
            this.formControls.affairKey.setValue(affairKey);
            this.hideError();
            this.affairService.getByIdAndOrigin(affairKey, 'SIAB').subscribe({
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
          this.hideError();
          this.docRegisterService
            .getUniqueKeyData(param.getParams())
            .subscribe({
              next: data => {
                this.formControls.uniqueKey.setValue(data.data[0]);
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
      this.hideError();
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
            const officeDate = new Date(officeExternalDate);
            const officeDateStr = this.parseDatepickerFormat(officeDate);
            // this.formControls.externalOfficeDate.setValue(officeDateStr);
            this.formControls.externalOfficeDate.setValue(
              format(
                parse(officeExternalDate, 'yyyy-MM-dd', new Date()),
                'dd/MM/yyyy'
              )
            );
          }
          if (this.formControls.observations.value == null) {
            this.formControls.observations.setValue(description);
          }
          if (this.formControls.affairKey.value == null) {
            this.formControls.affairKey.setValue(affairKey);
            this.hideError();
            this.affairService.getByIdAndOrigin(affairKey, 'SIAB').subscribe({
              next: data => this.formControls.affair.setValue(data.description),
              error: () => {},
            });
          }
          const param = new FilterParams();
          param.addFilter('uniqueCve', Number(onlyKey));
          this.hideError();
          this.docRegisterService
            .getUniqueKeyData(param.getParams())
            .subscribe({
              next: data => {
                this.formControls.uniqueKey.setValue(data.data[0]);
                this.setUniqueKeyData(data.data[0], true);
              },
              error: () => {},
            });
          this.formControls.externalOfficeDate.disable();
        },
        error: () => {},
      });
    }
  }

  setDefaultValues() {
    const initialDate = this.parseDatepickerFormat(this.initialDate);
    // this.formControls.receiptDate.setValue(initialDate);
    if (this.docDataService.documentsReceptionRegisterForm == null) {
      this.formControls.receiptDate.setValue(format(new Date(), 'dd/MM/yyyy'));
    }
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

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  checkManagementArea() {
    if (this.pageParams.pGestOk == 1 || this.globals.gnuActivaGestion == 1) {
      this.formControls.estatusTramite.addValidators(Validators.required);
    }
  }

  onFormChanges() {
    this.hideError();
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
    if (this.formControls.identifier.value != null) {
      this.identifier = this.formControls.identifier.value.id;
    }
    let initialDate;
    if (['MIXTO', '4', '4MT'].includes(this.identifier)) {
      initialDate = this.parseDatepickerFormat(this.initialDate);
      this.formControls.receiptDate.setValue(initialDate);
    }
  }

  wheelTypeChange(type: string) {
    this.affairKey.setValue(null);
    this.formControls.identifier.setValue(null);
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
      this.docRegisterService.getIdentifier('TRANS').subscribe({
        next: data => {
          this.formControls.identifier.setValue(data);
        },
      });
      //
    } else {
      if (!this.formControls.crimeKey.hasValidator(Validators.required))
        this.formControls.crimeKey.addValidators(Validators.required);
    }
    if (type == 'P') {
      // this.formControls.circumstantialRecord.addValidators(Validators.required);
      // this.formControls.circumstantialRecord.updateValueAndValidity();
      // this.formControls.preliminaryInquiry.addValidators(Validators.required);
      // this.formControls.preliminaryInquiry.updateValueAndValidity();
      // this.formControls.criminalCase.addValidators(Validators.required);
      // this.formControls.criminalCase.updateValueAndValidity();
      // this.formControls.protectionKey.addValidators(Validators.required);
      // this.formControls.protectionKey.updateValueAndValidity();
      // this.formControls.touchPenaltyKey.addValidators(Validators.required);
      // this.formControls.touchPenaltyKey.updateValueAndValidity();
      this.formControls.indiciadoNumber.addValidators(Validators.required);
      this.formControls.indiciadoNumber.updateValueAndValidity();
      this.docRegisterService.getIdentifier('ASEG').subscribe({
        next: data => {
          this.formControls.identifier.setValue(data);
        },
      });
    } else {
      // this.formControls.circumstantialRecord.clearValidators();
      // this.formControls.circumstantialRecord.updateValueAndValidity();
      // this.formControls.preliminaryInquiry.clearValidators();
      // this.formControls.preliminaryInquiry.updateValueAndValidity();
      // this.formControls.criminalCase.clearValidators();
      // this.formControls.criminalCase.updateValueAndValidity();
      // this.formControls.protectionKey.clearValidators();
      // this.formControls.protectionKey.updateValueAndValidity();
      // this.formControls.touchPenaltyKey.clearValidators();
      // this.formControls.touchPenaltyKey.updateValueAndValidity();
      this.formControls.touchPenaltyKey.clearValidators();
      this.formControls.touchPenaltyKey.updateValueAndValidity();
    }
    if (type != 'A') {
      this.checkDailyEviction();
    }
  }

  destinationAreaChange() {
    if (this.userRecipient.value?.user) {
      if (!this.populatingForm) {
        const param = new FilterParams();
        param.addFilter('user', this.userRecipient.value.user);
        this.hideError();
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
    if (
      this.formControls.cityNumber.value != null &&
      this.formControls.cityNumber.value != undefined
    ) {
      this.hideError();
      this.docRegisterService
        .getDynamicTables(1, {
          inicio: 1,
          text: city.state.descCondition,
        })
        .subscribe({
          next: data => this.entFedKey.setValue(data.data[0]),
        });
      this.getFederalEntities({ page: 1, text: '' });
      this.getCourts({ page: 1, text: '', limit: 10 });
    }
  }

  entFedChange(value: TvalTable1Data) {
    if (
      this.formControls.entFedKey.value != null &&
      this.formControls.entFedKey.value != undefined
    ) {
      this.formControls.cityNumber.setValue(null);
      this.hideError();
      this.getCities({ page: 1, text: '' });
      this.changeDetectorRef.detectChanges();
    }
  }

  changeJudgement(judgement: string) {
    if (judgement != '' && judgement != null) {
      this.formControls.protectionKey.setValue(judgement);
    }
    // console.log(judgement, this.formControls.protectionKey.value);
  }

  authorityChange(authority: string) {
    if (this.formControls.autorityNumber.value != null) {
      this.formControls.originNumber.setValue(
        Number(this.formControls.autorityNumber.value.idAuthority)
      );
    }
  }

  checkDailyEviction() {
    const param = new FilterParams();
    if (this.formControls.expedientNumber.value != null) {
      param.addFilter('fileNumber', this.formControls.expedientNumber.value);
      this.hideError();
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
    this.docDataService.flyerEditMode = true;
    this.documentsReceptionForm.reset();
    this.userRecipient.setValue(null);
    this.userCpp.setValue(null);
    this.pgrGoodsProcessed = true;
    this.populatingForm = true;
    this.formLoading = true;
    console.log(notif);
    const filterParams = new FilterParams();
    const values = {
      wheelType: notif.wheelType,
      externalRemitter: notif.externalRemitter,
      priority: notif.priority,
      wheelNumber: notif.wheelNumber,
      consecutiveNumber: notif.consecutiveNumber,
      expedientNumber: notif.expedientNumber,
      circumstantialRecord: notif.circumstantialRecord,
      preliminaryInquiry: notif.preliminaryInquiry,
      criminalCase: notif.criminalCase,
      protectionKey: notif.protectionKey,
      touchPenaltyKey: notif.touchPenaltyKey,
      officeExternalKey: notif.officeExternalKey,
      observations: notif.observations,
      expedientTransferenceNumber: notif.expedientTransferenceNumber,
      officeNumber: notif.officeNumber,
      captureDate: notif.captureDate,
      wheelStatus: notif.wheelStatus,
      entryProcedureDate: notif.entryProcedureDate,
    };
    this.documentsReceptionForm.patchValue({ ...values });
    this.blockErrors(true);
    if (notif.expedientNumber == null) {
      this.onLoadToast(
        'warning',
        'Expediente no disponible',
        'Este volante no tiene asociado un expediente.'
      );
    }
    if (notif.dailyEviction == 0) {
      this.formControls.dailyEviction.setValue(false);
    } else if (notif.dailyEviction == 1) {
      this.formControls.dailyEviction.setValue(true);
    }
    if (notif.addressGeneral == 0 || notif.addressGeneral == null) {
      this.formControls.addressGeneral.setValue(false);
    } else if (notif.addressGeneral == 1) {
      this.formControls.addressGeneral.setValue(true);
    }
    this.formControls.receiptDate.setValue(
      format(this.parseDateNoOffset(notif.receiptDate), 'dd/MM/yyyy')
    );
    this.formControls.externalOfficeDate.setValue(
      format(this.parseDateNoOffset(notif.externalOfficeDate), 'dd/MM/yyyy')
    );
    // const receiptDate = this.parseDatepickerFormat(
    //   new Date(notif.receiptDate),
    //   'EN'
    // );
    // this.formControls.receiptDate.setValue(new Date(receiptDate));
    // const externalOfficeDate = this.parseDatepickerFormat(
    //   new Date(notif.externalOfficeDate),
    //   'EN'
    // );
    // this.formControls.externalOfficeDate.setValue(new Date(externalOfficeDate));
    if (notif.wheelStatus == 'PENDIENTE') {
      this.procedureStatus = ProcedureStatus.pending;
    } else if (notif.wheelStatus == 'ENVIADO') {
      this.procedureStatus = ProcedureStatus.sent;
    }
    //this.checkProcedureBlock();
    if (notif.wheelType != null)
      this.formControls.wheelType.setValue(notif.wheelType);
    this.initialCondition = notif.wheelType;
    if (notif.identifier != null) {
      this.hideError();
      this.docRegisterService.getIdentifier(notif.identifier).subscribe({
        next: data => {
          this.formControls.identifier.setValue(data);
          this.formControls.identifierExp.setValue(data.id);
        },
      });
    }
    if (notif.affairKey != null) {
      this.formControls.affairKey.setValue(notif.affairKey);
      this.hideError();
      this.affairService.getByIdAndOrigin(notif.affairKey, 'SIAB').subscribe({
        next: data => {
          this.formControls.affair.setValue(data.description);
          let goodRelation: string = 'N';
          if (data.clv == 'S') {
            goodRelation = data.clv;
          }
          this.formControls.goodRelation.setValue(goodRelation);
        },
      });
    }
    if (notif.cityNumber != null) {
      this.hideError();
      this.docRegisterService.getCity(notif.cityNumber).subscribe({
        next: data => this.formControls.cityNumber.setValue(data),
      });
    }
    if (notif.entFedKey != null) {
      this.hideError();
      this.docRegisterService.getByTableKeyOtKey(1, notif.entFedKey).subscribe({
        next: data => {
          this.formControls.entFedKey.setValue(data.data);
        },
      });
    }
    if (notif.endTransferNumber != null) {
      this.hideError();
      this.docRegisterService
        .getTransferent(notif.endTransferNumber)
        .subscribe({
          next: data => {
            this.formControls.endTransferNumber.setValue(data);
            this.updateGlobalVars('noTransferente', data.id);
          },
        });
    }
    if (notif.transference != null) {
      this.hideError();
      this.docRegisterService.getTransferent(notif.transference).subscribe({
        next: data => {
          this.formControls.transference.setValue(data);
          this.showTransference = true;
        },
      });
    }
    if (notif.courtNumber != null) {
      this.hideError();
      this.docRegisterService.getCourt(notif.courtNumber).subscribe({
        next: data => this.formControls.courtNumber.setValue(data),
      });
    }
    if (notif.stationNumber != null) {
      this.hideError();
      filterParams.removeAllFilters();
      filterParams.addFilter('id', notif.stationNumber);
      filterParams.addFilter('idTransferent', notif.endTransferNumber);
      this.docRegisterService.getStations(filterParams.getParams()).subscribe({
        next: data => {
          this.formControls.stationNumber.setValue(data.data[0]);
          this.getStations({ page: 1, limit: 10 });
        },
      });
    }
    if (notif.autorityNumber != null) {
      filterParams.removeAllFilters();
      filterParams.addFilter('idAuthority', notif.autorityNumber);
      filterParams.addFilter('idStation', notif.stationNumber);
      filterParams.addFilter('idTransferer', notif.endTransferNumber);
      this.hideError();
      this.docRegisterService
        .getAuthoritiesFilter(filterParams.getParams())
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.formControls.autorityNumber.setValue(data.data[0]);
              this.getAuthorities({ page: 1, limit: 10 });
            }
          },
          error: () => {},
        });
    }
    if (notif.minpubNumber != null) {
      const minpub = notif.minpubNumber as IMinpub;
      this.hideError();
      this.docRegisterService.getMinPub(minpub.id).subscribe({
        next: data => {
          this.formControls.minpubNumber.setValue(data);
        },
      });
    }
    if (notif.crimeKey != null) {
      this.hideError();
      this.docRegisterService.getByTableKeyOtKey(2, notif.crimeKey).subscribe({
        next: data => {
          this.formControls.crimeKey.setValue(data.data);
        },
      });
    }
    if (notif.indiciadoNumber != null) {
      this.hideError();
      this.docRegisterService.getDefendant(notif.indiciadoNumber).subscribe({
        next: data => this.formControls.indiciadoNumber.setValue(data),
      });
    }
    if (notif.viaKey != null) {
      this.hideError();
      this.docRegisterService.getByTableKeyOtKey(9, notif.viaKey).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
    }
    if (notif.delDestinyNumber != null) {
      this.formControls.delDestinyNumber.setValue(notif.delDestinyNumber);
      if (notif.delegation != null) {
        this.formControls.delegationName.setValue(notif.delegation.description);
      } else {
        this.hideError();
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
        this.hideError();
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
        this.hideError();
        this.docRegisterService.getPhaseEdo().subscribe({
          next: data => {
            console.log(data);
            filterParams.removeAllFilters();
            filterParams.addFilter('id', notif.departamentDestinyNumber);
            filterParams.addFilter('numDelegation', notif.delDestinyNumber);
            if (notif.subDelDestinyNumber != null) {
              filterParams.addFilter(
                'numSubDelegation',
                notif.subDelDestinyNumber
              );
            }
            filterParams.addFilter('phaseEdo', data.stagecreated);
            this.hideError();
            this.docRegisterService
              .getDepartamentsFiltered(filterParams.getParams())
              .subscribe(data =>
                this.formControls.destinationArea.setValue(
                  data.data[0].description
                )
              );
          },
          error: err => {
            console.log(err);
            this.onLoadToast(
              'warning',
              'Datos de Área no encontrados',
              'No se encontraron todos los datos del area correspondiente.'
            );
          },
        });
      }
    }
    if (notif.wheelNumber != null) {
      filterParams.removeAllFilters();
      if (notif.expedientNumber != null) {
        filterParams.addFilter('expedient', notif.expedientNumber);
      }
      filterParams.addFilter('flierNumber', notif.wheelNumber);
      this.hideError();
      this.procedureManageService
        .getAllFiltered(filterParams.getParams())
        .subscribe({
          next: data => {
            console.log(data.data[0].id);
            console.log(data);
            setTimeout(() => {
              this.formLoading = false;
            }, 500);
            this.procedureId = data.data[0].id;
            const { status, areaToTurn, userToTurn, typeManagement } =
              data.data[0];
            this.procedureStatusCode = status;
            if (areaToTurn != null) {
              filterParams.removeAllFilters();
              filterParams.addFilter('id', areaToTurn);
              this.hideError();
              this.docRegisterService
                .getManagementAreasFiltered(filterParams.getParams())
                .subscribe({
                  next: data => {
                    if (data.data.length > 0) {
                      this.formControls.estatusTramite.setValue(data.data[0]);
                    }
                  },
                  error: err => {
                    console.log(err);
                    this.onLoadToast(
                      'warning',
                      'Área de Gestión Destino no encontrada',
                      'No se encontró el área del trámite.'
                    );
                  },
                });
            } else {
              this.onLoadToast(
                'warning',
                'Área de Gestión Destino no encontrada',
                'No se encontró el área del trámite.'
              );
            }
            if (userToTurn != null) {
              filterParams.removeAllFilters();
              filterParams.addFilter('user', userToTurn);
              this.hideError();
              this.docRegisterService
                .getUsersSegAreas(filterParams.getParams())
                .subscribe({
                  next: data => {
                    if (data.data.length > 0) {
                      console.log(data);
                      if (this.userRecipient.value == null)
                        this.userRecipient.setValue(data.data[0]);
                    }
                  },
                  error: err => {
                    console.log(err);
                    // this.onLoadToast(
                    //   'warning',
                    //   'Usuario en atención no encontrado',
                    //   'No se encontró el usuario en atención del trámite.'
                    // );
                  },
                });
            }
            if (status == 'OPS') {
              filterParams.removeAllFilters();
              filterParams.addFilter('flyerNumber', notif.wheelNumber);
              this.docRegisterService
                .getGoods(filterParams.getParams())
                .subscribe({
                  next: data => {
                    console.log(data);
                    if (data.count > 0) {
                      if ([3, '3'].includes(typeManagement)) {
                        this.pgrGoodsProcessed = true;
                        console.log(typeManagement);
                      } else if ([2, '2'].includes(typeManagement)) {
                        this.pgrGoodsProcessed = true;
                        console.log(typeManagement);
                      } else if (typeManagement == null) {
                        filterParams.removeAllFilters();
                        filterParams.addFilter(
                          'pgrOffice',
                          notif.officeExternalKey
                        );
                        this.interfacefgrService
                          .getPgrTransferFiltered(filterParams.getParams())
                          .subscribe({
                            next: data => {
                              this.pgrGoodsProcessed = true;
                            },
                            error: err => {
                              this.pgrGoodsProcessed = false;
                            },
                          });
                      } else {
                        this.pgrGoodsProcessed = false;
                      }
                    } else {
                      this.pgrGoodsProcessed = false;
                    }
                    console.log(this.pgrGoodsProcessed);
                  },
                  error: err => {
                    console.log(err);
                    this.pgrGoodsProcessed = false;
                    console.log(this.pgrGoodsProcessed);
                  },
                });
            } else {
              this.pgrGoodsProcessed = false;
              console.log(this.pgrGoodsProcessed);
            }
          },
          error: err => {
            console.log(err);
            this.onLoadToast(
              'warning',
              'Datos no encontrados',
              'No se encontraron los datos del trámite asociado al volante.'
            );
            this.formLoading = false;
          },
        });
    } else {
      this.formLoading = false;
    }
    this.flyerCopiesService
      .findByIds({ copyNumber: '1', flierNumber: notif.wheelNumber })
      .subscribe({
        next: data => {
          filterParams.addFilter('user', data.copyuser);
          this.hideError();
          this.docRegisterService
            .getUsersSegAreas(filterParams.getParams())
            .subscribe({
              next: data => {
                if (data.data.length > 0) {
                  console.log(data);
                  this.userRecipient.setValue(data.data[0]);
                }
              },
              error: err => {
                console.log(err);
                this.onLoadToast(
                  'warning',
                  'Usuario en atención no encontrado',
                  'No se encontró el usuario en atención del volante.'
                );
              },
            });
        },
        error: err => {
          console.log(err);
          this.onLoadToast(
            'warning',
            'Usuario en atención no encontrado',
            'No se encontró el usuario en atención del volante.'
          );
        },
      });
    this.flyerCopiesService
      .findByIds({ copyNumber: '2', flierNumber: notif.wheelNumber })
      .subscribe({
        next: data => {
          filterParams.addFilter('user', data.copyuser);
          this.hideError();
          this.docRegisterService
            .getUsersSegAreas(filterParams.getParams())
            .subscribe({
              next: data => {
                if (data.data.length > 0) {
                  console.log(data);
                  this.userCpp.setValue(data.data[0]);
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
    if (notif.institutionNumber != null) {
      const institution = notif.institutionNumber as IInstitutionNumber;
      this.formControls.institutionName.setValue(institution.name);
      this.formControls.institutionNumber.setValue(institution.id);
    }
    if (this.wheelNumber.value != null) {
      this.canViewDocuments = true;
    }
    this.formControls.receiptDate.disable();
    this.checkDailyEviction();
    this.destinationAreaChange();
    if (notif.wheelStatus == 'ENVIADO') {
      this.procedureStatus = ProcedureStatus.sent;
      this.userProcedureBlockedCheck();
    } else {
      this.procedureStatus = ProcedureStatus.pending;
    }
    console.log(Object.keys(this.pageParams).length);
    if (Object.keys(this.pageParams).length == 0) {
      this.enableSaveFlyer = true;
    } else {
      this.enableSaveFlyer = false;
    }
    this.populatingForm = false;
    console.log(this.documentsReceptionForm.value);
    this.blockErrors(false);
  }

  selectFlyer() {
    this.changeFlyerOption = true;
    this.docDataService.flyersRegistrationParams = null;
    console.log(this.docDataService.flyersRegistrationParams);
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

  sendToRecordUpdate() {
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    if (this.procedureId != undefined) {
      this.fileUpdComService.fileDataUpdateParams = {
        pGestOk: 1,
        pNoTramite: this.procedureId,
        dictamen: false,
      };
    }
    console.log(this.procedureId);
    this.router.navigateByUrl('/pages/juridical/file-data-update');
  }

  showTrackRecords(trackRecords: INotification[]) {
    this.loading = false;
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
      '¿Desea enviar y bloquear este volante?',
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
                  this.userProcedureBlockedCheck();
                  this.onLoadToast(
                    'success',
                    'Volante y trámite actualizados correctamente',
                    ''
                  );
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
              'Parametro faltante: pNoTramite'
            );
          }
        } else {
          if (this.wheelNumber.value != null) {
            this.notificationService
              .update(Number(this.wheelNumber.value), {
                wheelStatus: 'ENVIADO',
              })
              .subscribe({
                next: data => {
                  this.formControls.wheelStatus.setValue(ProcedureStatus.sent);
                  this.procedureStatus = ProcedureStatus.sent;
                  this.userProcedureBlockedCheck();
                  this.onLoadToast(
                    'success',
                    'Volante actualizado correctamente',
                    ''
                  );
                },
                error: err => {
                  console.log(err);
                  this.onLoadToast(
                    'error',
                    'Error',
                    'Hubo un problema al enviar y bloquear el volante'
                  );
                },
              });
          } else {
            this.onLoadToast(
              'error',
              'Error',
              'Hubo un problema al enviar y bloquear el volante'
            );
          }
        }
      }
    });
  }

  checkProcedureBlock() {
    this.hideError();
    this.docRegisterService
      .getUserOfficePermission({ toolbarUser: this.userId })
      .subscribe({
        next: data => {
          if (data.val_usr == 0) {
            //TODO: Removido para pruebas, habilitar para verificar usuario
            // this.procedureBlocked = true;
          }
        },
        error: () => {},
      });
  }

  viewDocuments() {
    // this.getDocumentsByFlyer(this.wheelNumber.value);
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.wheelNumber.value);
    // params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.getDocumentsByFlyer(this.wheelNumber.value);
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'info',
          'No disponible',
          'El volante no tiene documentos relacionados.'
        );
      },
    });
  }

  openModalDocuments() {
    this.openModalSelect(
      {
        title: 'Folios Relacionados al Expediente',
        columnsType: { ...DOCUMENTS_RECEPTION_SELECT_DOCUMENTS_COLUMNS },
        service: this.docRegisterService,
        dataObservableFn: this.docRegisterService.getDocuments,
        filters: [
          {
            field: 'flyerNumber',
            value: this.wheelNumber.value,
          },
          {
            field: 'scanStatus',
            value: 'ESCANEADO',
          },
        ],
        selectOnClick: true,
        type: 'text',
      },
      this.selectDocument
    );
  }

  selectDocument(
    document: IDocuments,
    self: DocumentsReceptionRegisterComponent
  ) {
    if (document) {
      console.log(document);
      self.documentMessage();
    }
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

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = RELATED_FOLIO_TITLE;
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
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

  documentMessage() {
    this.onLoadToast(
      'info',
      'Enlace no disponible',
      'El enlace al documento no se encuentra disponible'
    );
  }

  openModalDefendant() {
    const modalRef = this.modalService.show(
      IDocReceptionndicatedFormComponent,
      {
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onSave.subscribe(data => {
      if (data) this.addDefendant(data);
    });
  }

  addDefendant(defendant: IIndiciados) {
    this.getDefendants({ page: 1, text: '' });
    this.docRegisterService.getDefendant(defendant.id).subscribe({
      next: data => {
        this.formControls.indiciadoNumber.setValue(data);
      },
      error: () => {},
    });
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
    this.hideError();
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
    if (lparams?.text.length > 0) {
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    }
    let type: string;
    if (['A', 'P'].includes(this.wheelType.value)) type = 'A';
    if (['AT', 'T'].includes(this.wheelType.value)) type = 'T';
    if (this.wheelType.value != null) params.addFilter('keyview', type);
    this.hideError();
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
    this.hideError();
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
    this.hideError();
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
    this.hideError();
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
    return this.docRegisterService.getDynamicTables(id, params);
  }

  getTransferors(lparams: ListParams) {
    const body = {
      active: ['1', '2'],
      nameTransferent: lparams.text,
    };
    this.transferorLoading = true;
    this.hideError();
    this.docRegisterService.getActiveTransferents(body).subscribe({
      next: data => {
        this.transferors = new DefaultSelect(data.data, data.count);
        this.transferorLoading = false;
      },
      error: () => {
        this.transferors = new DefaultSelect();
        this.transferorLoading = false;
      },
    });
  }

  getTransferees(lparams: ListParams) {
    const body = {
      active: ['1', '2'],
      nameTransferent: lparams.text,
    };
    this.hideError();
    this.docRegisterService.getActiveTransferents(body).subscribe({
      next: data => {
        this.transferees = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.transferees = new DefaultSelect();
      },
    });
  }

  getStations(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text?.length > 0)
      params.addFilter('stationName', lparams.text, SearchFilter.LIKE);
    if (this.endTransferNumber.value != null)
      params.addFilter('idTransferent', this.endTransferNumber.value.id);
    this.stationLoading = true;
    this.hideError();
    this.docRegisterService.getStations(params.getParams()).subscribe({
      next: data => {
        this.stations = new DefaultSelect(data.data, data.count);
        this.stationLoading = false;
      },
      error: () => {
        this.stations = new DefaultSelect();
        this.stationLoading = false;
      },
    });
  }

  getAuthorities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text?.length > 0)
      params.addFilter('authorityName', lparams.text, SearchFilter.LIKE);
    if (this.endTransferNumber.value != null)
      params.addFilter('idTransferer', this.endTransferNumber.value.id);
    if (this.stationNumber.value != null)
      params.addFilter('idStation', this.stationNumber.value.id);
    this.hideError();
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
    this.hideError();
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
    if (event?.id) {
      this.formControls.transference.setValue(event);
      this.updateGlobalVars('noTransferente', event.id);
    }
    this.formControls.stationNumber.setValue(null);
    this.formControls.autorityNumber.setValue(null);
    this.getStations({ page: 1, text: '' });
    this.getAuthorities({ page: 1, text: '' });
  }

  changeStation(event: IStation) {
    this.formControls.autorityNumber.setValue(null);
    this.getAuthorities({ page: 1, text: '' });
  }

  getCourts(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.docRegisterService.getCourtsUnrelated(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.courts = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.courts = new DefaultSelect();
      },
    });
  }

  getDefendants(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0) {
      params.addFilter('name', lparams.text, SearchFilter.LIKE);
    }
    this.hideError();
    this.docRegisterService.getDefendants(params.getParams()).subscribe({
      next: data => {
        this.defendants = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.defendants = new DefaultSelect();
      },
    });
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    this.cityLoading = true;
    if (lparams?.text.length > 0) {
      params.addFilter('nameCity', lparams.text, SearchFilter.LIKE);
    }
    if (this.formControls.entFedKey.value != null) {
      params.addFilter('state', this.formControls.entFedKey.value?.otKey);
    }
    this.hideError();
    this.docRegisterService.getCities(params.getParams()).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
        this.cityLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.cities = new DefaultSelect();
        this.cityLoading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
    this.changeDetectorRef.detectChanges();
  }

  getManagementAreas(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.docRegisterService
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
    this.hideError();
    this.docRegisterService.getUniqueKeyData(param.getParams()).subscribe({
      next: data => {
        this.uniqueKeys = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.uniqueKeys = new DefaultSelect();
      },
    });
  }

  getUsers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      // params.addFilter('user', lparams.text, SearchFilter.LIKE);
      params.search = lparams.text;
    if (this.delDestinyNumber.value != null)
      params.addFilter('delegationNumber', this.delDestinyNumber.value);
    if (this.subDelDestinyNumber.value != null)
      params.addFilter('subdelegationNumber', this.subDelDestinyNumber.value);
    this.hideError();
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
      // params.addFilter('user', lparams.text, SearchFilter.LIKE);
      params.search = lparams.text;
    this.hideError();
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
        selectOnClick: true,
        type: 'text',
        placeholder: 'Buscar por Nombre Área...',
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
          /*{
            field: 'id',
          },*/
        ],
        searchFilterCompatible: true,
        selectOnClick: true,
        placeholder: 'Buscar tipo de asunto...',
        type: 'text',
      },
      this.selectAffair
    );
  }

  openModalKeys() {
    this.openModalSelect(
      {
        title: 'Clave Única',
        columnsType: { ...DOCUMENTS_RECEPTION_SELECT_UNIQUE_KEY_COLUMNS },
        service: this.docRegisterService,
        dataObservableFn: this.docRegisterService.getUniqueKeyDataModal,
        searchFilter: { field: 'uniqueCve' },
        searchFilterCompatible: false,
        selectOnClick: true,
        placeholder: 'Buscar por Clave Única...',
      },
      this.selectUniqueKey
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
    const delegation = areaData.delegation as IDelegation;
    const subdelegation = areaData.numSubDelegation as ISubdelegation;
    self.formControls.departamentDestinyNumber.setValue(areaData.id);
    self.formControls.destinationArea.setValue(areaData.description);
    self.formControls.delDestinyNumber.setValue(delegation.id);
    self.formControls.delegationName.setValue(delegation.description);
    self.formControls.subDelDestinyNumber.setValue(subdelegation.id);
    self.formControls.subDelegationName.setValue(subdelegation.description);
    self.getPublicMinistries({ page: 1, text: '' });
    self.getUsers({ page: 1, text: '' });
    self.destinationAreaChange();
  }

  selectAffair(affair: IAffair, self: DocumentsReceptionRegisterComponent) {
    self.formControls.affairKey.setValue(affair.id.toString());
    self.formControls.affair.setValue(affair.description);
    self.formControls.goodRelation.setValue(affair.clv);
  }

  selectUniqueKey(
    key: ITransferingLevelView,
    self: DocumentsReceptionRegisterComponent
  ) {
    self.formControls.uniqueKey.setValue(key);
    self.setUniqueKeyData(key, true);
    self.uniqueKeys = new DefaultSelect([key], 1);
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
    if (key.transfereeNum != null) {
      this.hideError();
      this.docRegisterService.getTransferent(key.transfereeNum).subscribe({
        next: data => {
          this.formControls.endTransferNumber.setValue(data);
          this.updateGlobalVars('noTransferente', data.id);
        },
        error: () => {},
      });
    }
    if (key.stationNum != null) {
      this.hideError();
      const params = new FilterParams();
      params.addFilter('id', key.stationNum);
      params.addFilter('idTransferent', key.transfereeNum);
      this.docRegisterService.getStations(params.getParams()).subscribe({
        next: data => {
          this.formControls.stationNumber.setValue(data.data[0]);
          this.getStations({ page: 1, limit: 10 });
        },
      });
    }
    if (key.authorityNum != null) {
      const param = new FilterParams();
      param.addFilter('idAuthority', key.authorityNum);
      param.addFilter('idStation', key.stationNum);
      param.addFilter('idTransferer', key.transfereeNum);
      this.hideError();
      this.docRegisterService
        .getAuthoritiesFilter(param.getParams())
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.formControls.autorityNumber.setValue(data.data[0]);
              this.getAuthorities({ page: 1, limit: 10 });
            }
          },
          error: () => {},
        });
    }
    if (full) {
      if (key.cityNum != null) {
        this.hideError();
        this.docRegisterService.getCity(key.cityNum).subscribe({
          next: data => {
            this.formControls.cityNumber.setValue(data);
          },
          error: () => {},
        });
      }
      if (key.federalEntityCve != null) {
        this.hideError();
        this.docRegisterService
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
    console.log(this.documentsReceptionForm.value);
    this.formControls.receiptDate.enable();
    this.formControls.externalOfficeDate.enable();
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
      uniqueKey: Number(this.formControls.uniqueKey.value?.uniqueCve),
      transference: this.formControls.transference.value?.id,
      captureDate: format(new Date(), 'yyyy-MM-dd'),
      entryProcedureDate: format(new Date(), 'yyyy-MM-dd'),
      officeExternalKey: this.formControls.officeExternalKey.value.substring(
        0,
        34
      ),
    };
    if (typeof formData.receiptDate == 'string') {
      formData.receiptDate = format(
        parse(
          this.formControls.receiptDate.value as string,
          'dd/MM/yyyy',
          new Date()
        ),
        'yyyy-MM-dd'
      );
    } else {
      formData.receiptDate = format(
        this.formControls.receiptDate.value as Date,
        'yyyy-MM-dd'
      );
    }
    if (typeof formData.externalOfficeDate == 'string') {
      formData.externalOfficeDate = format(
        parse(
          this.formControls.externalOfficeDate.value as string,
          'dd/MM/yyyy',
          new Date()
        ),
        'yyyy-MM-dd'
      );
    } else {
      formData.externalOfficeDate = format(
        this.formControls.externalOfficeDate.value as Date,
        'yyyy-MM-dd'
      );
    }
    if (this.formControls.institutionName == null) {
      this.hideError();
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
    this.formControls.officeExternalKey.setValue(formData.officeExternalKey);
    console.log(this.formData);
  }

  checkFormErrors(): boolean {
    let requiredErrors: number = 0,
      otherErrors: number = 0;
    let errors: string[] = [];
    for (const key in this.formControls) {
      const control = this.documentsReceptionForm.get(key);
      if (control.errors != null) {
        console.log(key, control.errors);
        errors = Object.keys(control.errors);
        errors.forEach(e => {
          if (e == 'required') {
            requiredErrors += 1;
          } else {
            otherErrors += 1;
          }
        });
      }
    }
    console.log(
      requiredErrors,
      otherErrors,
      this.reprocessFlag,
      this.documentsReceptionForm.invalid,
      this.flyerCopyRecipientForm.invalid,
      this.documentsReceptionForm.value,
      this.flyerCopyRecipientForm.value
    );
    let errorMsg: string = '';
    if (requiredErrors > 0) errorMsg = 'Complete todos los campos requeridos.';
    if (otherErrors > 0) errorMsg = 'Existen campos inválidos';
    if (requiredErrors > 0 && otherErrors > 0)
      errorMsg = 'Existen campos faltantes y/o inválidos';
    if (
      this.documentsReceptionForm.invalid &&
      (requiredErrors > 0 || otherErrors > 0) &&
      !this.reprocessFlag
    ) {
      this.documentsReceptionForm.markAllAsTouched();
      this.documentsReceptionForm.updateValueAndValidity();
      this.onLoadToast('warning', 'Formulario Inválido', errorMsg);
      return false;
    }
    if (this.flyerCopyRecipientForm.invalid && !this.reprocessFlag) {
      this.flyerCopyRecipientForm.markAllAsTouched();
      this.flyerCopyRecipientForm.updateValueAndValidity();
      this.onLoadToast(
        'warning',
        'Campos Faltantes',
        'Complete todos los campos requeridos.'
      );
      return false;
    }
    return true;
  }

  async checkCourt() {
    if (this.formControls.courtNumber.value != null) {
      let courtData;
      const param = new FilterParams();
      param.addFilter('courtNumber', this.formControls.courtNumber.value?.id);
      param.addFilter('city', this.formControls.cityNumber.value?.idCity);
      this.hideError();
      try {
        courtData = await firstValueFrom(
          this.docRegisterService.getCourtsByCity(param.getParams())
        );
      } catch (e) {
        return false;
      }
      if (courtData.data.length == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  async save(): Promise<boolean | void> {
    if (!this.checkFormErrors()) {
      console.log('Form invalid');
      return false;
    } else {
      console.log('Form valid');
    }
    // const courtFlag = await this.checkCourt();
    // if (!courtFlag) {
    //   this.onLoadToast(
    //     'warning',
    //     'Formulario Inválido',
    //     'El juzgado no corresponde a la ciudad seleccionada.'
    //   );
    //   this.loading = false;
    //   return false;
    // }
    this.loading = true;
    this.blockErrors(true);
    if (this.globals.gNoExpediente != null) {
      this.formControls.expedientNumber.setValue(
        Number(this.globals.gNoExpediente)
      );
    }
    //this.checkGoodsDailyEviction();
    if (this.globals.antecede == 1) {
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
          //this.updateROPGoods();
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
      this.existingNotification = false;
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          this.formControls.wheelNumber.setValue(data.nextval);
        },
        error: err => {
          console.log(err);
        },
      });
    }
    this.formControls.consecutiveNumber.setValue(0);
    let iden = this.formControls.identifier.value.id;
    if (this.formControls.expedientNumber.value != null) {
      this.hideError();
      this.expedientService
        .getById(this.formControls.expedientNumber.value)
        .subscribe({
          next: data => {
            iden = data.identifier;
            if (iden != this.formControls.identifier.value.id) {
              this.docRegisterService.getIdentifier('MIXTO').subscribe({
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
    this.hideError();
    this.notificationService
      .getDailyConsecutive(this.userDelegation, this.userSubdelegation)
      .subscribe({
        next: data => {
          this.formControls.consecutiveNumber.setValue(data.consecutivedaily);
        },
        error: err => {
          console.log(err);
        },
      });
    this.hideError();
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
  }

  updateROPGoods() {
    const params = new FilterParams();
    params.addFilter('fileNumber', this.formControls.expedientNumber.value);
    params.addFilter('status', 'ROP');
    this.hideError();
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
    console.log('Update Expedient');
    this.loading = true;
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
          console.log(data);
          this.updateGlobalVars(
            'gNoExpediente',
            this.formControls.expedientNumber.value
          );
          this.saveNotification();
          this.saveProcedureManagement();
        },
        error: err => {
          console.log(err);
          console.log(expedientData);
          this.loading = false;
          this.blockErrors(false);
          this.onLoadToast(
            'error',
            'Error',
            'Error al actualizar datos del expediente.'
          );
        },
      });
  }

  createExpedient() {
    console.log('Create Expedient');
    this.loading = true;
    console.log(
      this.formControls.protectionKey.value,
      this.formData.protectionKey,
      this.formData.affairKey
    );
    if (
      this.formData.protectionKey != null &&
      this.formData.protectionKey != undefined &&
      ['12', '15'].includes(this.formData.affairKey)
    ) {
      const param = new FilterParams();
      param.addFilter('cveProtection', this.formData.protectionKey);
      this.hideError();
      this.protectionService.getAllWithFilters(param.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            const body = {
              ...data.data[0],
              proceedingsNumber: this.formControls.expedientNumber.value,
            };
            this.protectionService.update(data.data[0].id, body).subscribe({
              next: () => {},
              error: err => {
                console.log(err);
              },
            });
          } else {
            this.insertProtectionKey();
          }
        },
        error: () => {
          this.insertProtectionKey();
        },
      });
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
          this.blockErrors(false);
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
      next: data => {
        this.formControls.expedientNumber.setValue(Number(data.id));
        console.log(data.id, this.formControls.expedientNumber.value);
        this.updateGlobalVars(
          'gNoExpediente',
          this.formControls.expedientNumber.value
        );
        this.saveNotification();
        this.saveProcedureManagement();
      },
      error: err => {
        console.log(err);
        console.log(expedientData);
        this.loading = false;
        this.blockErrors(false);
        this.onLoadToast(
          'error',
          'Error',
          'Error al guardar datos del expediente.'
        );
      },
    });
  }

  insertProtectionKey() {
    console.log('Add protection');
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
      error: err => {
        console.log(err);
      },
    });
  }

  saveProcedureManagement() {
    // if (this.pageParams.pGestOk != 1 || this.globals.gnuActivaGestion != 1) {
    //   return;
    // }
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
    param.addFilter('flierNumber', this.formControls.wheelNumber.value);
    if (this.pageParams.pNoTramite == null) {
      this.hideError();
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
    this.updateProcedureOnSave(affair, affairType);
  }

  updateProcedureOnSave(
    affair: string,
    affairType: number,
    procedureId?: number
  ) {
    console.log('Update Procedure');
    this.loading = true;
    let procedure: number;
    const body = {
      expedient: this.formControls.expedientNumber.value,
      flierNumber: this.formControls.wheelNumber.value,
      status: 'OPS',
      affair,
      affairType,
      officeNumber: this.formData.officeExternalKey,
      descentfed: this.formData.entFedDescription,
      priority: this.formData.priority,
      userToTurn: this.userRecipient.value.user,
      areaToTurn: this.formData.estatusTramite,
    };
    if (
      this.pageParams.pNoTramite != null &&
      this.pageParams.pNoTramite != undefined
    ) {
      procedure = this.pageParams.pNoTramite;
    } else if (procedureId != null && procedureId != undefined) {
      procedure = procedureId;
    } else if (this.procedureId != null && this.procedureId != undefined) {
      procedure = this.procedureId;
    }
    if (procedure != undefined && procedure != null) {
      this.procedureManageService.update(procedure, body).subscribe({
        next: () => {},
        error: err => {
          console.log(err);
          this.loading = false;
        },
      });
      const param = new FilterParams();
      param.addFilter('fileNumber', this.formControls.expedientNumber.value);
      this.hideError();
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
  }

  createProcedureManagement(affair: string, affairType: number) {
    console.log('Create Procedure');
    const body: IProceduremanagement = {
      status: 'OPI',
      situation: 1,
      userTurned: this.userId,
      actualDate: new Date(),
      dailyConsecutiveNumber: 0,
      admissionDate: new Date(),
      flierNumber: null,
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
        return this.updateProcedureOnSave(affair, affairType, data.id);
      },
      error: err => {
        console.log(err);
        this.loading = false;
        return this.updateProcedureOnSave(affair, affairType);
      },
    });
  }

  saveNotification() {
    this.loading = true;
    const param = new FilterParams();
    param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
    this.hideError();
    this.notificationService.getAllFilter(param.getParams()).subscribe({
      next: data => {
        console.log(data);
        if (data.count > 0) {
          this.existingNotification = true;
        } else {
          this.existingNotification = false;
        }
        this.handleNotification();
      },
      error: err => {
        console.log(err);
        this.existingNotification = false;
        this.handleNotification();
      },
    });
  }

  handleNotification() {
    console.log('Notificacion');
    this.loading = true;
    if (this.existingNotification) {
      console.log('Update Notification');
      let updateData = {
        wheelType: this.formData.wheelType,
        identifier: this.formData.identifier,
        externalRemitter: this.formData.externalRemitter,
        affairKey: this.formData.affairKey,
        receiptDate: this.formData.receiptDate,
        priority: this.formData.priority,
        wheelNumber: this.formControls.wheelNumber.value,
        consecutiveNumber: this.formControls.consecutiveNumber.value,
        expedientNumber: this.formControls.expedientNumber.value,
        addressGeneral: this.formData.addressGeneral,
        circumstantialRecord: this.formData.circumstantialRecord,
        preliminaryInquiry: this.formData.preliminaryInquiry,
        criminalCase: this.formData.criminalCase,
        protectionKey: this.formData.protectionKey,
        touchPenaltyKey: this.formData.touchPenaltyKey,
        officeExternalKey: this.formData.officeExternalKey,
        externalOfficeDate: this.formData.externalOfficeDate,
        observations: this.formData.observations,
        expedientTransferenceNumber: this.formData.expedientTransferenceNumber,
        cityNumber: this.formData.cityNumber,
        entFedKey: this.formData.entFedKey,
        endTransferNumber: this.formData.endTransferNumber,
        transference: this.formData.transference,
        courtNumber: this.formData.courtNumber,
        stationNumber: this.formData.stationNumber,
        autorityNumber: this.formData.autorityNumber,
        indiciadoNumber: this.formData.indiciadoNumber,
        viaKey: this.formData.viaKey,
        departamentDestinyNumber: this.formData.departamentDestinyNumber,
        delDestinyNumber: this.formData.delDestinyNumber,
        subDelDestinyNumber: this.formData.subDelDestinyNumber,
        institutionNumber: this.formData.institutionNumber,
        officeNumber: this.formData.officeNumber,
        captureDate: this.formData.captureDate,
        wheelStatus: this.formData.wheelStatus,
        entryProcedureDate: this.formData.entryProcedureDate,
        registerNumber: this.formData.registerNumber,
        originNumber: this.formData.originNumber,
        dictumKey: this.formData.dictumKey,
        reserved: this.formData.reserved,
        dailyEviction: this.formData.dailyEviction,
        crimeKey: this.formData.crimeKey,
        minpubNumber: this.formData.minpubNumber,
      };
      this.notificationService
        .update(this.formControls.wheelNumber.value, updateData)
        .subscribe({
          next: data => {
            console.log(data, updateData);
            this.sendFlyerCopies();
            this.formControls.receiptDate.disable();
            this.formControls.externalOfficeDate.disable();
            this.loading = false;
            this.blockErrors(false);
            if (this.captureAfterSave) {
              this.sendToGoodsCapture();
            } else {
              this.alert(
                'success',
                'Volante actualizado',
                `Se actualizó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
              );
            }
          },
          error: err => {
            console.log(err);
            console.log(updateData);
            this.formControls.receiptDate.disable();
            this.formControls.externalOfficeDate.disable();
            this.loading = false;
            this.blockErrors(false);
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
            this.addNotification();
          },
          error: err => {
            console.log(err);
            this.formControls.receiptDate.disable();
            this.formControls.externalOfficeDate.disable();
            this.loading = false;
            this.blockErrors(false);
            this.onLoadToast(
              'error',
              'Error',
              'Hubo un problema al crear el volante.'
            );
          },
        });
      } else {
        this.addNotification();
      }
    }
  }

  addNotification() {
    console.log('Create Notification');
    const insertData = {
      wheelType: this.formData.wheelType,
      identifier: this.formData.identifier,
      externalRemitter: this.formData.externalRemitter,
      affairKey: this.formData.affairKey,
      receiptDate: this.formData.receiptDate,
      priority: this.formData.priority,
      wheelNumber: this.formControls.wheelNumber.value,
      consecutiveNumber: this.formControls.consecutiveNumber.value,
      expedientNumber: this.formControls.expedientNumber.value,
      addressGeneral: this.formData.addressGeneral,
      circumstantialRecord: this.formData.circumstantialRecord,
      preliminaryInquiry: this.formData.preliminaryInquiry,
      criminalCase: this.formData.criminalCase,
      protectionKey: this.formData.protectionKey,
      touchPenaltyKey: this.formData.touchPenaltyKey,
      officeExternalKey: this.formData.officeExternalKey,
      externalOfficeDate: this.formData.externalOfficeDate,
      observations: this.formData.observations,
      expedientTransferenceNumber: this.formData.expedientTransferenceNumber,
      cityNumber: this.formData.cityNumber,
      entFedKey: this.formData.entFedKey,
      endTransferNumber: this.formData.endTransferNumber,
      transference: this.formData.transference,
      courtNumber: this.formData.courtNumber,
      stationNumber: this.formData.stationNumber,
      autorityNumber: this.formData.autorityNumber,
      indiciadoNumber: this.formData.indiciadoNumber,
      viaKey: this.formData.viaKey,
      departamentDestinyNumber: this.formData.departamentDestinyNumber,
      delDestinyNumber: this.formData.delDestinyNumber,
      subDelDestinyNumber: this.formData.subDelDestinyNumber,
      institutionNumber: this.formData.institutionNumber,
      officeNumber: this.formData.officeNumber,
      captureDate: this.formData.captureDate,
      wheelStatus: this.formData.wheelStatus,
      entryProcedureDate: this.formData.entryProcedureDate,
      registerNumber: this.formData.registerNumber,
      originNumber: this.formData.originNumber,
      dictumKey: this.formData.dictumKey,
      reserved: this.formData.reserved,
      dailyEviction: this.formData.dailyEviction,
      delegationNumber: this.userDelegation,
      subDelegationNumber: this.userSubdelegation,
      crimeKey: this.formData.crimeKey,
      minpubNumber: this.formData.minpubNumber,
    };
    this.notificationService.create(insertData).subscribe({
      next: data => {
        console.log(data.wheelNumber);
        this.formControls.wheelNumber.setValue(data.wheelNumber);
        this.updateGlobalVars('noVolante', data.wheelNumber);
        this.sendFlyerCopies();
        this.formControls.receiptDate.disable();
        this.formControls.externalOfficeDate.disable();
        this.loading = false;
        this.blockErrors(false);
        this.alert(
          'success',
          'Volante agregado',
          `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
        );
      },
      error: err => {
        console.log(err);
        console.log(insertData);
        this.formControls.receiptDate.disable();
        this.formControls.externalOfficeDate.disable();
        this.loading = false;
        this.blockErrors(false);
        if (err.message.includes('not_2_jxc_fk')) {
          this.onLoadToast(
            'error',
            'Error',
            'El juzgado no concuerda con la ciudad seleccionada.'
          );
        } else {
          this.onLoadToast(
            'error',
            'Error',
            'Hubo un problema al crear el volante.'
          );
        }
      },
    });
  }

  sendFlyerCopies() {
    console.log('Flier Copies');
    console.log(this.userRecipient.value);
    console.log(this.userCpp.value);
    if (this.userRecipient.value == null) {
      this.flyerCopyRecipientForm.patchValue(
        this.docDataService.documentsReceptionUserRecepientForm
      );
    }
    if (
      this.userCpp.value == null &&
      this.docDataService.documentsReceptionUserCopyForm != null
    ) {
      this.flyerCopyCppForm.patchValue(
        this.docDataService.documentsReceptionUserCopyForm
      );
    }
    const params = new FilterParams();
    params.addFilter('flierNumber', this.formControls.wheelNumber.value);
    this.hideError();
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
              next: data => {
                console.log(data);
              },
              error: err => {
                console.log(err);
              },
            });
          });
        } else {
          this.createFlyerCopies();
        }
      },
      error: err => {
        console.log(err);
        this.createFlyerCopies();
      },
    });
  }

  createFlyerCopies() {
    console.log('Create Flyer Copies');
    const recepientData = {
      copyuser: this.userRecipient.value.user,
      flierNumber: this.formControls.wheelNumber.value,
      persontype: FlyerPersontype.D,
      copyNumber: '1',
    };
    this.flyerCopiesService.create(recepientData).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log(err);
        console.log(recepientData);
      },
    });
    if (this.userCpp.value != null) {
      const copyData = {
        copyuser: this.userCpp.value.user,
        flierNumber: this.formControls.wheelNumber.value,
        persontype: FlyerPersontype.C,
        copyNumber: '2',
      };
      this.flyerCopiesService.create(copyData).subscribe({
        next: () => {},
        error: err => {
          console.log(err);
          console.log(copyData);
        },
      });
    }
  }

  checkGoodsDailyEviction() {
    let goods: IGood[] = [];
    let goodsStatus: IGood[] = [];
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.formControls.wheelNumber.value);
    this.hideError();
    this.docRegisterService.getGoods(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          data.data.forEach(g => {
            goods.push(g);
            if (['VXR', 'ROP', 'STA'].includes(g.status)) {
              this.hideError();
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
          //this.massiveGoodCorrections(goods, goodsStatus);
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
        this.hideError();
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
      this.hideError();
      this.docRegisterService.getGoods(params.getParams()).subscribe({
        next: data => {
          const goodsToCompare = data.data.filter(
            g => !['VXR', 'ROP', 'STA'].includes(g.status)
          );
          this.hideError();
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

  nextStep() {
    console.log(this.pageParams);
    if (Object.keys(this.pageParams).length > 0) {
      this.goodsCaptureCheck();
      console.log('Next capture');
    } else {
      this.captureAfterSave = true;
      this.save();
      console.log('Next save');
    }
  }

  async goodsCaptureCheck(): Promise<boolean | void> {
    if (!this.checkFormErrors()) {
      return false;
    }
    // const courtFlag = await this.checkCourt();
    // if (!courtFlag) {
    //   this.onLoadToast(
    //     'warning',
    //     'Formulario Inválido',
    //     'El juzgado no corresponde a la ciudad seleccionada.'
    //   );
    //   this.loading = false;
    //   return false;
    // }
    this.loading = true;
    this.formControls.consecutiveNumber.setValue(0);
    this.notificationService
      .getDailyConsecutive(this.userDelegation, this.userSubdelegation)
      .subscribe({
        next: data => {
          this.formControls.consecutiveNumber.setValue(data.consecutivedaily);
        },
        error: err => {
          console.log(err);
        },
      });
    this.prepareFormData();
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    console.log(this.docDataService.documentsReceptionRegisterForm);
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
        console.log(transferentData);
        this.hideError();
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
      let minpubNumber: number | string = '';
      if (this.formControls.minpubNumber.value?.id) {
        minpubNumber = this.formControls.minpubNumber.value?.id;
      }
      let courtNumber: number | string = '';
      if (this.formControls.courtNumber.value?.id) {
        courtNumber = this.formControls.courtNumber.value?.id;
      }
      const inquiryData = {
        protectionKey: this.formControls.protectionKey.value,
        touchPenaltyKey: this.formControls.touchPenaltyKey.value,
        circumstantialRecord: this.formControls.circumstantialRecord.value,
        preliminaryInquiry: this.formControls.preliminaryInquiry.value,
        criminalCase: this.formControls.criminalCase.value,
        entFedKey: this.formControls.entFedKey.value.toString(),
        indiciadoNumber: this.formControls.indiciadoNumber.value?.id,
        minpubNumber: minpubNumber,
        cityNumber: this.formControls.cityNumber.value?.idCity,
        courtNumber: courtNumber,
        transference: this.formControls.endTransferNumber.value?.id,
        stationNumber: this.formControls.stationNumber.value?.id,
        autorityNumber: Number(
          this.formControls.autorityNumber.value?.idAuthority
        ),
      };
      this.hideError();
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
          console.log(inquiryData);
          this.trackRecordsCheck();
        },
      });
    }
  }

  trackRecordsCheck(trackRecord?: INotification) {
    console.log(trackRecord);
    this.loading = true;
    if (trackRecord) {
      if (trackRecord?.expedientNumber) {
        this.updateGlobalVars('gNoExpediente', trackRecord.expedientNumber);
        this.formControls.expedientNumber.setValue(trackRecord.expedientNumber);
      }
      if (trackRecord?.wheelNumber) {
        this.updateGlobalVars('gNoVolante', Number(trackRecord.wheelNumber));
        this.formControls.wheelNumber.setValue(trackRecord.wheelNumber);
      }
      this.updateGlobalVars('gLastCheck', 1);
      this.updateGlobalVars('antecede', 1);
      this.startGoodsCapture();
    }
    this.startGoodsCapture();
  }

  startGoodsCapture() {
    console.log('Start Goods Capture');
    console.log(this.formControls.wheelType.value);
    if (this.formControls.wheelType.value == 'A') {
      this.updateGlobalVars('gCreaExpediente', 'N');
    }
    this.hideError();
    this.procedureManageService.getById(this.pageParams.pNoTramite).subscribe({
      next: data => {
        console.log(data);
        const { affair, affairSij, typeManagement, officeNumber } = data;
        this.checkTmpExpedients(
          affair,
          affairSij,
          typeManagement,
          officeNumber
        );
      },
      error: err => {
        console.log(err);
        this.loading = false;
        this.onLoadToast(
          'warning',
          'No se encontraron datos',
          'Hubo un problema al obtener los datos del trámite'
        );
      },
    });
  }

  checkTmpExpedients(
    affair: string,
    affairSij: number,
    typeManagement: number,
    officeNumber: string
  ) {
    if (this.formControls.expedientNumber.value == null) {
      this.hideError();
      this.expedientService.getNextVal().subscribe({
        next: data => {
          console.log(data);
          this.formControls.expedientNumber.setValue(Number(data.nextval));
          this.checkExistsTmpExpedients(
            affair,
            affairSij,
            typeManagement,
            officeNumber
          );
        },
        error: err => {
          console.log(err);
          this.loading = false;
          this.onLoadToast(
            'warning',
            'Expediente No Creado',
            'Hubo un problema al guardar los datos del expediente.'
          );
        },
      });
    } else {
      this.checkExistsTmpExpedients(
        affair,
        affairSij,
        typeManagement,
        officeNumber
      );
    }
  }

  checkExistsTmpExpedients(
    affair: string,
    affairSij: number,
    typeManagement: number,
    officeNumber: string
  ) {
    this.hideError();
    this.tmpExpedientService
      .getById(this.formControls.expedientNumber.value)
      .subscribe({
        next: () => {
          this.hideError();
          this.tmpExpedientService
            .remove(this.formControls.expedientNumber.value)
            .subscribe({
              next: () => {
                console.log('Delete Temp Expediente');
                this.saveTmpExpedients(
                  affair,
                  affairSij,
                  typeManagement,
                  officeNumber
                );
              },
              error: err => {
                console.log(err);
                this.loading = false;
                this.onLoadToast(
                  'warning',
                  'Expediente No Creado',
                  'Hubo un problema al guardar los datos del expediente.'
                );
              },
            });
        },
        error: () => {
          this.saveTmpExpedients(
            affair,
            affairSij,
            typeManagement,
            officeNumber
          );
        },
      });
  }

  saveTmpExpedients(
    affair: string,
    affairSij: number,
    typeManagement: number,
    officeNumber: string
  ) {
    const expedientData: ITempExpedient = {
      id: this.formControls.expedientNumber.value,
      recordCircumstanced: this.formData.circumstantialRecord,
      ascertainmentPrevious: this.formData.preliminaryInquiry,
      causePenal: this.formData.criminalCase,
      cveProtection: this.formData.protectionKey,
      cvetouchPenal: this.formData.touchPenaltyKey,
      nameIndexed: this.formData.indiciadoName,
      courtNumber: this.formData.courtNumber,
      cveEntfed: this.formData.entFedKey,
      cveCrime: this.formData.crimeKey,
      identifier: this.formData.identifier,
      transfereeNumber: this.formData.endTransferNumber,
      authorityNumber: this.formData.autorityNumber,
      stationNumber: this.formData.stationNumber,
      proceedingsType: this.formData.wheelType,
      expTransferorsNumber: this.formData.expedientTransferenceNumber,
      observations: this.formData.observations,
      insertionDate: format(new Date(), 'yyyy-MM-dd'),
      affair: affair,
      affairSijNumber: affairSij,
      procedureType: typeManagement,
      jobNumber: officeNumber,
    };
    console.log(this.formControls.expedientNumber.value);
    console.log(expedientData);
    this.tmpExpedientService.create(expedientData).subscribe({
      next: data => {
        this.formControls.expedientNumber.setValue(data.id);
        this.updateGlobalVars('gNoExpediente', data.id);
        this.checkTmpNotifications(affairSij);
      },
      error: err => {
        this.loading = false;
        console.log(expedientData);
        console.log(err);
        this.onLoadToast(
          'warning',
          'Expediente No Creado',
          'Hubo un problema al guardar los datos del expediente.'
        );
      },
    });
  }

  checkTmpNotifications(affairSij: number) {
    if (this.formControls.wheelNumber.value == null) {
      this.hideError();
      this.notificationService.getLastWheelNumber().subscribe({
        next: data => {
          console.log(data);
          this.formControls.wheelNumber.setValue(data.nextval);
          this.checkExistsTmpNotifications(affairSij);
        },
        error: err => {
          console.log(err);
          this.loading = false;
          this.onLoadToast(
            'warning',
            'Volante No Creado',
            'Hubo un problema al guardar los datos del volante.'
          );
        },
      });
    } else {
      this.checkExistsTmpNotifications(affairSij);
    }
  }

  checkExistsTmpNotifications(affairSij: number) {
    this.hideError();
    this.tmpNotificationService
      .getById(this.formControls.wheelNumber.value)
      .subscribe({
        next: data => {
          this.hideError();
          this.tmpNotificationService
            .remove(this.formControls.wheelNumber.value)
            .subscribe({
              next: () => {
                console.log('Volante Temp borrado');
                this.saveTmpNotifications(affairSij);
              },
              error: err => {
                console.log(err);
                this.loading = false;
                this.onLoadToast(
                  'warning',
                  'Volante No Creado',
                  'Hubo un problema al guardar los datos del volante.'
                );
              },
            });
        },
        error: () => {
          this.saveTmpNotifications(affairSij);
        },
      });
  }

  saveTmpNotifications(affairSij: number) {
    const notificationData: ITmpNotification = {
      ...this.formData,
      wheelNumber: this.formControls.wheelNumber.value,
      externalOfficeDate: this.formData.externalOfficeDate,
      receiptDate: this.formData.receiptDate,
      hcCaptureDate: format(new Date(), 'yyyy-MM-dd'),
      hcEntryProcedureDate: format(new Date(), 'yyyy-MM-dd'),
      affairSij,
      delegationNumber: this.userDelegation,
      subDelegationNumber: this.userSubdelegation,
      expedientNumber: this.formControls.expedientNumber.value,
      consecutiveNumber: this.formControls.consecutiveNumber.value,
    };
    console.log(this.formControls.wheelNumber.value);
    console.log(notificationData);
    this.tmpNotificationService.create(notificationData).subscribe({
      next: () => {
        this.updateGlobalVars('noVolante', this.formControls.wheelNumber.value);
        this.captureGoods();
      },
      error: err => {
        this.loading = false;
        console.log(notificationData);
        console.log(err);
        this.onLoadToast(
          'warning',
          'Volante No Creado',
          'Hubo un problema al guardar los datos del volante.'
        );
      },
    });
  }

  captureGoods() {
    console.log('Revision');
    console.log(this.globals.pIndicadorSat);
    this.formControls.receiptDate.disable();
    this.formControls.externalOfficeDate.disable();
    this.loading = true;
    if ([0, '0'].includes(this.globals.pIndicadorSat)) {
      console.log('SAT 0');
      const options: ICountAffairOptions = {
        office: this.formControls.officeExternalKey.value,
        expedient: this.formControls.expedientTransferenceNumber.value,
      };
      this.hideError();
      this.satTransferService.getCountAffair(options).subscribe({
        next: data => {
          console.log(data);
          if (data.count > 1) {
            this.sentToSatBulkLoad();
          } else if (data.count <= 1) {
            this.sendToGoodsCapture();
          }
        },
        error: err => {
          console.log(err);
          this.sendToGoodsCapture();
          this.onLoadToast(
            'error',
            'Error',
            'Error al buscar el oficio del SAT'
          );
        },
      });
    } else if ([1, '1'].includes(this.globals.pIndicadorSat)) {
      console.log('SAT 1');
      const options: ICountAffairOptions = {
        office: this.formControls.officeExternalKey.value,
      };
      this.hideError();
      this.satTransferService.getCountAffair(options).subscribe({
        next: data => {
          console.log(data);
          if (data.count > 1) {
            this.sentToSatBulkLoad();
          } else if (data.count <= 1) {
            this.sendToGoodsCapture();
          }
        },
        error: err => {
          console.log(err);
          this.sendToGoodsCapture();
          this.onLoadToast(
            'error',
            'Error',
            'Error al buscar el oficio del SAT'
          );
        },
      });
    } else if (this.globals.vTipoTramite == 3) {
      const param = new FilterParams();
      param.addFilter(
        'pgrOffice',
        this.formData.officeExternalKey,
        SearchFilter.LIKE
      );
      console.log(param.getParams());
      this.hideError();
      this.interfacefgrService
        .getPgrTransferFiltered(param.getParams())
        .subscribe({
          next: data => {
            console.log(data);
            if (data.count > 1) {
              this.sendToPgrBulkLoad();
            } else if (data.count <= 1) {
              this.sendToGoodsCapture(true);
            }
          },
          error: err => {
            console.log(err);
            this.sendToGoodsCapture();
          },
        });
    } else {
      this.sendToGoodsCapture();
    }
  }

  sentToSatBulkLoad() {
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    this.docDataService.documentsReceptionUserRecepientForm =
      this.flyerCopyRecipientForm.value;
    this.docDataService.documentsReceptionUserCopyForm =
      this.flyerCopyCppForm.value;
    this.docDataService.goodsBulkLoadSatSaeParams = {
      asuntoSat: this.formData.expedientTransferenceNumber,
      pNoExpediente: this.formControls.expedientNumber.value,
      pNoOficio: this.formData.officeExternalKey,
      pNoVolante: this.formControls.wheelNumber.value,
      pSatTipoExp: this.globals.pSatTipoExp.toString(),
      pIndicadorSat: Number(this.globals.pIndicadorSat),
    };
    console.log(this.docDataService.goodsBulkLoadSatSaeParams);
    let officeExternalKey = encodeURIComponent(this.formData.officeExternalKey);
    if (this.procedureOfficeKey.length > 34) {
      officeExternalKey = encodeURIComponent(this.procedureOfficeKey);
    }
    const expedientTransferenceNumber = encodeURIComponent(
      this.formData.expedientTransferenceNumber
    );
    const route = `/sat/${expedientTransferenceNumber}/${this.formControls.expedientNumber.value}/${officeExternalKey}/${this.formControls.wheelNumber.value}/${this.pageParams.pSatTipoExp}/${this.pageParams.pIndicadorSat}`;
    console.log(`pages/documents-reception/goods-bulk-load${route}`);
    this.loading = false;
    this.alertInfo(
      'info',
      'Información',
      'El asunto registrado por el SAT contiene más de un bien, a continuación se hará la carga masiva de sus bienes'
    ).then(() => {
      this.router.navigateByUrl(
        `pages/documents-reception/goods-bulk-load${route}`
      );
    });
  }

  sendToPgrBulkLoad() {
    this.loading = false;
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    this.docDataService.documentsReceptionUserRecepientForm =
      this.flyerCopyRecipientForm.value;
    this.docDataService.documentsReceptionUserCopyForm =
      this.flyerCopyCppForm.value;
    this.docDataService.goodsBulkLoadPgrSaeParams = {
      pNoExpediente: this.formControls.expedientNumber.value,
      pNoVolante: this.formControls.wheelNumber.value,
      pAvPrevia: this.formData.officeExternalKey,
    };
    console.log(this.docDataService.goodsBulkLoadPgrSaeParams);
    let preliminaryInquiry = encodeURIComponent(
      this.formData.officeExternalKey
    );
    if (this.procedureOfficeKey.length > 34) {
      preliminaryInquiry = encodeURIComponent(this.procedureOfficeKey);
    }
    const route = `/fgr/${this.formControls.expedientNumber.value}/${this.formControls.wheelNumber.value}/${preliminaryInquiry}`;
    console.log(`pages/documents-reception/goods-bulk-load${route}`);
    this.alertInfo(
      'info',
      'Información',
      'El asunto registrado por la FGR contiene más de un bien, a continuación se hará la carga masiva de sus bienes'
    ).then(() => {
      this.router.navigateByUrl(
        `pages/documents-reception/goods-bulk-load${route}`
      );
    });
  }

  sendToGoodsCapture(pgr?: boolean) {
    console.log('Goods Capture');
    this.docDataService.documentsReceptionRegisterForm =
      this.documentsReceptionForm.value;
    this.docDataService.documentsReceptionUserRecepientForm =
      this.flyerCopyRecipientForm.value;
    this.docDataService.documentsReceptionUserCopyForm =
      this.flyerCopyCppForm.value;
    if (pgr) {
      this.docDataService.goodsCaptureTempParams = {
        iden: this.formData.identifier,
        // noTransferente: this.pageParams.noTransferente,
        noTransferente: this.formData.endTransferNumber,
        desalojo: this.formData.dailyEviction,
        pNoVolante: null,
        pNoOficio: null,
        asuntoSat: null,
      };
    } else {
      this.docDataService.goodsCaptureTempParams = {
        iden: this.formData.identifier,
        // noTransferente: this.pageParams.noTransferente,
        noTransferente: this.formData.endTransferNumber,
        desalojo: this.formData.dailyEviction,
        pNoVolante: this.formControls.wheelNumber.value,
        pNoOficio: this.formData.officeExternalKey,
        asuntoSat: this.formData.expedientTransferenceNumber,
      };
    }
    console.log(this.docDataService.goodsCaptureTempParams);
    console.log(this.globals);
    this.loading = false;
    this.router.navigate(['pages/documents-reception/goods-capture'], {
      queryParams: {
        origin: 'FACTOFPREGRECDOCM',
      },
    });
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
      this.hideError();
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
    console.log('Post Goods Capture');
    console.log(this.globals.gNoExpediente);
    const params = new FilterParams();
    params.addFilter('expedientNumber', this.globals.gNoExpediente);
    this.hideError();
    this.notificationService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        if (data.data.length > 0) {
          this.formControls.expedientNumber.setValue(
            data.data[0].expedientNumber
          );
          this.formControls.wheelNumber.setValue(data.data[0].wheelNumber);
          this.updateProcedureManagement();
        } else {
          this.loadingPostCapture = false;
          this.alert(
            'error',
            'Error al verificar los registros agregados',
            `Hubo un error al buscar el volante ${this.formControls.wheelNumber.value} y/o el expediente ${this.formControls.expedientNumber.value}. No se crearon correctamente debido a un error en la captura de bienes.`
          );
        }
      },
      error: err => {
        console.log(err);
        this.loadingPostCapture = false;
        this.alert(
          'error',
          'Error al verificar los registros agregados',
          `Hubo un error al buscar el volante ${this.formControls.wheelNumber.value} y/o el expediente ${this.formControls.expedientNumber.value}. No se crearon correctamente debido a un error en la captura de bienes.`
        );
      },
    });
  }

  updateProcedureManagement() {
    console.log('Check Procedure');
    const params = new FilterParams();
    params.addFilter(
      'expedientNumber',
      this.formControls.expedientNumber.value
    );
    params.addFilter('wheelNumber', this.formControls.wheelNumber.value);
    this.hideError();
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
  }

  updateProcedure(goods: boolean) {
    console.log('Upd Post Procedure');
    let areaToTurn = this.formControls.estatusTramite.value.id;
    console.log(areaToTurn);
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
      flierNumber: this.formControls.wheelNumber.value,
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
              this.sendFlyerCopies();
              this.documentsReceptionForm.enable();
              this.formControls.identifier.setValue(
                this.docDataService.documentsReceptionRegisterForm.identifier
              );
              this.formControls.affair.setValue(
                this.docDataService.documentsReceptionRegisterForm.affair
              );
              this.formControls.endTransferNumber.setValue(
                this.docDataService.documentsReceptionRegisterForm
                  .endTransferNumber
              );
              this.loadingPostCapture = false;
              this.alertInfo(
                'success',
                'Notificación agregada',
                `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
              ).then(() => {
                try {
                  navigator.clipboard.writeText(
                    `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                  );
                  this.onLoadToast(
                    'info',
                    'Datos copiados al portapapeles',
                    'Se copió la información del volante y expediente.'
                  );
                } catch (err) {}
                this.endProcess();
              });
            },
            error: () => {
              this.sendFlyerCopies();
              this.documentsReceptionForm.enable();
              this.loadingPostCapture = false;
              this.alertInfo(
                'success',
                'Notificación agregada',
                `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.\n Sin embargo, hubo un problema al actualizar la información del trámite.`
              ).then(() => {
                try {
                  navigator.clipboard.writeText(
                    `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                  );
                  this.onLoadToast(
                    'info',
                    'Datos copiados al portapapeles',
                    'Se copió la información del volante y expediente.'
                  );
                } catch (err) {}
                this.endProcess();
              });
            },
          });
      } else {
        params.addFilter('id', this.pageParams.pNoTramite);
        params.addFilter('status', 'OPI');
        this.hideError();
        this.procedureManageService
          .getAllFiltered(params.getParams())
          .subscribe({
            next: data => {
              if (data.data.length > 0) {
                this.procedureManageService
                  .update(this.pageParams.pNoTramite, body)
                  .subscribe({
                    next: () => {
                      this.sendFlyerCopies();
                      this.documentsReceptionForm.enable();
                      this.formControls.identifier.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .identifier
                      );
                      this.formControls.affair.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .affair
                      );
                      this.formControls.endTransferNumber.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .endTransferNumber
                      );
                      this.loadingPostCapture = false;
                      this.alertInfo(
                        'success',
                        'Notificación agregada',
                        `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.`
                      ).then(() => {
                        try {
                          navigator.clipboard.writeText(
                            `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                          );
                          this.onLoadToast(
                            'info',
                            'Datos copiados al portapapeles',
                            'Se copió la información del volante y expediente.'
                          );
                        } catch (err) {}
                        this.endProcess();
                      });
                    },
                    error: () => {
                      this.sendFlyerCopies();
                      this.documentsReceptionForm.enable();
                      this.formControls.identifier.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .identifier
                      );
                      this.formControls.affair.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .affair
                      );
                      this.formControls.endTransferNumber.setValue(
                        this.docDataService.documentsReceptionRegisterForm
                          .endTransferNumber
                      );
                      this.loadingPostCapture = false;
                      this.alertInfo(
                        'success',
                        'Notificación agregada',
                        `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.\n Sin embargo, hubo un problema al actualizar la información del trámite.`
                      ).then(() => {
                        try {
                          navigator.clipboard.writeText(
                            `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                          );
                          this.onLoadToast(
                            'info',
                            'Datos copiados al portapapeles',
                            'Se copió la información del volante y expediente.'
                          );
                        } catch (err) {}
                        this.endProcess();
                      });
                    },
                  });
              } else {
                this.sendFlyerCopies();
                this.documentsReceptionForm.enable();
                this.formControls.identifier.setValue(
                  this.docDataService.documentsReceptionRegisterForm.identifier
                );
                this.formControls.affair.setValue(
                  this.docDataService.documentsReceptionRegisterForm.affair
                );
                this.formControls.endTransferNumber.setValue(
                  this.docDataService.documentsReceptionRegisterForm
                    .endTransferNumber
                );
                this.loadingPostCapture = false;
                this.alertInfo(
                  'success',
                  'Notificación agregada',
                  `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.\n Sin embargo, hubo un problema al actualizar la información del trámite.`
                ).then(() => {
                  try {
                    navigator.clipboard.writeText(
                      `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                    );
                    this.onLoadToast(
                      'info',
                      'Datos copiados al portapapeles',
                      'Se copió la información del volante y expediente.'
                    );
                  } catch (err) {}
                  this.endProcess();
                });
              }
            },
            error: () => {
              this.sendFlyerCopies();
              this.documentsReceptionForm.enable();
              this.formControls.identifier.setValue(
                this.docDataService.documentsReceptionRegisterForm.identifier
              );
              this.formControls.affair.setValue(
                this.docDataService.documentsReceptionRegisterForm.affair
              );
              this.formControls.endTransferNumber.setValue(
                this.docDataService.documentsReceptionRegisterForm
                  .endTransferNumber
              );
              this.loadingPostCapture = false;
              this.alertInfo(
                'success',
                'Notificación agregada',
                `Se agregó la notificación con número de volante ${this.formControls.wheelNumber.value} al expediente ${this.formControls.expedientNumber.value}.\n Sin embargo, hubo un problema al actualizar la información del trámite.`
              ).then(() => {
                try {
                  navigator.clipboard.writeText(
                    `Volante: ${this.formControls.wheelNumber.value}, Expediente: ${this.formControls.expedientNumber.value}`
                  );
                  this.onLoadToast(
                    'info',
                    'Datos copiados al portapapeles',
                    'Se copió la información del volante y expediente.'
                  );
                } catch (err) {}
                this.endProcess();
              });
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
    this.docDataService.flyerReceptionMode = false;
    this.router.navigateByUrl('pages/general-processes/work-mailbox');
  }
}
