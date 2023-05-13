import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { AlertButton } from '../../../scheduled-maintenance-1/models/alert-button';
import { PartializeGeneralGoodTab2Service } from '../../services/partialize-general-good-tab2.service';
import { PartializeGeneralGoodService } from '../../services/partialize-general-good.service';

@Component({
  selector: 'app-good-form',
  templateUrl: './good-form.component.html',
  styles: [
    `
      .hide {
        display: none;
      }
    `,
  ],
})
export class GoodFormComponent extends AlertButton implements OnInit {
  @Input() firstCase: boolean = null;
  paramsGoods = new FilterParams();
  goodFilter = SearchFilter.LIKE;

  // operator = SearchFilter.LIKE;
  constructor(
    private serviceTab1: PartializeGeneralGoodService,
    private serviceTab2: PartializeGeneralGoodTab2Service,
    private goodService: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private statusService: StatusGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.firstCase === null) {
      return;
    }
    if (this.firstCase === true) {
      this.serviceTab1.initFormGood();
      this.selectGood(this.serviceTab1.getSavedGood());
    }
    if (this.firstCase === false) {
      this.serviceTab2.initFormGood();
      this.selectGood(this.serviceTab1.getSavedGood());
    }
  }

  get service() {
    return this.firstCase === true ? this.serviceTab1 : this.serviceTab2;
  }

  get formLoading() {
    return this.service.formLoading;
  }

  set formLoading(value) {
    this.service.formLoading = value;
  }

  get saldo() {
    return this.service.formControl.get('saldo');
  }

  get form() {
    return this.service.formGood;
  }

  set form(form: FormGroup) {
    this.service.formGood = form;
  }

  get formControl() {
    return this.service.formControl;
  }

  get goodsList() {
    // this.paramsGoods = new FilterParams();
    // 1424, 1426, 1427, 1575, 1590;
    // this.paramsGoods.addFilter2('filter.goodClassNumber=$eq:1424');
    if (!this.paramsGoods.getParams().includes('goodClassNumber')) {
      if (this.firstCase) {
        this.paramsGoods.addFilter2(
          'filter.goodClassNumber=$in:1424,1426,1427,1575,1590'
        );
      } else {
        this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
        this.paramsGoods.addFilter2(
          'filter.goodClassNumber=$not:$in:1424,1426,1427,1575,1590'
        );
      }
    }
    // if (!this.paramsGoods.getParams().includes('unit')) {
    //   this.paramsGoods.addFilter2('filter.unit=$in:LITRO,METRO,PAR,PIEZA,JUEGO,CAJAS,M3,KILOGRAMO,UNIDAD,MEDIDA');
    // }

    // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1427');
    // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1575');
    // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1590');
    // this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
    if (!this.paramsGoods.getParams().includes('extDomProcess')) {
      this.paramsGoods.addFilter2('filter.extDomProcess=$not:$null');
    }
    // this.paramsGoods.addFilter2('filter.unit=$not:$null');
    if (!this.paramsGoods.getParams().includes('appraisalCurrencyKey')) {
      this.paramsGoods.addFilter2('filter.appraisalCurrencyKey=$not:$null');
    }
    // this.paramsGoods.addFilter2('filter.locationType=$not:$null');
    // this.paramsGoods.addFilter2('filter.originSignals=$not:$null');
    // this.paramsGoods.addFilter2('filter.registerInscrSol=$not:$null');
    // this.paramsGoods.addFilter2('filter.proficientOpinion=$not:$null');
    // this.paramsGoods.addFilter2('filter.valuerOpinion=$not:$null');
    // this.paramsGoods.addFilter2('filter.opinion=$not:$null');
    if (!this.paramsGoods.getParams().includes('appraisedValue')) {
      this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
    }
    if (!this.paramsGoods.getParams().includes('val14')) {
      this.paramsGoods.addFilter2('filter.val14=$not:$null');
    }
    // this.paramsGoods.addFilter2('filter.rackNumber=$not:$null');
    // this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
    // this.paramsGoods.addFilter2('filter.statusResourceRevision=$not:$null');
    // this.paramsGoods.addFilter2('filter.fractionId=$not:$null');
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
    let mensaje = await firstValueFrom(
      this.goodService.getValigFlag(good.goodId)
    );
    if (mensaje.includes('no esta Conciliado')) {
      return { bandera: 0, mensaje };
    }
    mensaje = await firstValueFrom(this.goodService.getValigSat(good.goodId));
    console.log(mensaje);
    if (
      mensaje.includes(
        'no cuenta con un estatus correcto para poder parcializar'
      )
    ) {
      return { bandera: 0, mensaje };
    }
    return { bandera: 1, mensaje: '' };
  }

  resetForm() {
    // this.service.formControl.
    this.service.good = null;
    this.form.reset();
    this.formControl.reset();
    this.service.bienesPar = [];
    this.service.sumCant = 0;
    this.service.sumVal14 = 0;
  }

  async selectGoodContent(good: IGood) {
    let bandera;
    let clasif: number;
    if (!good) {
      return;
    }
    console.log(good.goodClassNumber);
    const newBinesPar = this.service.bienesPar.filter(bien => {
      bien.noBien = good.goodId;
    });
    this.service.bienesPar = newBinesPar;
    this.service.savePartializeds();
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
        'Bien ' + good.goodId + ' no cuenta con clasificador'
      );
      return;
    }
    this.service.good = good;
    if ([1424, 1426, 1427, 1575, 1590].includes(+good.goodClassNumber)) {
      // this.service.setSettingsFirstCase();
      const val14 = good.val14 ? +good.val14.trim() : 0;
      if (isNaN(+good.val2) || val14 <= 0 || good.appraisedValue <= 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'Bien ' + good.goodId + ' no cuenta con importe'
        );
        this.service.good = null;
        return;
      }
      this.saldo.setValue(
        good.appraisedValue ? good.appraisedValue : good.val14
      );
    } else {
      this.service.formControl.get('saldo').setValue(good.quantity);
      // this.service.setSettingsSecondCase();
    }
    const statusGood = good.status
      ? await firstValueFrom(this.statusService.getById(good.status))
      : null;
    // debugger;
    const sssubtype = good.goodClassNumber
      ? await firstValueFrom(
          this.goodSssubtypeService.getAll2(
            '?filter.numClasifGoods=' + good.goodClassNumber
          )
        )
      : null;
    // console.log(estatusGood);
    this.form.setValue({
      noBien: good.goodId,
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

  async selectGood(good: IGood) {
    this.formLoading = true;
    await this.selectGoodContent(good);
    this.formLoading = false;
  }
}
