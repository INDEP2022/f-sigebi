import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IBienesPar } from '../models/bienesPar.model';
import { columnsFirstCase, columnsSecondCase } from '../models/columns';

export abstract class PartializeGeneralGood {
  formGood: FormGroup;
  good: IGood;
  formControl: FormGroup;
  // isFirstCase: boolean = false;
  formLoading = false;
  buttonsLoading = false;
  pageLoading = false;
  pagedBienesPar: any[] = [];
  firstCase = true;
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
  settingsGoodsFirstCase = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: columnsFirstCase,
  };
  settingsGoodsSecondCase = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: columnsSecondCase,
  };
  sumCant = 0;
  sumVal14 = 0;
  noActa: number = 0;
  clasificators: string = '1424, 1426, 1427, 1575, 1590';
  protected dbPartialize: string;
  protected dbSelectedGood: string;
  constructor(protected fb: FormBuilder) {}

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
    return this.good
      ? this.clasificators.includes(this.good.goodClassNumber + '')
      : false;
  }

  savePartializeds() {
    // localStorage.setItem(this.dbPartialize, JSON.stringify(this._bienesPar));
  }

  saveSelectedGood() {
    this.bienesPar = [];
    this.pagedBienesPar = [];
    localStorage.setItem(this.dbSelectedGood, JSON.stringify(this.good));
  }

  getSavedGood(): IGood {
    // return null;
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
