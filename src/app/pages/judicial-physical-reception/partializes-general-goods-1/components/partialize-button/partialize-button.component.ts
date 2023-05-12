import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { FunctionButtons } from '../../models/function-buttons';

@Component({
  selector: 'app-partialize-button',
  templateUrl: './partialize-button.component.html',
  styleUrls: ['./partialize-button.component.scss'],
})
export class PartializeButtonComponent
  extends FunctionButtons
  implements OnInit
{
  @Input() set press(value: boolean) {
    if (this.service) {
      if (
        this.form?.invalid ||
        this.formGood?.invalid ||
        this.vsum >= this.vimporte ||
        this.loading
      ) {
        return;
      }
      this.partialize();
    }
  }
  v_inmueble: number;
  vres: number;
  vident: number;
  get sumCant() {
    return this.service.sumCant;
  }
  get sumVal14() {
    return this.service.sumVal14;
  }
  get vimporte() {
    return this.service.vimporte;
  }
  get cantPar() {
    return this.form.get('cantPar');
  }
  get cantidad() {
    return this.form.get('cantidad');
  }
  get vsum() {
    return this.service.vsum;
  }

  constructor(private goodSSSubtypeService: GoodSssubtypeService) {
    super();
  }

  private validationImporte() {
    // debugger;
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      if (cantidad < 0.1) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible realizar la parcialización'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
    } else {
      if (cantidad != 1 && cantidad != this.vimporte) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'El numerario no tiene consistencia'
        );
        this.form.get('ind').setValue('S');
        return false;
      } else if (this.vimporte < 2) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No posible importe menor a 2'
        );
        return false;
      }
    }
    return true;
  }

  private async validationInmueble() {
    const clasificador = this.good.goodClassNumber;
    const inmuebleValidation = await firstValueFrom(
      this.goodSSSubtypeService.getAll2(
        'filter.numType=$in:2,6&filter.numClasifGoods=' + clasificador
      )
    );
    this.v_inmueble = inmuebleValidation.count;
    if (this.v_inmueble > 0) {
      if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar bien en fracciones'
        );
        return false;
      }
    }
    return true;
  }

  private async validationDecimales() {
    const fraccion = this.good.fraccion;
    // if (!fraccion) {
    //   this.onLoadToast(
    //     'error',
    //     'Parcialización',
    //     'No es posible parcializar bien en fracciones'
    //   );
    //   return false;
    // }
    const unidad = this.good.unit;
    // if (fraccion.decimalAmount === 'N' && !this.validationClasif()) {
    //   if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
    //     this.onLoadToast(
    //       'error',
    //       'Parcialización',
    //       'No es posible parcializar bien en fracciones'
    //     );
    //     return false;
    //   }
    // }
    // return true;

    let decimales;
    try {
      const decimalesValidation = await firstValueFrom(
        this.goodService.getMeasurementUnits(unidad)
      );
      decimales = decimalesValidation.data.decimales;
    } catch (x) {}

    //fraccion.decimalAmount === 'N'
    if (decimales === 'N' && !this.validationClasif()) {
      if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar bien en fracciones'
        );
        return false;
      }
    }
    return true;
  }

  private async validationNumerario() {
    const clasificador = this.good.goodClassNumber;
    const numerarioValidation = await firstValueFrom(
      this.goodSSSubtypeService.getAll2('filter.numClasifGoods=' + clasificador)
    );
    this.v_numerario = numerarioValidation.count;
    if (this.v_numerario === 0) {
      if (this.cantidad.value === this.formGood.get('cantidad').value) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se puede parcializar la misma cantidad que el bien padre'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
    }
    return true;
  }

  private fillAvaluo() {
    debugger;
    if (this.good.appraisedValue) {
      const algo = +(this.good.appraisedValue + '') * this.vfactor;
      const newValue = +algo.toFixed(2);
      return newValue;
    } else {
      return null;
    }
  }

  private fillDescription(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string
  ) {
    if (this.v_numerario === 0) {
      let result =
        ', (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ' (' +
        v_cantidad +
        ' ' +
        v_unidad +
        '), ' +
        this.formGood.get('descripcion').value;
      result = result.length > 1250 ? result.substring(1, 1250) : result;

      return 'Bien por ' + this.cantidad.value + ' ' + v_unidad + result + ' )';
    } else {
      let result =
        ' (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ', ' +
        this.formGood.get('descripcion').value +
        ' )';
      result = result.length > 1250 ? result.substring(1, 1250) : result;
      return (
        'Numerario por $' +
        (this.cantidad.value + '').trim() +
        ' ' +
        v_avaluo +
        result
      );
    }
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    // const clasificador = this.formGood.get('clasificador').value;
    if (this.validationClasif()) {
      importe = this.cantidad.value;
      const cantGood = this.good.quantity;
      if (+(cantGood + '') !== 1) {
        cantidad = this.cantidad.value;
      } else {
        cantidad = cantGood;
      }
    } else {
      cantidad = this.cantidad.value;
    }
    return { importe, cantidad };
  }

  private fillRow(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string,
    newImporte: number
  ) {
    // debugger;
    this.vfactor = this.cantidad.value / this.vimporte;
    console.log(this.cantidad.value, this.vimporte);
    this.vres = this.vimporte - newImporte;
    this.vident = 0;
    if (this.bienesPar[this.bienesPar.length - 2]) {
      this.vident = this.bienesPar[this.bienesPar.length - 1].id;
    }
    this.vident++;
    const descripcion = this.fillDescription(v_cantidad, v_unidad, v_avaluo);
    const proceso = this.good.extDomProcess;
    const avaluo = this.fillAvaluo();
    console.log(avaluo);
    const { importe, cantidad } = this.fillImporteCant();
    const noBien = this.good.goodId;
    this.service.sumCant += cantidad;
    this.service.sumVal14 += importe;
    // this.vident++;
    this.bienesPar.push({
      id: this.vident,
      noBien,
      descripcion,
      proceso,
      cantidad,
      avaluo,
      importe,
      val10: 0,
      val11: 0,
      val12: 0,
      val13: 0,
    });
  }

  private async partializeContent() {
    // debugger;
    this.form.get('ind').setValue('N');
    if (this.form.valid && this.formGood.valid) {
      // debugger;
      console.log(this.sumCant + '', this.sumVal14 + '');
      if (!this.validationImporte()) return;
      // this.vsum = 0;
      const validationIn = await this.validationInmueble();
      if (!validationIn) return;
      const validationDec = await this.validationDecimales();
      if (!validationDec) return;
      const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      // if (!v_cantidad || !v_unidad || !v_avaluo) {
      //   this.onLoadToast(
      //     'error',
      //     'Parcialización',
      //     'No es posible parcializar, no tiene unidades de medida '
      //   );
      //   return;
      // }

      const validationNum = await this.validationNumerario();
      if (!validationNum) return;
      // if (!this.validationClasif()) {
      //   this.vsum = this.sumCant ?? 0;
      // } else {
      //   this.vsum = this.sumVal14 ?? 0;
      // }
      console.log(this.sumCant + '', this.sumVal14 + '');

      const newImporte: number =
        this.cantPar.value * this.cantidad.value + this.vsum;
      if (newImporte > this.vimporte) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar, excede por ' +
            (newImporte - this.vimporte)
        );
        this.form.get('ind').setValue('S');
        return;
      }
      this.bienesPar.pop();
      // debugger;
      for (let index = 0; index < this.cantPar.value; index++) {
        this.fillRow(v_cantidad, v_unidad, v_avaluo, newImporte);
      }
      this.bienesPar.push({
        id: null,
        noBien: null,
        descripcion: null,
        proceso: null,
        cantidad: this.service.sumCant,
        avaluo: null,
        importe: this.service.sumVal14,
        val10: 0,
        val11: 0,
        val12: 0,
        val13: 0,
      });
      this.bienesPar = [...this.bienesPar];
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
    }
  }

  async partialize() {
    this.loading = true;
    // debugger;
    await this.partializeContent();
    this.loading = false;
  }
}
