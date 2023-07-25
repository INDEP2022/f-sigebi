import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IPhotographMedia } from '../../../../core/models/catalogs/photograph-media.model';
import { PhotographMediaService } from '../../../../core/services/catalogs/photograph-media.service';

@Component({
  selector: 'app-photograph-media-form',
  templateUrl: './photograph-media-form.component.html',
  styles: [],
})
export class PhotographMediaFormComponent extends BasePage implements OnInit {
  photographMediaForm: FormGroup = new FormGroup({});
  title: string = 'Medio Fotográfico';
  edit: boolean = false;
  photographMedia: IPhotographMedia;
  items = new DefaultSelect<IPhotographMedia>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private photographMediaService: PhotographMediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.photographMediaForm = this.fb.group({
      route: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.photographMedia != null) {
      this.edit = true;
      this.photographMediaForm.patchValue(this.photographMedia);
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
      this.photographMediaForm.controls['route'].value.trim() === '' ||
      this.photographMediaForm.controls['status'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.photographMediaService
      .create(this.photographMediaForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.photographMediaService
      .updateCatalogPhotographMedia(
        this.photographMedia.id,
        this.photographMediaForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}

/*



import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IPhotographMedia } from '../../../../core/models/catalogs/photograph-media.model';
import { PhotographMediaService } from '../../../../core/services/catalogs/photograph-media.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-photograph-media-form',
  templateUrl: './photograph-media-form.component.html',
  styles: [],
})
export class PhotographMediaFormComponent extends BasePage implements OnInit {
  photographMediaForm: ModelForm<IPhotographMedia>;
  title: string = 'Medio Fotográfico';
  edit: boolean = false;
  photograph: IPhotographMedia;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private photographMediaService: PhotographMediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.photographMediaForm = this.fb.group({
      route: [
        null,
        [
          Validators.maxLength(40),
          Validators.pattern(STRING_PATTERN)
        ]
      ],
      status: [
        null,
        [
          Validators.maxLength(1)
        ]
      ],
    });
    if (this.photograph != null) {
      this.edit = true;
      this.photographMediaForm.patchValue(this.photograph);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.photographMediaService.create(this.photographMediaForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.photographMediaService
      .update(this.photograph.id, this.photographMediaForm.value)
      .subscribe({
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
}





*/
