import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IBienesPar } from '../models/bienesPar.model';

export abstract class PartializeGeneralGood {
  formGood: FormGroup;
  good: IGood;
  formControl: FormGroup;
  // isFirstCase: boolean = false;
  formLoading = false;
  buttonsLoading = false;
  private _bienesPar: IBienesPar[] = [];
  get bienesPar() {
    return this._bienesPar;
  }
  set bienesPar(value) {
    this._bienesPar = value;
  }
  // settingsGoods = {
  //   ...TABLE_SETTINGS,
  //   actions: {
  //     columnTitle: 'Acciones',
  //     position: 'right',
  //     add: false,
  //     edit: false,
  //     delete: true,
  //   }
  // };
  settingsGoods = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  sumCant = 0;
  sumVal14 = 0;
  constructor(
    protected dbPartialize: string,
    protected dbSelectedGood: string,
    protected fb: FormBuilder
  ) {}

  get vsum() {
    return !this.validationClasif() ? this.sumCant : this.sumVal14;
  }

  get vimporte() {
    return !this.validationClasif()
      ? +(this.good.quantity + '')
      : this.good.val14
      ? +this.good.val14.trim()
      : -1;
  }

  validationClasif() {
    return [1424, 1426, 1427, 1575, 1590].includes(+this.good.goodClassNumber);
  }

  savePartializeds() {
    // localStorage.setItem(this.dbPartialize, JSON.stringify(this._bienesPar));
  }

  saveSelectedGood() {
    // localStorage.setItem(this.dbSelectedGood, JSON.stringify(this.good));
  }

  getSavedGood(): IGood {
    return null;
    const good = localStorage.getItem(this.dbSelectedGood);
    return good ? JSON.parse(good) : null;
  }

  getSavedPartializedGoods(): IBienesPar[] {
    console.log(this.dbPartialize);
    const partializeds = localStorage.getItem(this.dbPartialize);
    return partializeds ? JSON.parse(partializeds) : [];
  }

  initFormGood() {
    this.formGood = this.fb.group({
      noBien: [null, [Validators.required]],
      cantPadre: [null],
      descripcion: [null],
      cantidad: [null],
      avaluo: [null],
      estatus: [null],
      estatusDescripcion: [null],
      extDom: [null],
      moneda: [null],
      expediente: [null],
      clasificador: [null],
      clasificadorDescripcion: [null],
      importe: [null],
    });
  }

  initFormControl() {
    this.formControl = this.fb.group({
      ind: [null],
      cantPar: [null, [Validators.required, Validators.min(1)]],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      saldo: [null, [Validators.required, Validators.min(1)]],
    });
  }
}
