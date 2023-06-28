import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sub-delegation-form',
  templateUrl: './sub-delegation-form.component.html',
  styles: [],
})
export class SubDelegationFormComponent extends BasePage implements OnInit {
  subdelegationForm: FormGroup;
  title: string = 'Sub Delegación';
  edit: boolean = false;
  subdelegation: any;
  delegations = new DefaultSelect<IDelegation>();
  valueDelegation: IDelegation;
  validationDelegation: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private subdelegationService: SubdelegationService,
    private delegationService: DelegationService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.subdelegationForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      phaseEdo: [null, [Validators.required]],
      delegationNumber: [null, [Validators.required]],
      dailyConNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      registerNumber: [null],
      dateDailyCon: [new Date()],
    });
    if (this.subdelegation != null) {
      this.edit = true;
      this.subdelegationForm.patchValue(this.subdelegation);
      this.valueDelegation = this.subdelegation.delegationNumber as IDelegation;
      let delegation = this.subdelegation.delegationNumber;
      this.delegations = new DefaultSelect([delegation.description], 1);
      this.subdelegationForm.controls['delegationNumber'].setValue(
        delegation.description
      );
      console.log('data', delegation.id, this.subdelegation);
    }
    this.getDelegations(new ListParams());
  }

  getDelegations(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.delegationService.getAllPaginated(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

  delegationChange(delegation: IDelegation) {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.subdelegationService
      .create(this.subdelegationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    if (!this.validationDelegation && this.subdelegation != null) {
      this.subdelegationForm.controls['delegationNumber'].setValue(
        this.valueDelegation.id.toString()
      );
    }
    this.subdelegationService
      .update(this.subdelegation.id, this.subdelegationForm.getRawValue())
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

  onChange(id: any) {
    this.validationDelegation = true;
  }
}
