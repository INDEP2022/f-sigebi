import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html',
  styles: [],
})
export class ParameterFormComponent extends BasePage implements OnInit {
  @Output() formEmiter: any = new EventEmitter<any>();
  form: FormGroup = new FormGroup({});
  title: string = 'Parámetro';
  edit: boolean = false;
  parameter: IParameters = {} as IParameters;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private parameterServ: ParameterCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      initialValue: [null, [Validators.required, Validators.maxLength(100)]],
      finalValue: [null, Validators.maxLength(30)],
      startDate: [null, Validators.required],
      endDate: [null],
    });

    this.form.patchValue(this.parameter);
  }

  confirm() {
    if (this.form.valid) {
      if (this.edit) {
        this.parameterServ
          .update(this.form.get('id').value, this.form.value)
          .subscribe({
            next: () => this.handleSuccess(),
            error: err => this.onLoadToast('error', err.error.message, ''),
          });
      } else {
        this.parameterServ.create(this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    }
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'Parámetro',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );
    this.modalService.content.callback(true);
    this.modalService.hide();
  }

  close() {
    this.modalService.hide();
  }
}
