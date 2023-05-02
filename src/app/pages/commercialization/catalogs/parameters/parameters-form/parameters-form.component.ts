import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IParameter } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-parameters-form',
  templateUrl: './parameters-form.component.html',
  styles: [],
})
export class ParametersFormComponent extends BasePage implements OnInit {
  title: string = 'PARÁMETRO COMERCIALIZACIÓN';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  parameter: IParameter;

  @Output() refresh = new EventEmitter<true>();

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
  }

  prepareForm() {
    this.form = this.fb.group({
      idParam: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idValue: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idDirection: [null, [Validators.required]],
      eventTypeId: [null, []],
    });

    if (this.parameter) {
      //console.log(this.brand)
      this.edit = true;
      this.form.patchValue(this.parameter);
    }

    if (!this.edit) {
      const iParam = document.getElementById('idP');
      this.render.removeClass(iParam, 'disabled');
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
    this.parameterModService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
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
    console.log(this.form.value);
    this.parameterModService.update(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
