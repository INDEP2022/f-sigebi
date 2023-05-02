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
  title: string = 'Motivo Revisión';
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
      id: [null, [Validators.required]],
      estatus_inicial: [null, [Validators.required, Validators.maxLength(3)]],
      descripcion_motivo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tipo_bien: [null, [Validators.required, Validators.maxLength(1)]],
      estatus_rev: [null, [Validators.required, Validators.maxLength(3)]],
      area_responsable: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estatus_fin: [null, [Validators.required, Validators.maxLength(3)]],
      pantalla: [null, [Validators.required]],
      parametro: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
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
