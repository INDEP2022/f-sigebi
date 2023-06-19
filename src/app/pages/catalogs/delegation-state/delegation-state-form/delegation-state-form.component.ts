import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
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
  delegationSate: any;
  states = new DefaultSelect<IStateOfRepublic>();
  regionalDelegation = new DefaultSelect<IStateOfRepublic>();
  idState: any;
  idRegional: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationStateService: DelegationStateService,
    private stateOfRepublicService: StateOfRepublicService,
    private regionalDelegationService: RegionalDelegationService
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
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      keyState: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      status: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      version: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.delegationSate) {
      this.edit = true;
      console.log(this.delegationSate);
      this.delegationStateForm.patchValue(this.delegationSate);
      this.delegationStateForm.controls['regionalDelegation'].setValue(
        this.delegationSate.regionalDelegation.id
      );
      this.delegationStateForm.controls['stateCode'].setValue(
        this.delegationSate.stateCode.codeCondition
      );

      this.getStates(
        new ListParams(),
        this.delegationStateForm.controls['keyState'].value
      );
      this.getRegionalDelegation(
        new ListParams(),
        this.delegationStateForm.controls['regionalDelegation'].value
      );
    }

    //this.getStates(new ListParams());
    setTimeout(() => {
      this.getRegionalDelegation(new ListParams());
      this.getStates(new ListParams());
    }, 1000);
  }

  getStatesAll(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => {
        this.states = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.states = new DefaultSelect();
      },
    });
  }

  getStates(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = id;
    }
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => {
        this.states = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.states = new DefaultSelect();
      },
    });
  }
  getRegionalDelegation(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = id;
    }
    this.regionalDelegationService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.regionalDelegation = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.regionalDelegation = new DefaultSelect();
      },
    });
  }

  stateRegional(data: any) {
    console.log(data);
  }

  stateChange(state: IStateOfRepublic) {
    console.log(state);
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
      .create(this.delegationStateForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    const regId = this.delegationStateForm.controls['regionalDelegation'].value;
    const version = this.delegationStateForm.controls['version'].value;
    const keyState = this.delegationStateForm.controls['keyState'].value;
    this.delegationStateForm.controls['regionalDelegation'].setValue(
      parseInt(regId)
    );
    this.delegationStateForm.controls['version'].setValue(parseInt(version));
    this.delegationStateForm.controls['keyState'].setValue(parseInt(keyState));
    this.delegationStateService
      .newUpdate(
        // this.delegationSate.regionalDelegation,
        this.delegationStateForm.getRawValue()
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
