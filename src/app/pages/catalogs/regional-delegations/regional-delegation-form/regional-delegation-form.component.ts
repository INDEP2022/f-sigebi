import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-regional-delegation-form',
  templateUrl: './regional-delegation-form.component.html',
  styles: [],
})
export class RegionalDelegationFormComponent
  extends BasePage
  implements OnInit
{
  regionalDelegationForm: ModelForm<IRegionalDelegation>;
  regionalDelegation: IRegionalDelegation;
  title: string = 'Delegaciones regionales';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regionalDelegationService: RegionalDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.regionalDelegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registerNumber: [null],
      idGeographicZona: [null],
      version: [null],
      regionalDelegate: [null],
      officeAddress: [null],
      status: [null],
      keyZone: [null],
      iva: [null],
      city: [null],
      keyState: [null],
    });
    if (this.regionalDelegation != null) {
      this.edit = true;
      console.log(this.regionalDelegation);
      this.regionalDelegationForm.patchValue(this.regionalDelegation);
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
    this.regionalDelegationService
      .create(this.regionalDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.regionalDelegationService
      .update(this.regionalDelegation.id, this.regionalDelegationForm.value)
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
