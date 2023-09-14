import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  PHONE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';
import { INotary } from './../../../../core/models/catalogs/notary.model';
import { NotaryService } from './../../../../core/services/catalogs/notary.service';

@Component({
  selector: 'app-notary-form',
  templateUrl: './notary-form.component.html',
  styles: [],
})
export class NotaryFormComponent extends BasePage implements OnInit {
  notaryForm: FormGroup = new FormGroup({});
  title: string = 'Notario';
  edit: boolean = false;
  notary: INotary;
  items = new DefaultSelect<INotary>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private notaryService: NotaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.notaryForm = this.fb.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      valid: [null, [Validators.required]],
      notaryNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      ubication: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      domicile: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.pattern(PHONE_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      email: [
        null,
        [Validators.required, Validators.maxLength(80), Validators.email],
      ],
      registryNumber: [null],
    });
    if (this.notary != null) {
      this.edit = true;
      console.log(this.notary);
      this.notaryForm.patchValue(this.notary);
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
      this.notaryForm.controls['name'].value.trim() === '' ||
      this.notaryForm.controls['notaryNumber'].value.trim() === '' ||
      this.notaryForm.controls['phone'].value.trim() === '' ||
      this.notaryForm.controls['domicile'].value.trim() === '' ||
      this.notaryForm.controls['ubication'].value.trim() === '' ||
      this.notaryForm.controls['phone'].value.trim() === '' ||
      this.notaryForm.controls['email'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.notaryService.create(this.notaryForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.notaryService.update(this.notary.id, this.notaryForm.value).subscribe({
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
