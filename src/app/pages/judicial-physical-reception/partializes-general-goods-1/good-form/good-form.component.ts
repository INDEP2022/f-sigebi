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
    this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
    this.paramsGoods.addFilter2('filter.extDomProcess=$not:$null');
    this.paramsGoods.addFilter2('filter.unit=$not:$null');
    this.paramsGoods.addFilter2('filter.locationType=$not:$null');
    this.paramsGoods.addFilter2('filter.originSignals=$not:$null');
    this.paramsGoods.addFilter2('filter.registerInscrSol=$not:$null');
    this.paramsGoods.addFilter2('filter.proficientOpinion=$not:$null');
    this.paramsGoods.addFilter2('filter.valuerOpinion=$not:$null');
    this.paramsGoods.addFilter2('filter.opinion=$not:$null');
    this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
    this.paramsGoods.addFilter2('filter.rackNumber=$not:$null');
    this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
    this.paramsGoods.addFilter2('filter.statusResourceRevision=$not:$null');
    this.paramsGoods.addFilter2('filter.=$not:$null');
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

  private async validateGood(good: IGood) {
    let mensaje = await firstValueFrom(this.goodService.getValigFlag(good.id));
    if (mensaje.includes('no esta Conciliado')) {
      return { bandera: 0, mensaje };
    }
    mensaje = await firstValueFrom(this.goodService.getValigSat(good.id));
    if (
      mensaje.includes(
        'no cuenta con un estatus correcto para poder parcializar'
      )
    ) {
      return { bandera: 0, mensaje };
    }
    return { bandera: 1, mensaje: '' };
  }

  async selectGood(good: IGood) {
    let bandera;
    let clasif: number;
    if ([1424, 1426].includes(+(good.goodClassNumber + ''))) {
      bandera = 0;
      const validacion = await this.validateGood(good);
      bandera = validacion.bandera;
      if (bandera === 0) {
        this.onLoadToast('error', 'Parcialización', validacion.mensaje);
        return;
      }
    } else {
      clasif = 1;
    }
    if (!good.goodClassNumber) {
      this.onLoadToast(
        'error',
        'Parcialización',
        'Bien ' + good.id + ' no cuenta con clasificador'
      );
      return;
    }
    this.service.good = good;
    if ([1424, 1426, 1427, 1575, 1590].includes(+good.goodClassNumber)) {
      this.service.setSettingsFirstCase();
      if (+good.val14 <= 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'Bien ' + good.id + ' no cuenta con importe'
        );
        return;
      }
    } else {
      this.service.setSettingsSecondCase();
    }
    const statusGood = good.status
      ? await firstValueFrom(this.statusService.getById(good.status))
      : null;
    debugger;
    const sssubtype = good.goodClassNumber
      ? await firstValueFrom(
          this.goodSssubtypeService.getAll2(
            '?filter.numClasifGoods=' + good.goodClassNumber
          )
        )
      : null;
    // console.log(estatusGood);
    this.form.setValue({
      noBien: good.id,
      cantPadre: good.goodsPartializationFatherNumber,
      descripcion: good.description,
      cantidad: good.quantity,
      avaluo: good.appraisedValue,
      estatus: good.goodStatus,
      estatusDescripcion: statusGood ? statusGood.description : '',
      extDom: good.extDomProcess,
      moneda: good.val1,
      expediente: good.fileNumber,
      clasificador: good.goodClassNumber ? +good.goodClassNumber : null,
      clasificadorDescripcion: sssubtype
        ? sssubtype.data
          ? sssubtype.data.length > 0
            ? sssubtype.data[0].description
            : ''
          : ''
        : '',
      importe: +good.val14,
    });

    console.log(good);
  }

  get isFirstCase() {
    return this.service.isFirstCase;
  }
}
