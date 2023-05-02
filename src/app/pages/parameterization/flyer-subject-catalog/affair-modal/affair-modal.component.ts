import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-affair-modal',
  templateUrl: './affair-modal.component.html',
  styles: [],
})
export class AffairModalComponent extends BasePage implements OnInit {
  affairForm: ModelForm<IAffair>;
  affair: IAffair;

  title: string = 'Asunto';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private affairService: AffairService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.affairForm = this.fb.group({
      id: [null, []],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.affair != null) {
      this.edit = true;
      this.affairForm.patchValue(this.affair);
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
    this.affairService.create2(this.affairForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.affairService
      .update2(this.affair.id, this.affairForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
