import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestLotParam } from 'src/app/core/models/requests/request-lot-params.model';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-new-and-update',
  templateUrl: './new-and-update.component.html',
  styles: [],
})
export class NewAndUpdateComponent extends BasePage implements OnInit {
  title: string = 'Parámetro por Lote';
  edit: boolean = false;

  form: ModelForm<IRequestLotParam>;
  data: any;
  events = new DefaultSelect();

  requestLotParam: IRequestLotParam;

  validNew: any;
  validEdit: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lotparamsService: LotParamsService,
    private lotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    console.log('Registro al iniciar', this.requestLotParam);
    console.log('Nuevo', this.validNew);
    console.log('Edición', this.validEdit);
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      publicLot: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      idLot: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      specialGuarantee: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
    });
    if (this.requestLotParam != null) {
      this.edit = true;
      if (this.validNew === true) {
        this.edit = false;
        this.requestLotParam.specialGuarantee = null;
        this.form.patchValue(this.requestLotParam);
        this.form.get('idEvent')?.disable();
        this.form.get('publicLot')?.disable();
        this.form.get('idLot')?.disable();
      }
      this.form.patchValue(this.requestLotParam);
      this.form.get('idEvent')?.disable();
      this.form.get('publicLot')?.disable();
      this.form.get('idLot')?.disable();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    const requestBody: any = {
      idLot: this.requestLotParam.idLot,
      idEvent: this.requestLotParam.idEvent,
      publicLot: this.requestLotParam.publicLot,
      specialGuarantee: this.form.value.specialGuarantee,
      nbOrigin: null,
    };

    this.lotparamsService
      .update(this.requestLotParam.idLot, requestBody)
      .subscribe({
        next: resp => {
          this.handleSuccess();
          this.close();
        },
        error: err => {
          this.handleError();
        },
      });
  }

  create() {
    const requestBody: any = {
      idLot: null,
      idEvent: this.requestLotParam.idEvent,
      publicLot: this.requestLotParam.publicLot,
      specialGuarantee: this.form.value.specialGuarantee,
      nbOrigin: null,
    };

    this.lotparamsService.createLotParameter(requestBody).subscribe({
      next: resp => {
        this.handleSuccess();
        this.close();
      },
      error: err => {
        this.handleError();
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Registro ${message} Correctamente`, this.title);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el Registro`, this.title);
    this.loading = false;
  }

  getEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('idEvent', lparams.text, SearchFilter.EQ);

    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        this.events = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.events = new DefaultSelect();
      },
    });
  }
}
