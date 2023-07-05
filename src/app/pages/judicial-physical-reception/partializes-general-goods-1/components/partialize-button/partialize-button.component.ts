import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
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
    // debugger;
    if (this.service) {
      // console.log(this.vsum, this.vimporte);
      if (
        this.form?.invalid ||
        !this.good ||
        this.vsum >= this.vimporte ||
        this.loading
      ) {
        return;
      }
      this.partialize();
    }
  }
  @Output() filledRow = new EventEmitter();
  @Output() notFilledRow = new EventEmitter();
  v_inmueble: number;
  vres: number;
  vresVal14: number;
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

  private validationImporte2() {
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      // this.vimporte = +(cantidad + '');
      if (+(this.good.quantity + '') < 2 || isNaN(+this.good.quantity)) {
        this.alert(
          'error',
          'Parcialización',
          'No es posible realizar la parcialización'
        );
        // this.form.get('ind').setValue('S');
        return false;
      }
      // this.vsum = this.sumCant ?? 0;
    } else {
      // const searchRegExp = new RegExp(',', 'g');
      // this.vimporte = Number((+this.good.val2).toFixed(4));
      // this.vsum = this.sumVal14 ?? 0;
      if (
        isNaN(+this.good.val2) ||
        (cantidad != 1 && cantidad != this.vimporte)
      ) {
        this.alert(
          'error',
          'Parcialización',
          'El numerario no tiene consistencia'
        );
        // this.form.get('ind').setValue('S');
        return false;
      } else if (this.vimporte < 2) {
        this.alert('error', 'Parcialización', 'No posible importe menor a 2');
        return false;
      }
    }
    return true;
  }

  private validationImporte() {
    // debugger;
    console.log(this.good);
    const cantidad = +this.good.quantity;
    if (!this.validationClasif()) {
      if (cantidad < 0.1) {
        // if (this.version === 1 ? cantidad < 0.1 : cantidad < 2) {
        this.alert(
          'error',
          'Parcialización',
          'No es posible realizar la parcialización'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
    } else {
      if (cantidad != 1 && cantidad != this.vimporte) {
        this.alert(
          'error',
          'Parcialización',
          'El numerario no tiene consistencia'
        );
        this.form.get('ind').setValue('S');
        return false;
      } else if (this.vimporte < 2) {
        this.alert('error', 'Parcialización', 'No posible importe menor a 2');
        return false;
      }
    }
    return true;
  }

  private async validationInmueble() {
    const clasificador = this.good.goodClassNumber;
    const inmuebleValidation = await firstValueFrom(
      this.goodSSSubtypeService
        .getAll2('filter.numType=$in:2,6&filter.numClasifGoods=' + clasificador)
        .pipe(catchError(error => of({ count: 0 })))
    );
    this.v_inmueble = inmuebleValidation.count;
    if (this.v_inmueble > 0) {
      if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
        this.alert(
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
    // const fraccion = this.good.fraccion;
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
        this.alert(
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
      this.goodSSSubtypeService
        .getAll2('filter.numType=$in:7&filter.numClasifGoods=' + clasificador)
        .pipe(catchError(error => of({ count: 0 })))
    );
    // debugger;
    this.v_numerario = numerarioValidation
      ? numerarioValidation.count
        ? numerarioValidation.count
        : 0
      : 0;

    if (this.v_numerario === 0) {
      if (this.cantidad.value === this.good.quantity) {
        this.alert(
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
    // debugger;
    if (this.good.appraisedValue) {
      const algo = +(this.good.appraisedValue + '') * this.vfactor;
      const newValue = +algo.toFixed(2);
      return newValue;
    } else {
      return null;
    }
  }

  private fillDescriptionv2() {
    let descripcion =
      'Parcialización de Bien No.' +
      this.good.id +
      ', ' +
      this.good.description;
    return descripcion.length > 1250
      ? descripcion.substring(0, 1250)
      : descripcion;
  }

  private fillDescription(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string
  ) {
    // debugger;
    if (this.v_numerario === 0) {
      let result =
        ', (Producto de la Parcialización de Bien No. ' +
        this.good.goodId +
        ' (' +
        v_cantidad +
        ' ' +
        v_unidad +
        '), ' +
        this.good.description;
      result = result.length > 1250 ? result.substring(1, 1250) : result;

      return 'Bien por ' + this.cantidad.value + ' ' + v_unidad + result + ' )';
    } else {
      let result =
        ' (Producto de la Parcialización de Bien No.' +
        this.good.goodId +
        ', ' +
        this.good.description +
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

  private fillRowv2() {
    // this.vfactornum = vfactornum;
    // console.log(this.cantidad.value, this.vimporte);
    this.vident = 0;
    if (this.bienesPar[this.bienesPar.length - 2]) {
      this.vident = this.bienesPar[this.bienesPar.length - 1].id;
    }
    this.vident++;
    const descripcion = this.fillDescriptionv2();
    const proceso = this.good.extDomProcess;
    const avaluo = this.fillAvaluo();
    console.log(avaluo);
    const { importe, cantidad } = this.fillImporteCant();
    // const noBien = this.good.goodId;
    this.service.sumCant += +(cantidad + '');
    this.service.sumVal14 += +(importe + '');
    this.bienesPar.push({
      id: this.vident,
      noBien: null,
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

  private fillRow(v_cantidad: number, v_unidad: string, v_avaluo: string) {
    // debugger;

    if (this.bienesPar[this.bienesPar.length - 2]) {
      this.vident = this.bienesPar[this.bienesPar.length - 1].id;
    }
    this.vident++;
    const descripcion = this.fillDescription(v_cantidad, v_unidad, v_avaluo);
    const proceso = this.good.extDomProcess;
    const avaluo = this.fillAvaluo();
    console.log(avaluo);
    const { importe, cantidad } = this.fillImporteCant();
    // const noBien = this.good.goodId;
    if (cantidad) {
      this.service.sumCant += +(cantidad + '');
      this.service.sumCant = +this.service.sumCant.toFixed(2);
    }

    if (importe) {
      this.service.sumVal14 += +(importe + '');
      this.service.sumVal14 = +this.service.sumVal14.toFixed(2);
    }

    if (avaluo) {
      this.service.sumAvaluo += +(avaluo + '');
      this.service.sumAvaluo = +this.service.sumAvaluo.toFixed(2);
    }

    // this.vident++;
    this.bienesPar.push({
      id: this.vident,
      noBien: null,
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

  private fillBienesParV2() {
    for (let index = 0; index < this.cantPar.value; index++) {
      this.fillRowv2();
    }
    this.bienesPar = [...this.bienesPar];
    this.filledRow.emit();
    this.form.get('saldo').setValue(this.vres);
  }

  private calcImporte() {
    // debugger;
    this.service.clasificators.includes(this.good.goodClassNumber + '');
    const newImporte: number =
      +this.cantPar.value * +this.cantidad.value + this.vsum;
    if (newImporte > this.vimporte) {
      this.alert(
        'error',
        'Parcialización',
        'No es posible parcializar, excede por ' + (newImporte - this.vimporte)
      );
      this.form.get('ind').setValue('S');
      return 0;
    }
    return newImporte;
  }

  private fillBienesParV1(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string
  ) {
    this.bienesPar.pop();
    // debugger;
    for (let index = 0; index < this.cantPar.value; index++) {
      this.fillRow(v_cantidad, v_unidad, v_avaluo);
    }
    this.bienesPar.push({
      id: null,
      noBien: null,
      descripcion: null,
      proceso: null,
      cantidad: this.service.sumCant,
      avaluo: this.service.sumAvaluo,
      importe: this.service.sumVal14,
      val10: 0,
      val11: 0,
      val12: 0,
      val13: 0,
    });
    this.bienesPar = [...this.bienesPar];
    this.filledRow.emit();
    this.form.get('saldo').setValue(this.vres.toFixed(2));
    return true;
  }

  private async partializeContent() {
    // debugger;
    this.form.get('ind').setValue('N');
    if (this.form.valid && this.good) {
      // debugger;
      console.log(this.sumCant + '', this.sumVal14 + '');
      if (!this.validationImporte()) return false;

      // if (this.version === 1) {
      //   if (!this.validationImporte()) return;
      // } else {
      //   if (!this.validationImporte2()) return;
      // }

      // this.vsum = 0;
      let v_cantidad, v_unidad, v_avaluo;

      if (this.version === 1) {
        const validationIn = await this.validationInmueble();
        if (!validationIn) return false;
        const validationDec = await this.validationDecimales();
        if (!validationDec) return false;
        const result = await this.setMeasureData();
        console.log(result);
        v_cantidad = result.v_cantidad;
        v_unidad = result.v_unidad;
        v_avaluo = result.v_avaluo;
        // if (!v_cantidad || !v_unidad || !v_avaluo) {
        //   this.onLoadToast(
        //     'error',
        //     'Parcialización',
        //     'No es posible parcializar, no tiene unidades de medida '
        //   );
        //   return;
        // }

        const validationNum = await this.validationNumerario();
        if (!validationNum) return false;
        const newImporte = this.calcImporte();
        if (newImporte === 0) return false;
        // if (!this.validationClasif()) {
        //   this.vsum = this.sumCant ?? 0;
        // } else {
        //   this.vsum = this.sumVal14 ?? 0;
        // }
        this.vfactor = this.cantidad.value / this.vimporte;
        console.log(this.cantidad.value, this.vimporte);
        this.vres = this.vimporte - newImporte;
        this.vident = 0;
        return this.fillBienesParV1(v_cantidad, v_unidad, v_avaluo);
      } else {
        return false;
        // this.vfactor = this.cantidad.value / this.vimporte;
        // this.vres = this.vimporte - newImporte;
        // this.fillBienesParV2();
      }
      console.log(this.sumCant + '', this.sumVal14 + '');
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
      return false;
    }
  }

  async partialize() {
    this.loading = true;
    // debugger;
    const result = await this.partializeContent();
    if (!result) {
      this.notFilledRow.emit();
    }
    this.loading = false;
  }
}
