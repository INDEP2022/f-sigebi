import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { AlertButton } from '../../../scheduled-maintenance-1/models/alert-button';
import { PartializeGeneralGoodService } from '../../services/partialize-general-good.service';

@Component({
  selector: 'app-good-form',
  templateUrl: './good-form.component.html',
  styleUrls: ['./good-form.component.scss'],
})
export class GoodFormComponent extends AlertButton implements OnInit {
  // @Input() firstCase: boolean = null;
  @Input() version: number;
  paramsGoods = new FilterParams();
  // moreParams: string[] = [];
  goodFilter = SearchFilter.EQ;
  toggleInformation = true;
  // firstCase = true;
  // operator = SearchFilter.LIKE;
  constructor(
    private service: PartializeGeneralGoodService,
    // private serviceTab2: PartializeGeneralGoodTab2Service,
    // private service2: PartializeGeneralGoodV2Service,
    // private service2Tab2: PartializeGeneralGoodV2Tab2Service,
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private goodSssubtypeService: GoodSssubtypeService,
    private statusService: StatusGoodService,
    private statusScreenService: StatusXScreenService
  ) {
    super();
    // this.form.get('noBien').valueChanges.subscribe({next:response => {
    //   this.resetForm();
    // }})
  }

  searchGood() {
    this.formLoading = true;
    this.goodService.getByGoodNumber(this.noBien).subscribe({
      next: response => {
        this.resetForm();
        console.log(response);
        this.selectGood(response.data[0]);
        // this.selectGood(response)
      },
      error: err => {
        this.resetForm();
        this.alert('error', 'No. Bien ' + this.noBien, 'No encontrado');
        this.formLoading = false;
      },
    });
  }

