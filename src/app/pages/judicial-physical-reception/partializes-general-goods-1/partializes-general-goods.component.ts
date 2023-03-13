import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent implements OnInit {
  form: FormGroup;
  settings = {
    ...TABLE_SETTINGS,

    actions: false,
    columns: {
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
    },
    noDataMessage: 'No se encontrarón registros',
  };
  data = EXAMPLE_DATA;
  itemsSelect = new DefaultSelect();
  types = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private goodTypesService: GoodTypeService,
    private goodsQueryService: GoodsQueryService
  ) {
    // this.goodService.getAll(new ListParams()).subscribe(x => {
    //   console.log(x);
    // });
    // this.goodTypesService.search(new ListParams()).subscribe(x => {});
    // this.goodsQueryService.getAtributeClassificationGood(new ListParams()).subscribe(x => {
    //   console.log(x);
    // });
  }

  ngOnInit(): void {
    this.prepareForm();
    const total: number = this.data
      .map(element => element.cantidad)
      .reduce((prev, curr) => prev + curr, 0);
    this.data.push({
      id: null,
      noBien: null,
      descripcion: null,
      proceso: null,
      cantidad: total,
      avaluo: null,
      importe: null,
    });
  }
  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required, Validators.min(1)]],
      cantidadBien: [null, [Validators.required, Validators.min(1)]],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      avaluo: [null, [Validators.required, Validators.min(1)]],
      estatus: [null, [Validators.required]],
      extDom: [null, [Validators.required, Validators.min(1)]],
      moneda: [null, [Validators.required, Validators.min(1)]],
      expediente: [null, [Validators.required]],
      clasificador: [null, [Validators.required]],
      importe: [null, [Validators.required, Validators.min(1)]],
      veces: [null, [Validators.required, Validators.min(1)]],
      cantidad2: [null, [Validators.required, Validators.min(1)]],
      saldo: [null, [Validators.required, Validators.min(1)]],
    });
  }

  cleanBlock() {
    this.form.get('veces').setValue(null);
    this.form.get('cantidad2').setValue(null);
    this.form.get('saldo').setValue(null);
    this.data = [];
  }

  get cantidadRows() {
    return this.form.get('cantidad2');
  }

  get noBien() {
    return this.form.get('noBien');
  }

  get cantidadBien() {
    return this.form.get('cantidadBien');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get avaluo() {
    return this.form.get('avaluo');
  }
  get estatus() {
    return this.form.get('estatus');
  }
  get extDom() {
    return this.form.get('extDom');
  }
  get moneda() {
    return this.form.get('moneda');
  }
  get expediente() {
    return this.form.get('expediente');
  }
  get clasificador() {
    return this.form.get('clasificador');
  }
  get importe() {
    return this.form.get('importe');
  }
  get veces() {
    return this.form.get('veces');
  }
  get cantidad2() {
    return this.form.get('cantidad2');
  }
  get saldo() {
    return this.form.get('saldo');
  }

  partialize() {
    if (this.form.valid) {
      this.goodService.getById(this.noBien.value).subscribe(x => {
        console.log(x);
      });
      this.goodService
        .getDataByGoodFather(this.cantidadBien.value)
        .subscribe(x => {
          console.log(x);
        });
      this.data = [];
      let totalCantidad = 0;
      let totalImporte = 0;
      for (let index = 0; index < this.veces.value; index++) {
        this.data.push({
          id: 1,
          noBien: this.noBien.value,
          descripcion: this.descripcion.value,
          proceso: this.extDom.value,
          cantidad: this.cantidad2.value,
          avaluo: this.avaluo.value,
          importe: this.importe.value,
        });
        totalCantidad += this.cantidad2.value;
        totalImporte += this.importe.value;
      }
      this.data.push({
        id: null,
        noBien: null,
        descripcion: null,
        proceso: null,
        cantidad: totalCantidad,
        avaluo: null,
        importe: totalImporte,
      });
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
    }
  }
}

const EXAMPLE_DATA = [
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
];
