import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from '../partializes-general-goods-1/models/bienesPar.model';
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
  constructor(
    private service: PartializeGeneralGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private goodService: GoodService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  ngOnInit(): void {
    this.service.initFormControl();
    // const total: number = this.data
    //   .map(element => element.cantidad)
    //   .reduce((prev, curr) => prev + curr, 0);
    // this.data.push({
    //   id: null,
    //   noBien: null,
    //   descripcion: null,
    //   cantidad: total,
    //   avaluo: null,
    //   importe: null,
    // });
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

  get ind() {
    return this.form.get('ind');
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

  checkSum(pindica: string) {
    let vsum: number;
    let vban: boolean;
    if (this.bienesPar.length === 0) {
      if (pindica === 'V') {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se tiene registros a verificar'
        );
      } else {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se tiene registros a aplicar'
        );
      }
      return;
    }
    vsum = 0;
    this.bienesPar.forEach(item => {
      if (this.validationClasif()) {
        vsum += Number(item.importe.toFixed(4));
      } else {
        vsum += item.cantidad;
      }
    });
    vban = false;
    if (this.validationClasif() && vsum > +(+this.good.val2).toFixed(4)) {
      vban = true;
    } else if (!this.validationClasif() && vsum > this.good.quantity) {
      vban = true;
    }
    if (vban) {
      this.onLoadToast(
        'error',
        'Parcialización',
        'La sumatoria excede del importe total (' + vsum + ')'
      );
    } else if (pindica === 'V') {
      this.onLoadToast(
        'success',
        'Parcialización',
        'La sumatoria es correcta (' + vsum + ')'
      );
    }
  }

  cleanBlock() {
    this.form.get('veces').setValue(null);
    this.form.get('cantidad2').setValue(null);
    this.form.get('saldo').setValue(null);
    this.bienesPar = [];
  }

  private validationClasif() {
    return [1424, 1426, 62].includes(+this.good.goodCategory);
  }

  vimporte: number;
  v_inmueble: any;
  v_numerario: any;
  vsum: any = 0;
  vfactor: any;
  vres: any;
  vident: any;

  private validationImporte() {
    // debugger;
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      this.vimporte = cantidad;
      if (cantidad < 2) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No es posible realizar la parcialización'
        );
        this.form.get('ind').setValue('S');
        return false;
      }
      // this.vsum = this.sumCant ?? 0;
    } else {
      // const searchRegExp = new RegExp(',', 'g');
      this.vimporte = Number((+this.good.val2).toFixed(4));
      // this.vsum = this.sumVal14 ?? 0;
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

  // private async validationInmueble() {
  //   const clasificador = this.good.goodCategory;
  //   const inmuebleValidation = await firstValueFrom(this.goodSSSubtypeService.getAll2('filter.numType=$in:2,6&filter.numClasifGoods=' + clasificador));
  //   this.v_inmueble = inmuebleValidation.count;
  //   if (this.v_inmueble > 0) {
  //     if ((this.cantPar.value % 1) !== 0 || (this.cantidad.value % 1) !== 0) {
  //       this.onLoadToast('error', 'Parcialización', 'No es posible parcializar bien en fracciones')
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // private async validationDecimales() {
  //   const unidad = this.good.unit;
  //   const decimalesValidation = await firstValueFrom(this.goodService.getMeasurementUnits(unidad));
  //   if (decimalesValidation.data.decimales === 'N' && !this.validationClasif()) {
  //     if ((this.cantPar.value % 1) !== 0 || (this.cantidad.value % 1) !== 0) {
  //       this.onLoadToast('error', 'Parcialización', 'No es posible parcializar bien en fracciones')
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  private async setMeasureData() {
    const data = await firstValueFrom(
      this.goodService.getGoodWidthMeasure(this.good.id)
    );
    const { cantidad, descripcion, cve_moneda_avaluo } = data.data[0];

    return {
      v_cantidad: cantidad,
      v_unidad: descripcion,
      v_avaluo: cve_moneda_avaluo,
    };
  }

  private async validationNumerario() {
    const clasificador = this.good.goodCategory;
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
    v_cantidad: string,
    v_unidad: string,
    v_avaluo: string
  ) {
    if (this.v_numerario === 0) {
      return (
        'Bien por ' +
        this.cantidad.value +
        ' ' +
        v_unidad +
        ', (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ' (' +
        v_cantidad +
        ' ' +
        v_unidad +
        '), ' +
        this.formGood.get('descripcion').value +
        ' )'
      );
    } else {
      return (
        'Numerario por $' +
        (this.cantidad.value + '').trim() +
        ' ' +
        v_avaluo +
        ' (Producto de la Parcialización de Bien No.' +
        this.formGood.get('noBien').value +
        ', ' +
        this.formGood.get('descripcion').value +
        ' )'
      );
    }
  }

  private fillAvaluo() {
    if (this.good.appraisedValue) {
      return Math.round(this.good.appraisedValue * this.vfactor);
    } else {
      return null;
    }
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    // const clasificador = this.formGood.get('clasificador').value;
    if (this.validationClasif()) {
      importe = Number(this.cantidad.value.toFixed(2));
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

  async partialize() {
    // debugger;
    let vind;
    this.form.get('ind').setValue('N');
    if (this.form.valid && this.formGood.valid) {
      if (!this.validationImporte()) return;
      this.vsum = 0;
      this.vident = 0;
      // const validationIn = await this.validationInmueble();
      // if (!validationIn) return;
      // const validationDec = await this.validationDecimales();
      // if (!validationDec) return;
      // const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      // const validationNum = await this.validationNumerario();
      // if (!validationNum) return;
      this.bienesPar.forEach(item => {
        if (!this.validationClasif()) {
          this.vsum += item.cantidad;
        } else {
          this.vsum += item.importe;
        }
        this.vident = item.id;
      });
      const newImporte = this.cantPar.value * this.cantidad.value + this.vsum;
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
      this.vfactor = this.cantidad.value / this.vimporte;
      this.vres = this.vimporte - newImporte;
      vind = true;

      // if (this.bienesPar[this.bienesPar.length - 2]) {
      //   this.vident = this.bienesPar[this.bienesPar.length - 1].id;
      // }
      this.vident++;
      let item;
      for (let index = 0; index < this.form.get('cantPar').value; index++) {
        if (vind) {
          vind = false;
        } else {
          this.bienesPar.push(item);
        }
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
        let descripcion =
          'Parcialización de Bien No.' +
          this.good.id +
          ', ' +
          this.good.description;
        item.id = this.vident;
        item.noBien = this.good.id;
        item.descripcion =
          descripcion.length > 1250
            ? descripcion.substring(0, 1250)
            : descripcion;
        item.proceso = this.good.extDomProcess;
        const avaluo = this.fillAvaluo();
        const { importe, cantidad } = this.fillImporteCant();
        item.cantidad = cantidad;
        item.avaluo = avaluo;
        item.importe = importe;
        // this.service.sumCant += cantidad;
        // this.service.sumVal14 += importe;
        // this.vident++;
        // if (this.isFirstCase) this.bienesPar.pop();
        // this.bienesPar.push({
        //   id: this.vident,
        //   noBien,
        //   descripcion,
        //   proceso,
        //   cantidad,
        //   avaluo,
        //   importe,
        //   val10: 0,
        //   val11: 0,
        //   val12: 0,
        //   val13: 0
        // })
        // if (this.isFirstCase) this.bienesPar.push({
        //   id: null,
        //   noBien: null,
        //   descripcion: null,
        //   proceso: null,
        //   cantidad: this.service.sumCant,
        //   avaluo: null,
        //   importe: this.service.sumVal14,
        //   val10: 0,
        //   val11: 0,
        //   val12: 0,
        //   val13: 0
        // })
      }
      this.saldo.setValue(this.vres);
      this.ind.setValue('S');
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
    }
  }

  private getNoActa(): any {
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

    return null;
  }

  private getStatusxPantalla(): any {
    return { estatus_nuevo_bien: '', estatus_final: '' };
    /**
     *  FOR reg IN (SELECT estatus_final, estatus_nuevo_bien, accion
                  FROM   estatus_x_pantalla est
                  WHERE  est.cve_pantalla = vc_pantalla
                  AND    est.accion       = vaccion)
      LOOP
         IF reg.estatus_final IS NOT NULL THEN
            vestatus := reg.estatus_nuevo_bien;
            :BIENES.ESTATUS := reg.estatus_final;
            INSERT INTO historico_estatus_bien (no_bien, estatus, fec_cambio,
                                                usuario_cambio, motivo_cambio, programa_cambio_estatus)
                                        VALUES (:BIENES.NO_BIEN, reg.estatus_final, sysdate,
                                                :toolbar_usuario, 'Parcialización', vc_pantalla);
            EXIT;
         END IF;
         IF :SYSTEM.LAST_RECORD = 'TRUE' THEN
            EXIT;
         END IF;
         NEXT_RECORD;
      END LOOP;
     */
    return null;
  }

  private getVerificaDesCargaMasiva(): any {
    /**
     * BEGIN
         SELECT COUNT(0)
           INTO v_vefif_des
           FROM BIENES_CARGA_MASIVA
          WHERE NO_BIEN = :BIENES.NO_BIEN
            AND DESALOJO_DIADIA = 1;
      EXCEPTION
         WHEN OTHERS THEN
            v_vefif_des := 0;
     */
    return null;
  }

  private getBienDual(): any {
    /**
     *  SELECT seq_bienes.nextval
            INTO   vn_bien_new
            FROM   dual;
     */
    return null;
  }

  // private async fillDescriptions(item: IBienesPar, vimpbien: number) {
  //   let vobserv_padre = 'Bien(es) parcializado(s): ';
  //   item.noBien = await this.getBienDual();
  //   vobserv_padre = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
  //   vobserv_padre = vobserv_padre.substring(
  //     0,
  //     vobserv_padre.length > 600 ? 600 : vobserv_padre.length
  //   );
  //   // vdesc_padre = vdesc_padre + item.noBien;
  //   // vdesc_padre = vdesc_padre.substring(0, vdesc_padre.length > 1250 ? 1250 : vdesc_padre.length)
  //   return { vobserv_padre, noBien: item.noBien };
  // }

  private estatusProceed(): any {
    /**
     *  SELECT ESTATUS_FINAL
     INTO v_est_proced
     FROM ESTATUS_X_PANTALLA
    WHERE CVE_PANTALLA = vc_pantalla
      AND ESTATUS      = pestatus
      AND ACCION       = 'FINAL'
      AND PROCESO_EXT_DOM = pproextdom;
     */
    return null;
  }

  async apply() {
    this.loading = true;
    let v_importe: number,
      v_estatus: string,
      vaccion: string,
      vproextdom: string,
      vno_acta: number,
      v_verif_des: string;
    // let vb_estatus_valido = false;
    // if (this.bienesPar.length === 0) {
    //   this.onLoadToast('error', 'Error', 'No se tienen cantidades a parcializar...')
    //   return;
    // }
    if (this.validationClasif()) {
      v_importe = +(this.good.appraisedValue
        ? this.good.appraisedValue
        : this.good.val14
        ? this.good.val14
        : '0');
    } else {
      v_importe = this.good.quantity;
    }
    this.checkSum('O');

    // this.form.get('ind').setValue('N');
    v_estatus = this.good.status;
    vaccion = 'FINAL';
    // vproextdom = this.good.extDomProcess;
    // vno_acta = await this.getNoActa();
    let { estatus_nuevo_bien, estatus_final } = await this.getStatusxPantalla();
    v_estatus = estatus_nuevo_bien;
    this.formGood.get('estatus').setValue(estatus_final);
    let vobserv_padre = 'Bien(es) parcializado(s): ';
    // v_verif_des = await this.getVerificaDesCargaMasiva();
    let vsumimp = 0;

    let vval2: number,
      vimpbien: number,
      vident: number,
      vfactor: number,
      vfactornum: number,
      vobservaciones: string;
    this.bienesPar.forEach(async item => {
      if (this.validationClasif()) {
        vval2 = item.importe; //Number(item.importe.toFixed(2).trim())
        vimpbien = Number(item.importe.toFixed(2).trim());
      } else {
        vval2 = +this.good.val2;
        vimpbien = item.cantidad;
      }
      vident = item.id;
      vfactor = vimpbien / v_importe;
      vfactornum = vimpbien / (v_importe - vsumimp);
      vsumimp = vsumimp + vimpbien;
      item.noBien = await this.getBienDual();
      let mensaje = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
      vobserv_padre =
        mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      vobservaciones = 'Parcializado del bien: ' + this.good.id;
      this.insertaBien(
        item,
        v_estatus,
        vproextdom,
        vval2,
        vobservaciones,
        vfactor,
        vfactornum
      );
    });
    if (vsumimp < v_importe) {
      vfactor = (v_importe - vsumimp) / v_importe;
      vfactornum = (v_importe - vsumimp) / (v_importe - vsumimp);
      let item: IBienesPar;
      let descripcion =
        'Parcialización de Bien No.' +
        this.good.id +
        ', ' +
        this.good.description;
      descripcion =
        descripcion.length > 1250
          ? descripcion.substring(0, 1250)
          : descripcion;
      let avaluo = this.good.appraisedValue
        ? +(this.good.appraisedValue * vfactor).toFixed(2)
        : this.good.appraisedValue;
      item = {
        id: vident + 1,
        noBien: null,
        descripcion,
        proceso: null,
        cantidad: null,
        avaluo,
        importe: 0,
        val10: 0,
        val11: 0,
        val12: 0,
        val13: 0,
      };

      if (this.validationClasif()) {
        item.importe = +(v_importe - vsumimp).toFixed(2);
        if (this.good.quantity !== 1) {
          item.cantidad = v_importe - vsumimp;
        } else {
          item.cantidad = this.good.quantity;
        }
        vval2 = item.importe;
        Number((item.avaluo ? item.avaluo : item.importe).toFixed(2));
        vimpbien = +item.importe.toFixed(4);
      } else {
        item.cantidad = v_importe - vsumimp;
        vval2 = item.importe;
        vimpbien = item.cantidad;
      }
      item.noBien = await this.getBienDual();
      let mensaje = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
      vobserv_padre =
        mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      vobservaciones = 'Saldo parcializado del bien: ' + this.good.id;

      // const fail: boolean = await this.insertaBien(item, v_estatus, vproextdom, vval2, vobservaciones, vfactor, vfactornum, v_verif_des, vno_acta);
      // if (fail) {

      // }
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
    // const description = vdesc_padre + this.good.description;
    // this.good.description = description.substring(0, observations.length > 1250 ? 1250 : observations.length);
    // this.formGood.get('descripcion').setValue(this.good.description);
    // if (vno_acta > 0) {
    //   await firstValueFrom(this.detailReceptionService.deleteById(this.good.id, vno_acta))
    // }
    // this.saldo.setValue(0);
    // this.onLoadToast('success', 'Parcialización', 'La parcialización de bienes se realizo con éxito');
  }

  async insertaBien(
    item: IBienesPar,
    pestatus: string,
    pproextdom: string,
    pval2: number,
    pobservaciones: string,
    pfactor: number,
    pfactornum: number
  ) {
    const PVAL14 = pval2;
    const v_est_proced = await this.estatusProceed();
    if (!v_est_proced) return false;
    [
      this.goodService.create({
        ...this.good,
        id: item.noBien,
        description: v_est_proced + ', ' + this.good.description,
        status: pestatus,
        val2: pval2 + '',
        val10: item.val10 + '',
        val11: item.val11 + '',
        val12: item.val12 + '',
        val13: item.val13 + '',
        val14: PVAL14 + '',
        appraisedValue: item.avaluo,
        goodReferenceNumber: item.noBien,
        observations: pobservaciones,
        goodsPartializationFatherNumber: item.noBien,
        extDomProcess: pproextdom,
      }),
      this.historyGoodService.create({
        propertyNum: item.noBien,
        status: pestatus,
        changeDate: new Date(),
        userChange: localStorage.getItem('username'),
        reasonForChange: 'Parcialización',
        statusChangeProgram: 'FACTGENPARCBIEN',
        extDomProcess: pproextdom,
      }),
    ];
    return true;
  }
}
