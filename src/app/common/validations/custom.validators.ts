import { AbstractControl, ValidatorFn } from '@angular/forms';

function transferenteAndAct(actValue: any): ValidatorFn {
  return (
    control: AbstractControl
  ): { [key: string]: { transferent: any } } | null => {
    const acta = actValue;
    if (control.value != null) {
      const transfer = control.value;
      if (
        acta === 'A' &&
        transfer.transferentkey != 'PGR' &&
        transfer.transferentkey != 'PJF'
      ) {
        return { TransferenteAndAct: { transferent: transfer.transferentkey } };
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}

export { transferenteAndAct };
