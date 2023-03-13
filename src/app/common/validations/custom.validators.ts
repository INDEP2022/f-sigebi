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
        transfer.keyTransferent != 'PGR' &&
        transfer.keyTransferent != 'PJF'
      ) {
        return { TransferenteAndAct: { transferent: transfer.keyTransferent } };
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}

export { transferenteAndAct };
