import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delegation-modal',
  templateUrl: './delegation-modal.component.html',
  styles: [],
})
export class DelegationModalComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  delegationM: IDelegation;

  title: string = 'Delegación';
  edit: boolean = false;

  idZ = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private readonly zoneGeographicService: ZoneGeographicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  getZones(event: ListParams) {
    this.zoneGeographicService.getAll(event).subscribe({
      next: data => {
        this.idZ = new DefaultSelect(data.data, data.count);
      },
    });
  }

  private prepareForm() {
    this.delegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      etapaEdo: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      idZoneGeographic: [null, [Validators.required, Validators.maxLength(1)]],
    });
    if (this.delegationM != null) {
      this.edit = true;
      this.delegationForm.patchValue(this.delegationM);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    const newDelegation = Object.assign({}, this.delegationForm.value);

    Object.defineProperty(newDelegation, 'idZoneGeographic', {
      value: newDelegation.idZoneGeographic.id,
    });

    if (this.edit) newDelegation.id = this.delegationM.id;

    this.edit ? this.update() : this.create(newDelegation);
  }

  create(newDelegation: IDelegation) {
    console.log(newDelegation);
    this.loading = true;
    this.delegationService.create2(newDelegation).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => (this.loading = false),
    });
  }

  update() {
    console.log();
    this.loading = true;
    this.delegationService
      .update2(this.delegationForm.getRawValue())
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
