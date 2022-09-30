import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styles: [],
})
export class DelegationFormComponent extends BasePage implements OnInit {
  delegationForm: FormGroup = new FormGroup({});
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

  private prepareForm(): void {
    this.delegationForm = this.fb.group({
      id: ['', Validators.required],
      description: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      zoneContractCVE: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      diffHours: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      phaseEdo: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      zoneVigilanceCVE: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      noRegister: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      etapaEdo: [, Validators.required],
      cveState: ['', Validators.required],
      addressOffice: ['', Validators.required],
      regionalDelegate: ['', Validators.required],
      cveZone: ['', Validators.required],
      city: ['', Validators.required],
      status: ['', Validators.required],
      iva: ['', Validators.required],
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
