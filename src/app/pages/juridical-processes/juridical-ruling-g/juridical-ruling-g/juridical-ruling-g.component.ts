/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { TempGood } from './dataTemp';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling-g',
  templateUrl: './juridical-ruling-g.component.html',
  styleUrls: ['./juridical-ruling-g.component.scss'],
})
export class JuridicalRulingGComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] = TempGood;
  goodsValid: IGood[] = [];
  documents: IDocuments[] = [];

  data3 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  data4 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  settings1 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      quantity: {
        title: 'Cantidad',
        type: 'string',
      },
      identifier: {
        title: 'Ident.',
        type: 'string',
      },
      status: {
        title: 'Est',
        type: 'string',
      },
      processStatus: {
        title: 'Proceso',
        type: 'string',
      },
      name: {
        title: 'Check',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelect(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion Dictaminada',
        type: 'string',
      },
      menaje: {
        title: 'Menaje',
        type: 'string',
      },
      quantity: {
        title: 'Cant. Dic..',
        type: 'string',
      },
      status: {
        title: 'Est',
        type: 'string',
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
        title: 'ID Destino',
        type: 'string',
      },
      name: {
        title: 'Check',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings3 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      fecha: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings4 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      fecha: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public listadoDocumentos: boolean = false;
  public rutaAprobado: string =
    baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  prepareForm() {
    this.expedientesForm = this.fb.group({
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      averiguacionPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
      causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      delito: [false],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.dictaminacionesForm = this.fb.group({
      etiqueta: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaResolucion: [null],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      cveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      estatus: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      noExpediente: [null],
    });
    this.gestionDestinoForm = this.fb.group({
      estatus: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  btnDocumentos() {
    console.log('btnDocumentos');
    this.listadoDocumentos = true;
  }
  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnBorrarDictamen() {
    console.log('btnBorrarDictamen');
  }
  btnImprimeOficio() {
    console.log('btnImprimeOficio');
  }
  btnParcializar() {
    console.log('btnParcializar');
  }
  btnOficioSubstanciacion() {
    console.log('btnOficioSubstanciacion');
  }
  btnOficioRelacionado() {
    console.log('btnOficioRelacionado');
  }

  btnSalir() {
    console.log('Salir');
    this.listadoDocumentos = false;
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }

  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }
  addAll() {
    if (this.goods.length > 0) {
      this.goodsValid = this.goodsValid.concat(this.goods);
      this.goods = [];
    }
  }
  addSelect() {
    if (this.selectedGooods.length > 0) {
      this.goodsValid = this.goodsValid.concat(this.selectedGooods);
      this.selectedGooods.forEach(good => {
        this.goods = this.goods.filter(_good => _good.id != good.id);
      });
      this.selectedGooods = [];
    }
  }
  removeSelect() {
    if (this.selectedGooodsValid.length > 0) {
      this.goods = this.goods.concat(this.selectedGooodsValid);
      this.selectedGooodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
      });
      this.selectedGooodsValid = [];
    }
  }
  removeAll() {
    if (this.goodsValid.length > 0) {
      this.goods = this.goods.concat(this.goodsValid);
      this.goodsValid = [];
    }
  }
}
