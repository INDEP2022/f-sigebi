import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { IResponse } from 'src/app/core/models/catalogs/response.model';
//services
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ResponseService } from 'src/app/core/services/catalogs/response.service';

@Component({
  selector: 'app-response-catalog-modal',
  templateUrl: './response-catalog-modal.component.html',
  styles: [],
})
export class ResponseCatalogModalComponent extends BasePage implements OnInit {
  responseForm: ModelForm<IResponse>;
  responseI: IResponse;
  title: string = 'Catálogo de Respuestas';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private responseService: ResponseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.responseForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      idQuestion: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      text: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      startValue: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      endValue: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });
    if (this.responseI != null) {
      this.edit = true;
      // console.log(this.questionI);
      this.responseForm.patchValue(this.responseI);
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
    this.responseService.create(this.responseForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.responseService
      .update(this.responseI.id, this.responseForm.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }
}
