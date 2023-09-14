import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  takeUntil,
} from 'rxjs';
import {
  goFormControlAndFocus,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { SatTransferService } from 'src/app/core/services/ms-interfacesat/sat-transfer.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { DocumentsViewerByFolioComponent } from '../../../../../@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { SelectListFilteredModalComponent } from '../../../../../@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import {
  baseMenu,
  routesJuridicalProcesses,
} from '../../../../../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from '../../../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../../../../core/interfaces/list-response.interface';
import { IAffair } from '../../../../../core/models/catalogs/affair.model';
import { IAuthority } from '../../../../../core/models/catalogs/authority.model';
import { ICity } from '../../../../../core/models/catalogs/city.model';
import { ICourt } from '../../../../../core/models/catalogs/court.model';
import { IDictamen } from '../../../../../core/models/catalogs/dictamen.model';
import { TvalTable1Data } from '../../../../../core/models/catalogs/dinamic-tables.model';
import { IIdentifier } from '../../../../../core/models/catalogs/identifier.model';
import { IIndiciados } from '../../../../../core/models/catalogs/indiciados.model';
import { IIssuingInstitution } from '../../../../../core/models/catalogs/issuing-institution.model';
import { IMinpub } from '../../../../../core/models/catalogs/minpub.model';
import { IRAsuntDic } from '../../../../../core/models/catalogs/r-asunt-dic.model';
import { IStation } from '../../../../../core/models/catalogs/station.model';
import {
  ITransferente,
  ITransferingLevelView,
} from '../../../../../core/models/catalogs/transferente.model';
import { IDocuments } from '../../../../../core/models/ms-documents/documents';
import {
  DictumData,
  IInstitutionNumber,
  INotification,
} from '../../../../../core/models/ms-notification/notification.model';
import { IManagementArea } from '../../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from '../../../../../core/services/authentication/auth.service';
import { DocReceptionRegisterService } from '../../../../../core/services/document-reception/doc-reception-register.service';
import { DocumentsService } from '../../../../../core/services/ms-documents/documents.service';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { IGlobalVars } from '../../../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../../../shared/global-vars/services/global-vars.service';
import { DOCUMENTS_RECEPTION_SELECT_DOCUMENTS_COLUMNS } from '../../../../documents-reception/flyers/documents-reception-register/interfaces/columns';
import { MailboxModalTableComponent } from '../../../../general-processes/work-mailbox/components/mailbox-modal-table/mailbox-modal-table.component';
import { RELATED_FOLIO_TITLE } from '../../../../general-processes/work-mailbox/utils/modal-titles';
import { RELATED_FOLIO_COLUMNS } from '../../../../general-processes/work-mailbox/utils/related-folio-columns';
import { AbandonmentsDeclarationTradesService } from '../../../abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { FlyerCopiesModalComponent } from '../../flyer-copies-modal/flyer-copies-modal.component';
import {
  IJuridicalFileDataUpdateForm,
  JURIDICAL_FILE_DATA_UPDATE_FORM,
} from '../../interfaces/file-data-update-form';
import { IJuridicalFileDataUpdateParams } from '../../interfaces/file-data-update-parameters';
import { FileUpdateCommunicationService } from '../../services/file-update-communication.service';
import { JuridicalFileUpdateService } from '../../services/juridical-file-update.service';
import { juridicalRecordUpdateRequest } from './juridical-record-update-request';

