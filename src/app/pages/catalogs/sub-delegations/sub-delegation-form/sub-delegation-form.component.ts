import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sub-delegation-form',
  templateUrl: './sub-delegation-form.component.html',
  styles: [],
})
export class SubDelegationFormComponent extends BasePage implements OnInit {
  subdelegationForm: FormGroup;
  title: string = 'Sub Delegacion';
  edit: boolean = false;
  subdelegation: ISubdelegation;
  delegations = new DefaultSelect<IDelegation>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private subdelegationService: SubdelegationService,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.subdelegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phaseEdo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numDelegation: [null, [Validators.min(1)]],
      numDailyCon: [null, [Validators.required]],
      numRegister: [null, [Validators.min(1)]],
      dateDailyCon: [new Date()],
    });
    if (this.subdelegation != null) {
      this.edit = true;
      this.subdelegationForm.patchValue(this.subdelegation);
    }
  }

  getSubDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

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
    this.modalRef.content.callback.emit(true);
    this.modalRef.hide();
  }
}
