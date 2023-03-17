import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAppraisers } from 'src/app/core/models/catalogs/appraisers.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-appraisal-institutions-modal',
  templateUrl: './appraisal-institutions-modal.component.html',
  styles: [],
})
export class AppraisalInstitutionsModalComponent
  extends BasePage
  implements OnInit
{
  appraisers: IAppraisers;
  appraisersForm: ModelForm<IAppraisers>;
  title: string = 'Instituciones Valuadoras';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private appraisersService: AppraisersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.appraisersForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noExterior: [null, [Validators.required]],
      noInterior: [null, [Validators.required]],
      codepostal: [null, [Validators.required]],
      colony: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      deleg: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cveEntfed: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [null, [Validators.required]],
      curp: [null, [Validators.required]],
      tel: [null, [Validators.required]],
      represent: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [null],
      noRegistro: [null],
    });
    if (this.appraisers != null) {
      this.edit = true;
      this.appraisersForm.patchValue(this.appraisers);
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
    this.appraisersService.create(this.appraisersForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    this.appraisersService
      .update(
        this.appraisersForm.controls['id'].value,
        this.appraisersForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `${message} Correctamente`, this.title);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