  ngOnInit(): void {
    if (this.version === null) {
      return;
    }

    // if (this.firstCase === null || this.version === null) {
    //   return;
    // }
    // this.moreParams = [];
    this.service.initFormGood();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (param['numberGood']) {
          this.form.get('noBien').setValue(param['numberGood'] || null);
          this.searchGood();
          return;
        }
      },
    });
    // this.selectGood(this.service.getSavedGood());
    // if (this.firstCase === true) {
    // this.service.initFormGood();
    // this.selectGood(this.serviceTab1.getSavedGood());
    // this.moreParams.push(
    //   'filter.goodClassNumber=$in:' + this.service.clasificators
    // );
    // }
    // if (this.firstCase === false) {
    // this.service.initFormGood();
    // this.selectGood(this.serviceTab2.getSavedGood());
    // this.moreParams.push(
    //   'filter.goodClassNumber=$not:$null',
    //   'filter.goodClassNumber=$not:$in:' + this.service.clasificators
    // );
    // }
    // if (this.version === 1) {
    // this.moreParams.push('filter.unit=$not:$null');
    // this.moreParams.push('filter.extDomProcess=$not:$null');
    // this.moreParams.push('filter.appraisalCurrencyKey=$not:$null');
    // this.moreParams.push('filter.appraisedValue=$not:$null');
    // this.moreParams.push('filter.val14=$not:$null');
    // }
  }

  // get service() {
  //   return this.version === 1 ? this.service1 : this.service2;
  //   // return this.version === 1
  //   //   ? this.firstCase === true
  //   //     ? this.serviceTab1
  //   //     : this.serviceTab2
  //   //   : this.firstCase === true
  //   //     ? this.service2Tab1
  //   //     : this.service2Tab2;
  // }

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

  get firstCase() {
    return this.service.firstCase;
  }

  set firstCase(value) {
    this.service.firstCase = value;
  }

  // get goodsList() {
  //   // this.paramsGoods = new FilterParams();
  //   // 1424, 1426, 1427, 1575, 1590;
  //   // this.paramsGoods.addFilter2('filter.goodClassNumber=$eq:1424');
  //   if (!this.paramsGoods.getParams().includes('goodClassNumber')) {
  //     if (this.firstCase) {
  //       this.paramsGoods.addFilter2(
  //         'filter.goodClassNumber=$in:1424,1426,1427,1575,1590'
  //       );
  //     } else {
  //       this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
  //       this.paramsGoods.addFilter2(
  //         'filter.goodClassNumber=$not:$in:1424,1426,1427,1575,1590'
  //       );
  //     }
  //   }
  //   // if (!this.paramsGoods.getParams().includes('unit')) {
  //   //   this.paramsGoods.addFilter2('filter.unit=$in:LITRO,METRO,PAR,PIEZA,JUEGO,CAJAS,M3,KILOGRAMO,UNIDAD,MEDIDA');
  //   // }

  //   // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1427');
  //   // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1575');
  //   // this.paramsGoods.addFilter2('filter.goodClassNumber=$or:1590');
  //   // this.paramsGoods.addFilter2('filter.goodClassNumber=$not:$null');
  //   if (!this.paramsGoods.getParams().includes('extDomProcess')) {
  //     this.paramsGoods.addFilter2('filter.extDomProcess=$not:$null');
  //   }
  //   // this.paramsGoods.addFilter2('filter.unit=$not:$null');
  //   if (!this.paramsGoods.getParams().includes('appraisalCurrencyKey')) {
  //     this.paramsGoods.addFilter2('filter.appraisalCurrencyKey=$not:$null');
  //   }
  //   // this.paramsGoods.addFilter2('filter.locationType=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.originSignals=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.registerInscrSol=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.proficientOpinion=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.valuerOpinion=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.opinion=$not:$null');
  //   if (!this.paramsGoods.getParams().includes('appraisedValue')) {
  //     this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
  //   }
  //   if (!this.paramsGoods.getParams().includes('val14')) {
  //     this.paramsGoods.addFilter2('filter.val14=$not:$null');
  //   }
  //   // this.paramsGoods.addFilter2('filter.rackNumber=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.appraisedValue=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.statusResourceRevision=$not:$null');
  //   // this.paramsGoods.addFilter2('filter.fractionId=$not:$null');
  //   return this.goodService.getAll(this.paramsGoods.getParams());
  // }

  // get cantidadRows() {
  //   return this.form.get('cantidad2');
  // }

  get noBien() {
    return this.form
      ? this.form.get('noBien')
        ? this.form.get('noBien').value
        : null
      : null;
  }

  // get cantPadre() {
  //   return this.form.get('cantPadre');
  // }

  // get descripcion() {
  //   return this.form.get('descripcion');
  // }

  // get avaluo() {
  //   return this.form.get('avaluo');
  // }
  // get estatus() {
  //   return this.form.get('estatus');
  // }
  // get extDom() {
  //   return this.form.get('extDom');
  // }
  // get moneda() {
  //   return this.form.get('moneda');
  // }
  // get expediente() {
  //   return this.form.get('expediente');
  // }
  // get clasificador() {
  //   return this.form.get('clasificador');
  // }
  // get importe() {
  //   return this.form.get('importe');
  // }

  get good() {
    return this.service.good;
  }

  get goodId() {
    return this.good ? this.good.goodId : null;
  }

  get goodClassNumberDesc() {
    return this.service.goodClassNumberDesc;
  }

  get goodStatusDesc() {
    return this.service.goodStatusDesc;
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

  // private async getVerificaDesCargaMasiva() {
  //   return firstValueFrom(
  //     this.goodService.getValidMassiveDownload(this.good.goodId)
  //   );
  // }

  resetForm() {
    // this.service.formControl.
    this.service.good = null;
    this.service.formGood.reset();
    // this.form.reset();
    this.formControl.reset();
    this.service.bienesPar = [];
    this.service.pagedBienesPar = [];
    this.service.sumCant = 0;
    this.service.sumVal14 = 0;
    this.service.sumAvaluo = 0;
    this.service.goodStatusDesc = '';
    this.service.goodClassNumberDesc = '';
    this.service.haveAply = true;
  }

  ngOnDestroy() {
    this.resetForm();
  }

  private validateStatusXPantalla(good: IGood) {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FACTGENPARCBIEN');
    filterParams.addFilter('processExtSun', good.extDomProcess);
    filterParams.addFilter('status', good.status);
    return firstValueFrom(
      this.statusScreenService
        .getList(filterParams.getFilterParams())
        .pipe(map(x => x.data[0]))
    );
  }

  private async getNoActa(good: IGood) {
    return firstValueFrom(
      this.goodService.getActAccount({
        goodNumber: good.goodId,
        status: good.status,
        process: good.extDomProcess,
      })
    );
  }

  async selectGoodContent(good: IGood) {
    let bandera;
    let clasif: number;
    this.service.verif_des = 0;
    // debugger;
    if (!good) {
      this.service.good = null;
      // const lastGood = this.form.get('noBien').value;
      this.resetForm();
      // this.noBien.setValue(lastGood);
      return;
    }
    if (this.version === 1) {
      // debugger;
      let vb_estatus_valido;
      // vb_estatus_valido = await this.validateStatusXPantalla(good);
      try {
        vb_estatus_valido = await this.validateStatusXPantalla(good);
        console.log(vb_estatus_valido);
      } catch (x) {
        console.log(x);
        this.alert(
          'error',
          'Error',
          'El Bien no cuenta con un estatus y/o proceso correcto'
        );
        return;
      }
      try {
        this.service.verif_des = await firstValueFrom(
          this.goodService.getValidMassiveDownload(good.goodId)
        );
      } catch (x: any) {
        console.log(x);
        this.service.verif_des = 0;
        // this.onLoadToast(
        //   'error',
        //   'Verificación Descarga Masiva',
        //   x.error.message
        // );
        // this.loading = false;
        // return;
      }

      console.log(good.goodClassNumber);
      // const newBienesPar = this.service.bienesPar.filter(bien => {
      //   bien.noBien = good.goodId;
      // });
      // this.service.bienesPar = newBienesPar;
      // this.service.savePartializeds();
      if ([1424, 1426].includes(+(good.goodClassNumber + ''))) {
        bandera = 0;
        const validacion = await this.validateGood(good);
        bandera = validacion.bandera;
        if (bandera === 0) {
          this.alert('error', 'Parcialización', validacion.mensaje);
          return;
        }
      } else {
        clasif = 1;
      }
      if (!good.goodClassNumber) {
        this.alert(
          'error',
          'Parcialización',
          'Bien ' + good.goodId + ' no cuenta con clasificador'
        );
        return;
      }
      try {
        this.service.noActa = await this.getNoActa(good);
      } catch (x) {
        this.service.noActa = 0;
      }

      this.service.good = good;
      if ([1424, 1426, 1427, 1575, 1590].includes(+good.goodClassNumber)) {
        this.firstCase = true;
        const val14 = good.val14 ? +good.val14.trim() : 0;
        if (isNaN(+good.val2) || val14 <= 0 || good.appraisedValue <= 0) {
          this.alert(
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
        this.firstCase = false;
        this.service.formControl.get('saldo').setValue(good.quantity);
      }
    } else {
      // this.service.good = good;
      // if ([62, 1426, 1424].includes(+good.goodClassNumber)) {
      //   this.saldo.setValue(good.val2);
      // } else {
      //   this.saldo.setValue(good.quantity);
      // }
    }
    this.service.saveSelectedGood();
    const statusGood = good.status
      ? await firstValueFrom(this.statusService.getById(good.status))
      : null;
    this.service.goodStatusDesc = statusGood ? statusGood.description : '';
    // debugger;
    const sssubtype = good.goodClassNumber
      ? await firstValueFrom(
          this.goodSssubtypeService.getAll2(
            '?filter.numClasifGoods=' + good.goodClassNumber
          )
        )
      : null;
    this.service.goodClassNumberDesc = sssubtype
      ? sssubtype.data
        ? sssubtype.data.length > 0
          ? sssubtype.data[0].description
          : ''
        : ''
      : '';
    // console.log(estatusGood);
    // this.form.setValue({
    //   noBien: good.goodId,
    //   cantPadre: good.goodsPartializationFatherNumber,
    //   descripcion: good.description,
    //   cantidad: good.quantity,
    //   avaluo: good.appraisedValue,
    //   estatus: good.goodStatus,
    //   estatusDescripcion: statusGood ? statusGood.description : '',
    //   extDom: good.extDomProcess,
    //   moneda: good.val1,
    //   expediente: good.fileNumber,
    //   clasificador: good.goodClassNumber ? +good.goodClassNumber : null,
    //   clasificadorDescripcion: sssubtype
    //     ? sssubtype.data
    //       ? sssubtype.data.length > 0
    //         ? sssubtype.data[0].description
    //         : ''
    //       : ''
    //     : '',
    //   importe: +good.val14,
    // });
    // this.service.saveSelectedGood();
    console.log(good);
  }

  async selectGood(good: IGood) {
    await this.selectGoodContent(good);
    this.formLoading = false;
  }
}
