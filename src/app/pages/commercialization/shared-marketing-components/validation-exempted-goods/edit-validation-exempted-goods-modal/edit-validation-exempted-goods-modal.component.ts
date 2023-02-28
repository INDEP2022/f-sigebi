import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-edit-validation-exempted-goods-modal',
  templateUrl: './edit-validation-exempted-goods-modal.component.html',
  styles: [],
})
export class EditValidationExemptedGoodsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Bienes Exentos de validación';
  edit: boolean = false;

  goodForm: ModelForm<IGood>;
  good: IGood;

  goods = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.goodForm = this.fb.group({
      id: [null, []],
      description: [null, []],
      quantity: [null, []],

      proccess: [null, []],
    });
    if (this.good != null) {
      this.edit = true;
      console.log(this.good);
      this.goodForm.patchValue(this.good);
    }
  }

  getGoods(params: ListParams) {
    this.goodService.getAll(params).subscribe({
      next: data => (this.goods = new DefaultSelect(data.data, data.count)),
    });
  }

  onValuesChange() {
    // console.log(delegationChange);
    // this.delegationValue = delegationChange;
    // this.subDelegationForm.controls['phaseEdo'].setValue(
    //   delegationChange.etapaEdo
    // );
    // this.delegations = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
