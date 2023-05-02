import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import {
  GoodDTO,
  IGoodP,
} from 'src/app/common/repository/interfaces/ms-partialize-good';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from './models/bienesPar.model';
import { PartializeGeneralGoodService } from './services/partialize-general-good.service';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent
  extends BasePage
  implements OnInit
{
  bienesPar: IBienesPar[] = [];
  v_inmueble: any;
  v_numerario: any;
  vfactor: any;
  vres: any;
  vident: any;
  constructor(
    private service: PartializeGeneralGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private goodService: GoodService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
    private partializeGoodService: PartializeGoodService,
    private statusXScreenService: ScreenStatusService
  ) {
    super();
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  ngOnInit(): void {
    this.service.initFormControl();
    this.bienesPar = [...this.service.getSavedPartializedGoods()];
  }

  cleanBlock() {
    this.form.get('cantPar').setValue(null);
    this.form.get('cantidad').setValue(null);
    this.form.get('saldo').setValue(null);
    this.bienesPar = [];
  }

  get form() {
    return this.service.formControl;
  }
  get formGood() {
    return this.service.formGood;
  }
  get cantPar() {
    return this.form.get('cantPar');
  }
  get cantidad() {
    return this.form.get('cantidad');
  }
  get saldo() {
    return this.form.get('saldo');
  }
  get sumCant() {
    return this.service.sumCant;
  }
  get sumVal14() {
    return this.service.sumVal14;
  }
  get good() {
    return this.service.good;
  }
  get isFirstCase() {
    return this.service.isFirstCase;
  }
  get vimporte() {
    return !this.validationClasif()
      ? +(this.good.quantity + '')
      : this.good.val14
      ? +this.good.val14
      : -1;
  }
  get vsum() {
    return !this.validationClasif() ? this.sumCant : this.sumVal14;
  }

  private validationClasif() {
    return [1424, 1426, 1427, 1575, 1590].includes(+this.good.goodClassNumber);
  }

  private validationImporte() {
    // debugger;
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      if (cantidad < 0.1) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible realizar la parcialización'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
    } else {
      if (cantidad != 1 && cantidad != this.vimporte) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'El numerario no tiene consistencia'
        );
        this.form.get('ind').setValue('S');
        return false;
      } else if (this.vimporte < 2) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No posible importe menor a 2'
        );
        return false;
      }
    }
    return true;
  }

  private async validationInmueble() {
    const clasificador = this.good.goodClassNumber;
    const inmuebleValidation = await firstValueFrom(
      this.goodSSSubtypeService.getAll2(
        'filter.numType=$in:2,6&filter.numClasifGoods=' + clasificador
      )
    );
    this.v_inmueble = inmuebleValidation.count;
    if (this.v_inmueble > 0) {
      if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar bien en fracciones'
        );
        return false;
      }
    }
    return true;
  }

  private async validationDecimales() {
    const fraccion = this.good.fraccion;
    if (!fraccion) {
      return false;
    }
    // const unidad = this.good.unit;
    if (fraccion.decimalAmount === 'N' && !this.validationClasif()) {
      if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar bien en fracciones'
        );
        return false;
      }
    }
    return true;

    // let decimales;
    // try {
    //   const decimalesValidation = await firstValueFrom(
    //     this.goodService.getMeasurementUnits(unidad)
    //   );
    //   decimales = decimalesValidation.data.decimales;
    // } catch (x) {}

    // //fraccion.decimalAmount === 'N'
    // if (decimales === 'N' && !this.validationClasif()) {
    //   if (this.cantPar.value % 1 !== 0 || this.cantidad.value % 1 !== 0) {
    //     this.onLoadToast(
    //       'error',
    //       'Parcialización',
    //       'No es posible parcializar bien en fracciones'
    //     );
    //     return false;
    //   }
    // }
    // return true;
  }

  private async setMeasureData() {
    // const data = await firstValueFrom(
    //   this.goodService.getGoodWidthMeasure(this.good.id)
    // );
    // const { cantidad, descripcion, cve_moneda_avaluo } = {
    //   cantidad: this.good.quantity,
    //   descripcion: this.good.fraccion.description,
    //   cve_moneda_avaluo: this.good.appraisalCurrencyKey,
    // };

    return {
      v_cantidad: this.good.quantity,
      v_unidad: this.good.fraccion.description,
      v_avaluo: this.good.appraisalCurrencyKey,
    };
    // let cantidad, descripcion, cve_moneda_avaluo;
    // try {
    //   const data = await firstValueFrom(
    //     this.goodService.getGoodWidthMeasure(this.good.goodId)
    //   );
    //   cantidad = data.data[0].cantidad;
    //   descripcion = data.data[0].descripcion;
    //   cve_moneda_avaluo = data.data[0].cve_moneda_avaluo;
    // } catch (x) {}
    // return {
    //   v_cantidad: cantidad ? +cantidad : null,
    //   v_unidad: descripcion,
    //   v_avaluo: cve_moneda_avaluo,
    // };
  }

  private async validationNumerario() {
    const clasificador = this.good.goodClassNumber;
    const numerarioValidation = await firstValueFrom(
      this.goodSSSubtypeService.getAll2('filter.numClasifGoods=' + clasificador)
    );
    this.v_numerario = numerarioValidation.count;
    if (this.v_numerario === 0) {
      if (this.cantidad.value === this.formGood.get('cantidad').value) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se puede parcializar la misma cantidad que el bien padre'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
    }
    return true;
  }

  private fillDescription(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string
  ) {
    if (this.v_numerario === 0) {
      let result =
        ', (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ' (' +
        v_cantidad +
        ' ' +
        v_unidad +
        '), ' +
        this.formGood.get('descripcion').value;
      result = result.length > 1250 ? result.substring(1, 1250) : result;

      return 'Bien por ' + this.cantidad.value + ' ' + v_unidad + result + ' )';
    } else {
      let result =
        ' (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ', ' +
        this.formGood.get('descripcion').value +
        ' )';
      result = result.length > 1250 ? result.substring(1, 1250) : result;
      return (
        'Numerario por $' +
        (this.cantidad.value + '').trim() +
        ' ' +
        v_avaluo +
        result
      );
    }
  }

  private fillAvaluo() {
    if (this.good.appraisedValue) {
      return +(+(this.good.appraisedValue + '') * this.vfactor).toFixed(2);
    } else {
      return null;
    }
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    // const clasificador = this.formGood.get('clasificador').value;
    if (this.validationClasif()) {
      importe = this.cantidad.value;
      const cantGood = this.good.quantity;
      if (cantGood !== 1) {
        cantidad = this.cantidad.value;
      } else {
        cantidad = cantGood;
      }
    } else {
      cantidad = this.cantidad.value;
    }
    return { importe, cantidad };
  }

  deleteRow(row: { data: IBienesPar; index: number }) {
    console.log(row);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'info',
          'Parcialización',
          'Eliminada la parcialización ' + row.data.id
        );
        if (row.index === 0) {
          this.bienesPar.shift();
        } else {
          this.bienesPar = this.bienesPar
            .slice(0, row.index)
            .concat(this.bienesPar[this.bienesPar.length - 1]);
        }
        this.bienesPar[this.bienesPar.length - 1].cantidad -= row.data.cantidad;
        this.service.sumCant -= row.data.cantidad;
        this.service.sumVal14 -= row.data.importe;
        // this.bienesPar[this.bienesPar.length - 1].avaluo -= row.data.avaluo;
        this.bienesPar[this.bienesPar.length - 1].importe -= row.data.importe;
        if (this.bienesPar[this.bienesPar.length - 1].cantidad === 0) {
          this.bienesPar.pop();
        }
        this.bienesPar = [...this.bienesPar];
        this.service.savePartializeds();
      }
    });
  }

  private fillRow(
    v_cantidad: number,
    v_unidad: string,
    v_avaluo: string,
    newImporte: number
  ) {
    this.vfactor = this.cantidad.value / this.vimporte;
    console.log(this.cantidad.value, this.vimporte);
    this.vres = this.vimporte - newImporte;
    this.vident = 0;
    if (this.bienesPar[this.bienesPar.length - 2]) {
      this.vident = this.bienesPar[this.bienesPar.length - 1].id;
    }
    this.vident++;
    const descripcion = this.fillDescription(v_cantidad, v_unidad, v_avaluo);
    const proceso = this.good.extDomProcess;
    const avaluo = this.fillAvaluo();
    console.log(avaluo);
    const { importe, cantidad } = this.fillImporteCant();
    const noBien = this.good.goodId;
    this.service.sumCant += cantidad;
    this.service.sumVal14 += importe;
    // this.vident++;
    this.bienesPar.push({
      id: this.vident,
      noBien,
      descripcion,
      proceso,
      cantidad,
      avaluo,
      importe,
      val10: 0,
      val11: 0,
      val12: 0,
      val13: 0,
    });
  }

  async partialize() {
    this.loading = true;
    // debugger;
    this.form.get('ind').setValue('N');
    if (this.form.valid && this.formGood.valid) {
      // debugger;
      console.log(this.sumCant + '', this.sumVal14 + '');
      if (!this.validationImporte()) return;
      // this.vsum = 0;
      const validationIn = await this.validationInmueble();
      if (!validationIn) return;
      const validationDec = await this.validationDecimales();
      if (!validationDec) return;
      const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      if (!v_cantidad || !v_unidad || !v_avaluo) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar, no tiene unidades de medida '
        );
        return;
      }

      const validationNum = await this.validationNumerario();
      if (!validationNum) return;
      // if (!this.validationClasif()) {
      //   this.vsum = this.sumCant ?? 0;
      // } else {
      //   this.vsum = this.sumVal14 ?? 0;
      // }
      console.log(this.sumCant + '', this.sumVal14 + '');

      const newImporte: number =
        this.cantPar.value * this.cantidad.value + this.vsum;
      if (newImporte > this.vimporte) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible parcializar, excede por ' +
            (newImporte - this.vimporte)
        );
        this.form.get('ind').setValue('S');
        return;
      }
      this.bienesPar.pop();
      // debugger;
      for (let index = 0; index < this.cantPar.value; index++) {
        this.fillRow(v_cantidad, v_unidad, v_avaluo, newImporte);
      }
      this.bienesPar.push({
        id: null,
        noBien: null,
        descripcion: null,
        proceso: null,
        cantidad: this.service.sumCant,
        avaluo: null,
        importe: this.service.sumVal14,
        val10: 0,
        val11: 0,
        val12: 0,
        val13: 0,
      });
      this.bienesPar = [...this.bienesPar];
      this.loading = false;
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
      this.loading = false;
    }
  }

  private async getNoActa() {
    return firstValueFrom(
      this.goodService.getActAccount({
        goodNumber: this.good.goodId,
        status: this.good.status,
        process: this.good.extDomProcess,
      })
    );
    /**
     * BEGIN
         SELECT NVL(MAX(NO_ACTA),0)
           INTO vno_acta
           FROM DETALLE_ACTA_ENT_RECEP
          WHERE NO_ACTA IN (SELECT NO_ACTA
                              FROM ACTAS_ENTREGA_RECEPCION
                             WHERE TIPO_ACTA = 'EVENTREC')
            AND NO_BIEN = :BIENES.NO_BIEN;

         IF vno_acta > 0 THEN
            SELECT COUNT(0)
              INTO v_cuantos
              FROM ESTATUS_X_PANTALLA
             WHERE CVE_PANTALLA = 'FINDICA_0035_1'
               AND ACCION = 'RF'
               AND ESTATUS_FINAL = :BIENES.ESTATUS
               AND PROCESO_EXT_DOM = :BIENES.PROCESO_EXT_DOM;

            IF v_cuantos = 0 THEN
               vno_acta := 0;
            END IF;
         END IF;

      EXCEPTION
         WHEN OTHERS THEN
            vno_acta := 0;
      END;
     */
  }

  private async getStatusProcessxPantalla() {
    return await firstValueFrom(
      this.goodService.getStatusAndProcess({
        goodNumber: this.good.goodId,
        screenKey: 'FACTGENPARCBIEN',
        process: this.good.extDomProcess,
        action: 'FINAL',
        status: this.good.status,
        user: localStorage.getItem('username'),
      })
    );
  }

  private async getVerificaDesCargaMasiva() {
    return firstValueFrom(
      this.goodService.getValidMassiveDownload(this.good.goodId)
    );
  }

  private async getBienDual() {
    return firstValueFrom(this.goodService.getValidSeq());
  }

  private async fillDescriptions(item: IBienesPar, vimpbien: number) {
    // debugger;
    let vobserv_padre = 'Bien(es) parcializado(s): ';
    let vdesc_padre = 'Bien(es) generado(s): ';
    try {
      item.noBien = await this.getBienDual();
    } catch (x) {}
    vobserv_padre = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
    vobserv_padre = vobserv_padre.substring(
      0,
      vobserv_padre.length > 600 ? 600 : vobserv_padre.length
    );
    vdesc_padre = vdesc_padre + item.noBien;
    vdesc_padre = vdesc_padre.substring(
      0,
      vdesc_padre.length > 1250 ? 1250 : vdesc_padre.length
    );
    return { vobserv_padre, vdesc_padre, noBien: item.noBien };
  }

  private async estatusProceed(status: string, process: string) {
    return firstValueFrom(
      this.statusXScreenService
        .getStatusXScreen({
          screen: 'FACTGENPARCBIEN',
          status,
          action: 'FINAL',
          process,
        })
        .pipe(
          map(x =>
            x.data ? (x.data.length > 0 ? x.data[0].statusfinal : null) : null
          )
        )
    );
  }
  async apply() {
    // debugger;
    this.loading = true;
    let v_importe: number,
      v_estatus: string,
      vaccion: string,
      vno_acta: number = 0,
      v_verif_des: number = 0;
    // let vb_estatus_valido = false;
    if (this.bienesPar.length === 0) {
      this.onLoadToast(
        'error',
        'Error',
        'No se tienen cantidades a parcializar...'
      );
      return;
    }
    if (this.validationClasif()) {
      v_importe = +(this.good.appraisedValue
        ? this.good.appraisedValue
        : this.good.val14
        ? this.good.val14
        : '0');
    } else {
      v_importe = +(this.good.quantity + '');
    }
    this.form.get('ind').setValue('N');
    v_estatus = this.good.status;
    vaccion = 'FINAL';
    // vproextdom = this.good.extDomProcess;
    try {
      vno_acta = await this.getNoActa();
    } catch (x) {
      vno_acta = 0;
    }
    try {
      const { status, process } = await this.getStatusProcessxPantalla();
      this.service.good.status = status;
      this.service.good.extDomProcess = process;
      this.formGood.get('estatus').setValue(status);
      this.formGood.get('extDom').setValue(process);
    } catch (x) {
      // this.onLoadToast(
      //   'error',
      //   'Error',
      //   'No se tienen cantidades a parcializar...'
      // );
      // return;
    }
    try {
      v_verif_des = await this.getVerificaDesCargaMasiva();
    } catch (x: any) {
      console.log(x);
      this.onLoadToast(
        'error',
        'Verificación Descarga Masiva',
        x.error.message
      );
      this.loading = false;
      return;
    }
    let vsumimp = 0;
    let vval2: number,
      vimpbien: number,
      vident: number,
      vfactor: number,
      vfactornum: number,
      vobservaciones: string,
      vobserv_padre: string,
      vdesc_padre: string;
    await this.bienesPar.forEach(async item => {
      if (this.validationClasif()) {
        vval2 = Number(item.importe.toFixed(2).trim());
        vimpbien = item.importe;
      } else {
        vval2 = +this.good.val14;
        vimpbien = item.cantidad;
      }
      vident = item.id;
      vfactor = vimpbien / v_importe;
      vfactornum = vimpbien / (v_importe - vsumimp);
      vsumimp = vsumimp + vimpbien;
      const descriptions = await this.fillDescriptions(item, vimpbien);
      console.log(descriptions);
      vobserv_padre = descriptions.vobserv_padre;
      vdesc_padre = descriptions.vdesc_padre;
      vobservaciones = 'Parcializado del bien: ' + this.good.goodId;
      try {
        await this.insertaBien(
          item,
          this.good,
          v_estatus,
          this.good.extDomProcess,
          vval2,
          vobservaciones,
          v_verif_des,
          vno_acta
        );
      } catch (x: any) {
        console.log(x);
        this.onLoadToast('error', 'Inserta Bien', 'No se pudo parcializar');
        this.loading = false;
        return;
      }
    });
    if (vsumimp < v_importe) {
      vfactor = (v_importe - vsumimp) / v_importe;
      vfactornum = (v_importe - vsumimp) / (v_importe - vsumimp);
      let item: IBienesPar;
      const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      const clasificador = this.good.goodClassNumber;
      const numerarioValidation = await firstValueFrom(
        this.goodSSSubtypeService.getAll2(
          'filter.numClasifGoods=' + clasificador + '&filter.numType=7'
        )
      );
      const v_numerario = numerarioValidation.count;
      if (v_numerario !== 0) {
        if (this.validationClasif()) {
          item = {
            id: null,
            noBien: null,
            descripcion: null,
            proceso: null,
            cantidad: null,
            avaluo: null,
            importe: 0,
            val10: 0,
            val11: 0,
            val12: 0,
            val13: 0,
          };
        }
      }
      item.id = vident + 1;
      if (v_numerario === 0) {
        let mensaje =
          '(Producto de la Parcialización de Bien No.' +
          this.good.goodId +
          '  (' +
          v_cantidad +
          ' ' +
          v_unidad +
          '), ' +
          this.good.description +
          ')';
        mensaje = mensaje.substring(
          0,
          mensaje.length > 1250 ? 1250 : mensaje.length
        );
        item.descripcion =
          'Bien por ' +
          this.form.get('saldo').value +
          ' ' +
          v_unidad +
          ', ' +
          mensaje;
      } else {
        let mensaje =
          '(Producto de la Parcialización de Bien No.' +
          this.good.goodId +
          ', ' +
          this.good.description +
          ')';
        mensaje = mensaje.substring(
          0,
          mensaje.length > 1250 ? 1250 : mensaje.length
        );
        item.descripcion =
          'Numerario por $ ' +
          this.form.get('saldo').value +
          ' ' +
          v_avaluo +
          ' ' +
          mensaje;
      }
      item.proceso = this.good.extDomProcess;
      if (this.good.appraisedValue) {
        item.avaluo = Number((this.good.appraisedValue * vfactor).toFixed(2));
      } else {
        item.avaluo = this.good.appraisedValue;
      }
      if (this.validationClasif()) {
        item.importe = v_importe - vsumimp;
        if (this.good.quantity !== 1) {
          item.cantidad = v_importe - vsumimp;
        } else {
          item.cantidad = this.good.quantity;
        }
        vval2 = Number((item.avaluo ? item.avaluo : item.importe).toFixed(2));
        vimpbien = item.importe;
      } else {
        item.cantidad = v_importe - vsumimp;
        vval2 = +this.good.val14;
        vimpbien = item.cantidad;
      }
      const descriptions = await this.fillDescriptions(item, vimpbien);
      vobserv_padre = descriptions.vobserv_padre;
      vdesc_padre = descriptions.vdesc_padre;
      vobservaciones = 'Saldo parcializado del bien: ' + this.good.goodId;
      try {
        await this.insertaBien(
          item,
          this.good,
          v_estatus,
          this.good.extDomProcess,
          vval2,
          vobservaciones,
          v_verif_des,
          vno_acta
        );
      } catch (x: any) {
        console.log(x);
        this.onLoadToast('error', 'Inserta Bien', 'No se pudo parcializar');
        this.loading = false;
        return;
      }
    }
    const observations =
      vobserv_padre +
      ' fecha: ' +
      format(new Date(), 'dd/MM/yyyy') +
      '. ' +
      this.good.observations;
    this.good.observations = observations.substring(
      0,
      observations.length > 600 ? 600 : observations.length
    );
    const description = vdesc_padre + this.good.description;
    this.good.description = description.substring(
      0,
      observations.length > 1250 ? 1250 : observations.length
    );
    this.formGood.get('descripcion').setValue(this.good.description);
    if (vno_acta > 0) {
      await firstValueFrom(
        this.detailReceptionService.deleteById(this.good.goodId, vno_acta)
      );
    }
    this.saldo.setValue(0);
    this.onLoadToast(
      'success',
      'Parcialización',
      'La parcialización de bienes se realizo con éxito'
    );
  }

  async insertaBien(
    item: IBienesPar,
    good: IGood,
    statusNew: string,
    pproextdom: string,
    pval2: number,
    observations: string,
    pEviction: number,
    pno_acta: number
  ) {
    // return this.partializeGoodService.pupInsertGood()
    // return true;
    console.log('Entro a insertaBien', good);
    const newGood: IGoodP = {
      ...good,
      observations,
      amount: item.cantidad,
      val2: pval2 + '',
      val11: item.val11 + '',
      val12: item.val12 + '',
      val13: item.val13 + '',
      val14: good.val14 + '',
      worthappraisal: item.avaluo ? +(item.avaluo + '') : null,
      goodReferenceNumber: item.noBien,
      extDomProcess: pproextdom,
    };
    let request: GoodDTO = {
      screenKey: 'FACTGENPARCBIEN',
      pno_acta,
      changeUser: localStorage.getItem('username'),
      good: newGood,
      pEviction,
      statusNew,
    };
    return firstValueFrom(this.partializeGoodService.pupInsertGood(request));
  }
}
