import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-delegation-modal',
  templateUrl: './delegation-modal.component.html',
  styles: [],
})
export class DelegationModalComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  delegationM: IDelegation;

  title: string = 'Delegaciones';
  edit: boolean = false;

  idZ: IZoneGeographic;

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
      id: [null, [Validators.required]],
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
      idZoneGeographic: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(1),
        ],
      ],
    });
    if (this.delegationM != null) {
      this.edit = true;
      console.log('idzona', this.delegationM);
      this.idZ = this.delegationM.idZoneGeographic as IZoneGeographic;
      this.delegationForm.patchValue(this.delegationM);
      this.delegationForm.controls['idZoneGeographic'].setValue(this.idZ.id);
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
    this.delegationService.create2(this.delegationForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.delegationService.update2(this.delegationForm.value).subscribe({
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
