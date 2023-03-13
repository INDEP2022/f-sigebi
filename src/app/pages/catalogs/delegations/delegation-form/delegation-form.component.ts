import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  states = new DefaultSelect<IStateOfRepublic>();
  zones = new DefaultSelect<IZoneGeographic>();
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
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [null, [Validators.required, Validators.maxLength(80)]],
      zoneContractCVE: [null, [Validators.required, Validators.maxLength(80)]],
      diffHours: [null, [Validators.required, Validators.maxLength(80)]],
      zoneVigilanceCVE: [null, [Validators.required, Validators.maxLength(80)]],
      noRegister: [null, [Validators.required, Validators.maxLength(80)]],
      etapaEdo: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      cveState: [null, [Validators.required]],
      addressOffice: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      regionalDelegate: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      // cveZone: [null, Validators.required],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required]],
      iva: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],
      idZoneGeographic: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.delegation != null) {
      this.fillForm();
    }
  }

  fillForm() {
    this.edit = true;
    this.delegationForm.patchValue(this.delegation);
    const idZoneGeographic = this.delegation
      .idZoneGeographic as IZoneGeographic;
    if (idZoneGeographic) {
      this.zones = new DefaultSelect([idZoneGeographic], 1);
      this.delegationForm.controls.id.setValue(idZoneGeographic.id);
    }
  }

  getStates(params: ListParams) {
    this.delegationService.getStates(params).subscribe({
      next: data => (this.states = new DefaultSelect(data.data, data.count)),
    });
  }

  getZones(params: ListParams) {
    this.delegationService.getZones(params).subscribe({
      next: data => (this.zones = new DefaultSelect(data.data, data.count)),
    });
  }
  stateChange(state: IStateOfRepublic) {
    console.log(state);
  }

  zoneChange(zone: IZoneGeographic) {
    console.log(zone);
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
