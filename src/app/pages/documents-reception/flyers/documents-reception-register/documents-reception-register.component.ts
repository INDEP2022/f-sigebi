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
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TvalTable1Data } from '../../../../core/models/catalogs/dinamic-tables.model';
import { DynamicTablesService } from '../../../../core/services/dynamic-catalogs/dynamic-tables.service';
import { DocumentsReceptionFlyerSelectComponent } from './components/documents-reception-flyer-select/documents-reception-flyer-select.component';
import { DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS } from './constants/documents-reception-register-default-values';
import {
  DocuentsReceptionRegisterFormChanges,
  DOCUMENTS_RECEPTION_REGISTER_FORM,
  DOC_RECEPT_REG_FIELDS_TO_LISTEN,
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
  };
  transfers = new DefaultSelect();
  identifiers = new DefaultSelect(
    DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS,
    3
  );
  subjects = new DefaultSelect<IAffair>();
  federalEtities = new DefaultSelect<TvalTable1Data>();
  transferors = new DefaultSelect<ITransferente>();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private affairService: AffairService,
    private notificationService: NotificationService,
    private dynamicTablesService: DynamicTablesService,
    private transferentService: TransferenteService
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

  ngOnInit(): void {
    // ! descomentar esta linea para mostrar el modal al inicio
    // this.selectFlyer();
    this.onFormChanges();
    this.initSelectElements();
  }

  initSelectElements() {
    this.getSubjects({ inicio: 1, text: '' });
    this.getTransferors({ inicio: 1, text: '' });
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
}
