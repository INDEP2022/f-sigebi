import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delegation-state-form',
  templateUrl: './delegation-state-form.component.html',
  styles: [],
})
export class DelegationStateFormComponent extends BasePage implements OnInit {
  delegationStateForm: ModelForm<IDelegationState>;
  title: string = 'Delegación Estado';
  edit: boolean = false;
  delegationSate: IDelegationState;
  states = new DefaultSelect<IStateOfRepublic>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationStateService: DelegationStateService,
    private stateOfRepublicService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.delegationStateForm = this.fb.group({
      regionalDelegation: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      stateCode: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      keyState: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.delegationSate) {
      this.fillForm();
    }
  }

  fillForm() {
    this.edit = true;
    this.delegationStateForm.patchValue(this.delegationSate);
    /**
     * !Agregar funcionalidad para llenar el select
     * !cuando lo traiga del backend
     */
    // const state = this.delegationSate.keyState
  }

  getStates(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => (this.states = new DefaultSelect(data.data, data.count)),
    });
  }

  stateChange(state: IStateOfRepublic) {
    this.delegationStateForm.controls.keyState.setValue(state.id);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.delegationStateService
      .create(this.delegationStateForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.delegationStateService
      .update(
        this.delegationSate.regionalDelegation,
        this.delegationStateForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
