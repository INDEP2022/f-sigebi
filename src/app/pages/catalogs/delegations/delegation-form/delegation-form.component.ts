import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styles: [],
})
export class DelegationFormComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  title: string = 'Delegacion';
  edit: boolean = false;
  delegation: IDelegation;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.delegationForm = this.fb.group({
      addressOffice: [null, [Validators.required]],
      city: [null],
      cveState: [null],
      cveZone: [null],
      description: [null],
      diffHours: [null],
      etapaEdo: [null],
      idZoneGeographic: [null],
      iva: [null],
      noRegister: [null],
      regionalDelegate: [null],
      status: [null],
      version: [null],
      zoneContractCVE: [null],
      zoneVigilanceCVE: [],
    });
    if (this.delegation != null) {
      this.edit = true;
      this.delegationForm.patchValue(this.delegation);
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
    this.delegationService.create(this.delegationForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.delegationService
      .update(this.delegation.id, this.delegationForm.getRawValue())
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
