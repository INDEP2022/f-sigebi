import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { PartializeGeneralGoodService } from '../../partializes-general-goods-1/services/partialize-general-good.service';
import { AlertButton } from '../../scheduled-maintenance-1/models/alert-button';

@Component({
  selector: 'app-good-form',
  templateUrl: './good-form.component.html',
  styles: [],
})
export class GoodFormComponent extends AlertButton implements OnInit {
  @Input() firstCase = false;
  paramsGoods = new FilterParams();
  // operator = SearchFilter.LIKE;
  constructor(
    private service: PartializeGeneralGoodService,
    private goodService: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private statusService: StatusGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.initFormGood();
    this.selectGood(this.service.getSavedGood());
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

  get goodsList() {
    this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
    // this.paramsGoods.addFilter2('filter.goodClassNumber=$eq:1424');
    // this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
    // this.paramsGoods.addFilter2('filter.val2=$not:$null');
    // this.paramsGoods.addFilter2('filter.quantity=$not:$null');
    // this.paramsGoods.addFilter2('filter.quantity=$eq:2');
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
    if (good) {
      this.service.good = good;
      const newBinesPar = this.service.bienesPar.filter(bien => {
        bien.noBien = good.goodId;
      });
      this.service.bienesPar = newBinesPar;
      this.service.savePartializeds();
      if ([62, 1424, 1426].includes(+good.goodClassNumber)) {
        if (isNaN(+good.val2)) {
          this.onLoadToast(
            'error',
            'Parcialización',
            'Bien ' + good.goodId + ' no cuenta con importe'
          );
          this.service.good = null;
          return;
        }
        this.service.setSettingsFirstCase();
        this.saldo.setValue(+good.val2);
      } else {
        this.service.setSettingsSecondCase();
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
        importe: +good.val2,
      });
      this.service.saveSelectedGood();
      console.log(good);
    }
  }

  // get isFirstCase() {
  //   return this.service.isFirstCase;
  // }
}
