import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//model
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//services
import { DelegationService } from 'src/app/core/services/maintenance-delegations/delegation.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-maintenance-deleg-subdeleg-modal',
  templateUrl: './maintenance-deleg-subdeleg-modal.component.html',
  styles: [],
})
export class MaintenanceDelegSubdelegModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Sub Delegaciones';
  edit: boolean = false;

  subDelegationForm: ModelForm<ISubdelegation>;
  subDelegation: ISubdelegation;
  id: IDelegation;
  idD: IDelegation;

  delegationValue: IDelegation;

  delegations = new DefaultSelect();
  phaseEdos = new DefaultSelect();

  showDelegation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private subDelegationService: SubDelegationService,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.subDelegationForm = this.fb.group({
      delegationNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      //dailyConNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      //dateDailyCon: [null, [Validators.pattern(STRING_PATTERN)]],
      phaseEdo: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      registerNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.subDelegation != null) {
      this.id = this.subDelegation.delegationNumber as IDelegation;
      this.edit = true;
      console.log(this.subDelegation);
      this.subDelegationForm.patchValue(this.subDelegation);
      this.subDelegationForm.controls['delegationNumber'].setValue(this.id.id);
    } else {
      this.edit = false;
      console.log(this.idD);
      this.subDelegationForm.controls['delegationNumber'].setValue(this.idD.id);
      this.subDelegationForm.controls['phaseEdo'].setValue(this.idD.etapaEdo);
    }
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: data =>
        (this.delegations = new DefaultSelect(data.data, data.count)),
    });
  }

  getPhaseEdo(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: data => (this.phaseEdos = new DefaultSelect(data.data, data.count)),
    });
  }

  onValuesChange(delegationChange: IDelegation) {
    console.log(delegationChange);
    this.delegationValue = delegationChange;
    this.subDelegationForm.controls['phaseEdo'].setValue(
      delegationChange.etapaEdo
    );
    this.delegations = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.subDelegationService.create(this.subDelegationForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.subDelegationService
      .update(this.subDelegation.id, this.subDelegationForm.value)
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
