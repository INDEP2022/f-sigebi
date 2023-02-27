import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IComiXThird,
  IThirdParty,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComiXThirdService } from 'src/app/core/services/ms-thirdparty/comi-xthird.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-amount-third-modal',
  templateUrl: './amount-third-modal.component.html',
  styles: [],
})
export class AmountThirdModalComponent extends BasePage implements OnInit {
  title: string = 'Montos';
  edit: boolean = false;

  amountForm: ModelForm<IComiXThird>;
  amounts: IComiXThird;
  thirdParty: IThirdParty;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comiXThirdService: ComiXThirdService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.amountForm = this.fb.group({
      idComiXThird: [null, []],
      idThirdParty: [null, []],
      startingAmount: [null, []],
      pctCommission: [null, []],
      finalAmount: [null, []],
    });
    if (this.amounts != null) {
      this.thirdParty = this.amounts.idThirdParty as unknown as IThirdParty;
      this.edit = true;
      this.amountForm.patchValue(this.amounts);
      this.amountForm.controls['idThirdParty'].setValue(this.thirdParty.id);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.comiXThirdService
      .update(this.amounts.idComiXThird, this.amountForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  create() {
    this.loading = true;
    this.comiXThirdService.create(this.amountForm.value).subscribe({
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
