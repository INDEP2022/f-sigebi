import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
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
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
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
  };
  initialCondition: string = 'T';
  procedureStatus: ProcedureStatus = ProcedureStatus.pending;
  initialDate: Date = new Date();
  maxDate: Date = new Date();
  taxpayerLabel: TaxpayerLabel = TaxpayerLabel.Taxpayer;
  // transfers = new DefaultSelect();
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
  users = new DefaultSelect<IUser>();
  usersCopy = new DefaultSelect<IUser>();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
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
    private identifierService: IdentifierService
  ) {
    super();
  }

  private get formControls() {
    return this.documentsReceptionForm.controls;
  }

  get wheelNumber() {
    return this.documentsReceptionForm.controls['wheelNumber'];
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

  get delegationNumber() {
    return this.documentsReceptionForm.controls['delegationNumber'];
  }

  get subDelegationNumber() {
    return this.documentsReceptionForm.controls['subDelegationNumber'];
  }

  get userRecipient() {
    return this.flyerCopyRecipientForm.controls['copyuser'];
  }

  get userCpp() {
    return this.flyerCopyRecipientForm.controls['copyuser'];
  }

  ngOnInit(): void {
    // ! descomentar esta linea para mostrar el modal al page
    // this.selectFlyer();
    this.onFormChanges();
    this.setDefaultValues();
    this.initSelectElements();
    // TODO: Deshabilitar usuarios si el estatus es enviado
  }

  initSelectElements() {
    this.getIdentifiers({ page: 1, text: '' });
    this.getSubjects({ inicio: 1, text: '' });
    this.getTransferors({ inicio: 1, text: '' });
    this.getCities({ inicio: 1, text: '' });
    this.getFederalEntities({ inicio: 1, text: '' });
    this.getStations({ page: 1, text: '' });
    this.getAuthorities({ page: 1, text: '' });
    this.getPublicMinistries({ page: 1, text: '' });
    this.getCrimes({ inicio: 1, text: '' });
    this.getCourts({ inicio: 1, text: '' });
    this.getDefendants({ inicio: 1, text: '' });
    this.getReceptionWays({ inicio: 1, text: '' });
    this.getManagementAreas({ page: 1, text: '' });
    this.getUsers({ page: 1, text: '' });
    this.getUsersCopy({ page: 1, text: '' });
  }

  setDefaultValues() {
    const day = this.initialDate.getDate();
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const initialDate = `${day}/${month}/${year}`;
    this.formControls.receiptDate.setValue(initialDate);
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
  }

  wheelTypeChange(type: string) {
    this.affairKey.setValue(null);
    this.formControls.affair.setValue(null);
    if (type === 'T' || type === 'AT') {
      // this.formControls.identifier.setValue('TRANS');
      // TODO: Deshabilitar o habilitar controles acorde al tipo
    }
    if (type === 'T') this.taxpayerLabel = TaxpayerLabel.Taxpayer;
    if (type === 'AT') this.taxpayerLabel = TaxpayerLabel.Defendant;
  }

  destinationAreaChange(area: string) {
    //TODO: Validar si cambia el area que el usuario en atencion este asignado a ella
    // con el endpoint seg_acceso_x_areas. Query en el trigger POST-CHANGE de NO_DEPTO_DESTINO
  }

  affairChange(affair: string) {
    //TODO: Obtener si tiene relacion con bien para habilitar captura de bienes
    //TODO: Validaciones especiales par asunto 21, 22 y 34
  }

  cityChange(city: ICity) {
    this.dynamicTablesService
      .getTvalTable1ByTableKey(1, { inicio: 1, text: city.state.descCondition })
      .subscribe({
        next: data => this.entFedKey.setValue(data.data[0]),
      });
    // this.entFedKey.setValue(city.state.descCondition);
    this.getPublicMinistries({ page: 1, text: '' });
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
      receiptDate: notif.receiptDate,
      priority: notif.priority,
      wheelNumber: notif.wheelNumber,
      consecutiveNumber: notif.consecutiveNumber,
      expedientNumber: notif.expedientNumber,
      dailyEviction: notif.dailyEviction,
      addressGeneral: notif.addressGeneral,
      circumstantialRecord: notif.circumstantialRecord,
      preliminaryInquiry: notif.preliminaryInquiry,
      criminalCase: notif.criminalCase,
      protectionKey: notif.protectionKey,
      touchPenaltyKey: notif.touchPenaltyKey,
      officeExternalKey: notif.officeExternalKey,
      externalOfficeDate: notif.externalOfficeDate,
      observations: notif.observations,
      expedientTransferenceNumber: notif.expedientTransferenceNumber,
      transference: notif.transference,
      institutionNumber: notif.institutionNumber.id,
      officeNumber: notif.officeNumber,
      captureDate: notif.captureDate,
      wheelStatus: notif.wheelStatus,
    };
    this.documentsReceptionForm.patchValue({ ...values });
    if (notif.wheelType != null)
      this.formControls.wheelType.setValue(notif.wheelType);
    this.initialCondition = notif.wheelType;
    if (notif.identifier != null)
      this.identifierService.getById(notif.identifier).subscribe({
        next: data => this.formControls.identifier.setValue(data),
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
          next: data => this.formControls.entFedKey.setValue(data.data),
        });
    }
    if (notif.endTransferNumber != null)
      this.transferentService.getById(notif.endTransferNumber).subscribe({
        next: data => this.formControls.endTransferNumber.setValue(data),
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
    if (notif.minpubNumber != null)
      this.minpubService.getById(notif.minpubNumber).subscribe({
        next: data => this.formControls.minpubNumber.setValue(data),
      });
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
    if (notif.delegationNumber != null) {
      this.formControls.delegationNumber.setValue(notif.delegationNumber);
      if (notif.delegation != null) {
        this.formControls.delegationName.setValue(notif.delegation.description);
      } else {
        this.delegationService
          .getById(notif.delegationNumber)
          .subscribe(data =>
            this.formControls.delegationName.setValue(data.description)
          );
      }
    }
    if (notif.subDelegationNumber != null) {
      this.formControls.subDelegationNumber.setValue(notif.subDelegationNumber);
      if (notif.subDelegation != null) {
        this.formControls.subDelegationName.setValue(
          notif.subDelegation.description
        );
      } else {
        this.subdelegationService
          .getById(notif.subDelegationNumber)
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
    // TODO: agregar busqueda de estatus_tramite de interfaceSat
    console.log(this.documentsReceptionForm.value);
  }

  selectFlyer() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        // TODO: Deberia recibir todos los datos para que el formulario sea llenado
        callback: (next: INotification) => {
          if (next) this.fillForm(next); // TODO: LLenar el formulario
        },
      },
    };
    this.modalService.show(DocumentsReceptionFlyerSelectComponent, modalConfig);
  }

  sendFlyer() {
    this.procedureStatus = ProcedureStatus.sent;
    this.userRecipient.disable();
    this.userCpp.disable();
  }

  viewDocuments() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  chooseOther() {
    this.selectFlyer();
  }

  save() {}

  captureGoods() {}

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
    //TODO: Agregar filtro por tipo de volante o proceso, campo referralNoteType y
    // cargar datos en modal tabla con la relacion al bien
    this.affairService.getAll(params).subscribe({
      next: data => {
        this.subjects = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.handleSelectErrors(err);
      },
    });
  }

  getIdentifiers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    if (this.wheelType.value != null)
      params.addFilter('keyview', this.wheelType.value);
    this.docRegisterService.getIdentifiers(params.getParams()).subscribe({
      next: data => {
        this.identifiers = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getFederalEntities(params: ListParams) {
    let elements$ = this.getDynamicTables(1, params);
    elements$.subscribe({
      next: data => {
        this.federalEntities = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getReceptionWays(params: ListParams) {
    let elements$ = this.getDynamicTables(9, params);
    elements$.subscribe({
      next: data => {
        this.receptionWays = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getCrimes(params: ListParams) {
    let elements$ = this.getDynamicTables(2, params);
    elements$.subscribe({
      next: data => {
        this.crimes = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getDynamicTables(
    id: number | string,
    params: ListParams
  ): Observable<IListResponse<TvalTable1Data>> {
    return this.dynamicTablesService.getTvalTable1ByTableKey(id, params);
  }

  getTransferors(lparams: ListParams) {
    //TODO: aplicar filterparams para nameTransferent y active (not: 1,2 or null)
    this.transferentService.getAll(lparams).subscribe({
      next: data => {
        this.transferors = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
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
      error: err => this.handleSelectErrors(err),
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
      error: err => this.handleSelectErrors(err),
    });
  }

  getPublicMinistries(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    if (this.cityNumber.value != null)
      params.addFilter('idCity', this.cityNumber.value.idCity);
    if (this.delegationNumber.value != null)
      params.addFilter('noDelegation', this.delegationNumber.value);
    if (this.subDelegationNumber.value != null)
      params.addFilter('noSubDelegation', this.subDelegationNumber.value);
    // console.log(params.getParams());
    this.docRegisterService.getPublicMinistries(params.getParams()).subscribe({
      next: data => {
        this.publicMinistries = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  changeTransferor(event: ITransferente) {
    this.formControls.transference.setValue(event.id);
  }

  getCourts(lparams: ListParams) {
    this.courtService.getAll(lparams).subscribe({
      next: data => {
        this.courts = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getDefendants(lparams: ListParams) {
    this.defendantService.getAll(lparams).subscribe({
      next: data => {
        this.defendants = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getCities(lparams: ListParams) {
    this.cityService.getAll(lparams).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getManagementAreas(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    this.docRegisterService.getManagementAreas(params.getParams()).subscribe({
      next: data => {
        this.managementAreas = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getUsers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    if (this.delegationNumber.value != null)
      params.addFilter('delegationNumber', this.delegationNumber.value);
    if (this.subDelegationNumber.value != null)
      params.addFilter('subdelegationNumber', this.subDelegationNumber.value);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        this.users = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
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
      error: err => this.handleSelectErrors(err),
    });
  }

  checkDesalojo(event: any) {
    console.log(
      event,
      this.documentsReceptionForm.controls['dailyEviction'].value
    );
  }

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

  // openModalSelect(context?: Partial<DocumentsReceptionSelectComponent>) {
  //   const modalRef = this.modalService.show(DocumentsReceptionSelectComponent, {
  //     initialState: { ...context },
  //     class: 'modal-lg modal-dialog-centered',
  //     ignoreBackdropClick: true,
  //   });
  //   modalRef.content.onSelect.subscribe(data => {
  //     if (data) this.selectArea(data);
  //   });
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

  selectArea(areaData: IDepartment, self: DocumentsReceptionRegisterComponent) {
    const delegation = areaData.numDelegation as IDelegation;
    const subdelegation = areaData.numSubDelegation as ISubdelegation;
    self.formControls.departamentDestinyNumber.setValue(areaData.id);
    self.formControls.destinationArea.setValue(areaData.description);
    self.formControls.delegationNumber.setValue(delegation.id);
    self.formControls.delegationName.setValue(delegation.description);
    self.formControls.subDelegationNumber.setValue(subdelegation.id);
    self.formControls.subDelegationName.setValue(subdelegation.description);
    self.getPublicMinistries({ page: 1, text: '' });
    self.getUsers({ page: 1, text: '' });
  }

  selectAffair(affair: IAffair, self: DocumentsReceptionRegisterComponent) {
    // TODO: Establecer relacion bien
    self.formControls.affairKey.setValue(affair.id);
    self.formControls.affair.setValue(affair.description);
  }

  clearCityState() {
    this.formControls.cityNumber.setValue(null);
    this.formControls.entFedKey.setValue(null);
    this.getPublicMinistries({ page: 1, text: '' });
  }
}
