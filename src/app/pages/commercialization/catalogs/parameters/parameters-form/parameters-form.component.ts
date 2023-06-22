import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IParameter,
  ITypeEvent,
} from 'src/app/core/models/ms-parametercomer/parameter';
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
  title: string = 'PARÁMETRO COMERCIALIZACIÓN';
  edit: boolean = false;
  form: ModelForm<IParameter>;
  parameter: IParameter;
  typeEvents = new DefaultSelect<ITypeEvent>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterModService: ParameterModService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
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

    if (this.parameter) {
      this.edit = true;
      this.form.patchValue(this.parameter);
      this.form.get('parameter').disable();
      this.form.get('value').disable();
      this.form.get('address').disable();
    }

    if (!this.edit) {
      const iParam = document.getElementById('idP');
      this.render.removeClass(iParam, 'disabled');
    }
  }

  getTypeEvent(params: ListParams) {
    this.parameterModService.getTypeEvent(params).subscribe(data => {
      console.log(data);
      this.typeEvents = new DefaultSelect(data.data, data.count);
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
    this.handleSuccess();
    this.parameterModService.create(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    let body = {
      parameter: this.parameter.parameter,
      value: this.parameter.value,
      address: this.parameter.address,
      description: this.form.value.description,
      typeEventId: this.form.value.typeEventId,
    };
    this.parameterModService.update(this.parameter.parameter, body).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
}
