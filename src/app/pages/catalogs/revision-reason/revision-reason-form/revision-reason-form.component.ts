import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RevisionReasonService } from 'src/app/core/services/catalogs/revision-reason.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IRevisionReason } from '../../../../core/models/catalogs/revision-reason.model';

@Component({
  selector: 'app-revision-reason-form',
  templateUrl: './revision-reason-form.component.html',
  styles: [],
})
export class RevisionReasonFormComponent extends BasePage implements OnInit {
  revisionReasonForm: FormGroup = new FormGroup({});
  title: string = 'Motivo para Estatus REV';
  edit: boolean = false;
  revisionReason: IRevisionReason;
  items = new DefaultSelect<IRevisionReason>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private revisionReasonService: RevisionReasonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.revisionReasonForm = this.fb.group({
      initialStatus: [
        null,
        [
          Validators.maxLength(3),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      descriptionCause: [
        null,
        [
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      goodType: [
        null,
        [
          Validators.maxLength(1),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      statusRev: [
        null,
        [
          Validators.maxLength(3),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      managerArea: [
        null,
        [
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      statusPurpose: [
        null,
        [
          Validators.maxLength(3),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      screen: [
        null,
        [
          Validators.maxLength(80),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      parameter: [
        null,
        [
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
    });
    if (this.revisionReason != null) {
      this.edit = true;
      console.log(this.revisionReason);
      this.revisionReasonForm.patchValue(this.revisionReason);
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
      this.revisionReasonForm.controls['initialStatus'].value.trim() === '' ||
      this.revisionReasonForm.controls['goodType'].value.trim() === '' ||
      this.revisionReasonForm.controls['descriptionCause'].value.trim() ===
        '' ||
      this.revisionReasonForm.controls['statusRev'].value.trim() === '' ||
      this.revisionReasonForm.controls['managerArea'].value.trim() === '' ||
      this.revisionReasonForm.controls['statusPurpose'].value.trim() === '' ||
      this.revisionReasonForm.controls['parameter'].value.trim() === '' ||
      this.revisionReasonForm.controls['screen'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.revisionReasonService.create(this.revisionReasonForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.revisionReasonService
      .update(this.revisionReason.id, this.revisionReasonForm.value)
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
