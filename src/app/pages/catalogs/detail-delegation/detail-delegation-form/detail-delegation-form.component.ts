import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { DetailDelegationService } from 'src/app/core/services/catalogs/detail-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-detail-delegation-form',
  templateUrl: './detail-delegation-form.component.html',
  styles: [],
})
export class DetailDelegationFormComponent extends BasePage implements OnInit {
  detailDelegationForm: ModelForm<IDetailDelegation>;
  title: string = 'Detalle Delegación';
  edit: boolean = false;
  detailDelegation: IDetailDelegation;
  delegation = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private detailDelegationService: DetailDelegationService,
    private affairService: AffairService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.detailDelegationForm = this.fb.group({
      id: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(80)],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      location: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      address: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
          Validators.required,
        ],
      ],
      position: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      area: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      mail: [
        null,
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      tel1: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(80)],
      ],
      tel2: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(80)],
      ],
      tel3: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(80)],
      ],
      numberDelegation: [null, [Validators.required]],
    });
    if (this.detailDelegation != null) {
      this.edit = true;
      this.detailDelegationForm.patchValue(this.detailDelegation);
    }
    setTimeout(() => {
      this.getDelegation(new ListParams());
    }, 1000);
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.detailDelegationForm.controls['name'].value.trim() === '' ||
      this.detailDelegationForm.controls['location'].value.trim() === '' ||
      this.detailDelegationForm.controls['address'].value.trim() === '' ||
      this.detailDelegationForm.controls['position'].value.trim() === '' ||
      this.detailDelegationForm.controls['area'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.detailDelegationService
      .create(this.detailDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.detailDelegationService
      .update(this.detailDelegation.id, this.detailDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getDelegation(params: ListParams) {
    this.affairService.getDelegations(params).subscribe({
      next: data => {
        this.delegation = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.delegation = new DefaultSelect();
      },
    });
  }
}
