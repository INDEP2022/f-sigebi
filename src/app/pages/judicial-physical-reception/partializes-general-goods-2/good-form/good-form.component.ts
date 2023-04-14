import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { AlertButton } from '../../scheduled-maintenance-1/models/alert-button';
import { PartializeGeneralGoodService } from '../services/partialize-general-good.service';

@Component({
  selector: 'app-good-form',
  templateUrl: './good-form.component.html',
  styles: [],
})
export class GoodFormComponent extends AlertButton implements OnInit {
  paramsGoods = new FilterParams();
  // operator = SearchFilter.LIKE;
  constructor(
    private service: PartializeGeneralGoodService,
    private fb: FormBuilder,
    private goodService: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private statusService: StatusGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.initFormGood();
  }

  get form() {
    return this.service.formGood;
  }

  set form(form: FormGroup) {
    this.service.formGood = form;
  }

  get goodsList() {
    return this.goodService.getAll(this.paramsGoods.getParams());
  }

  get cantidadRows() {
    return this.form.get('cantidad2');
  }

  get noBien() {
    return this.form.get('noBien');
  }

  get cantPadre() {
    return this.form.get('cantPadre');
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

  private validateGood() {
    return { bandera: 1, mensaje: '' };
  }

  async selectGood(good: IGood) {
    let bandera;
    // if ([62,1424, 1426].includes(+good.goodCategory)) {
    //   bandera = 0;
    //   const validacion = this.validateGood();
    //   bandera = validacion.bandera;
    //   if (bandera === 0) {
    //     this.onLoadToast('error', 'Parcialización', validacion.mensaje);
    //     return;
    //   }
    // }
    // if (!good.goodCategory) {
    //   this.onLoadToast('error', 'Parcialización', 'Bien ' + good.id + ' no cuenta con clasificador');
    // }
    this.service.good = good;
    const statusGood = good.status
      ? await firstValueFrom(this.statusService.getById(good.goodStatus))
      : null;
    debugger;
    const sssubtype = good.goodCategory
      ? await firstValueFrom(
          this.goodSssubtypeService.getAll2(
            '?filter.numClasifGoods=' + good.goodCategory
          )
        )
      : null;
    // console.log(estatusGood);
    this.form.setValue({
      noBien: good.id,
      cantPadre: good.goodsPartializationFatherNumber,
      descripcion: good.goodDescription,
      cantidad: good.quantity,
      avaluo: good.appraisedValue,
      estatus: good.goodStatus,
      estatusDescripcion: statusGood
        ? statusGood.data
          ? statusGood.data.description
          : ''
        : '',
      extDom: good.extDomProcess,
      moneda: good.val1,
      expediente: good.no_expediente,
      clasificador: good.goodCategory ? +good.goodCategory : null,
      clasificadorDescripcion: sssubtype
        ? sssubtype.data
          ? sssubtype.data.length > 0
            ? sssubtype.data[0].description
            : ''
          : ''
        : '',
      importe: +good.val2,
    });
    if ([62, 1424, 1426].includes(+good.goodCategory)) {
      this.service.setSettingsFirstCase();
    } else {
      this.service.setSettingsSecondCase();
    }
    console.log(good);
  }

  get isFirstCase() {
    return this.service.isFirstCase;
  }
}
