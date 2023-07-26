import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGrantee } from 'src/app/core/models/catalogs/grantees.model';
import { GranteeService } from 'src/app/core/services/catalogs/grantees.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-grantees-form',
  templateUrl: './grantees-form.component.html',
  styles: [],
})
export class GranteesFormComponent extends BasePage implements OnInit {
  granteesForm: ModelForm<IGrantee>;
  title: string = 'Donatario';
  edit: boolean = false;
  grantee: IGrantee;

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder,
    public granteeService: GranteeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.granteesForm = this.fb.group({
      id: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      puesto: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      type: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      razonSocial: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      noInside: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      noExterior: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      col: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      nommun: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      nomedo: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      cp: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      usrStatus: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(5),
        ],
      ],
    });

    if (this.grantee != null) {
      this.edit = true;
      this.granteesForm.patchValue(this.grantee);
      this.granteesForm.get('id').disable();
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.granteesForm.controls['description'].value.trim() == '' ||
      this.granteesForm.controls['puesto'].value.trim() == '' ||
      this.granteesForm.controls['razonSocial'].value.trim() == '' ||
      this.granteesForm.controls['street'].value.trim() == '' ||
      this.granteesForm.controls['noExterior'].value.trim() == '' ||
      this.granteesForm.controls['col'].value.trim() == '' ||
      this.granteesForm.controls['nomedo'].value.trim() == '' ||
      this.granteesForm.controls['cp'].value.trim() == '' ||
      (this.granteesForm.controls['description'].value.trim() == '' &&
        this.granteesForm.controls['puesto'].value.trim() == '' &&
        this.granteesForm.controls['razonSocial'].value.trim() == '' &&
        this.granteesForm.controls['street'].value.trim() == '' &&
        this.granteesForm.controls['noExterior'].value.trim() == '' &&
        this.granteesForm.controls['col'].value.trim() == '' &&
        this.granteesForm.controls['nomedo'].value.trim() == '' &&
        this.granteesForm.controls['cp'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.granteeService.create(this.granteesForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.granteesForm.controls['description'].value.trim() == '' ||
      this.granteesForm.controls['puesto'].value.trim() == '' ||
      this.granteesForm.controls['razonSocial'].value.trim() == '' ||
      this.granteesForm.controls['street'].value.trim() == '' ||
      this.granteesForm.controls['noExterior'].value.trim() == '' ||
      this.granteesForm.controls['col'].value.trim() == '' ||
      this.granteesForm.controls['nomedo'].value.trim() == '' ||
      this.granteesForm.controls['cp'].value.trim() == '' ||
      (this.granteesForm.controls['description'].value.trim() == '' &&
        this.granteesForm.controls['puesto'].value.trim() == '' &&
        this.granteesForm.controls['razonSocial'].value.trim() == '' &&
        this.granteesForm.controls['street'].value.trim() == '' &&
        this.granteesForm.controls['noExterior'].value.trim() == '' &&
        this.granteesForm.controls['col'].value.trim() == '' &&
        this.granteesForm.controls['nomedo'].value.trim() == '' &&
        this.granteesForm.controls['cp'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.granteeService
        .update(this.grantee.id, this.granteesForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
