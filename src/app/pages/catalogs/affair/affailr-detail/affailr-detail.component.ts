import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-affailr-detail',
  templateUrl: './affailr-detail.component.html',
  styles: [],
})
export class AffailrDetailComponent extends BasePage implements OnInit {
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
      id: [null],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      processDetonate: [null],
      referralNoteType: [null],
      userCreation: [null],
      creationDate: [null],
      userModification: [null],
      modificationDate: [null],
      versionUser: [null],
      version: [null],
      clv: [null],
      status: [null],
      registerNumber: [null],
      nbOrigen: [null],
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
    this.affairForm.controls['nbOrigen'].setValue('SIAB');
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
    const message: string = this.edit ? 'Actualizado' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
