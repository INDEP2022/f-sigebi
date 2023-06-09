import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';
import {
  DOUBLE_POSITIVE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
} from 'src/app/core/shared/patterns';
import { GoodsCharacteristicsService } from '../../../services/goods-characteristics.service';
import { IVal } from '../good-table-vals.component';

@Component({
  selector: 'app-good-characteristic-modal',
  templateUrl: './good-characteristic-modal.component.html',
  styleUrls: ['./good-characteristic-modal.component.scss'],
})
export class GoodCharacteristicModalComponent
  extends BasePage
  implements OnInit
{
  row: IVal;
  form: FormGroup = new FormGroup({});
  title: string = 'CARACTERÍSTICA DE BIEN';
  today: Date = new Date();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: GoodsCharacteristicsService
  ) {
    super();
  }

  ngOnInit() {
    if (this.row) {
      this.prepareForm();
    }
  }

  moneyValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.get('value');
    const goodClassNumber = control.get('goodClassNumber');
    if (
      goodClassNumber.value === 62 &&
      value.value != 'MN' &&
      value.value != 'USD'
    ) {
      return null;
      // return 'El numerario solo acepta Moneda Nacional o dólares';
    } else if (this.good.goodClassNumber === 1424 && this.row.value != 'MN') {
      return null;
    } else if (this.good.goodClassNumber === 1426 && this.row.value != 'USD') {
      return null;
    } else if (this.good.goodClassNumber === 1590 && this.row.value != 'EUR') {
      return null;
    }

    return { money: true };
  };

  private prepareForm() {
    let validators = [];
    this.form = this.fb.group({
      value: [this.row.value],
      goodClassNumber: [this.good.goodClassNumber],
    });
    if (this.row.required) {
      validators.push(Validators.required);
    }
    if (this.row.dataType === 'N') {
      validators.push(Validators.pattern(POSITVE_NUMBERS_PATTERN));
    }
    if (this.row.dataType === 'F') {
      validators.push(Validators.pattern(DOUBLE_POSITIVE_PATTERN));
    }

    this.form.setValidators(validators);
  }

  get good() {
    return this.service.good;
  }

  saved() {
    this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }

  haveError() {
    return (
      this.haveErrorRequired() ||
      this.haveNumericError() ||
      this.haveFloatError() ||
      this.haveMoneyError().length > 0
    );
  }

  notInt(valor: any) {
    valor = parseInt(valor);
    if (isNaN(valor)) {
      return true;
    }
    return false;
  }

  isFloat(valor: any) {
    var RE = /^\d*(\.\d{1})?\d{0,3}$/;
    if (RE.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  haveNumericError() {
    return this.row.dataType === 'N' && this.notInt(this.row.value);
  }

  haveFloatError() {
    return this.row.dataType === 'F' && !this.isFloat(this.row.value);
  }

  haveMoneyError() {
    if (this.row.attribute === 'MONEDA') {
      if (
        this.good.goodClassNumber === 62 &&
        this.row.value != 'MN' &&
        this.row.value != 'USD'
      ) {
        return 'El numerario solo acepta Moneda Nacional o dólares';
      } else if (this.good.goodClassNumber === 1424 && this.row.value != 'MN') {
        return 'El numerario solo acepta Moneda Nacional';
      } else if (
        this.good.goodClassNumber === 1426 &&
        this.row.value != 'USD'
      ) {
        return 'El numerario solo acepta Dólares (USD)';
      } else if (
        this.good.goodClassNumber === 1590 &&
        this.row.value != 'EUR'
      ) {
        return 'El numerario solo acepta Euros (EUR)';
      }
    }
    return '';
  }

  haveErrorRequired() {
    return (
      this.row.required &&
      (!this.row.value || (this.row.value && this.row.value.trim() == ''))
    );
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'Ha sido actualizada correctamente',
      `Recuerde guardar para conservar cambios`
    );
    this.modalRef.content.callback(this.row);
    this.modalRef.hide();
  }
}