@Component({
  selector: 'app-juridical-record-update',
  templateUrl: './juridical-record-update.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: -5px;
      }

      .gray-label {
        font-size: 10px !important;
        font-weight: 600 !important;
        color: #74788d !important;
      }

      .form-material {
        margin-bottom: 0.7rem !important;
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
export class JuridicalRecordUpdateComponent
  extends juridicalRecordUpdateRequest
  implements OnInit, OnChanges
{
  public readonly flyerId: number = null;
  flyerForm: FormGroup;
  linkDictaminacionesJuridicas: string =
    baseMenu + routesJuridicalProcesses[0].link;
  linkReaccionacionTurno: string =
    '/pages/documents-reception/flyers-registration/shift-change';
  linkOficioRelacionado: string =
    '/pages/documents-reception/flyers-registration/related-document-management';
  fileDataUpdateForm = new FormGroup(JURIDICAL_FILE_DATA_UPDATE_FORM);
  initialCondition: string = 'P';
  prevInitialCondition: string = '';
  canViewDocuments = false;
  transferorLoading: boolean = false;
  stationLoading: boolean = false;
  dictum: string = '';
  prevDictumKey: { id: string; description: string };
  dictOffice: string = '';
  dictConsultOnly: string = 'N';
  procedureId: number;
  userId: string;
  userDelegation: number;
  dictumPermission: boolean = true;
  initialDate: string;
  formLoading: boolean = false;
  maxDate: Date = new Date();
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
  affairs = new DefaultSelect<IAffair>();
  dictums = new DefaultSelect<IDictamen>();
  institutions = new DefaultSelect<IIssuingInstitution>();
  pageParams: IJuridicalFileDataUpdateParams = null;
  globals: IGlobalVars;
  items: DefaultSelect<any>;
  @Input() selectedNotification: INotification;
  @Input() layout: 'FILE-UPDATE' | 'ABANDONMENT' = 'FILE-UPDATE';
  @Input() searchMode: boolean = false;
  @Input() confirmSearch: boolean = false;
  @Output() onSearch = new EventEmitter<
    Partial<IJuridicalFileDataUpdateForm>
  >();
  datosEnviados = new EventEmitter<DictumData>();
  change_Dict: DictumData;
  public optionsTipoVolante = [
    { value: 'A', label: 'Administrativo' },
    { value: 'P', label: 'Procesal' },
    { value: 'AT', label: 'Admin. Trans' },
    { value: 'T', label: 'Transferente' },
  ];

  fetchForForm: FetchForForm;

  constructor(
    // private fb: FormBuilder,
    private activiveRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private globalVarsService: GlobalVarsService,
    private fileUpdateService: JuridicalFileUpdateService,
    private fileUpdComService: FileUpdateCommunicationService,
    private docRegisterService: DocReceptionRegisterService,
    private authService: AuthService,
    private documentsService: DocumentsService,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    // private changeDetectorRef: ChangeDetectorRef,
    protected opinionService: OpinionService,
    protected notificationService: NotificationService,
    protected satTransferenceService: SatTransferService,
    protected dictationService: DictationService,
    private mJobManagementService: MJobManagementService
  ) {
    super();
    this.fetchForForm = new FetchForForm(fileUpdateService, this.formControls);
    const id = this.activiveRoute.snapshot.paramMap.get('id');
    if (id) this.flyerId = Number(id);
    this.initialDate = format(new Date(), 'd/MM/yyyy', {
      locale: esLocale,
    });
    if (this.fileUpdComService.fileDataUpdateParams != null)
      this.pageParams = this.fileUpdComService.fileDataUpdateParams;
  }

  get formControls() {
    return this.fileDataUpdateForm.controls;
  }

  get departmentName() {
    return this.fileDataUpdateForm.controls['destinationArea'].value;
  }

  get delegationName() {
    return this.fileDataUpdateForm.controls['delegationName'].value;
  }

  get subDelegationName() {
    return this.fileDataUpdateForm.controls['subDelegationName'].value;
  }

  /**
   * @description is CVE_ASUNTO
   */
  get affair() {
    return this.fileDataUpdateForm.controls['affairKey'].value;
  }

  get wheelNumber() {
    return this.fileDataUpdateForm.controls['wheelNumber'].value;
  }

  get expedientNumber() {
    return this.fileDataUpdateForm.controls['expedientNumber'].value;
  }

  get delDestinyNumber() {
    return this.fileDataUpdateForm.controls['delDestinyNumber'].value;
  }

  get userRecipient() {
    return this.fileDataUpdateForm.controls['userRecipient'].value;
  }

  ngOnInit(): void {
    this.blockErrors(true);
    this.checkParams();
    this.fileDataUpdateForm.disable();
  }

  isActiveDictation = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['searchMode']?.currentValue &&
      !changes['searchMode']?.isFirstChange()
    ) {
      this.activateSearch();
    } else if (changes['searchMode']?.currentValue === false) {
      this.deactivateSearch();
    }

    if (
      changes['confirmSearch']?.currentValue &&
      !changes['confirmSearch']?.isFirstChange()
    ) {
      if (changes['confirmSearch']?.currentValue) {
        this.onSearch.emit(this.fileDataUpdateForm.value);
      }
      this.deactivateSearch();
    }

    if (
      changes['selectedNotification']?.currentValue &&
      !changes['selectedNotification']?.isFirstChange()
    ) {
      // this.dictum = '';
      // this.dictOffice = '';
      this.prevDictumKey = undefined;
      // this.affair = null;
      this.fillForm(changes['selectedNotification'].currentValue);
    }
  }

  checkParams() {
    this.getGlobalVars();
    if (
      (this.pageParams.pGestOk == 1 || this.globals.gnuActivaGestion == 1) &&
      this.pageParams.pNoTramite
    ) {
      console.log('getData');
      this.getData();
    }
    if (this.pageParams.dictamen) {
      // TODO: Integrar validaciones cuando se creo dictamen
    } else if (
      this.pageParams.dictamen != null &&
      this.pageParams.dictamen != undefined
    ) {
      if (
        this.layout == 'FILE-UPDATE' &&
        this.fileUpdateService.juridicalFileDataUpdateForm != null
      ) {
        this.deactivateSearch();
      }
      if (
        this.layout == 'ABANDONMENT' &&
        this.abandonmentsService.abandonmentsFlyerForm != null
      ) {
        this.deactivateSearch();
      }
      this.checkDictum();
    }
  }

  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globals = globalVars;
      });
  }

  getLoggedUser() {
    const token = this.authService.decodeToken();
    this.userId = token.preferred_username;
    const params = new FilterParams();
    params.addFilter('user', token.preferred_username);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: (data: { data: string | any[] }) => {
        if (data.data.length > 0) {
          this.userDelegation = data.data[0].delegation1Number;
          this.getScreenPermissions();
        }
      },
      error: () => {},
    });
  }

  checkDictum() {
    const params = new FilterParams();
    params.addFilter('wheelNumber', this.formControls.wheelNumber.value);
    this.fileUpdateService.getDictation(params.getParams()).subscribe({
      next: (data: { count: number }) => {
        if (data.count == 0) {
          this.checkMJobManagement();
        }
      },
      error: () => {
        this.checkMJobManagement();
      },
    });
  }

  checkMJobManagement() {
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.formControls.wheelNumber.value);
    this.fileUpdateService.getMJobManagement(params.getParams()).subscribe({
      next: (data: { count: number }) => {
        if (data.count == 0 && this.globals.varDic != null) {
          this.fileUpdateService
            .updateNotification(this.formControls.wheelNumber.value, {
              dictumKey: this.globals.varDic,
            })
            .subscribe({
              next: () => {},
              error: () => {},
            });
        } else if (data.count == 0 && this.dictum != 'CONOCIMIENTO') {
          this.fileUpdateService
            .updateNotification(this.formControls.wheelNumber.value, {
              dictumKey: null,
            })
            .subscribe({
              next: () => {},
              error: () => {},
            });
        }
      },
      error: () => {
        if (this.globals.varDic != null) {
          this.fileUpdateService
            .updateNotification(this.formControls.wheelNumber.value, {
              dictumKey: this.globals.varDic,
            })
            .subscribe({
              next: () => {},
              error: () => {},
            });
        } else if (this.dictum != 'CONOCIMIENTO') {
          this.fileUpdateService
            .updateNotification(this.formControls.wheelNumber.value, {
              dictumKey: null,
            })
            .subscribe({
              next: () => {},
              error: () => {},
            });
        }
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getScreenPermissions() {
    const params = new FilterParams();
    params.addFilter('typeNumber', 'RESARCIMIENTO');
    params.addFilter('reading', 'S');
    params.addFilter('writing', 'S');
    params.addFilter('user', this.userId);
    this.fileUpdateService.getUserPermissions(params.getParams()).subscribe({
      next: (data: { count: number }) => {
        if (data.count > 0) {
          this.dictumPermission = true;
        } else {
          // TODO: habilitar cuando el usuario admin tenga permisos
          // this.dictumPermission = false;
        }
      },
      error: () => {},
    });
  }

  getData() {
    this.formLoading = true;
    this.fileUpdateService.getProcedure(this.pageParams.pNoTramite).subscribe({
      next: (data: { flierNumber: string | number }) => {
        const param = new FilterParams();
        param.addFilter('wheelNumber', data.flierNumber);
        this.fileUpdateService.getNotification(param.getParams()).subscribe({
          next: (data: { count: number; data: INotification[] }) => {
            if (data.count > 0) {
              this.fillForm(data.data[0]);
            } else {
              this.formLoading = false;
              this.onLoadToast(
                'warning',
                'Datos no encontrados',
                'No se encontró la información del volante'
              );
            }
          },
          error: () => {
            this.formLoading = false;
            this.onLoadToast(
              'warning',
              'Datos no encontrados',
              'No se encontró la información del volante'
            );
          },
        });
      },
      error: () => {
        this.formLoading = false;
        this.onLoadToast(
          'warning',
          'Datos no encontrados',
          'No se encontró la información del volante'
        );
      },
    });
  }

  // numero de prueba 624187
  async fillForm(notif: INotification) {
    this.fileDataUpdateForm.enable();
    this.fileDataUpdateForm.reset();
    const filterParams = new FilterParams();
    this.formLoading = true;
    const values: any = {
      wheelType: notif.wheelType,
      externalRemitter: notif.externalRemitter,
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
      dictumKey: notif.dictumKey,
    };

    this.fileDataUpdateForm.patchValue({ ...values });
    if (notif.wheelType) {
      console.log(notif.wheelType);
      this.changeWheelType(notif.wheelType);
    } else {
      this.initialCondition = '';
    }
    if (notif.expedientNumber == null) {
      this.onLoadToast(
        'warning',
        'Expediente no disponible',
        'Este volante no tiene asociado un expediente.'
      );
    }
    this.formControls.receiptDate.enable();
    this.formControls.receiptDate.setValue(
      format(this.parseDateNoOffset(notif.receiptDate), 'dd/MM/yyyy')
    );
    this.formControls.receiptDate.disable();
    this.formControls.externalOfficeDate.enable();
    this.formControls.externalOfficeDate.setValue(
      format(this.parseDateNoOffset(notif.externalOfficeDate), 'dd/MM/yyyy')
    );
    this.formControls.externalOfficeDate.disable();
    this.formControls.wheelType.enable();
    if (notif.wheelType != null)
      this.formControls.wheelType.setValue(notif.wheelType);
    this.formControls.wheelType.disable();
    // this.changeWheelType(notif.wheelType);
    // this.initialCondition = notif.wheelType;

    /** POST-QUERY */
    if (notif.endTransferNumber != null) {
      this.docRegisterService
        .getTransferent(notif.endTransferNumber)
        .subscribe({
          next: (data: any) => {
            this.formControls.endTransferNumber.enable();
            this.formControls.endTransferNumber.setValue(data);
            this.formControls.endTransferNumber.disable();
          },
        });
    }

    if (notif.transference) {
      this.docRegisterService.getTransferent(notif.transference).subscribe({
        next: (data: any) => {
          this.formControls.transference.enable();
          this.formControls.transference.setValue(data);
          this.formControls.transference.disable();
        },
      });
    }

    if (notif.stationNumber != null) {
      filterParams.removeAllFilters();
      filterParams.addFilter('id', notif.stationNumber);
      filterParams.addFilter('idTransferent', notif.endTransferNumber);
      this.docRegisterService.getStations(filterParams.getParams()).subscribe({
        next: (data: { data: any[] }) => {
          this.formControls.stationNumber.enable();
          this.formControls.stationNumber.setValue(data.data[0]);
          this.formControls.stationNumber.disable();
          this.getStations({ page: 1, limit: 10 });
        },
      });
    }

    if (notif.autorityNumber) {
      console.log(notif.autorityNumber);
      filterParams.removeAllFilters();
      filterParams.addFilter('idAuthority', notif.autorityNumber);
      filterParams.addFilter('idStation', notif.stationNumber);
      filterParams.addFilter('idTransferer', notif.endTransferNumber);
      this.docRegisterService
        .getAuthoritiesFilter(filterParams.getParams())
        .subscribe({
          next: (data: { count: number; data: any[] }) => {
            if (data.count > 0) {
              this.formControls.autorityNumber.enable();
              this.formControls.autorityNumber.setValue(data.data[0]);
              this.formControls.autorityNumber.disable();

              this.formControls.uniqueKey.enable();
              this.formControls.uniqueKey.setValue({
                ...data.data[0],
                uniqueCve: data.data[0].idAuthorityIssuerTransferor,
              });
              this.formControls.uniqueKey.setValue(
                data.data[0].idAuthorityIssuerTransferor
              );
              this.formControls.uniqueKey.disable();
              // this.getAuthorities({ page: 1, limit: 10 });
            }
          },
          error: () => {},
        });
    }

    if (notif.affairKey) {
      this.fileUpdateService.getAffair(notif.affairKey).subscribe({
        next: (data: any) => {
          this.formControls.affairKey.enable();
          this.formControls.affairKey.setValue(data);
          this.formControls.affairKey.disable();
        },
        error: () => {},
      });
    }

    if (notif.entFedKey != null) {
      this.docRegisterService.getByTableKeyOtKey(1, notif.entFedKey).subscribe({
        next: (data: { data: any }) => {
          this.formControls.entFedKey.enable();
          this.formControls.entFedKey.setValue(data.data);
          this.formControls.entFedKey.disable();
        },
      });
    }

    if (notif.dictumKey) {
      try {
        const data = await firstValueFrom(
          this.cveDictumWhenValidateItemObserver(notif.dictumKey)
        );
        if (data.count > 0) {
          const dictum: any = data.data[0];
          this.formControls.dictumKey.enable();
          console.log('hoal mundo', { dictum });
          this.formControls.dictumKey.setValue(dictum);
          this.formControls.dictumKey.disable();
          this.prevDictumKey = { ...this.formControls.dictumKey.value } || null;
          this.dictum = dictum.description;
          this.dictOffice = dictum.dict_ofi;
          this.isOpenDictumKey = false;
        }
      } catch (ex) {
        this.isOpenDictumKey = true;
        this.formControls.dictumKey.setValue({
          id: null,
          description: notif.dictumKey,
          nameAndId: notif.dictumKey,
        } as any);
      }
      // this.cveDictumWhenValidateItemObserver(notif.dictumKey).subscribe({
      //   next: (data: { count: number; data: any[] }) => {

      //   },

      // });
    } else {
      this.isOpenDictumKey = true;
    }

    if (notif.minpubNumber != null) {
      const minpub = notif.minpubNumber as IMinpub;
      this.docRegisterService.getMinPub(minpub.id).subscribe({
        next: (data: any) => {
          this.formControls.minpubNumber.enable();
          this.formControls.minpubNumber.setValue(data);
          this.formControls.minpubNumber.disable();
        },
      });
    }

    if (notif.cityNumber != null) {
      this.docRegisterService.getCity(notif.cityNumber).subscribe({
        next: (data: any) => {
          this.formControls.cityNumber.enable();
          this.formControls.cityNumber.setValue(data);
          this.formControls.cityNumber.disable();
        },
      });
    }

    if (notif.institutionNumber != null) {
      const institution = notif.institutionNumber as IInstitutionNumber;
      this.fileUpdateService.getInstitution(institution.id).subscribe({
        next: (data: any) => {
          this.formControls.institutionNumber.enable();
          this.formControls.institutionNumber.setValue(data);
          this.formControls.institutionNumber.disable();
        },
        error: () => {},
      });
    }

    if (notif.courtNumber != null) {
      this.docRegisterService.getCourt(notif.courtNumber).subscribe({
        next: (data: any) => {
          this.formControls.courtNumber.enable();
          this.formControls.courtNumber.setValue(data);
          this.formControls.courtNumber.disable();
        },
      });
    }

    if (notif.indiciadoNumber != null) {
      this.docRegisterService.getDefendant(notif.indiciadoNumber).subscribe({
        next: (data: any) => {
          this.formControls.indiciadoNumber.enable();
          this.formControls.indiciadoNumber.setValue(data);
          this.formControls.indiciadoNumber.disable();
        },
      });
    }

    // TODO:
    /* BEGIN
     SELECT DESC_TRANSFERENTE
     INTO   :TRANSFERENTE
     FROM   CAT_TRANSFERENTE
     WHERE  NO_TRANSFERENTE = :NO_TRANSFERENTE;
  EXCEPTION
     WHEN no_data_found THEN
        NULL;
     WHEN OTHERS THEN
        LIP_MENSAJE(SQLERRM||'.','S');
        RAISE FORM_TRIGGER_FAILURE;
  END; */

    if (notif.crimeKey != null)
      this.docRegisterService.getByTableKeyOtKey(2, notif.crimeKey).subscribe({
        next: (data: { data: any }) => {
          this.formControls.crimeKey.enable();
          this.formControls.crimeKey.setValue(data.data);
          this.formControls.crimeKey.disable();
        },
      });

    if (notif.viaKey != null)
      this.docRegisterService.getByTableKeyOtKey(9, notif.viaKey).subscribe({
        next: (data: { data: any }) => {
          this.formControls.viaKey.enable();
          this.formControls.viaKey.setValue(data.data);
          this.formControls.viaKey.disable();
        },
      });

    // filterParams.removeAllFilters();

    // filterParams.addFilter('transfereeNum', notif.endTransferNumber);
    // filterParams.addFilter('stationNum', notif.stationNumber);
    // filterParams.addFilter('authorityNum', notif.autorityNumber);
    // this.docRegisterService
    //   .getUniqueKeyData(filterParams.getParams())
    //   .subscribe({
    //     next: (data: { count: number; data: any[] }) => {
    //       if (data.count > 0) {
    //         this.formControls.uniqueKey.enable();
    //         this.formControls.uniqueKey.setValue(data.data[0]);
    //         this.formControls.uniqueKey.disable();
    //       }
    //     },
    //     error: () => {},
    //   });

    filterParams.removeAllFilters();
    filterParams.addFilter('expedient', notif.expedientNumber);
    filterParams.addFilter('flierNumber', notif.wheelNumber);
    this.fileUpdateService.getProcedures(filterParams.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          this.procedureId = data.data[0].id;
          this.formLoading = false;
        } else {
          this.formLoading = false;
        }
      },
      error: (err: any) => {
        this.formLoading = false;
      },
    });

    if (notif.delDestinyNumber != null) {
      this.formControls.delDestinyNumber.enable();
      this.formControls.delDestinyNumber.setValue(notif.delDestinyNumber);
      this.formControls.delDestinyNumber.disable();
      if (notif.delegation != null) {
        this.formControls.delegationName.enable();
        this.formControls.delegationName.setValue(notif.delegation.description);
        this.formControls.delegationName.disable();
      } else {
        this.fileUpdateService
          .getDelegation(notif.delDestinyNumber)
          .subscribe(data => {
            this.formControls.delegationName.enable();
            this.formControls.delegationName.setValue(data.description);
            this.formControls.delegationName.disable();
          });
      }
    }
    if (notif.subDelDestinyNumber != null) {
      this.formControls.subDelDestinyNumber.enable();
      this.formControls.subDelDestinyNumber.setValue(notif.subDelDestinyNumber);
      this.formControls.subDelDestinyNumber.disable();
      if (notif.subDelegation != null) {
        this.formControls.subDelegationName.enable();
        this.formControls.subDelegationName.setValue(
          notif.subDelegation.description
        );
        this.formControls.subDelegationName.disable();
      } else {
        this.fileUpdateService
          .getSubDelegation(notif.subDelDestinyNumber)
          .subscribe((data: { description: any }) => {
            this.formControls.subDelegationName.enable();
            this.formControls.subDelegationName.setValue(data.description);
            this.formControls.subDelegationName.disable();
          });
      }
    }
    if (notif.departamentDestinyNumber != null) {
      this.formControls.departamentDestinyNumber.enable();
      this.formControls.departamentDestinyNumber.setValue(
        notif.departamentDestinyNumber
      );
      this.formControls.departamentDestinyNumber.disable();
      if (notif.departament != null) {
        this.formControls.destinationArea.enable();
        this.formControls.destinationArea.setValue(
          notif.departament.description
        );
        this.formControls.destinationArea.disable();
      } else {
        this.docRegisterService.getPhaseEdo().subscribe({
          next: (data: { stagecreated: string | number }) => {
            filterParams.removeAllFilters();
            filterParams.addFilter('id', notif.departamentDestinyNumber);
            filterParams.addFilter('numDelegation', notif.delDestinyNumber);
            if (notif.subDelDestinyNumber) {
              filterParams.addFilter(
                'numSubDelegation',
                notif.subDelDestinyNumber
              );
            }
            filterParams.addFilter('phaseEdo', data.stagecreated);
            this.docRegisterService
              .getDepartamentsFiltered(filterParams.getParams())
              .subscribe((data: { data: { description: any }[] }) => {
                this.formControls.destinationArea.enable();
                if (data.data[0]) {
                  this.formControls.destinationArea.setValue(
                    data.data[0].description
                  );
                }

                this.formControls.destinationArea.disable();
              });
          },
          error: (err: any) => {
            this.onLoadToast(
              'warning',
              'Datos de Área no encontrados',
              'No se encontraron todos los datos del area correspondiente.'
            );
          },
        });
      }
    }
    this.fileUpdateService
      .getRecipientUser({ copyNumber: 1, flierNumber: notif.wheelNumber }) //trae desde tabla copias_x_volante
      .subscribe({
        next: (data: { copyuser: string | number }) => {
          filterParams.removeAllFilters();
          filterParams.addFilter('user', data.copyuser);
          this.docRegisterService
            .getUsersSegAreas(filterParams.getParams())
            .subscribe({
              next: data => {
                if (data.count > 0) {
                  this.formControls.userRecipient.enable();
                  this.formControls.userRecipient.setValue(
                    data.data[0].userDetail.name
                  );
                  this.formControls.userRecipient.disable();
                }
              },
              error: () => {},
            });
        },
        error: () => {},
      });
    if (this.formControls.wheelNumber.value != null) {
      this.canViewDocuments = true;
    }
    // TODO: Deshabilitar dictamen si no es nulo y no cumple condiciones SAT
    // if (this.formControls.dictumKey != null) {
    // } else {
    //   this.fileDataUpdateForm.enable();
    // }
    for (const key in this.formControls) {
      if (
        key != 'dictumKey' ||
        (this.dictum == 'CONOCIMIENTO' && key == 'dictumKey')
      ) {
        const control = this.fileDataUpdateForm.get(key);
        control.disable();
      }
    }
  }

  isOpenDictumKey = false;

  cveDictumWhenValidateItemObserver(description: string) {
    const filterParams = new FilterParams();
    filterParams.addFilter('description', description);
    return this.fileUpdateService.getDictum(filterParams.getParams());
  }

  /**
   *
   * @param description is this.dictum
   */
  cveDictumWhenValidateItem(description: string) {
    this.cveDictumWhenValidateItemObserver(description).subscribe({
      next: (data: { count: number; data: any[] }) => {
        if (data.count > 0) {
          const dictum = data.data[0];
          this.dictOffice = dictum.dict_ofi;
        }
      },
      error: () => {},
    });
  }

  activateSearch() {
    this.fileDataUpdateForm.enable();
    this.prevDictumKey = { ...this.formControls.dictumKey.value } || null;
    this.prevInitialCondition = this.initialCondition;
    if (this.layout == 'FILE-UPDATE')
      this.fileUpdateService.juridicalFileDataUpdateForm =
        this.fileDataUpdateForm.value;
    if (this.layout == 'ABANDONMENT')
      this.abandonmentsService.abandonmentsFlyerForm =
        this.fileDataUpdateForm.value;
    this.fileDataUpdateForm.reset();
    this.fileDataUpdateForm.enable();
  }

  deactivateSearch() {
    this.fileDataUpdateForm.enable();
    if (this.layout == 'FILE-UPDATE') {
      this.fileDataUpdateForm.patchValue(
        this.fileUpdateService.juridicalFileDataUpdateForm
      );
    }
    if (this.layout == 'ABANDONMENT') {
      this.fileDataUpdateForm.patchValue(
        this.abandonmentsService.abandonmentsFlyerForm
      );
    }
    if (this.prevInitialCondition !== '') {
      this.initialCondition = this.prevInitialCondition;
    } else {
      if (['T', 'P'].includes(this.formControls.wheelType.value)) {
        this.initialCondition = 'T';
      } else if (['AT', 'A'].includes(this.formControls.wheelType.value)) {
        this.initialCondition = this.formControls.wheelType.value;
      }
    }
    this.fileDataUpdateForm.disable();
    // if (this.selectedNotification.get)
    // if (this.formControls.dictumKey.value?.description) {
    //   this.dictum = this.formControls.dictumKey.value?.description;
    //   // this.dictOffice = this.formControls.dictumKey.value?.dict_ofi;
    //   this.cveDictumWhenValidateItem(this.dictum);
    // }
    this.checkToEnableDictum();
  }

  checkToEnableDictum() {
    // if (this.formControls.dictumKey.value == null) {
    if (this.isOpenDictumKey === true) {
      this.formControls.dictumKey.enable();
    } else {
      this.prevDictumKey = { ...this.formControls.dictumKey.value } || null;
      if (
        [16, 24, 26, '16', '24', '26'].includes(
          this.formControls.dictumKey.value?.id
        ) &&
        this.formControls.wheelNumber.value != null
      ) {
        const param = new FilterParams();
        param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
        this.fileUpdateService.getNotification(param.getParams()).subscribe({
          next: (data: { count: number }) => {
            if (data.count > 0) {
              this.formControls.dictumKey.enable();
            }
          },
        });
      }
    }
  }

  setUniqueKeyData(key: ITransferingLevelView, full?: boolean) {
    if (key.transfereeNum != null)
      this.docRegisterService.getTransferent(key.transfereeNum).subscribe({
        next: (data: any) => {
          this.formControls.endTransferNumber.setValue(data);
        },
        error: () => {},
      });
    if (key.stationNum != null) {
      const params = new FilterParams();
      params.addFilter('id', key.stationNum);
      params.addFilter('idTransferent', key.transfereeNum);
      this.docRegisterService.getStations(params.getParams()).subscribe({
        next: (data: { data: any[] }) => {
          this.formControls.stationNumber.setValue(data.data[0]);
          this.getStations({ page: 1, limit: 10 });
        },
      });
    }
    if (key.authorityNum != null) {
      const param = new FilterParams();
      param.addFilter('idAuthority', key.authorityNum);
      this.docRegisterService
        .getAuthoritiesFilter(param.getParams())
        .subscribe({
          next: (data: { count: number; data: any[] }) => {
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
        this.docRegisterService.getCity(key.cityNum).subscribe({
          next: (data: any) => {
            this.formControls.cityNumber.setValue(data);
          },
          error: () => {},
        });
      }
      if (key.federalEntityCve != null) {
        this.docRegisterService
          .getByTableKeyOtKey(1, key.federalEntityCve)
          .subscribe({
            next: (data: { data: any }) => {
              this.formControls.entFedKey.setValue(data.data);
            },
            error: () => {},
          });
      }
    }
  }

  openSatChat() {
    //TODO: adaptar PUP_ACLARA_CHAT
    this.onLoadToast(
      'info',
      'Chat no disponible',
      'El chat para consultar con el SAT no se encuentra disponible.'
    );
  }

  isLoadingOfficeOfRelief = false;
  async onClickOfficeOfRelief() {
    let dictumId: string;
    this.isLoadingOfficeOfRelief = true;
    if (!this.formControls.affairKey.value) {
      this.alert(
        'warning',
        'No especificado',
        'Es necesario especificar el tipo de desahogo'
      );
      this.isLoadingOfficeOfRelief = false;
      return;
    }
    if (this.formControls.dictumKey.value?.id) {
      dictumId = this.formControls.dictumKey.value.id;
      if (['24', '26'].includes(dictumId)) {
        this.openSatChat();
        this.isLoadingOfficeOfRelief = false;
        return;
      }
    }
    let catRAsuntDict = null;
    try {
      catRAsuntDict = await this.fetchForForm.searchCatRAsuntDic();
      if (catRAsuntDict.count < 1) {
        this.alert(
          'warning',
          'No encontrado',
          'Este asunto con este dictámen no esta registrado en el catálogo de Asuntos - Dictamen'
        );
        this.isLoadingOfficeOfRelief = false;
        return;
      }
    } catch (ex) {
      this.alert(
        'warning',
        'No encontrado',
        'Este asunto con este dictámen no esta registrado en el catálogo de Asuntos - Dictamen'
      );
      this.isLoadingOfficeOfRelief = false;
      return;
    }
    if (this.affair && (!this.dictOffice || this.dictOffice === 'D')) {
      await this.pupValidaOf(catRAsuntDict.data[0]);
      this.isLoadingOfficeOfRelief = false;
      return;
    }
    if (this.affair && this.dictOffice) {
      try {
        await this.fetchForForm.mOfficeManager();
        //  si trae cero va al catch
      } catch (ex) {
        if (dictumId == '1') {
          try {
            await this.fetchForForm.getGoodAll();
            await this.pupValidaOf(catRAsuntDict.data[0]);
          } catch (ex) {
            this.alert(
              'warning',
              'No encontrado',
              'Este volante no tiene bienes para Desahogar.'
            );
            this.isLoadingOfficeOfRelief = false;
            return;
          }
          this.isLoadingOfficeOfRelief = false;
          return;
        }
      }
      await this.pupValidaOf(catRAsuntDict.data[0]);
    }
    this.isLoadingOfficeOfRelief = false;
    // try {
    //   const result = await this.fetchForForm.searchCatRAsuntDic();
    //   if (result.count < 1) {
    //     this.alert(
    //       'warning',
    //       'No encontrado',
    //       'Este asunto con este dictamen no esta registrado en el catálogo de Asuntos - Dictamen'
    //     );
    //     return;
    //   }
    //   this.pupValidaOf(result.data[0]);
    // } catch (ex) {}

    // const params = new FilterParams();
    // params.addFilter('dictum', this.formControls.dictumKey.value?.id);
    // params.addFilter('code', this.formControls.affairKey.value?.id);
    // params.addFilter('flyerType', this.formControls.wheelType.value);
    // const params = [
    //   { dictum: this.formControls.dictumKey.value?.id },
    //   { code: this.formControls.affairKey.value?.id },
    //   { flyerType: this.formControls.wheelType.value },
    // ];

    // this.fileUpdateService.getDictumSubjects(params.getParams()).subscribe({
    //   next: data => {
    //     if (data.count > 0) {
    //       const catalog = data.data[0];
    //       if (catalog.g_of == 'S') {
    //         params.removeAllFilters();
    //         params.addFilter(
    //           'flyerNumber',
    //           this.formControls.wheelNumber.value
    //         );
    //         this.fileUpdateService
    //           .getJobManagements(params.getParams())
    //           .subscribe({
    //             next: data => {
    //               if (data.count > 0) {
    //                 this.goToDocumentsManagement(catalog);
    //               } else {
    //                 if (dictumId == 1) {
    //                   params.removeAllFilters();
    //                   params.addFilter(
    //                     'fileNumber',
    //                     this.formControls.expedientNumber.value
    //                   );
    //                   params.addFilter('status', 'ROP');
    //                   this.docRegisterService
    //                     .getGoods(params.getParams())
    //                     .subscribe({
    //                       next: data => {
    //                         if (data.count > 0) {
    //                           this.goToDocumentsManagement(catalog);
    //                         } else {
    //                           this.alert(
    //                             'warning',
    //                             'No se encontraron bienes',
    //                             'Este volante no tiene bienes para Desahogar.'
    //                           );
    //                         }
    //                       },
    //                       error: () => {
    //                         this.alert(
    //                           'warning',
    //                           'No se encontraron bienes',
    //                           'Este volante no tiene bienes para Desahogar.'
    //                         );
    //                       },
    //                     });
    //                 } else {
    //                   this.goToDocumentsManagement(catalog);
    //                 }
    //               }
    //             },
    //             error: err => {
    //             },
    //           });
    //       } else {
    //         this.alert(
    //           'warning',
    //           'Asunto y Dictamen inválidos',
    //           'De acuerdo al Asunto y Dictamen NO puede generar un Oficio Gestión.'
    //         );
    //       }
    //     } else {
    //       this.onLoadToast(
    //         'warning',
    //         'Catálogo no encontrado',
    //         'Este asunto con este dictamen no esta registrado en el catálogo de Asuntos - Dictamen'
    //       );
    //     }
    //   },
    //   error: err => {
    //     this.onLoadToast(
    //       'warning',
    //       'Catálogo no encontrado',
    //       'Hubo un problema al buscar el asunto con ese dictamen'
    //     );
    //   },
    // });
  }

  async pupValidaOf(CAT_R_ASUNT_DIC: any) {
    const { property, i, e, g_of, doc } = CAT_R_ASUNT_DIC;
    let sale: string = '',
      officeType: string = '';
    if (property == 'N') {
      sale = 'C';
    } else if (property == 'S') {
      sale = 'D';
    }
    if (i == 'S') {
      officeType = 'INTERNO';
    }
    if (e == 'S') {
      officeType = 'EXTERNO';
    }
    if (g_of == 'S') {
      let procedure;
      if (
        this.pageParams.pNoTramite != null &&
        this.pageParams.pNoTramite != undefined
      ) {
        procedure = this.pageParams.pNoTramite;
      } else if (this.procedureId != undefined) {
        procedure = this.procedureId;
      }
      this.fileUpdComService.juridicalDocumentManagementParams = {
        expediente: this.formControls.expedientNumber.value,
        volante: this.formControls.wheelNumber.value,
        pDictamen: this.formControls.dictumKey.value?.id,
        pGestOk: this.pageParams.pGestOk,
        pNoTramite: procedure,
        tipoOf: officeType,
        bien: property,
        sale: sale,
        doc,
      };
      this.router.navigate(
        [
          '/pages/documents-reception/flyers-registration/related-document-management/1',
        ],
        {
          queryParams: {
            LAST_ROUTE: '/pages/juridical/file-data-update',
            ORIGIN: 'FACTGENACTDATEX',
            VOLANTE: this.formControls.wheelNumber.value,
            EXPEDIENTE: this.formControls.expedientNumber.value,
            DOC: doc,
            TIPO_OF: officeType,
            SALE: sale,
            BIEN: property,
            P_GEST_OK: this.pageParams.pGestOk,
            P_NO_TRAMITE: procedure,
            P_DICTAMEN: this.formControls.dictumKey.value?.id,
          },
        }
      );
      try {
        const dictationCount = await this.getCountDictation();
        const mJobManagementCount = await this.getJobManagement();
        if (dictationCount == 0 && mJobManagementCount == 0) {
          await firstValueFrom(
            this.notificationService.update(
              this.formControls.wheelNumber.value,
              {
                dictumKey: null,
              }
            )
          );
        }
      } catch (ex) {
        showToast({
          icon: 'error',
          text: 'Error al actualizar la clave del dictamen',
        });
      }
    }
  }

  goToDocumentsManagement(catalog: IRAsuntDic) {
    this.fileUpdateService.juridicalFileDataUpdateForm =
      this.fileDataUpdateForm.value;
    let sale: string = '',
      officeType: string = '';
    if (catalog.property == 'N') {
      sale = 'C';
    } else if (catalog.property == 'S') {
      sale = 'D';
    }
    if (catalog.i == 'S') {
      officeType = 'INTERNO';
    }
    if (catalog.e == 'S') {
      officeType = 'EXTERNO';
    }

    let procedure;
    if (
      this.pageParams.pNoTramite != null &&
      this.pageParams.pNoTramite != undefined
    ) {
      procedure = this.pageParams.pNoTramite;
    } else if (this.procedureId != undefined) {
      procedure = this.procedureId;
    }
    this.fileUpdComService.juridicalDocumentManagementParams = {
      expediente: this.formControls.expedientNumber.value,
      volante: this.formControls.wheelNumber.value,
      pDictamen: this.formControls.dictumKey.value?.id,
      pGestOk: this.pageParams.pGestOk,
      pNoTramite: procedure,
      tipoOf: officeType,
      bien: catalog.property,
      sale: sale,
      doc: catalog.doc,
    };
    this.router.navigate(
      [
        '/pages/documents-reception/flyers-registration/related-document-management/1',
      ],
      {
        queryParams: {
          origin: '/pages/juridical/file-data-update',
          form: 'FACTGENACTDATEX',
          expediente: this.formControls.expedientNumber.value,
          volante: this.formControls.wheelNumber.value,
          pDictamen: this.formControls.dictumKey.value?.id,
          pGestOk: this.pageParams.pGestOk,
          pNoTramite: procedure,
          tipoOf: officeType,
          bien: catalog.property,
          sale: sale,
          doc: catalog.doc,
        },
      }
    );
  }

  isLoadingBtnDictationJudgment: boolean = false;
  async sendToJuridicalRuling() {
    // let dictumType: string;
    // const dictumId = Number(this.formControls.dictumKey.value?.id);
    // if (dictumId == 18 && !this.dictumPermission) {
    //   this.onLoadToast(
    //     'warning',
    //     'No cuenta con los permisos necesarios',
    //     'No tiene privilegios para entrar a los Dictamenes de Resarcimiento.'
    //   );
    //   return;
    // }
    // if ([1, 16, 23].includes(dictumId)) dictumType = 'PROCEDENCIA';
    // if (dictumId == 15) dictumType = 'DESTRUCCION';
    // if (dictumId == 2) dictumType = 'DECOMISO';
    // if (dictumId == 22) dictumType = 'EXT_DOM';
    // if ([3, 19].includes(dictumId)) dictumType = 'DEVOLUCION';
    // if (dictumId == 17) dictumType = 'TRANSFERENTE';
    // if (dictumId == 18) dictumType = 'RESARCIMIENTO';
    // if (dictumId == 20) dictumType = 'ABANDONO';
    // if (dictumId == 24) dictumType = 'ACLARA';
    // let procedure;
    // if (
    //   this.pageParams.pNoTramite != null &&
    //   this.pageParams.pNoTramite != undefined
    // ) {
    //   procedure = this.pageParams.pNoTramite;
    // } else if (this.procedureId != undefined) {
    //   procedure = this.procedureId;
    // }
    // this.fileUpdateService.juridicalFileDataUpdateForm =
    //   this.fileDataUpdateForm.value;
    // this.globalVarsService.updateSingleGlobal(
    //   'varDic',
    //   this.dictum,
    //   this.globals
    // );
    // if (this.formControls.delDestinyNumber.value == this.userDelegation) {
    //   this.dictConsultOnly = 'S';
    // } else {
    //   //TODO: habilitar cuando el usuario tenga los permisos
    //   this.dictConsultOnly = 'N';
    // }
    // this.fileUpdComService.juridicalRulingParams = {
    //   expediente: this.formControls.expedientNumber.value,
    //   volante: this.formControls.wheelNumber.value,
    //   tipoVo: this.formControls.wheelType.value,
    //   tipoDic: dictumType,
    //   consulta: this.dictConsultOnly,
    //   pGestOk: this.pageParams.pGestOk,
    //   pNoTramite: procedure,
    // };
    // let path = '/pages/juridical/juridical-ruling-g';
    // this.router.navigate([path], {
    //   queryParams: {
    //     origin: '/pages/juridical/file-data-update',
    //     form: 'FACTGENACTDATEX',
    //     expediente: this.formControls.expedientNumber.value,
    //     volante: this.formControls.wheelNumber.value,
    //     tipoVo: this.formControls.wheelType.value,
    //     tipoDic: dictumType,
    //     consulta: this.dictConsultOnly,
    //     pGestOk: this.pageParams.pGestOk,
    //     pNoTramite: procedure,
    //   },
    // });

    try {
      this.isLoadingBtnDictationJudgment = true;
      const dictamen = this.formControls.dictumKey.value?.id;
      const { description: cveDictation, id: dictation } =
        this.formControls.dictumKey.value;
      // console.log('dictamen', dictamen);

      let dictOfi;
      try {
        dictOfi = await this.getCatDictation(dictamen);
      } catch (ex) {
        dictOfi = null;
      }

      if (['9', '10', '14'].includes(dictamen)) {
        try {
          const params = new ListParams();
          params['filter.wheelNumber'] = this.formControls.wheelNumber.value;
          const notification =
            this.selectedNotification; /* (await this.getNotification(
            params,
            true
          )) as INotification; */
          this.globals.varDic = notification.dictumKey;
        } catch (ex) {
          this.globals.varDic = null;
        }

        let exist;
        exist = await this.getSatTransference(
          this.formControls.officeExternalKey.value
        );

        if (exist == 0) {
          try {
            exist = await this.getPgrTransference({
              'filter.pgrOffice': this.formControls.officeExternalKey.value,
              limit: 1,
              page: 1,
            });
          } catch (ex: any) {
            if (ex.status == 400) {
              exist = 0;
            } else {
              throw ex;
            }
          }
        }

        if (exist > 0) {
          const questionResponse = await showQuestion({
            icon: 'question',
            text:
              'El Volante: ' +
              this.formControls.wheelNumber.value +
              ' , ya cuenta con una aclaración. Desea generar dictámen de recepción?',
            title: 'Pregunta',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, cancelar',
          });
          if (questionResponse.isConfirmed) {
            this.formControls.dictumKey.setValue(null);
            this.formControls.dictumKey.enable();
            if (!this.formControls.dictumKey.value) {
              this.alert(
                'warning',
                '',
                'Es necesario especificar el tipo de Desahogo Asunto'
              );
              this.isLoadingBtnDictationJudgment = false;
              return;
            }
            this.pupShowDictation();
          }
        }
      } else {
        const affairKey = this.formControls.affairKey.value?.id; // CVE_ASUNTO
        if (!cveDictation) {
          this.alert(
            'warning',
            '',
            'Es necesario especificar el tipo de Desahogo Asunto'
          );
          this.isLoadingBtnDictationJudgment = false;
          return;
        }
        if (!affairKey) {
          this.alert(
            'warning',
            '',
            'Es necesario especificar el tipo de desahogo'
          );
          this.isLoadingBtnDictationJudgment = false;
          return;
        }
        this.formControls.dictumKey.disable();
        const params = new ListParams();
        params['filter.user'] = this.authService
          .decodeToken()
          .preferred_username?.toUpperCase(); //TODO:Descomentar'ERMARTINEZ';
        params['filter.typeNumber'] = 'RESARCIMIENTO';
        params['filter.writing'] = 'S';
        params['filter.reading'] = 'S';
        let vc_usu_resar = 0;
        try {
          const rTDictaAarusr = await this.getRTdictaAarusr(params);
          vc_usu_resar = rTDictaAarusr.count;
        } catch (ex: any) {
          if (ex.status == 400) {
            vc_usu_resar = 0;
          } else {
            throw ex;
          }
        }

        if (affairKey && dictOfi.dict_ofi == 'D') {
          if (dictation == '18' && vc_usu_resar < 1) {
            this.alert(
              'warning',
              '',
              'No tienes privilegios para entrar a los Dictámenes de Resarcimiento '
            );
            this.isLoadingBtnDictationJudgment = false;
            return;
          }

          if (
            this.formControls.delDestinyNumber.value ==
            Number(this.authService.decodeToken().department)
          ) {
            this.dictConsultOnly = 'N';
            this.pupShowDictation();
          } else {
            this.dictConsultOnly = 'S';
            this.pupShowDictation();
          }
          this.isLoadingBtnDictationJudgment = false;
        }
        this.isLoadingBtnDictationJudgment = false;
      }
      this.isLoadingBtnDictationJudgment = false;
    } catch (ex) {
      this.alert(
        'error',
        '',
        'Este volante no puede acceder a este tipo de dictamen'
      );
      this.isLoadingBtnDictationJudgment = false;
    }
    this.isLoadingBtnDictationJudgment = false;
  }

  async getCountDictation(): Promise<number> {
    const listParams = new ListParams();
    listParams['filter.wheelNumber'] = this.formControls.wheelNumber.value;
    const count = await firstValueFrom(
      this.dictationService.getAll(listParams).pipe(
        map(response => response.count),
        catchError(error => {
          if (error.status >= 400 && error.status < 500) {
            return of(0);
          } else {
            throw error;
          }
        })
      )
    );
    return count;
  }

  async getJobManagement(): Promise<number> {
    const listParams = new ListParams();
    listParams['filter.flyerNumber'] = this.formControls.wheelNumber.value;
    const count = await firstValueFrom(
      this.mJobManagementService.getAll(listParams).pipe(
        map(response => response.count),
        catchError(error => {
          if (error.status >= 400 && error.status < 500) {
            return of(0);
          } else {
            throw error;
          }
        })
      )
    );
    return count;
  }

  async getNotificationKnow(): Promise<number> {
    const listParams = new ListParams();
    listParams['filter.wheelNumber'] = this.formControls.wheelNumber.value;
    listParams['filter.dictumKey'] = 'CONOCIMIENTO';
    const count = await firstValueFrom(
      this.notificationService.getAll(listParams).pipe(
        map(response => response.count),
        catchError(error => {
          if (error.status >= 400 && error.status < 500) {
            return of(0);
          } else {
            throw error;
          }
        })
      )
    );
    return count;
  }

  async updateDictumKey() {
    try {
      const dictationCount = await this.getCountDictation();
      const mJobManagementCount = await this.getJobManagement();
      if (dictationCount == 0 && mJobManagementCount == 0) {
        await firstValueFrom(
          this.notificationService.update(this.formControls.wheelNumber.value, {
            dictumKey: null,
          })
        );
      } else if (
        dictationCount == 0 &&
        mJobManagementCount > 0 &&
        this.globals.varDic
      ) {
        await firstValueFrom(
          this.notificationService.update(this.formControls.wheelNumber.value, {
            dictumKey: this.globals.varDic,
          })
        );
      }
    } catch (ex) {
      showToast({
        icon: 'error',
        text: 'Error al actualizar la clave del dictamen',
      });
    }
  }

  async pupShowDictation() {
    const dictumKey = this.formControls.dictumKey.value?.id;
    let dictumType;
    if (['1', '16', '23'].includes(dictumKey)) dictumType = 'PROCEDENCIA';
    if (dictumKey == '15') dictumType = 'DESTRUCCION';
    if (dictumKey == '2') dictumType = 'DECOMISO';
    if (dictumKey == '22') dictumType = 'EXT_DOM';
    if (['3', '19'].includes(dictumKey)) dictumType = 'DEVOLUCION';
    if (dictumKey == '17') dictumType = 'TRANSFERENTE';
    if (dictumKey == '18') dictumType = 'RESARCIMIENTO';
    if (dictumKey == '20') dictumType = 'ABANDONO';
    if (dictumKey == '24') dictumType = 'ACLARA';

    let procedure;
    if (
      this.pageParams.pNoTramite != null &&
      this.pageParams.pNoTramite != undefined
    ) {
      procedure = this.pageParams.pNoTramite;
    } else if (this.procedureId != undefined) {
      procedure = this.procedureId;
    }
    this.fileUpdateService.juridicalFileDataUpdateForm =
      this.fileDataUpdateForm.value;
    this.globalVarsService.updateSingleGlobal(
      'varDic',
      this.dictum,
      this.globals
    );
    if (this.formControls.delDestinyNumber.value == this.userDelegation) {
      this.dictConsultOnly = 'S';
    } else {
      //TODO: habilitar cuando el usuario tenga los permisos
      this.dictConsultOnly = 'N';
    }
    this.fileUpdComService.juridicalRulingParams = {
      expediente: this.formControls.expedientNumber.value,
      volante: this.formControls.wheelNumber.value,
      tipoVo: this.formControls.wheelType.value,
      tipoDic: dictumType,
      consulta: this.dictConsultOnly,
      pGestOk: this.pageParams.pGestOk,
      pNoTramite: procedure,
    };
    let path = '/pages/juridical/juridical-ruling-g';
    this.router.navigate([path], {
      queryParams: {
        origin: '/pages/juridical/file-data-update',
        form: 'FACTGENACTDATEX',
        EXPEDIENTE: this.formControls.expedientNumber.value,
        VOLANTE: this.formControls.wheelNumber.value,
        TIPO_VO: this.formControls.wheelType.value,
        TIPO_DIC: dictumType,
        CONSULTA: this.dictConsultOnly,
        P_GEST_OK: this.pageParams.pGestOk,
        P_NO_TRAMITE: procedure,
      },
    });

    await this.updateDictumKey();

    // const dictamen = this.formControls.dictumKey.value?.id;
    // let dictOfi = await this.getCatDictation(dictamen);
    // try {
    //   if (['9', '10', '14'].includes(dictamen)) {
    //     try {
    //       const params = new ListParams();
    //       params['wheelNumber'] = this.formControls.wheelNumber.value;
    //       const notification = (await this.getNotification(
    //         params,
    //         true
    //       )) as INotification;
    //     } catch (ex) {
    //       this.globals.varDic = null;
    //     }
    //     let exist;
    //     exist = await this.getSatTransference(
    //       this.formControls.officeExternalKey.value
    //     );
    //     if (exist == 0) {
    //       exist = await this.getPgrTransference(
    //         this.formControls.officeExternalKey.value
    //       );
    //     }

    //     if (exist > 0) {
    //       const questionResponse = await showQuestion({
    //         icon: 'question',
    //         text: 'El Volante: '+this.formControls.wheelNumber+' , ya cuenta con una aclaración. Desea generar dictámen de recepción?',
    //         title: 'Pregunta',
    //         confirmButtonText: 'Si, continuar',
    //         cancelButtonText: 'No, cancelar',
    //       });
    //       if (!questionResponse.isConfirmed) {
    //         this.formControls.dictumKey.setValue(null);
    //         if ()
    //         return;
    //       }
    //     }
    //   }
    // } catch (ex) {
    //   this.alert(
    //     'error',
    //     '',
    //     'No se pudo obtener la información de la transferencia'
    //   );
    // }
  }

  openToShiftChange() {
    // this.fileUpdateService.juridicalFileDataUpdateForm =
    //   this.fileDataUpdateForm.value;
    this.fileUpdComService.juridicalShiftChangeParams = {
      iden: this.formControls.wheelNumber.value,
      exp: this.formControls.expedientNumber.value,
      pNoTramite: this.procedureId,
      affair: this.formControls.affairKey.value,
      // origin: this.layout,
    };
    this.router.navigate(['/pages/juridical/file-data-update/shift-change'], {
      queryParams: {
        previousRoute: this.activiveRoute.snapshot.queryParams['previousRoute'],
        form: 'FACTGENACTDATEX',
        iden: this.formControls.wheelNumber.value,
        exp: this.formControls.expedientNumber.value,
        pNoTramite: this.procedureId,
        affair: this.formControls.affairKey.value,
        // origin: this.layout,
      },
    });
  }

  readonly nameForm = '';

  async sendToRelatedDocumentsManagement() {
    this.fileUpdateService.juridicalFileDataUpdateForm =
      this.fileDataUpdateForm.value;
    let procedure;
    if (
      this.pageParams.pNoTramite != null &&
      this.pageParams.pNoTramite != undefined
    ) {
      procedure = this.pageParams.pNoTramite;
    } else if (this.procedureId != undefined) {
      procedure = this.procedureId;
    }
    this.fileUpdComService.juridicalRelatedDocumentManagementParams = {
      expediente: this.formControls.expedientNumber.value,
      volante: this.formControls.wheelNumber.value,
      pGestOk: this.pageParams.pGestOk,
      pNoTramite: procedure,
    };
    this.router.navigate(
      [
        '/pages/documents-reception/flyers-registration/related-document-management-relation/2',
      ],
      {
        queryParams: {
          LAST_ROUTE: '/pages/juridical/file-data-update',
          ORIGIN: 'FACTGENACTDATEX',
          VOLANTE: this.formControls.wheelNumber.value,
          EXPEDIENTE: this.formControls.expedientNumber.value,
          P_GEST_OK: this.pageParams.pGestOk,
          P_NO_TRAMITE: procedure,
        },
      }
    );

    try {
      const dictationCount = await this.getCountDictation();
      const mJobManagementCount = await this.getJobManagement();
      const notificationKnowCount = await this.getNotificationKnow();
      if (
        dictationCount == 0 &&
        mJobManagementCount == 0 &&
        notificationKnowCount == 0
      ) {
        await firstValueFrom(
          this.notificationService.update(this.formControls.wheelNumber.value, {
            dictumKey: null,
          })
        );
      }
    } catch (ex) {
      showToast({
        icon: 'error',
        text: 'Error al actualizar la clave del dictamen',
      });
    }
  }

  openFlyerCopies() {
    const modalRef = this.modalService.show(FlyerCopiesModalComponent, {
      initialState: { notification: this.formControls.wheelNumber.value },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  viewDocuments() {
    // this.getDocumentsByFlyer(this.formControls.wheelNumber.value);
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.formControls.wheelNumber.value);
    // params.addFilter('scanStatus', 'ESCANEADO');
    this.fileUpdateService.getDocuments(params.getParams()).subscribe({
      next: (data: any) => {
        this.getDocumentsByFlyer(this.formControls.wheelNumber.value);
      },
      error: (err: any) => {
        this.onLoadToast(
          'info',
          'No disponible',
          'El volante no tiene documentos relacionados.'
        );
      },
    });
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
      .subscribe((document: IDocuments) => this.getPicturesFromFolio(document));
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

  changeWheelType(type: string) {
    this.formControls.affairKey.setValue(null);
    this.formControls.endTransferNumber.setValue(null);
    this.getTransferors({ page: 1, text: '' });
    if (['T', 'P'].includes(type)) {
      this.initialCondition = 'T';
    } else if (['AT', 'A'].includes(type)) {
      this.initialCondition = type;
    }
    console.log('initialCondition', this.initialCondition);
    if (this.initialCondition == 'A') {
      const keys = [
        'transference',
        'expedientTransferenceNumber',
        'judgementType',
      ];
    }

    if (this.initialCondition == 'T') {
      const keys = [
        'circumstantialRecord',
        'preliminaryInquiry',
        'criminalCase',
        'touchPenaltyKey',
        'minpubNumber',
        'crimeKey',
        'protectionKey',
      ];
    }

    if (this.initialCondition == 'AT') {
      const keys = [
        'transference',
        'expedientTransferenceNumber',
        'judgementType',
      ];
    }
  }

  changeDictum(dictum: { id: number; description: string } /* IOpinion */) {
    this.dictum = dictum.description;
    this.cveDictumWhenValidateItem(this.dictum);
    // this.dictOffice = dictum.dict_ofi;
    console.log('ddd', dictum);

    this.change_Dict = dictum;
    this.fileUpdComService.enviarDatos(this.change_Dict);
    localStorage.setItem('dictumKey', JSON.stringify(this.change_Dict));
    // this.datosEnviados.emit(this.change_Dict)
    if (this.dictum == 'CONOCIMIENTO') {
      this.formControls.reserved.enable();
      this.alert(
        'info',
        'Justificación',
        'Para el desahogo de Conocimiento es necesario ingresar la justificación'
      );
      goFormControlAndFocus('reserved');
    } else {
      this.formControls.reserved.disable();
    }

    //when mouse double click on DICTAMEN
    if (
      this.prevDictumKey != null &&
      [16, 24, 26, '16', '24', '26'].includes(this.prevDictumKey?.id)
    ) {
      const param = new FilterParams();
      param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
      param.addFilter('dictumKey', this.prevDictumKey?.description);
      this.fileUpdateService.getNotification(param.getParams()).subscribe({
        next: (data: { count: number }) => {
          if (data.count > 0) {
            this.alertQuestion(
              'info',
              `El volante ${this.formControls.wheelNumber.value} ya cuenta con un desahogo`,
              '¿Desea generar otro?',
              'Sí'
            ).then(question => {
              if (question.isConfirmed) {
                this.dictConsultOnly = 'S';
                this.sendToJuridicalRuling();
              }
            });
          }
        },
        error: () => {},
      });
    }
  }

  changeTransferor(event: ITransferente) {
    // if (event?.id) {
    //   this.formControls.transference.setValue(event);
    // }
    this.formControls.stationNumber.setValue(null);
    this.formControls.autorityNumber.setValue(null);
    this.getStations({ page: 1, text: '' });
    this.getAuthorities({ page: 1, text: '' });
  }

  changeStation(event: IStation) {
    this.formControls.autorityNumber.setValue(null);
    this.getAuthorities({ page: 1, text: '' });
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
            value: this.formControls.wheelNumber.value,
          },
          {
            field: 'scanStatus',
            value: 'ESCANEADO',
          },
        ],
        selectOnClick: true,
      },
      this.selectDocument
    );
  }

  selectDocument(document: IDocuments, self: JuridicalRecordUpdateComponent) {
    if (document) {
      self.documentMessage();
    }
  }

  documentMessage() {
    this.onLoadToast(
      'info',
      'Enlace no disponible',
      'El enlace al documento no se encuentra disponible'
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

  getUniqueKey(lparams: ListParams) {
    const param = new FilterParams();
    param.addFilter('uniqueCve', Number(lparams.text));
    this.docRegisterService.getUniqueKeyData(param.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.uniqueKeys = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.uniqueKeys = new DefaultSelect();
      },
    });
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('nameCity', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.docRegisterService.getCities(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  getDynamicTables(
    id: number | string,
    params: ListParams
  ): Observable<IListResponse<TvalTable1Data>> {
    return this.docRegisterService.getDynamicTables(id, params);
  }

  getFederalEntities(params: ListParams) {
    let elements$ = this.getDynamicTables(1, params);
    elements$.subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.federalEntities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.federalEntities = new DefaultSelect();
      },
    });
  }

  _transferors = new DefaultSelect();

  getTransferors(lparams: ListParams, isTransference = false) {
    const body = {
      active: ['1', '2'],
      nameTransferent: lparams.text,
    };
    this.transferorLoading = true;
    this.docRegisterService.getActiveTransferents(body).subscribe({
      next: (data: { data: any[]; count: number }) => {
        if (isTransference) {
          this._transferors = new DefaultSelect(data.data, data.count);
        } else {
          this.transferors = new DefaultSelect(data.data, data.count);
        }
        this.transferorLoading = false;
      },
      error: () => {
        this.transferors = new DefaultSelect();
        this.transferorLoading = false;
      },
    });
  }

  getStations(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text?.length > 0)
      params.addFilter('stationName', lparams.text, SearchFilter.LIKE);
    if (this.formControls.endTransferNumber.value != null)
      params.addFilter(
        'idTransferent',
        this.formControls.endTransferNumber.value.id
      );
    this.stationLoading = true;
    this.docRegisterService.getStations(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
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
    if (this.formControls.endTransferNumber.value != null)
      params.addFilter(
        'idTransferer',
        this.formControls.endTransferNumber.value.id
      );
    if (this.formControls.stationNumber.value != null)
      params.addFilter('idStation', this.formControls.stationNumber.value.id);
    this.docRegisterService.getAuthorities(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.authorities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authorities = new DefaultSelect();
      },
    });
  }

  getInstitutions(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('name', lparams.text, SearchFilter.LIKE);
    this.fileUpdateService.getInstitutions(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.institutions = new DefaultSelect(data.data, data.count);
      },
      error: (err: any) => {
        this.institutions = new DefaultSelect();
      },
    });
  }

  getPublicMinistries(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    //TODO: Filtros comentados para pruebas
    // if (this.cityNumber.value != null)
    //   params.addFilter('idCity', this.cityNumber.value.idCity);
    // if (this.delDestinyNumber.value != null)
    //   params.addFilter('noDelegation', this.delDestinyNumber.value);
    // if (this.subDelDestinyNumber.value != null)
    //   params.addFilter('noSubDelegation', this.subDelDestinyNumber.value);
    this.docRegisterService.getPublicMinistries(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.publicMinistries = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.publicMinistries = new DefaultSelect();
      },
    });
  }

  getCrimes(params: ListParams) {
    let elements$ = this.getDynamicTables(2, params);
    elements$.subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.crimes = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.crimes = new DefaultSelect();
      },
    });
  }

  getCourts(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.docRegisterService.getCourtsUnrelated(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
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
    if (lparams?.text.length > 0)
      params.addFilter('name', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.docRegisterService.getDefendants(params.getParams()).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.defendants = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.defendants = new DefaultSelect();
      },
    });
  }

  getReceptionWays(params: ListParams) {
    let elements$ = this.getDynamicTables(9, params);
    elements$.subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.receptionWays = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.receptionWays = new DefaultSelect();
      },
    });
  }

  getAffairs(params: ListParams) {
    this.fileUpdateService.getAffairs(params).subscribe({
      next: (data: { data: any[]; count: number }) => {
        this.affairs = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.affairs = new DefaultSelect();
      },
    });
  }

  isLoadingDictums = false;
  getDictums(params: ListParams) {
    this.isLoadingDictums = true;
    params['CVE_ASUNTO'] = this.formControls.affairKey.value?.id;
    params['TIPO_VOLANTE'] = this.formControls.wheelType.value;
    params['CVE_OFICIO_EXTERNO'] = this.formControls.officeExternalKey.value;
    this.fileUpdateService.postFindDescriptionOpinion(params).subscribe({
      next: (data: { data: any[]; count: number }) => {
        //order for id
        data.data.sort((a, b) => {
          return a.id - b.id;
        });
        this.dictums = new DefaultSelect(data.data, data.count);
        this.isLoadingDictums = false;
      },
      error: () => {
        this.isLoadingDictums = false;
        this.dictums = new DefaultSelect();
      },
    });
  }
}

