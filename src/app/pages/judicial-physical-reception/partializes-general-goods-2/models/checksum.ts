import { PartializeFunctions } from './partialize-functions';

export class CheckSum extends PartializeFunctions {
  private getBan(vsum: number) {
    if (this.validationClasif() && vsum > +(+this.good.val2).toFixed(4)) {
      return true;
    } else if (!this.validationClasif() && vsum > this.good.quantity) {
      return true;
    }
    return false;
  }

  execute(pindica: string) {
    let vsum: number;
    let vban: boolean;
    if (this.bienesPar.length === 0) {
      if (pindica === 'V') {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se tiene registros a verificar'
        );
      } else {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se tiene registros a aplicar'
        );
      }
      return false;
    }
    vsum = 0;
    this.bienesPar.forEach(item => {
      if (this.validationClasif()) {
        vsum += Number(item.importe.toFixed(4));
      } else {
        vsum += item.cantidad;
      }
    });
    vban = this.getBan(vsum);
    if (vban) {
      this.onLoadToast(
        'error',
        'Parcialización',
        'La sumatoria excede del importe total (' + vsum + ')'
      );
      return false;
    } else if (pindica === 'V') {
      this.onLoadToast(
        'success',
        'Parcialización',
        'La sumatoria es correcta (' + vsum + ')'
      );
    }
    return true;
  }
}
