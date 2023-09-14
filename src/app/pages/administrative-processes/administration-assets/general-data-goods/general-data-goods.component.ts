import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { getClassColour } from 'src/app/pages/general-processes/goods-characteristics/goods-characteristics/good-table-vals/good-table-vals.component';
import { CharacteristicGoodCellComponent } from '../../change-of-good-classification/change-of-good-classification/characteristicGoodCell/characteristic-good-cell.component';
import { ChangeOfGoodCharacteristicService } from '../../change-of-good-classification/services/change-of-good-classification.service';
import { ModelForm } from './../../../../core/interfaces/model-form';
import { ATRIBUT_ACT_COLUMNS } from './columns';
//import { ChangeOfGoodCharacteristicService } from './services/change-of-good-classification.service';

@Component({
  selector: 'app-general-data-goods',
  templateUrl: './general-data-goods.component.html',
  styles: [],
})
export class GeneralDataGoodsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() goodId: number;
  generalDataForm: ModelForm<any>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  list: { atributo: string; valor: string }[] = [];
  good: IGood = {};
  data: any = {};
  classificationOfGoods: number;
  atributNewSettings: any;
  atributActSettings: any;
  goodChange: number = 0;
  service = inject(ChangeOfGoodCharacteristicService);
  viewAct: boolean = false;
  disableUpdate: boolean = false;

  get dataAtribute() {
    return this.service.data;
  }
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly goodQueryService: GoodsQueryService
  ) {
    super();
    this.atributActSettings = {
      ...this.settings,
      actions: null,
      hideSubHeader: false,
      columns: { ...ATRIBUT_ACT_COLUMNS },
    };
    this.atributNewSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.good };
          },
          renderComponent: CharacteristicGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, false) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(changes);
      this.getGood();
    }
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  esTipoFecha(variable: any): boolean {
    return variable instanceof Date;
  }

  updateGood() {
    let required: boolean = false;
    this.dataAtribute.forEach((item: any) => {
      if (item.required && (item.value === null || item.value === '')) {
        required = true;
      }
    });
    if (required) {
      this.alert('warning', 'Debe Registrar los Atributos Requeridos.', '');
      return;
    }
    const patron: RegExp =
      /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/((19|20)\d\d)$/;
    let body: any = {};
    console.log('ATRIBUTOS DESDE GENERAL', this.dataAtribute);
    this.dataAtribute.forEach((row: any) => {
      if (patron.test(row.value)) {
        row.value = this.convertirFecha(row.value);
      }
      body[row.column] = row.value;
    });
    body['quantitySae'] = this.generalDataForm.get('cantidad').value;
    if (this.generalDataForm.get('fechaFe').value === null) {
      body['judicialDate'] = this.generalDataForm.get('fechaFe').value;
    } else {
      if (this.esTipoFecha(this.generalDataForm.get('fechaFe').value)) {
        body['judicialDate'] = this.obtenerFecha(
          this.generalDataForm.get('fechaFe').value
        );
      } else {
        body['judicialDate'] = this.formatDate2(
          this.generalDataForm.get('fechaFe').value
        );
      }
    }
    body['observations'] = this.generalDataForm.get('observacion').value;
    body['description'] = this.generalDataForm.get('descripcion').value;
    body['id'] = Number(this.good.id);
    body['goodId'] = Number(this.good.id);
    body['goodClassNumber'] = Number(this.good.goodClassNumber);
    this.goodService.update(body).subscribe({
      next: resp => {
        this.viewAct = !this.viewAct;
        this.disableUpdate = !this.disableUpdate;
        this.good = resp;
        this.alert('success', 'El Bien se ha Actualizado', '');
        setTimeout(() => {
          this.goodChange++;
        }, 100);
      },
      error: err => {
        this.alert('error', 'Error al Actualizar el Bien', '');
      },
    });
  }

  convertirFecha(fechaOriginal: any): string {
    const [dia, mes, anio] = fechaOriginal.split('/');
    const fechaObjeto: Date = new Date(`${mes}/${dia}/${anio}`);
    const anioFormateado: string = fechaObjeto.getFullYear().toString();
    const mesFormateado: string = (fechaObjeto.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const diaFormateado: string = fechaObjeto
      .getDate()
      .toString()
      .padStart(2, '0');
    const fechaFormateada: string = `${anioFormateado}-${mesFormateado}-${diaFormateado}`;
    return fechaFormateada;
  }

  convertirFecha2(fecha: string | Date): string {
    let fechaObj: Date;
    if (typeof fecha === 'string') {
      fechaObj = new Date(fecha);
    } else {
      fechaObj = fecha;
    }
    const anio = fechaObj.getFullYear();
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    const fechaObjeto: Date = new Date(`${mes}/${dia}/${anio}`);
    const anioFormateado: string = fechaObjeto.getFullYear().toString();
    const mesFormateado: string = (fechaObjeto.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const diaFormateado: string = fechaObjeto
      .getDate()
      .toString()
      .padStart(2, '0');
    const fechaFormateada: string = `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
    return fechaFormateada;
  }

  private getGood() {
    this.goodService.getById(this.goodId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.classificationOfGoods = Number(response.data[0].goodClassNumber);
        this.good = response.data[0];
        this.generalDataForm.get('cantidad').patchValue(this.good.quantitySae);
        this.generalDataForm
          .get('fechaFe')
          .patchValue(
            this.good.judicialDate === undefined ||
              this.good.judicialDate === null
              ? null
              : this.formatDate(this.good.judicialDate.toString())
          );
        this.generalDataForm
          .get('observacion')
          .patchValue(this.good.observations);
        this.generalDataForm
          .get('descripcion')
          .patchValue(this.good.description);
        setTimeout(() => {
          this.goodChange++;
        }, 100);
      },
    });
  }
  private prepareForm() {
    this.generalDataForm = this.fb.group({
      descripcion: [null, Validators.maxLength(4000)],
      cantidad: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.min(1)],
      ],
      fechaFe: [null],
      observacion: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(600)],
      ],
    });
  }
  update() {
    this.viewAct = !this.viewAct;
    this.disableUpdate = !this.disableUpdate;
    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  formatDate(fecha: string) {
    return fecha.split('T')[0].split('-').reverse().join('/');
  }
  formatDate2(fecha: string) {
    return fecha.split('T')[0].split('/').reverse().join('-');
  }
  obtenerFecha(fecha: string): string {
    const fechaActual = new Date(fecha);
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${year}-${month}-${day}`;
    return fechaFormateada;
  }
}

/* for (let i = 1; i <= 120; i++) {
  this.data[`val${i}`] = '';
}
for (const i in val) {
  for (const j in this.data) {
    if (j == i) {
      this.data[j] = val[i];
    }
  }
}
let dataParam = this.params.getValue();
dataParam.limit = 120;
dataParam.addFilter('classifGoodNumber', this.good.goodClassNumber);
this.goodQueryService.getAllFilter(dataParam.getParams()).subscribe({
  next: val => {
    let ordered = val.data.sort(
      (a, b) => a.columnNumber - b.columnNumber
    );
    ordered.forEach((order, index) => {
      if (order) {
        this.list.push({
          atributo: order.attribute,
          valor: this.data[`val${index + 1}`] ?? '',
        });
      }
    });
  },
}); */
