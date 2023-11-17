import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerTpEvent } from 'src/app/core/models/ms-event/event-type.model';
import {
  IParameter,
  ITypeEvent,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-parameters-form',
  templateUrl: './parameters-form.component.html',
  styles: [],
})
export class ParametersFormComponent extends BasePage implements OnInit {
  title: string = 'parámetro del Módulo Comercialización';
  edit: boolean = false;
  form: ModelForm<IParameter>;
  parameter: IParameter;
  typeEvents = new DefaultSelect<IComerTpEvent>();
  parameters = new DefaultSelect<IParameters>();
  tipo = new DefaultSelect();
  addressList = new DefaultSelect<any>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterModService: ParameterModService,
    private comerTpEventosService: ComerTpEventosService,
    private parameterCatService: ParameterCatService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.addressList = new DefaultSelect([
      { value: 'I', description: 'Inmuebles' },
      { value: 'M', description: 'Muebles' },
      { value: 'C', description: 'Comercial' },
      { value: 'D', description: 'Conciliación' },
    ]);
    this.getTypeEvent(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      parameter: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      value: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(500),
        ],
      ],
      address: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(1),
        ],
      ],
      typeEventId: [
        null,
        [Validators.pattern(NUM_POSITIVE), Validators.max(999)],
      ],
    });

    if (this.parameter != null) {
      this.edit = true;
      console.log(this.parameter);
      this.form.patchValue(this.parameter);
      this.form.get('parameter').disable();
      this.form.get('value').disable();
      this.form.get('address').disable();
      this.getTypeEvent(new ListParams(), this.form.get('typeEventId').value);
    }

    /*if (!this.edit) {
      const iParam = document.getElementById('idP');
      this.render.removeClass(iParam, 'disabled');
    }*/
    this.getTypeEvent(new ListParams());
    this.getParameters(new ListParams());
  }

  getTypeEvent(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.comerTpEventosService.getAllComerTpEvent(params).subscribe({
      next: data => {
        console.log(data);
        this.typeEvents = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.typeEvents = new DefaultSelect();
      },
    });
  }

  getParameters(params: ListParams) {
    this.parameterCatService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.parameters = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.parameters = new DefaultSelect();
      },
    });
  }

  typeEventChange(typeEvent: ITypeEvent) {}

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.parameterModService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'ha sido actualizado'
      : 'ha sido guardado';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.alert('success', this.title, `El ${this.title} ${message}`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.parameterModService.updateNew(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
}
