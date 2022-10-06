import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';
import { DetailDelegationService } from 'src/app/core/services/catalogs/detail-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private detailDelegationService: DetailDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.detailDelegationForm = this.fb.group({
      id: [null, Validators.required],
      name: [
        null,
        Validators.compose([
          Validators.pattern(
            '[a-zA-Z]((.|_|-)?[a-zA-ZáéíóúÁÉÍÓÚ\u0020]+){0,255}'
          ),
          Validators.required,
        ]),
      ],
      location: [null, Validators.required],
      address: [null, Validators.required],
      position: [null, Validators.required],
      area: [null, Validators.required],
      mail: [null, [Validators.email, Validators.required]],
      description: [null],
      numP1: [null, Validators.required],
      numP2: [null, Validators.required],
      numP3: [null, Validators.required],
      numDelegation: [null, [Validators.required]],
    });
    if (this.detailDelegation != null) {
      this.edit = true;
      this.detailDelegationForm.patchValue(this.detailDelegation);
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
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