class FetchForForm {
  constructor(
    private juridicalFileUpdateService: JuridicalFileUpdateService,
    private formControls: any
  ) {}
  params = new FilterParams();

  async searchCatRAsuntDic(
    _params?: { key: string; value: string; searchType?: SearchFilter }[]
  ) {
    let params = new FilterParams();
    if (!_params) {
      params.addFilter('dictum', this.formControls.dictumKey.value?.id);
      params.addFilter('code', this.formControls.affairKey.value?.id);
      params.addFilter('flyerType', this.formControls.wheelType.value);
    } else {
      params = this.setParams(_params);
    }

    const result = await firstValueFrom(
      this.juridicalFileUpdateService.getDictumSubjects(params.getParams())
    );

    return result;
  }

  async mOfficeManager() {
    const result = await firstValueFrom(
      this.juridicalFileUpdateService.getJobManagements(
        `filter.flyerNumber=${this.formControls.wheelNumber.value}`
      )
    );
    return result;
  }

  async getDictations() {
    const result = await firstValueFrom(
      this.juridicalFileUpdateService.getDictation(
        `filter.wheelNumber=${this.formControls.wheelNumber.value}`
      )
    );
    return result;
  }

  getGoodAll(params: ListParams | null = null) {
    if (params) {
      params = new ListParams();
      params['filter.fileeNumber'] = this.formControls.expedientNumber.value;
      params['filter.status'] = 'ROP';
    }
    return this.juridicalFileUpdateService.getGoodAll(params);
  }

  async putNotification(
    wheelNumber: number = null,
    notification: Partial<INotification> = null
  ) {
    if (!wheelNumber) wheelNumber = this.formControls.wheelNumber.value;
    if (!notification) {
      notification = {
        dictumKey: null,
      };
    }
    const result = await firstValueFrom(
      this.juridicalFileUpdateService.putNotification(wheelNumber, notification)
    );
    return result;
  }

  setParams(
    params: { key: string; value: string; searchType?: SearchFilter }[]
  ) {
    const _params = new FilterParams();
    params.forEach(item => {
      const searchType = item.searchType;
      if (searchType) {
        this.params.addFilter(item.key, item.value, searchType);
      } else {
        this.params.addFilter(item.key, item.value);
      }
    });
    return _params;
  }
}
