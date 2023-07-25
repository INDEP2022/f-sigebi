import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { StatusCodeService } from 'src/app/core/services/catalogs/status-code.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-status-code-form',
  templateUrl: './status-code-form.component.html',
  styles: [],
})
export class StatusCodeFormComponent extends BasePage implements OnInit {
  statusCodeForm: ModelForm<IStatusCode>;
  title: string = 'Código Estado';
  edit: boolean = false;
  statusCode: IStatusCode;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private statusCodeService: StatusCodeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.statusCodeForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      descCode: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      order: [
        null,
        [
          Validators.minLength(1),
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });
    if (this.statusCode != null) {
      this.edit = true;
      this.statusCodeForm.patchValue(this.statusCode);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.statusCodeForm.controls['id'].value.trim() == '' ||
      this.statusCodeForm.controls['descCode'].value.trim() == '' ||
      (this.statusCodeForm.controls['id'].value.trim() == '' &&
        this.statusCodeForm.controls['descCode'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      /*this.loading = true;
      const params: ListParams = new ListParams();
      let count: number;
      params['filter.id'] = this.statusCodeForm.controls['id'].value;
      this.statusCodeService.getAll(params).subscribe({
        next: response => {
          count = response.count;
          if (response.count > 0) {
            this.alert('warning', 'Código estado', 'La clave ya existe.');
          } else {
            this.statusCodeService
              .create(this.statusCodeForm.getRawValue())
              .subscribe({
                next: data => this.handleSuccess(),
                error: error => (this.loading = false),
              });
          }
          this.loading = false;
        },
        error: error => {
          if (count > 0) {
            this.alert('warning', 'Código estado', 'La clave ya existe.');
          } else {
            this.statusCodeService
              .create(this.statusCodeForm.getRawValue())
              .subscribe({
                next: data => this.handleSuccess(),
                error: error => (this.loading = false),
              });
          }

          this.loading = false;
        },
      });*/
      this.alertQuestion(
        'question',
        'El registro ya existe',
        '¿Desea reemplazarlo?'
      ).then(question => {
        if (question.isConfirmed) {
          //Ejecutar el servicio
          this.statusCodeService
            .create(this.statusCodeForm.getRawValue())
            .subscribe({
              next: data => this.handleSuccess(),
              error: error => {
                console.log(error);
              },
            });
        }
      });
    }
  }

  update() {
    if (
      this.statusCodeForm.controls['id'].value.trim() == '' ||
      this.statusCodeForm.controls['descCode'].value.trim() == '' ||
      (this.statusCodeForm.controls['id'].value.trim() == '' &&
        this.statusCodeForm.controls['descCode'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.statusCodeService
        .newUpdate(this.statusCodeForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
