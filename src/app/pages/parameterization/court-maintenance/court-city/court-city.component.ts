import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-court-city',
  templateUrl: './court-city.component.html',
  styles: [],
})
export class CourtCityComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  id: string | number = null;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private courtCityServ: CourtByCityService,
    private readonly serviceSubDeleg: SubdelegationService,
    private readonly serviceFederation: EntFedService,
    private readonly serviceDeleg: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      city: [null, Validators.required],
      court: [this.id, Validators.required],
      entity: [{ value: null, disabled: true }],
      delegation: [{ value: null, disabled: true }],
      subDelegation: [{ value: null, disabled: true }],
    });
  }

  getState(data: any) {
    if (data) {
      if (data)
        if (typeof data.state == 'string') {
          this.getEntidad(data.state);
          this.getDelegation(data.noDelegation);
          this.getSubDelegation(data.noSubDelegation);
        }
    }
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast('success', 'Se ha guardado la ciudad', '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  confirm() {
    this.courtCityServ.create(this.form.value).subscribe({
      next: () => this.handleSuccess(),
      error: err => this.onLoadToast('error', err.error.message, ''),
    });
  }

  private getEntidad(id: number) {
    this.serviceFederation.getById(id).subscribe({
      next: data => this.form.get('entity').patchValue(data.otWorth),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getDelegation(delegation: number) {
    this.serviceDeleg.getById(delegation).subscribe({
      next: data => this.form.get('delegation').patchValue(data.description),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getSubDelegation(subDelegation: number) {
    this.serviceSubDeleg.getById(subDelegation).subscribe({
      next: data => this.form.get('subDelegation').patchValue(data.description),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }
}
