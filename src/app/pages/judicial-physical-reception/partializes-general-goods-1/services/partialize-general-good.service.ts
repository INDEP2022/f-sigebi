import { Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IBienesPar } from '../models/bienesPar.model';

@Injectable()
export class PartializeGeneralGoodService {
  formGood: FormGroup;
  good: IGood;
  formControl: FormGroup;
  isFirstCase: boolean = false;
  private _bienesPar: IBienesPar[] = [];

  get bienesPar() {
    return this._bienesPar;
  }

  set bienesPar(value) {
    this._bienesPar = value;
  }

  private columns1: any = {
    id: {
      title: 'Id.',
      type: 'string',
      sort: false,
    },
    noBien: {
      title: 'No. Bien',
      type: 'string',
      sort: false,
    },
    descripcion: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },
    proceso: {
      title: 'Proceso',
      type: 'string',
      sort: false,
    },
    cantidad: {
      title: 'Cantidad',
      type: 'string',
      sort: false,
    },
    avaluo: {
      title: 'Valor Avalúo',
      type: 'string',
      sort: false,
    },
    importe: {
      title: 'Importe',
      type: 'number',
      sort: false,
    },
  };
  private columns2: any = {
    id: {
      title: 'Id.',
      type: 'string',
      sort: false,
    },
    noBien: {
      title: 'No. Bien',
      type: 'string',
      sort: false,
    },
    descripcion: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },
    proceso: {
      title: 'Proceso',
      type: 'string',
      sort: false,
    },
    cantidad: {
      title: 'Cantidad',
      type: 'string',
      sort: false,
    },
    avaluo: {
      title: 'Valor Avalúo',
      type: 'string',
      sort: false,
    },
  };
  settingsGoods = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: true,
    },
    columns: this.columns2,
  };
  sumCant = 0;
  sumVal14 = 0;
  constructor(
    @Inject('dbPartialize') private dbPartialize: string,
    @Inject('dbSelectedGood') private dbSelectedGood: string,
    private fb: FormBuilder
  ) {}

  saveSelectedGood() {
    localStorage.setItem(this.dbSelectedGood, JSON.stringify(this.good));
  }
  savePartializeds() {
    localStorage.setItem(this.dbPartialize, JSON.stringify(this._bienesPar));
  }

  getSavedGood(): IGood {
    const good = localStorage.getItem(this.dbSelectedGood);
    return good ? JSON.parse(good) : null;
  }

  getSavedPartializedGoods(): IBienesPar[] {
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
      clasificador: [null, [Validators.required]],
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

  setSettingsFirstCase() {
    this.settingsGoods = {
      ...TABLE_SETTINGS,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      columns: this.columns1,
    };
    this.isFirstCase = true;
  }

  setSettingsSecondCase() {
    this.settingsGoods = {
      ...TABLE_SETTINGS,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      columns: this.columns2,
    };
    this.isFirstCase = false;
    this.formControl.get('saldo').setValue(+this.good.quantity);
  }
}
