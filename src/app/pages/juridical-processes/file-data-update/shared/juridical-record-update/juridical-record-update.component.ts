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
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
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
import { showHideErrorInterceptorService } from '../../../../../common/services/show-hide-error-interceptor.service';
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
import { IOpinion } from '../../../../../core/models/catalogs/opinion.model';
import { IRAsuntDic } from '../../../../../core/models/catalogs/r-asunt-dic.model';
import { IStation } from '../../../../../core/models/catalogs/station.model';
import {
  ITransferente,
  ITransferingLevelView,
} from '../../../../../core/models/catalogs/transferente.model';
import { IDocuments } from '../../../../../core/models/ms-documents/documents';
import {
  IInstitutionNumber,
  INotification,
} from '../../../../../core/models/ms-notification/notification.model';
import { IManagementArea } from '../../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from '../../../../../core/services/authentication/auth.service';
import { DocReceptionRegisterService } from '../../../../../core/services/document-reception/doc-reception-register.service';
import { DocumentsService } from '../../../../../core/services/ms-documents/documents.service';
import { BasePage } from '../../../../../core/shared/base-page';
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
  extends BasePage
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
  fileDataUpdateForm = this.fb.group(JURIDICAL_FILE_DATA_UPDATE_FORM);
  initialCondition: string = 'P';
  prevInitialCondition: string = '';
  canViewDocuments = false;
  transferorLoading: boolean = false;
  stationLoading: boolean = false;
  dictum: string = '';
  prevDictumKey: IOpinion;
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

  public optionsTipoVolante = [
    { value: 'A', label: 'Administrativo' },
    { value: 'P', label: 'Procesal' },
    { value: 'AT', label: 'Admin. Trans' },
    { value: 'T', label: 'Transferente' },
  ];

  constructor(
    private fb: FormBuilder,
    private activiveRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private globalVarsService: GlobalVarsService,
    private fileUpdateService: JuridicalFileUpdateService,
    private fileUpdComService: FileUpdateCommunicationService,
    private docRegisterService: DocReceptionRegisterService,
    private showHideService: showHideErrorInterceptorService,
    private authService: AuthService,
    private documentsService: DocumentsService,
    private abandonmentsService: AbandonmentsDeclarationTradesService
  ) {
    super();
    const id = this.activiveRoute.snapshot.paramMap.get('id');
    if (id) this.flyerId = Number(id);
    this.initialDate = format(new Date(), 'd/MM/yyyy', {
      locale: esLocale,
    });
    if (this.fileUpdComService.fileDataUpdateParams != null)
      this.pageParams = this.fileUpdComService.fileDataUpdateParams;
  }

  private get formControls() {
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      changes['searchMode']?.currentValue &&
      !changes['searchMode']?.isFirstChange()
    ) {
      console.log('SearchMode');
      this.activateSearch();
    } else if (changes['searchMode']?.currentValue === false) {
      console.log('SearchMode false');
      this.deactivateSearch();
    }
    if (
      changes['confirmSearch']?.currentValue &&
      !changes['confirmSearch']?.isFirstChange()
    ) {
      console.log('confirmSearch');
      if (changes['confirmSearch']?.currentValue) {
        console.log(this.fileDataUpdateForm.value);
        this.onSearch.emit(this.fileDataUpdateForm.value);
      }
      // this.deactivateSearch();
    }
    if (
      changes['selectedNotification']?.currentValue &&
      !changes['selectedNotification']?.isFirstChange()
    ) {
      console.log('selectedNotification');
      this.fillForm(changes['selectedNotification'].currentValue);
    }
  }

  checkParams() {
    this.getGlobalVars();
    // if (this.fileUpdateService.juridicalFileDataUpdateForm != null)
    //   this.fileDataUpdateForm.patchValue(
    //     this.fileUpdateService.juridicalFileDataUpdateForm
    //   );
    console.log(this.pageParams);
    if (
      (this.pageParams.pGestOk == 1 || this.globals.gnuActivaGestion == 1) &&
      this.pageParams.pNoTramite
    ) {
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
        console.log(this.globals);
      });
  }

  getLoggedUser() {
    const token = this.authService.decodeToken();
    this.userId = token.preferred_username;
    const params = new FilterParams();
    params.addFilter('user', token.preferred_username);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
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
      next: data => {
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
      next: data => {
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
      next: data => {
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
      next: data => {
        console.log(data);
        const param = new FilterParams();
        param.addFilter('wheelNumber', data.flierNumber);
        this.fileUpdateService.getNotification(param.getParams()).subscribe({
          next: data => {
            console.log(data);
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

  fillForm(notif: INotification) {
    this.fileDataUpdateForm.enable();
    this.fileDataUpdateForm.reset();
    const filterParams = new FilterParams();
    this.formLoading = true;
    const values = {
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
    };
    this.fileDataUpdateForm.patchValue({ ...values });
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
    this.initialCondition = notif.wheelType;
    this.fileUpdateService.getAffair(notif.affairKey).subscribe({
      next: data => {
        this.formControls.affairKey.enable();
        this.formControls.affairKey.setValue(data);
        this.formControls.affairKey.disable();
      },
      error: () => {},
    });
    if (notif.cityNumber != null)
      this.docRegisterService.getCity(notif.cityNumber).subscribe({
        next: data => {
          this.formControls.cityNumber.enable();
          this.formControls.cityNumber.setValue(data);
          this.formControls.cityNumber.disable();
        },
      });
    if (notif.entFedKey != null) {
      this.docRegisterService.getByTableKeyOtKey(1, notif.entFedKey).subscribe({
        next: data => {
          this.formControls.entFedKey.enable();
          this.formControls.entFedKey.setValue(data.data);
          this.formControls.entFedKey.disable();
        },
      });
    }
    if (notif.endTransferNumber != null)
      this.docRegisterService
        .getTransferent(notif.endTransferNumber)
        .subscribe({
          next: data => {
            this.formControls.endTransferNumber.enable();
            this.formControls.endTransferNumber.setValue(data);
            this.formControls.endTransferNumber.disable();
          },
        });
    if (notif.courtNumber != null)
      this.docRegisterService.getCourt(notif.courtNumber).subscribe({
        next: data => {
          this.formControls.courtNumber.enable();
          this.formControls.courtNumber.setValue(data);
          this.formControls.courtNumber.disable();
        },
      });
    if (notif.stationNumber != null) filterParams.removeAllFilters();
    filterParams.addFilter('id', notif.stationNumber);
    filterParams.addFilter('idTransferent', notif.endTransferNumber);
    this.docRegisterService.getStations(filterParams.getParams()).subscribe({
      next: data => {
        this.formControls.stationNumber.enable();
        this.formControls.stationNumber.setValue(data.data[0]);
        this.formControls.stationNumber.disable();
        this.getStations({ page: 1, limit: 10 });
      },
    });
    if (notif.autorityNumber != null) {
      filterParams.addFilter('idAuthority', notif.autorityNumber);
      filterParams.addFilter('idStation', notif.stationNumber);
      filterParams.addFilter('idTransferer', notif.endTransferNumber);
      this.docRegisterService
        .getAuthoritiesFilter(filterParams.getParams())
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.formControls.autorityNumber.enable();
              this.formControls.autorityNumber.setValue(data.data[0]);
              this.formControls.autorityNumber.disable();
              this.getAuthorities({ page: 1, limit: 10 });
            }
          },
          error: () => {},
        });
    }
    filterParams.removeAllFilters();
    filterParams.addFilter('transfereeNum', notif.endTransferNumber);
    filterParams.addFilter('stationNum', notif.stationNumber);
    filterParams.addFilter('authorityNum', notif.autorityNumber);
    this.docRegisterService
      .getUniqueKeyData(filterParams.getParams())
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.formControls.uniqueKey.enable();
            this.formControls.uniqueKey.setValue(data.data[0]);
            this.formControls.uniqueKey.disable();
          }
        },
        error: () => {},
      });
    if (notif.minpubNumber != null) {
      const minpub = notif.minpubNumber as IMinpub;
      this.docRegisterService.getMinPub(minpub.id).subscribe({
        next: data => {
          this.formControls.minpubNumber.enable();
          this.formControls.minpubNumber.setValue(data);
          this.formControls.minpubNumber.disable();
        },
      });
    }
    if (notif.crimeKey != null)
      this.docRegisterService.getByTableKeyOtKey(2, notif.crimeKey).subscribe({
        next: data => {
          this.formControls.crimeKey.enable();
          this.formControls.crimeKey.setValue(data.data);
          this.formControls.crimeKey.disable();
        },
      });
    if (notif.indiciadoNumber != null)
      this.docRegisterService.getDefendant(notif.indiciadoNumber).subscribe({
        next: data => {
          this.formControls.indiciadoNumber.enable();
          this.formControls.indiciadoNumber.setValue(data);
          this.formControls.indiciadoNumber.disable();
        },
      });
    if (notif.viaKey != null)
      this.docRegisterService.getByTableKeyOtKey(9, notif.viaKey).subscribe({
        next: data => {
          this.formControls.viaKey.enable();
          this.formControls.viaKey.setValue(data.data);
          this.formControls.viaKey.disable();
        },
      });
    if (notif.institutionNumber != null) {
      const institution = notif.institutionNumber as IInstitutionNumber;
      this.fileUpdateService.getInstitution(institution.id).subscribe({
        next: data => {
          this.formControls.institutionNumber.enable();
          this.formControls.institutionNumber.setValue(data);
          this.formControls.institutionNumber.disable();
        },
        error: () => {},
      });
    }
    if (notif.dictumKey != null) {
      filterParams.removeAllFilters();
      filterParams.addFilter('description', notif.dictumKey);
      this.fileUpdateService.getDictum(filterParams.getParams()).subscribe({
        next: data => {
          if (data.count > 0) {
            const dictum = data.data[0];
            this.formControls.dictumKey.enable();
            this.formControls.dictumKey.setValue(dictum);
            this.formControls.dictumKey.disable();
            this.prevDictumKey = this.formControls.dictumKey.value;
            this.dictum = dictum.description;
            this.dictOffice = dictum.dict_ofi;
          }
        },
        error: () => {},
      });
    }
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
      error: err => {
        console.log(err);
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
          .subscribe(data => {
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
          next: data => {
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
              .subscribe(data => {
                this.formControls.destinationArea.enable();
                this.formControls.destinationArea.setValue(
                  data.data[0].description
                );
                this.formControls.destinationArea.disable();
              });
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
    this.fileUpdateService
      .getRecipientUser({ copyNumber: 1, flierNumber: notif.wheelNumber })
      .subscribe({
        next: data => {
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
    console.log(this.canViewDocuments);
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

  activateSearch() {
    console.log(this.searchMode);
    this.fileDataUpdateForm.enable();
    this.prevDictumKey = this.formControls.dictumKey.value;
    this.prevInitialCondition = this.initialCondition;
    if (this.layout == 'FILE-UPDATE')
      this.fileUpdateService.juridicalFileDataUpdateForm =
        this.fileDataUpdateForm.value;
    if (this.layout == 'ABANDONMENT')
      this.abandonmentsService.abandonmentsFlyerForm =
        this.fileDataUpdateForm.value;
    console.log(
      this.fileUpdateService.juridicalFileDataUpdateForm,
      this.abandonmentsService.abandonmentsFlyerForm
    );
    this.fileDataUpdateForm.reset();
    this.fileDataUpdateForm.enable();
  }

  deactivateSearch() {
    console.log(this.searchMode);
    console.log(this.confirmSearch);
    this.fileDataUpdateForm.enable();
    console.log(
      this.fileUpdateService.juridicalFileDataUpdateForm,
      this.abandonmentsService.abandonmentsFlyerForm
    );
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
      if (['A', 'P'].includes(this.formControls.wheelType.value)) {
        this.initialCondition = 'A';
      } else if (['AT', 'T'].includes(this.formControls.wheelType.value)) {
        this.initialCondition = this.formControls.wheelType.value;
      }
    }
    this.fileDataUpdateForm.disable();
    if (this.formControls.dictumKey.value?.description) {
      this.dictum = this.formControls.dictumKey.value?.description;
      this.dictOffice = this.formControls.dictumKey.value?.dict_ofi;
    }
    this.checkToEnableDictum();
  }

  checkToEnableDictum() {
    if (this.formControls.dictumKey.value == null) {
      this.formControls.dictumKey.enable();
    } else {
      this.prevDictumKey = this.formControls.dictumKey.value;
      if (
        [16, 24, 26, '16', '24', '26'].includes(
          this.formControls.dictumKey.value?.id
        ) &&
        this.formControls.wheelNumber.value != null
      ) {
        const param = new FilterParams();
        param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
        this.fileUpdateService.getNotification(param.getParams()).subscribe({
          next: data => {
            if (data.count > 0) {
              this.formControls.dictumKey.enable();
            }
          },
          error: () => {},
        });
      }
    }
  }

  setUniqueKeyData(key: ITransferingLevelView, full?: boolean) {
    if (key.transfereeNum != null)
      this.docRegisterService.getTransferent(key.transfereeNum).subscribe({
        next: data => {
          this.formControls.endTransferNumber.setValue(data);
        },
        error: () => {},
      });
    if (key.stationNum != null) {
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
        this.docRegisterService.getCity(key.cityNum).subscribe({
          next: data => {
            this.formControls.cityNumber.setValue(data);
          },
          error: () => {},
        });
      }
      if (key.federalEntityCve != null) {
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

  openSatChat() {
    //TODO: adaptar PUP_ACLARA_CHAT
    this.onLoadToast(
      'info',
      'Chat no disponible',
      'El chat para consultar con el SAT no se encuentra disponible.'
    );
  }

  sendToDocumentsManagement() {
    // TODO: mandar parametros
    let dictumId: number;
    if (this.formControls.dictumKey.value?.id) {
      dictumId = this.formControls.dictumKey.value.id;
      if ([24, 26].includes(dictumId)) {
        this.openSatChat();
        return;
      }
    }
    const params = new FilterParams();
    params.addFilter('dictum', this.formControls.dictumKey.value?.id);
    params.addFilter('code', this.formControls.affairKey.value?.id);
    params.addFilter('flyerType', this.formControls.wheelType.value);
    this.fileUpdateService.getDictumSubjects(params.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          const catalog = data.data[0];
          if (catalog.g_of == 'S') {
            params.removeAllFilters();
            params.addFilter(
              'flyerNumber',
              this.formControls.wheelNumber.value
            );
            this.fileUpdateService
              .getJobManagements(params.getParams())
              .subscribe({
                next: data => {
                  if (data.count > 0) {
                    this.goToDocumentsManagement(catalog);
                  } else {
                    if (dictumId == 1) {
                      params.removeAllFilters();
                      params.addFilter(
                        'fileNumber',
                        this.formControls.expedientNumber.value
                      );
                      params.addFilter('status', 'ROP');
                      this.docRegisterService
                        .getGoods(params.getParams())
                        .subscribe({
                          next: data => {
                            if (data.count > 0) {
                              this.goToDocumentsManagement(catalog);
                            } else {
                              this.alert(
                                'warning',
                                'No se encontraron bienes',
                                'Este volante no tiene bienes para Desahogar.'
                              );
                            }
                          },
                          error: () => {
                            this.alert(
                              'warning',
                              'No se encontraron bienes',
                              'Este volante no tiene bienes para Desahogar.'
                            );
                          },
                        });
                    } else {
                      this.goToDocumentsManagement(catalog);
                    }
                  }
                },
                error: err => {
                  console.log(err);
                },
              });
          } else {
            this.alert(
              'warning',
              'Asunto y Dictamen inválidos',
              'De acuerdo al Asunto y Dictamen NO puede generar un Oficio Gestión.'
            );
          }
        } else {
          this.onLoadToast(
            'warning',
            'Catálogo no encontrado',
            'Este asunto con este dictamen no esta registrado en el catálogo de Asuntos - Dictamen'
          );
        }
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'warning',
          'Catálogo no encontrado',
          'Hubo un problema al buscar el asunto con ese dictamen'
        );
      },
    });
  }

  goToDocumentsManagement(catalog: IRAsuntDic) {
    this.fileUpdateService.juridicalFileDataUpdateForm =
      this.fileDataUpdateForm.value;
    let sale: string = '',
      officeType: string = '';
    if (catalog.property == 'S') {
      sale = 'C';
    } else if (catalog.property == 'N') {
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
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/related-document-management/1'
    );
  }

  sendToJuridicalRuling() {
    let dictumType: string;
    const dictumId = Number(this.formControls.dictumKey.value?.id);
    if (dictumId == 18 && !this.dictumPermission) {
      this.onLoadToast(
        'warning',
        'No cuenta con los permisos necesarios',
        'No tiene privilegios para entrar a los Dictamenes de Resarcimiento.'
      );
      return;
    }
    if ([1, 16, 23].includes(dictumId)) dictumType = 'PROCEDENCIA';
    if (dictumId == 15) dictumType = 'DESTRUCCION';
    if (dictumId == 2) dictumType = 'DECOMISO';
    if (dictumId == 22) dictumType = 'EXT_DOM';
    if ([3, 19].includes(dictumId)) dictumType = 'DEVOLUCION';
    if (dictumId == 17) dictumType = 'TRANSFERENTE';
    if (dictumId == 18) dictumType = 'RESARCIMIENTO';
    if (dictumId == 20) dictumType = 'ABANDONO';
    if (dictumId == 24) dictumType = 'ACLARA';
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
      // this.dictConsultOnly = 'N';
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
    // const params = {
    //   expediente: 791477,
    //   volante: 1558180,
    //   tipoVo: 'P',
    //   tipoDic: 'PROCEDENCIA',
    //   consulta: 'N',
    //   pGestOk: 1,
    //   pNoTramite: 1044141,
    // };
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/juridical-dictums'
    );
  }

  openToShiftChange() {
    // this.fileUpdateService.juridicalFileDataUpdateForm =
    //   this.fileDataUpdateForm.value;
    this.fileUpdComService.juridicalShiftChangeParams = {
      iden: this.formControls.wheelNumber.value,
      exp: this.formControls.expedientNumber.value,
      pNoTramite: this.procedureId,
    };
    this.router.navigate(['/pages/juridical/file-data-update/shift-change'], {
      queryParams: { origin: this.layout },
    });
  }

  sendToRelatedDocumentsManagement() {
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
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/related-document-management/2'
    );
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
      next: data => {
        console.log(data);
        this.getDocumentsByFlyer(this.formControls.wheelNumber.value);
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

  changeWheelType(type: string) {
    this.formControls.affairKey.setValue(null);
    this.formControls.endTransferNumber.setValue(null);
    this.getTransferors({ page: 1, text: '' });
    if (['A', 'P'].includes(type)) {
      this.initialCondition = 'A';
    } else if (['AT', 'T'].includes(type)) {
      this.initialCondition = type;
    }
  }

  changeDictum(dictum: IOpinion) {
    console.log(dictum);
    this.dictum = dictum.description;
    this.dictOffice = dictum.dict_ofi;
    if (this.dictum == 'CONOCIMIENTO') {
      this.formControls.reserved.enable();
    } else {
      this.formControls.reserved.disable();
    }
    if (
      this.prevDictumKey != null &&
      [16, 24, 26, '16', '24', '26'].includes(this.prevDictumKey?.id)
    ) {
      const param = new FilterParams();
      param.addFilter('wheelNumber', this.formControls.wheelNumber.value);
      param.addFilter('dictumKey', this.prevDictumKey?.description);
      this.fileUpdateService.getNotification(param.getParams()).subscribe({
        next: data => {
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
    if (event?.id) {
      this.formControls.transference.setValue(event.id);
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
      console.log(document);
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
      next: data => {
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
      next: data => {
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
      next: data => {
        this.federalEntities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.federalEntities = new DefaultSelect();
      },
    });
  }

  getTransferors(lparams: ListParams) {
    const body = {
      active: ['1', '2'],
      nameTransferent: lparams.text,
    };
    this.transferorLoading = true;
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
    if (this.formControls.endTransferNumber.value != null)
      params.addFilter(
        'idTransferer',
        this.formControls.endTransferNumber.value.id
      );
    if (this.formControls.stationNumber.value != null)
      params.addFilter('idStation', this.formControls.stationNumber.value.id);
    this.docRegisterService.getAuthorities(params.getParams()).subscribe({
      next: data => {
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
      next: data => {
        this.institutions = new DefaultSelect(data.data, data.count);
      },
      error: err => {
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
      next: data => {
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
      next: data => {
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
    if (lparams?.text.length > 0)
      params.addFilter('name', lparams.text, SearchFilter.LIKE);
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

  getAffairs(params: ListParams) {
    this.fileUpdateService.getAffairs(params).subscribe({
      next: data => {
        this.affairs = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.affairs = new DefaultSelect();
      },
    });
  }

  getDictums(params: ListParams) {
    this.fileUpdateService.getDictums(params).subscribe({
      next: data => {
        this.dictums = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.dictums = new DefaultSelect();
      },
    });
  }
}
