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
import { SelectListFilteredModalComponent } from '../../../../../@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import {
  baseMenu,
  routesJuridicalProcesses,
} from '../../../../../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import {
  FilterParams,
  ListParams,
} from '../../../../../common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from '../../../../../common/services/show-hide-error-interceptor.service';
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
import { IStation } from '../../../../../core/models/catalogs/station.model';
import {
  ITransferente,
  ITransferingLevelView,
} from '../../../../../core/models/catalogs/transferente.model';
import {
  IInstitutionNumber,
  INotification,
} from '../../../../../core/models/ms-notification/notification.model';
import { IManagementArea } from '../../../../../core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { DocReceptionRegisterService } from '../../../../../core/services/document-reception/doc-reception-register.service';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { IGlobalVars } from '../../../../../shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from '../../../../../shared/global-vars/services/global-vars.service';
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
    `,
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
  canViewDocuments = false;
  transferorLoading: boolean = false;
  stationLoading: boolean = false;
  dictum: string = '';
  procedureId: number;
  initialDate: string;
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
  @Input() layout: 'FILE-UPDATE' | 'ABANDONMENT';
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
    private showHideErrorInterceptorService: showHideErrorInterceptorService
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

  ngOnInit(): void {
    this.showHideErrorInterceptorService.showHideError(false);
    this.formControls.receiptDate.setValue(this.initialDate);
    this.checkParams();
    this.fileDataUpdateForm.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchMode'].currentValue) {
      this.activateSearch();
    } else {
      this.deactivateSearch();
    }
    if (changes['confirmSearch'].currentValue) {
      this.onSearch.emit(this.fileDataUpdateForm.value);
      this.deactivateSearch();
    } else {
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
  }

  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globals = globalVars;
        console.log(this.globals);
      });
  }

  getData() {
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
              this.onLoadToast(
                'warning',
                'Datos no encontrados',
                'No se encontró la información del volante'
              );
            }
          },
          error: () => {
            this.onLoadToast(
              'warning',
              'Datos no encontrados',
              'No se encontró la información del volante'
            );
          },
        });
      },
      error: () => {
        this.onLoadToast(
          'warning',
          'Datos no encontrados',
          'No se encontró la información del volante'
        );
      },
    });
  }

  fillForm(notif: INotification) {
    this.fileDataUpdateForm.reset();
    const filterParams = new FilterParams();
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
    this.formControls.receiptDate.setValue(format(new Date(), 'MM/d/yyyy'));
    this.formControls.externalOfficeDate.setValue(
      format(new Date(), 'MM/d/yyyy')
    );
    if (notif.wheelType != null)
      this.formControls.wheelType.setValue(notif.wheelType);
    this.initialCondition = notif.wheelType;
    this.fileUpdateService.getAffair(notif.affairKey).subscribe({
      next: data => {
        this.formControls.affairKey.setValue(data);
      },
      error: () => {},
    });
    if (notif.cityNumber != null)
      this.docRegisterService.getCity(notif.cityNumber).subscribe({
        next: data => this.formControls.cityNumber.setValue(data),
      });
    if (notif.entFedKey != null) {
      this.docRegisterService.getByTableKeyOtKey(1, notif.entFedKey).subscribe({
        next: data => {
          this.formControls.entFedKey.setValue(data.data);
        },
      });
    }
    if (notif.endTransferNumber != null)
      this.docRegisterService
        .getTransferent(notif.endTransferNumber)
        .subscribe({
          next: data => {
            this.formControls.endTransferNumber.setValue(data);
          },
        });
    if (notif.courtNumber != null)
      this.docRegisterService.getCourt(notif.courtNumber).subscribe({
        next: data => this.formControls.courtNumber.setValue(data),
      });
    if (notif.stationNumber != null)
      this.docRegisterService.getStation(notif.stationNumber).subscribe({
        next: data => this.formControls.stationNumber.setValue(data),
      });
    if (notif.autorityNumber != null) {
      filterParams.addFilter('idAuthority', notif.autorityNumber);
      this.docRegisterService
        .getAuthoritiesFilter(filterParams.getParams())
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.formControls.autorityNumber.setValue(data.data[0]);
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
            this.formControls.uniqueKey.setValue(data.data[0]);
          }
        },
        error: () => {},
      });
    if (notif.minpubNumber != null) {
      const minpub = notif.minpubNumber as IMinpub;
      this.docRegisterService.getMinPub(minpub.id).subscribe({
        next: data => this.formControls.minpubNumber.setValue(data),
      });
    }
    if (notif.crimeKey != null)
      this.docRegisterService.getByTableKeyOtKey(2, notif.crimeKey).subscribe({
        next: data => this.formControls.crimeKey.setValue(data.data),
      });
    if (notif.indiciadoNumber != null)
      this.docRegisterService.getDefendant(notif.indiciadoNumber).subscribe({
        next: data => this.formControls.indiciadoNumber.setValue(data),
      });
    if (notif.viaKey != null)
      this.docRegisterService.getByTableKeyOtKey(9, notif.viaKey).subscribe({
        next: data => this.formControls.viaKey.setValue(data.data),
      });
    if (notif.institutionNumber != null) {
      const institution = notif.institutionNumber as IInstitutionNumber;
      this.fileUpdateService.getInstitution(institution.id).subscribe({
        next: data => {
          this.formControls.institutionNumber.setValue(data);
        },
        error: () => {},
      });
    }
    if (notif.dictumKey != null) {
      this.fileUpdateService.getDictum(notif.dictumKey).subscribe({
        next: data => {
          this.formControls.dictumKey.setValue(data);
          this.dictum = data.description;
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
        }
      },
      error: () => {},
    });
    if (notif.delDestinyNumber != null) {
      this.formControls.delDestinyNumber.setValue(notif.delDestinyNumber);
      if (notif.delegation != null) {
        this.formControls.delegationName.setValue(notif.delegation.description);
      } else {
        this.fileUpdateService
          .getDelegation(notif.delDestinyNumber)
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
        this.fileUpdateService
          .getSubDelegation(notif.subDelDestinyNumber)
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
        this.docRegisterService.getPhaseEdo().subscribe({
          next: data => {
            filterParams.removeAllFilters();
            filterParams.addFilter('id', notif.departamentDestinyNumber);
            filterParams.addFilter('numDelegation', notif.delDestinyNumber);
            filterParams.addFilter(
              'numSubDelegation',
              notif.subDelDestinyNumber
            );
            filterParams.addFilter('phaseEdo', data.stagecreated);
            this.docRegisterService
              .getDepartamentsFiltered(filterParams.getParams())
              .subscribe(data =>
                this.formControls.destinationArea.setValue(
                  data.data[0].description
                )
              );
          },
          error: () => {},
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
                  this.formControls.userRecipient.setValue(
                    data.data[0].userDetail.name
                  );
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
    this.fileDataUpdateForm.enable();
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
  }

  deactivateSearch() {
    console.log(this.searchMode);
    console.log(this.confirmSearch);
  }

  setUniqueKeyData(key: ITransferingLevelView, full?: boolean) {
    // if (key.transfereeNum != null)
    //   this.docRegisterService.getTransferent(key.transfereeNum).subscribe({
    //     next: data => {
    //       this.formControls.endTransferNumber.setValue(data);
    //       this.updateGlobalVars('noTransferente', data.id);
    //     },
    //     error: () => {},
    //   });
    // if (key.stationNum != null)
    //   this.docRegisterService.getStation(key.stationNum).subscribe({
    //     next: data => this.formControls.stationNumber.setValue(data),
    //     error: () => {},
    //   });
    // if (key.authorityNum != null) {
    //   const param = new FilterParams();
    //   param.addFilter('idAuthority', key.authorityNum);
    //   this.docRegisterService
    //     .getAuthoritiesFilter(param.getParams())
    //     .subscribe({
    //       next: data => {
    //         if (data.count > 0) {
    //           this.formControls.autorityNumber.setValue(data.data[0]);
    //         }
    //       },
    //       error: () => {},
    //     });
    // }
    // if (full) {
    //   if (key.cityNum != null) {
    //     this.docRegisterService.getCity(key.cityNum).subscribe({
    //       next: data => {
    //         this.formControls.cityNumber.setValue(data);
    //       },
    //       error: () => {},
    //     });
    //   }
    //   if (key.federalEntityCve != null) {
    //     this.docRegisterService
    //       .getByTableKeyOtKey(1, key.federalEntityCve)
    //       .subscribe({
    //         next: data => {
    //           this.formControls.entFedKey.setValue(data.data);
    //         },
    //         error: () => {},
    //       });
    //   }
    // }
  }

  sentToDocumentsManagement() {
    // TODO: mandar parametros
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
    this.fileUpdComService.juridicalDocumentManagementParams = {
      expediente: this.formControls.expedientNumber.value,
      volante: this.formControls.wheelNumber.value,
      pDictamen: this.formControls.dictumKey.value?.id,
      pGestOk: this.pageParams.pGestOk,
      pNoTramite: procedure,
      tipoOf: 'INTERNO',
      bien: 'S',
      sale: 'D',
      doc: '',
    };
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/related-document-management'
    );
  }

  sentToJuridicalRuling() {
    let dictumType: string;
    const dictumId = Number(this.formControls.dictumKey.value?.id);
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
    //TODO: Asignar parametro consulta de acuerdo a permisos del usuario en la pantalla
    this.fileUpdComService.juridicalRulingParams = {
      expediente: this.formControls.expedientNumber.value,
      volante: this.formControls.wheelNumber.value,
      tipoVo: this.formControls.wheelType.value,
      tipoDic: dictumType,
      consulta: 'S',
      pGestOk: this.pageParams.pGestOk,
      pNoTramite: procedure,
    };
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/juridical-dictums'
    );
  }

  sentToShiftChange() {
    // TODO: mandar parametros
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
      '/pages/documents-reception/flyers-registration/shift-change'
    );
  }

  sendToRelatedDocumentsManagement() {
    // TODO: mandar parametros
    this.router.navigateByUrl(
      '/pages/documents-reception/flyers-registration/related-document-management'
    );
  }

  openFlyerCopies() {
    //
  }

  viewDocuments() {
    // TODO: ajustar busqueda de documentos
    // const params = new FilterParams();
    // params.addFilter('flyerNumber', this.wheelNumber.value);
    // params.addFilter('scanStatus', 'ESCANEADO');
    // this.documentsService.getAllFilter(params.getParams()).subscribe({
    //   next: data => {
    //     console.log(data);
    //     const documents = data.data;
    //     if (data.count == 1) {
    //       if (documents[0].associateUniversalFolio) {
    //         this.onLoadToast(
    //           'info',
    //           'Enlace no disponible',
    //           'El enlace al documento no se encuentra disponible'
    //         );
    //       } else {
    //         this.onLoadToast(
    //           'info',
    //           'No disponible',
    //           'No tiene documentos digitalizados.'
    //         );
    //       }
    //     } else if (data.count > 1) {
    //       this.openModalDocuments();
    //     } else {
    //       this.onLoadToast(
    //         'info',
    //         'No disponible',
    //         'No tiene documentos digitalizados.'
    //       );
    //     }
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.onLoadToast(
    //       'info',
    //       'No disponible',
    //       'No se encontraron documentos asociados.'
    //     );
    //   },
    // });
  }

  changeTransferor(event: ITransferente) {
    if (event?.id) {
      this.formControls.transference.setValue(event.id);
      // this.updateGlobalVars('noTransferente', event.id);
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

  changeDictum(dictum: IOpinion) {
    this.dictum = dictum.description;
    if (this.dictum == 'CONOCIMIENTO') {
      this.formControls.reserved.enable();
    }
  }

  openModalDocuments() {
    // this.openModalSelect(
    //   {
    //     title: 'Folios Relacionados al Expediente',
    //     columnsType: { ...DOCUMENTS_RECEPTION_SELECT_DOCUMENTS_COLUMNS },
    //     service: this.docRegisterService,
    //     dataObservableFn: this.docRegisterService.getDocuments,
    //     filters: [
    //       {
    //         field: 'flyerNumber',
    //         value: this.wheelNumber.value,
    //       },
    //       {
    //         field: 'scanStatus',
    //         value: 'ESCANEADO',
    //       },
    //     ],
    //     selectOnClick: true,
    //   },
    //   this.selectDocument
    // );
  }

  // selectDocument(
  //   document: IDocuments,
  //   self: DocumentsReceptionRegisterComponent
  // ) {
  //   if (document) {
  //     console.log(document);
  //     self.documentMessage();
  //   }
  // }

  openModalAreas() {
    // this.openModalSelect(
    //   {
    //     title: 'Área',
    //     columnsType: { ...DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS },
    //     service: this.docRegisterService,
    //     dataObservableFn: this.docRegisterService.getDepartaments,
    //     searchFilter: { field: 'description', operator: SearchFilter.LIKE },
    //     selectOnClick: true,
    //   },
    //   this.selectArea
    // );
  }

  // selectArea(areaData: IDepartment, self: DocumentsReceptionRegisterComponent) {
  //   const delegation = areaData.delegation as IDelegation;
  //   const subdelegation = areaData.numSubDelegation as ISubdelegation;
  //   self.formControls.departamentDestinyNumber.setValue(areaData.id);
  //   self.formControls.destinationArea.setValue(areaData.description);
  //   self.formControls.delDestinyNumber.setValue(delegation.id);
  //   self.formControls.delegationName.setValue(delegation.description);
  //   self.formControls.subDelDestinyNumber.setValue(subdelegation.id);
  //   self.formControls.subDelegationName.setValue(subdelegation.description);
  //   self.getPublicMinistries({ page: 1, text: '' });
  //   self.getUsers({ page: 1, text: '' });
  // }

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
    // const param = new FilterParams();
    // param.addFilter('uniqueCve', Number(lparams.text));
    // this.docRegisterService.getUniqueKeyData(param.getParams()).subscribe({
    //   next: data => {
    //     this.uniqueKeys = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.users = new DefaultSelect();
    //   },
    // });
  }

  getCities(lparams: ListParams) {
    // this.docRegisterService.getCities(lparams).subscribe({
    //   next: data => {
    //     this.cities = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.cities = new DefaultSelect();
    //   },
    // });
  }

  // getDynamicTables(
  //   id: number | string,
  //   params: ListParams
  // ): Observable<IListResponse<TvalTable1Data>> {
  //   return this.docRegisterService.getDynamicTables(id, params);
  // }

  getFederalEntities(params: ListParams) {
    // let elements$ = this.getDynamicTables(1, params);
    // elements$.subscribe({
    //   next: data => {
    //     this.federalEntities = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.federalEntities = new DefaultSelect();
    //   },
    // });
  }

  getTransferors(lparams: ListParams) {
    // const body = {
    //   active: ['1', '2'],
    //   nameTransferent: lparams.text,
    // };
    // this.transferorLoading = true;
    // this.docRegisterService.getActiveTransferents(body).subscribe({
    //   next: data => {
    //     this.transferors = new DefaultSelect(data.data, data.count);
    //     this.transferorLoading = false;
    //   },
    //   error: () => {
    //     this.transferors = new DefaultSelect();
    //     this.transferorLoading = false;
    //   },
    // });
  }

  getStations(lparams: ListParams) {
    // const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    //   params.addFilter('stationName', lparams.text, SearchFilter.LIKE);
    // if (this.endTransferNumber.value != null)
    //   params.addFilter('idTransferent', this.endTransferNumber.value.id);
    // this.stationLoading = true;
    // this.docRegisterService.getStations(params.getParams()).subscribe({
    //   next: data => {
    //     this.stations = new DefaultSelect(data.data, data.count);
    //     this.stationLoading = false;
    //   },
    //   error: () => {
    //     this.stations = new DefaultSelect();
    //     this.stationLoading = false;
    //   },
    // });
  }

  getAuthorities(lparams: ListParams) {
    // const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    //   params.addFilter('authorityName', lparams.text, SearchFilter.LIKE);
    // if (this.endTransferNumber.value != null)
    //   params.addFilter('idTransferer', this.endTransferNumber.value.id);
    // if (this.stationNumber.value != null)
    //   params.addFilter('idStation', this.stationNumber.value.id);
    // this.docRegisterService.getAuthorities(params.getParams()).subscribe({
    //   next: data => {
    //     this.authorities = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.authorities = new DefaultSelect();
    //   },
    // });
  }

  getInstitutions(lparams: ListParams) {
    //
  }

  getPublicMinistries(lparams: ListParams) {
    // const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    //   params.addFilter('description', lparams.text, SearchFilter.LIKE);
    // //TODO: Filtros comentados para prubeas
    // // if (this.cityNumber.value != null)
    // //   params.addFilter('idCity', this.cityNumber.value.idCity);
    // // if (this.delDestinyNumber.value != null)
    // //   params.addFilter('noDelegation', this.delDestinyNumber.value);
    // // if (this.subDelDestinyNumber.value != null)
    // //   params.addFilter('noSubDelegation', this.subDelDestinyNumber.value);
    // this.docRegisterService.getPublicMinistries(params.getParams()).subscribe({
    //   next: data => {
    //     this.publicMinistries = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.publicMinistries = new DefaultSelect();
    //   },
    // });
  }

  getCrimes(params: ListParams) {
    // let elements$ = this.getDynamicTables(2, params);
    // elements$.subscribe({
    //   next: data => {
    //     this.crimes = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.crimes = new DefaultSelect();
    //   },
    // });
  }

  getCourts(lparams: ListParams) {
    // this.docRegisterService.getCourts(lparams).subscribe({
    //   next: data => {
    //     this.courts = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.courts = new DefaultSelect();
    //   },
    // });
  }

  getDefendants(lparams: ListParams) {
    // this.docRegisterService.getDefendants(lparams).subscribe({
    //   next: data => {
    //     this.defendants = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.defendants = new DefaultSelect();
    //   },
    // });
  }

  getReceptionWays(params: ListParams) {
    // let elements$ = this.getDynamicTables(9, params);
    // elements$.subscribe({
    //   next: data => {
    //     this.receptionWays = new DefaultSelect(data.data, data.count);
    //   },
    //   error: () => {
    //     this.receptionWays = new DefaultSelect();
    //   },
    // });
  }

  getAffairs(params: ListParams) {
    //
  }

  getDictums(params: ListParams) {
    this.fileUpdateService.getDictums(params).subscribe({
      next: data => {
        this.dictums = new DefaultSelect(data.data, data.count);
      },
      error: () => {},
    });
  }
}
