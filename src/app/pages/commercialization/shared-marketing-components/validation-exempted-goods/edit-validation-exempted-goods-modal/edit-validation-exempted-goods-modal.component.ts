import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodsTransAva } from 'src/app/core/models/ms-good/goods-trans-ava.model';
import { GoodTransAvaService } from 'src/app/core/services/ms-good/goods-trans-ava.service';
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
  goodsTransAva: IGoodsTransAva;
  goodForm: ModelForm<IGood>;
  good: IGood;
  goods = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodTransAvaService: GoodTransAvaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.goodForm = this.fb.group({
      goodNumber: [null, []],
      process: [null, []],
      registryNumber: [null, [Validators.required]],
    });
    if (this.goodsTransAva != null) {
      this.edit = true;
      this.goodForm.patchValue(this.goodsTransAva);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    if (this.goodForm.valid) {
      this.loading = true;
      console.log(this.goodForm.value);
      this.goodTransAvaService.update(this.goodForm.value).subscribe({
        next: data => {
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.alert('warning', `No es Posible Actualizar el Registro`, '');
        },
      });
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
    }
  }

  create() {
    this.loading = true;
    this.goodTransAvaService.create(this.goodForm.value).subscribe({
      next: data => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: error => {
        this.loading = false;
        this.alert('warning', `No es Posible Crear el Registro`, '');
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `${message} Correctamente`, ``);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
