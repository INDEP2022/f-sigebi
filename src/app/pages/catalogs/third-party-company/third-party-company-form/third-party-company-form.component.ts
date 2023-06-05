import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IThirdPartyCompany } from 'src/app/core/models/catalogs/third-party-company.model';
import { ThirdPartyService } from 'src/app/core/services/catalogs/third-party-company.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-third-party-company-form',
  templateUrl: './third-party-company-form.component.html',
  styles: [],
})
export class ThirdPartyCompanyFormComponent extends BasePage implements OnInit {
  thirdPartyCompanyForm: ModelForm<IThirdPartyCompany>;
  title = 'EMPRESAS DE TERCEROS';
  edit = false;
  thirdParty: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private thirdPartyCompanyService: ThirdPartyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.thirdPartyCompanyForm = this.fb.group({
      id: [null],
      keyCompany: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cveZoneContract: [null, Validators.required],
    });

    if (this.thirdParty != null) {
      this.edit = true;
      this.thirdPartyCompanyForm.patchValue(this.thirdParty);
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  confirm(): void {
    this.edit ? this.update() : this.create();
  }

  create(): void {
    this.loading = true;
    this.thirdPartyCompanyService
      .create(this.thirdPartyCompanyForm.value)
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => (this.loading = false),
      });
  }

  update(): void {
    this.loading = true;
    this.thirdPartyCompanyService
      .updateThirdPartyCompany(
        this.thirdParty.id,
        this.thirdPartyCompanyForm.value
      )
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => (this.loading = false),
      });
  }

  handleSuccess(): void {
    const message = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
