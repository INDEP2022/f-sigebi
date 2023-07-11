import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//import { IGoodsAvailableSale } from 'src/app/core/models/commercialization/goodsAvailableSale';
//import { GoodsAvailableSaleService } from 'src/app/core/services/ms-goods-available-sale/ms-goods-available-sale.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'goods-available-sale-form',
  templateUrl: './goods-available-sale-form.component.html',
  styles: [],
})
export class GoodsAvailableSaleFormComponent
  extends BasePage
  implements OnInit
{
  goodsAvailableSaleForm: ModelForm<any>;
  title: string = 'Estatus de bienes disponibles para comercializar';
  edit: boolean = false;
  goodsAvailable: any;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  //private goodsAvailableSaleService: GoodsAvailableSaleService
  private prepareForm() {
    this.goodsAvailableSaleForm = this.fb.group({
      id: [null],
      goodStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      processStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      quantity: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      transferentDestiny: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.goodsAvailable != null) {
      this.edit = true;
      this.goodsAvailableSaleForm.patchValue(this.goodsAvailable);
    }
  }
  close() {
    this.modalRef.hide();
  }
  /*
  confirm() {
    console.log('Confirmar');
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.goodsAvailableSaleService
      .create(this.goodsAvailableSaleForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.goodsAvailableSaleService
      .update(this.goodsAvailableSaleForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }*/

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
