import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from './models/bienesPar.model';
import { PartializeGeneralGoodService } from './services/partialize-general-good.service';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent
  extends BasePage
  implements OnInit
{
  v_numerario: any;
  vfactor: any;
  constructor(private service: PartializeGeneralGoodService) {
    super();
  }

  get bienesPar() {
    return this.service.bienesPar;
  }
  set bienesPar(value) {
    this.service.bienesPar = value;
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  get isFirstCase() {
    return this.service.isFirstCase;
  }

  ngOnInit(): void {
    this.service.initFormControl();
    this.bienesPar = [...this.service.getSavedPartializedGoods()];
  }

  cleanBlock() {
    this.form.get('cantPar').setValue(null);
    this.form.get('cantidad').setValue(null);
    this.form.get('saldo').setValue(null);
    this.bienesPar = [];
  }

  get form() {
    return this.service.formControl;
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
            .slice(0, row.index)
            .concat(this.bienesPar[this.bienesPar.length - 1]);
        }
        this.bienesPar[this.bienesPar.length - 1].cantidad -= row.data.cantidad;
        this.service.sumCant -= row.data.cantidad;
        this.service.sumVal14 -= row.data.importe;
        // this.bienesPar[this.bienesPar.length - 1].avaluo -= row.data.avaluo;
        this.bienesPar[this.bienesPar.length - 1].importe -= row.data.importe;
        if (this.bienesPar[this.bienesPar.length - 1].cantidad === 0) {
          this.bienesPar.pop();
        }
        this.bienesPar = [...this.bienesPar];
        this.service.savePartializeds();
      }
    });
  }
}
