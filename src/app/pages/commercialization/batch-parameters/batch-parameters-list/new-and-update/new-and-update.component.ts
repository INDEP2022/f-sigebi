import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
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

  form: ModelForm<any>;
  data: any;
  events = new DefaultSelect();
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
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      lotePublico: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      idLot: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      garantia: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
    });
    if (this.data != null) {
      this.edit = true;
      this.form.patchValue({
        idEvent: this.data.idEvent,
        lotePublico: this.data.publicLot,
        garantia: this.data.specialGuarantee,
        idLot: this.data.idLot,
      });
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
      idLot: this.data.idLot,
      idEvent: Number(this.form.value.idEvent),
      publicLot: Number(this.form.value.lotePublico),
      specialGuarantee: Number(this.form.value.garantia),
      nbOrigin: null,
    };

    this.lotparamsService.update(this.data.idLot, requestBody).subscribe({
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
      idLot: Number(this.form.value.idLot),
      idEvent: Number(this.form.value.idEvent),
      publicLot: Number(this.form.value.lotePublico),
      specialGuarantee: Number(this.form.value.garantia),
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
