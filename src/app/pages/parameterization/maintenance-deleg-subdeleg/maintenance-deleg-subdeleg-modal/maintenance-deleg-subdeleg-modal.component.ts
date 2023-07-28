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
  title: string = 'Subdelegación';
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
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      //dailyConNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      //dateDailyCon: [null, [Validators.pattern(STRING_PATTERN)]],
      phaseEdo: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
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
    if (this.subDelegationForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.subDelegationService
      .create(this.subDelegationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.alert('error', 'El No. Subdelegacion ya fue registrado', '');
        },
      });
  }

  update() {
    this.loading = true;
    this.subDelegationService
      .update(this.subDelegation.id, this.subDelegationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.modalRef.content.callback(true);
    this.modalRef.hide();
    console.log(this.modalRef.hide());
    this.loading = false;
    this.close();
  }
}
