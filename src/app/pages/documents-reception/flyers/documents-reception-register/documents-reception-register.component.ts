import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, merge, takeUntil } from 'rxjs';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { TvalTable1Data } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsReceptionFlyerSelectComponent } from './components/documents-reception-flyer-select/documents-reception-flyer-select.component';
import { DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS } from './constants/documents-reception-register-default-values';
import {
  DocuentsReceptionRegisterFormChanges,
  DOCUMENTS_RECEPTION_REGISTER_FORM,
  DOC_RECEPT_REG_FIELDS_TO_LISTEN,
  TaxpayerLabel,
} from './interfaces/documets-reception-register-form';

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
  valuesChange: DocuentsReceptionRegisterFormChanges = {
    identifier: (value: string) => this.identifierChange(value),
    type: (value: string) => this.transferTypeChange(value),
    destinationArea: (value: string) => this.destinationAreaChange(value),
    subject: (value: string) => this.subjectChange(value),
  };
  transfers = new DefaultSelect();
  identifiers = new DefaultSelect(
    DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS,
    3
  );
  taxpayerLabel: TaxpayerLabel = TaxpayerLabel.Taxpayer;
  subjects = new DefaultSelect<IAffair>();
  federalEtities = new DefaultSelect<TvalTable1Data>();
  transferors = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authorities = new DefaultSelect<IAuthority>();
  courts = new DefaultSelect<ICourt>();
  defendants = new DefaultSelect<IIndiciados>();
  users = new DefaultSelect<IUser>();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private affairService: AffairService,
    private notificationService: NotificationService,
    private dynamicTablesService: DynamicTablesService,
    private transferentService: TransferenteService,
    private docRegisterService: DocReceptionRegisterService,
    private courtService: CourtService,
    private defendantService: IndiciadosService,
    private usersService: UsersService
  ) {
    super();
  }

  get procedureStatus() {
    return this.formControls.status;
  }

  private get formControls() {
    return this.documentsReceptionForm.controls;
  }

  get flyer() {
    return this.documentsReceptionForm.controls['flyer'];
  }

  get transmitter() {
    return this.documentsReceptionForm.controls['transmitter'];
  }

  get transfer() {
    return this.documentsReceptionForm.controls['transfer'];
  }

  ngOnInit(): void {
    // ! descomentar esta linea para mostrar el modal al inicio
    // this.selectFlyer();
    this.onFormChanges();
    this.initSelectElements();
  }

  initSelectElements() {
    this.getSubjects({ inicio: 1, text: '' });
    this.getTransferors({ inicio: 1, text: '' });
    this.getStations({ page: 1, text: '' });
    this.getAuthorities({ page: 1, text: '' });
    this.getCourts({ inicio: 1, text: '' });
    this.getDefendants({ inicio: 1, text: '' });
    this.getUsers({ inicio: 1, text: '' });
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
    if (!identifier) return;
    if (identifier.includes('4') || identifier === 'MIXTO')
      this.formControls.reception.disable();
    else this.formControls.reception.enable();
  }

  transferTypeChange(type: string) {
    if (type === 'T' || type === 'AT') {
      this.formControls.identifier.setValue('TRANS');
    }
    if (type === 'T') this.taxpayerLabel = TaxpayerLabel.Taxpayer;
    if (type === 'AT') this.taxpayerLabel = TaxpayerLabel.Defendant;
  }

  destinationAreaChange(area: string) {
    //TODO: Validar si cambia el area que el usuario en atencion este asignado a ella
    // con el endpoint seg_acceso_x_areas. Query en el trigger POST-CHANGE de NO_DEPTO_DESTINO
  }

  subjectChange(subject: string) {
    //TODO: Obtener si tiene relacion con bien para habilitar captura de bienes
    //TODO: Validaciones especiales par asunto 21, 22 y 34
  }

  fillForm(value: string | number) {
    this.documentsReceptionForm.reset();
    this.documentsReceptionForm.get('flyer').setValue(value);
  }

  selectFlyer() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        // TODO: Deberia recibir todos los datos para que el formulario sea llenado
        callback: (next: string | number) => {
          if (next) this.fillForm(next); // TODO: LLenar el formulario
        },
      },
    };
    this.modalService.show(DocumentsReceptionFlyerSelectComponent, modalConfig);
  }

  sendFlyer() {
    this.documentsReceptionForm.get('status').setValue('ENVIADO');
  }

  viewDocuments() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  chooseOther() {
    this.selectFlyer();
  }

  save() {}

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
      error: err => {
        this.handleSelectErrors(err);
      },
    });
  }

  getIdentifiers(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0) params.addFilter('identifier', lparams.text);
    //TODO: Flitro por volante (No se encontro el campo en el endpoint)
    this.notificationService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        this.identifiers = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  getDynamicTables(id: number | string, params: ListParams) {
    //TODO: llamar servicio con params
    this.dynamicTablesService.getTvalTable1ByTableKey(id).subscribe({
      next: data => {
        return { data: data.data, count: data.count };
      },
      error: err => this.handleSelectErrors(err),
    });
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
    if (lparams?.text.length > 0) params.addFilter('stationName', lparams.text);
    if (this.transfer.value != null)
      params.addFilter('idTransferent', this.transfer.value);
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
      params.addFilter('authorityName', lparams.text);
    if (this.transfer.value != null)
      params.addFilter('idTransferer', this.transfer.value);
    if (this.transmitter.value != null)
      params.addFilter('idStation', this.transmitter.value);
    this.docRegisterService.getAuthorities(params.getParams()).subscribe({
      next: data => {
        this.authorities = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  changeTransferor(event: ITransferente) {
    this.documentsReceptionForm.controls['transferDup'].setValue(event);
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

  getUsers(lparams: ListParams) {
    this.usersService.getAllSegUsers(lparams).subscribe({
      next: data => {
        this.users = new DefaultSelect(data.data, data.count);
      },
      error: err => this.handleSelectErrors(err),
    });
  }

  checkDesalojo(event: any) {
    console.log(event, this.documentsReceptionForm.controls['desalojov'].value);
  }
}
