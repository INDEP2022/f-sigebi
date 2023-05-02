import { PartializeFunctions } from './partialize-functions';

export class Partialize extends PartializeFunctions {
  vsum: number;
  vident: number;
  vimporte: number;
  vfactor: number;
  cantidad: number;
  vres: number;
  execute(cantPar: number, cantidad: number) {
    // debugger;
    if (!this.validationImporte()) return null;
    this.cantidad = cantidad;
    this.vsum = 0;
    this.vident = 0;
    this.bienesPar.forEach(item => {
      if (!this.validationClasif()) {
        this.vsum += item.cantidad;
      } else {
        this.vsum += item.importe;
      }
      this.vident = item.id;
    });
    const newImporte = cantPar * cantidad + this.vsum;
    if (newImporte > this.vimporte) {
      this.onLoadToast(
        'error',
        'Parcialización',
        'No es posible parcializar, excede por ' + (newImporte - this.vimporte)
      );
      // this.form.get('ind').setValue('S');
      return null;
    }
    this.vfactor = cantidad / this.vimporte;
    this.vres = this.vimporte - newImporte;
    for (let index = 0; index < cantPar; index++) {
      this.fillRow();
    }
    this.bienesPar = [...this.bienesPar];
    return this.vres;
  }

  private fillAvaluo() {
    // debugger;
    if (this.good.appraisedValue) {
      return +(+(this.good.appraisedValue + '') * this.vfactor).toFixed(2);
    } else {
      return null;
    }
  }

  private fillDescription() {
    let descripcion =
      'Parcialización de Bien No.' +
      this.good.id +
      ', ' +
      this.good.description;
    return descripcion.length > 1250
      ? descripcion.substring(0, 1250)
      : descripcion;
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    // const clasificador = this.formGood.get('clasificador').value;
    if (this.validationClasif()) {
      importe = Number(this.cantidad.toFixed(2));
      const cantGood = this.good.quantity;
      if (cantGood !== 1) {
        cantidad = this.cantidad;
      } else {
        cantidad = cantGood;
      }
    } else {
      cantidad = this.cantidad;
    }
    return { importe, cantidad };
  }

  private fillRow() {
    // this.vfactornum = vfactornum;
    // console.log(this.cantidad.value, this.vimporte);
    this.vident = 0;
    if (this.bienesPar[this.bienesPar.length - 2]) {
      this.vident = this.bienesPar[this.bienesPar.length - 1].id;
    }
    this.vident++;
    const descripcion = this.fillDescription();
    const proceso = this.good.extDomProcess;
    const avaluo = this.fillAvaluo();
    console.log(avaluo);
    const { importe, cantidad } = this.fillImporteCant();
    const noBien = this.good.goodId;
    this.service.sumCant += cantidad;
    this.service.sumVal14 += importe;
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

  private validationImporte() {
    // debugger;
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      this.vimporte = +(cantidad + '');
      if (+(this.good.quantity + '') < 2 || isNaN(+this.good.quantity)) {
        this.onLoadToast(
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
      this.vimporte = Number((+this.good.val2).toFixed(4));
      // this.vsum = this.sumVal14 ?? 0;
      if (
        isNaN(+this.good.val2) ||
        (cantidad != 1 && cantidad != this.vimporte)
      ) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'El numerario no tiene consistencia'
        );
        // this.form.get('ind').setValue('S');
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
}
