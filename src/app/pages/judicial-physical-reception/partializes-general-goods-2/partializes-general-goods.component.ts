import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from '../partializes-general-goods-1/models/bienesPar.model';
import { PartializeGeneralGoodService } from '../partializes-general-goods-1/services/partialize-general-good.service';
import { Apply } from './models/apply';
import { CheckSum } from './models/checksum';
import { Partialize } from './models/partialize';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent
  extends BasePage
  implements OnInit
{
  @Input() firstCase = false;
  vestatus: string;
  partializeObj = new Partialize();
  checkSumObj = new CheckSum();
  applyObj = new Apply();
  constructor(private service: PartializeGeneralGoodService) {
    super();
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  ngOnInit(): void {
    this.service.initFormControl();
    this.bienesPar = this.service.getSavedPartializedGoods();
  }

  cleanBlock() {
    this.form.get('veces').setValue(null);
    this.form.get('cantidad').setValue(null);
    this.form.get('saldo').setValue(null);
    this.bienesPar = [];
  }

  get bienesPar() {
    return this.service.bienesPar;
  }
  set bienesPar(value) {
    this.service.bienesPar = value;
  }

  get form() {
    return this.service.formControl;
  }
  get formGood() {
    return this.service.formGood;
  }
  get cantPar() {
    return this.form.get('cantPar');
  }
  get cantidad() {
    return this.form.get('cantidad');
  }
  get saldo() {
    return this.form.get('saldo');
  }

  checkSum(pindica: string) {
    // debugger;
    this.loading = true;
    if (this.form.valid && this.formGood.valid) {
      this.checkSumObj.execute(pindica);
    }
    this.loading = false;
  }

  deleteRow(row: { data: IBienesPar; index: number }) {
    console.log(row);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'info',
          'Parcialización',
          'Eliminada la parcialización ' + row.data.id
        );
        if (row.index === 0) {
          this.bienesPar.shift();
        } else {
          this.bienesPar = this.bienesPar
            .slice(0, row.index - 1)
            .concat(this.bienesPar[this.bienesPar.length - 1]);
        }
        console.log(this.bienesPar);
        this.bienesPar = [...this.bienesPar];
        this.service.savePartializeds();
      }
    });
  }

  async partialize() {
    this.loading = true;
    // debugger;
    // this.ind.setValue('N');
    if (this.form.valid && this.formGood.valid) {
      const vres = this.partializeObj.execute(
        this.cantPar.value,
        this.cantidad.value
      );
      if (vres === null) {
        this.loading = false;
        return;
      }
      // this.saldo.setValue(vres);
      this.service.savePartializeds();
      // this.ind.setValue('S');
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
    }
    this.loading = false;
  }

  async apply() {
    this.loading = true;
    this.form.get('ind').setValue('N');
    if (this.formGood.valid) {
      await this.applyObj.execute();
    }
    this.loading = false;
  }
}
