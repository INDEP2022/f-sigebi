import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import { GoodDTO } from 'src/app/common/repository/interfaces/ms-partialize-good';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from './models/bienesPar.model';
import { PartializeGeneralGoodService } from './services/partialize-general-good.service';
export interface IPupBien {
  description: string;
  amount: string;
  worthappraisal: number;
  goodReferenceNumber: string;
  status: string;
  processExtSun: string;
  pval2: number;
  observations: string;
  pfactornum: number;
  pEviction: string;
  certificateNumber: number;
  good: IGood;
}
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
    private historyGoodService: HistoryGoodService,
    private statusXScreenService: ScreenStatusService
  ) {
    super();
    // this.goodService.getAll(new ListParams()).subscribe(x => {
    //   console.log(x);
    // });
    // this.goodTypesService.search(new ListParams()).subscribe(x => {});
    // this.goodsQueryService.getAtributeClassificationGood(new ListParams()).subscribe(x => {
    //   console.log(x);
    // });
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  ngOnInit(): void {
    this.service.initFormControl();
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
      // this.vimporte = +(cantidad + '');
      if (cantidad < 0.1) {
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
      // this.vimporte = +this.good.val14;
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
    // const fraccion = this.good.fraccion;
    // if (!fraccion) {
    //   return false;
    // }
    const unidad = this.good.unit;
    const decimalesValidation = await firstValueFrom(
      this.goodService.getMeasurementUnits(unidad)
    );

    //fraccion.decimalAmount === 'N'
    if (
      decimalesValidation.data.decimales === 'N' &&
      !this.validationClasif()
    ) {
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

  private async setMeasureData() {
    // const data = await firstValueFrom(
    //   this.goodService.getGoodWidthMeasure(this.good.id)
    // );
    // const { cantidad, descripcion, cve_moneda_avaluo } = {
    //   cantidad: this.good.quantity,
    //   descripcion: this.good.fraccion.description,
    //   cve_moneda_avaluo: this.good.appraisalCurrencyKey,
    // };

    // return {
    //   v_cantidad: this.good.quantity,
    //   v_unidad: this.good.fraccion.description,
    //   v_avaluo: this.good.appraisalCurrencyKey,
    // };
    const data = await firstValueFrom(
      this.goodService.getGoodWidthMeasure(this.good.id)
    );
    const { cantidad, descripcion, cve_moneda_avaluo } = data.data[0];

    return {
      v_cantidad: +cantidad,
      v_unidad: descripcion,
      v_avaluo: cve_moneda_avaluo,
    };
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

  async partialize() {
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
      this.vfactor = this.cantidad.value / this.vimporte;
      this.vres = this.vimporte - newImporte;
      this.vident = 0;
      if (this.bienesPar[this.bienesPar.length - 2]) {
        this.vident = this.bienesPar[this.bienesPar.length - 1].id;
      }
      this.vident++;
      const descripcion = this.fillDescription(v_cantidad, v_unidad, v_avaluo);
      const proceso = this.good.extDomProcess;
      const avaluo = this.fillAvaluo();
      const { importe, cantidad } = this.fillImporteCant();
      const noBien = this.good.id;
      this.service.sumCant += cantidad;
      this.service.sumVal14 += importe;
      // this.vident++;
      this.bienesPar.pop();
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
    } else {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.form.markAsUntouched();
      }, 1000);
    }
  }

  private async getNoActa() {
    return firstValueFrom(
      this.goodService.getActAccount({
        goodNumber: this.good.id,
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
        goodNumber: this.good.id,
        screenKey: 'FACTGENPARCBIEN',
        process: this.good.extDomProcess,
        action: 'FINAL',
        status: this.good.status,
        user: localStorage.getItem('username'),
      })
    );
    /**
     * FOR reg IN (SELECT estatus_final, estatus_nuevo_bien, accion, proceso_ext_dom
                  FROM   estatus_x_pantalla EST
                  WHERE  est.cve_pantalla = vc_pantalla
                  AND    est.accion       = vaccion
                  AND    est.estatus      = :bienes.estatus
                  AND    est.proceso_ext_dom = :bienes.proceso_ext_dom)--GMR 06-10-09
      LOOP

         IF reg.estatus_final IS NOT NULL THEN
             -- vestatus := reg.estatus_nuevo_bien;
             --:BIENES.ESTATUS := reg.estatus_final;
            :BIENES.PROCESO_EXT_DOM := reg.proceso_ext_dom;--GMR 06-10-2009
            SELECT ESTATUS_FINAL
              INTO vc_paso_est
              FROM ESTATUS_X_PANTALLA EP
             WHERE EP.CVE_PANTALLA = vc_pantalla
               AND EP.ACCION       = vaccion
               AND EP.ESTATUS      = :BIENES.ESTATUS
               AND EP.PROCESO_EXT_DOM = :BIENES.PROCESO_EXT_DOM;
              :BIENES.ESTATUS := vc_paso_est;

            INSERT INTO historico_estatus_bien (no_bien, estatus, fec_cambio,
                                                usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--GMR 06-10-2009
                                        VALUES (:BIENES.NO_BIEN, vc_paso_est, sysdate,
                                                :toolbar_usuario, 'Parcialización', vc_pantalla,reg.proceso_ext_dom);--GMR 06-10-2009

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

  private async getVerificaDesCargaMasiva() {
    return firstValueFrom(
      this.goodService.getValidMassiveDownload(this.good.id)
    );
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

  private async getBienDual() {
    return firstValueFrom(this.goodService.getValidSeq());
    /**
     *  SELECT seq_bienes.nextval
            INTO   vn_bien_new
            FROM   dual;
     */
    // return null;
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
    } catch (x) {}
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
    } catch (x) {}
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
      vobservaciones = 'Parcializado del bien: ' + this.good.id;
      await this.insertaBien(
        item,
        this.good,
        v_estatus,
        this.good.extDomProcess,
        vval2,
        vobservaciones,
        vfactornum,
        v_verif_des,
        vno_acta
      );
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
          this.good.id +
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
          this.good.id +
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
      vobservaciones = 'Saldo parcializado del bien: ' + this.good.id;

      const fail: boolean = await this.insertaBien(
        item,
        this.good,
        v_estatus,
        this.good.extDomProcess,
        vval2,
        vobservaciones,
        vfactornum,
        v_verif_des,
        vno_acta
      );
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
    const description = vdesc_padre + this.good.description;
    this.good.description = description.substring(
      0,
      observations.length > 1250 ? 1250 : observations.length
    );
    this.formGood.get('descripcion').setValue(this.good.description);
    if (vno_acta > 0) {
      await firstValueFrom(
        this.detailReceptionService.deleteById(this.good.id, vno_acta)
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
    status: string,
    pproextdom: string,
    pval2: number,
    pobservaciones: string,
    pfactornum: number,
    pdesalojo: number,
    pno_acta: number
  ) {
    // return this.partializeGoodService.pupInsertGood()
    // return true;
    console.log('Entro a insertaBien', good);

    let request: GoodDTO = null;
    request = {
      pFactorNumber: +pfactornum,
      inventoryNumber: good.inventoryNumber + '',
      screenKey: 'FACTGENPARCBIEN',
      description: status + ', ' + item.descripcion,
      amount: item.cantidad + '',
      entranceDate: good.dateIn, // ? format(good.dateIn, 'yyyy-MM-dd') : '',
      exitDate: good.dateOut, // ? format(good.dateOut, 'yyyy-MM-dd') : '',
      beatDate: good.expireDate, // ? format(good.expireDate, 'yyyy-MM-dd') : '',
      locationType: good.locationId ? good.locationId + '' : null,
      status,
      val1: good.val1,
      val2: pval2 + '',
      val3: good.val3,
      val4: good.val4,
      val5: good.val5,
      val6: good.val6,
      val7: good.val7,
      val8: good.val8,
      val9: good.val9,
      val10: good.val10,
      val11: item.val11 + '',
      val12: item.val12 + '',
      val13: item.val13 + '',
      val14: good.val14 + '',
      val15: good.val15,
      val16: good.val16,
      val17: good.val17,
      val18: good.val18,
      val19: good.val19,
      val20: good.val20,
      val21: good.val21,
      val22: good.val22,
      val23: good.val23,
      val24: good.val24,
      val25: good.val25,
      val26: good.val26,
      val27: good.val27,
      val28: good.val28,
      val29: good.val29,
      val30: good.val30,
      val31: good.val31,
      val32: good.val32,
      val33: good.val33,
      val34: good.val34,
      val35: good.val35,
      val36: good.val36,
      val37: good.val37,
      val38: good.val38,
      val39: good.val39,
      val40: good.val40,
      val41: good.val41,
      val42: good.val42,
      val43: good.val43,
      val44: good.val44,
      val45: good.val45,
      val46: good.val46,
      val47: good.val47,
      val48: good.val48,
      val49: good.val49,
      val50: good.val50,
      classificationGood: good.goodClassNumber + '',
      markingsOrigin: good.originSignals ? good.originSignals : '',
      applicationenrollRecord: good.registerInscrSol,
      opinionDate: good.dateOpinion
        ? format(good.dateOpinion, 'yyyy-MM-dd')
        : '',
      proficientopinion: good.proficientOpinion,
      appraiseropinion: good.valuerOpinion,
      opinion: good.opinion,
      worthappraisal: item.avaluo ? +(item.avaluo + '') : null,
      drawerNumber: good.drawerNumber + '',
      vaultNumber: good.vaultNumber + '',
      goodReferenceNumber: item.noBien + '',
      currencyappraisalKey: good.appraisalCurrencyKey,
      appraisalVigDate: good.appraisalVigDate
        ? format(good.appraisalVigDate, 'yyyy-MM-dd')
        : '',
      approvedDestLegal: good.legalDestApprove,
      usrIapproveDestLegal: good.legalDestApproveUsr,
      iApproveDestLegalDate: good.legalDestApproveDate,
      complianceAbandonmentDate: good.complianceLeaveDate
        ? format(good.complianceLeaveDate, 'yyyy-MM-dd')
        : '',
      notificationAbandonmentDate: good.complianceNotifyDate
        ? format(good.complianceNotifyDate, 'yyyy-MM-dd')
        : '',
      observationsAbandonment: good.leaveObservations,
      confAbandonmentJudicialDate: good.judicialLeaveDate
        ? format(good.judicialLeaveDate, 'yyyy-MM-dd')
        : '',
      notificationDate: good.notifyDate
        ? format(good.notifyDate, 'yyyy-MM-dd')
        : '',
      notifiedTO: good.notifyA,
      placeNotification: good.placeNotify,
      beefdiscarddiscardrecRevDate: good.discardRevRecDate
        ? format(good.discardRevRecDate, 'yyyy-MM-dd')
        : '',
      issueResolutionrecRevDate: good.resolutionEmissionRecRevDate
        ? format(good.resolutionEmissionRecRevDate, 'yyyy-MM-dd')
        : '',
      agreementAdmissoryrecRevDate: good.discardRevRecDate
        ? format(good.discardRevRecDate, 'yyyy-MM-dd')
        : '',
      audiencerecRevDate: good.audienceRevRecDate
        ? format(good.audienceRevRecDate, 'yyyy-MM-dd')
        : '',
      observationsrecRev: good.revRecObservations,
      reasonAbandonment: good.leaveCause,
      resolution: good.resolution,
      unaffordabilityDate: good.fecUnaffordability,
      criterionunaffordability: good.unaffordabilityJudgment,
      usrIapproveUtilization: good.userApproveUse,
      IapproveUtilizationDate: good.useApproveDate
        ? format(good.useApproveDate, 'yyyy-MM-dd')
        : '',
      observationsUtilization: good.useObservations,
      requestedChangeCashDate: good.dateRequestChangeNumerary,
      userRequestChangeCash: good.numberChangeRequestUser + '',
      reasonChangeCash: good.causeNumberChange + '',
      solicitousChangeCash: good.changeRequestNumber + '',
      authorizeChangeCashDate: good.authNumberChangeDate
        ? format(good.authNumberChangeDate, 'yyyy-MM-dd')
        : '',
      userauthorizeChangenumber: good.authChangeNumberUser + '',
      authorizeChangeCash: good.authChangeNumber + '',
      ratifiesChangeCashDate: good.numberChangeRatifiesDate
        ? format(good.numberChangeRatifiesDate, 'yyyy-MM-dd')
        : '',
      userRatifiesChangenumber: good.numberChangeRatifiesUser + '',
      notificationrecRevDate: good.notifyRevRecDate
        ? format(good.notifyRevRecDate, 'yyyy-MM-dd')
        : '',
      reasonrecRev: good.revRecCause,
      agreementInitial: good.initialAgreement,
      observations: pobservaciones,
      proceedingsNumber: good.fileNumber + '',
      expAssociatedNumber: good.associatedFileNumber + '',
      rackNumber: good.rackNumber + '',
      storeNumber: good.storeNumber + '',
      batchNumber: good.lotNumber + '',
      classifyGoodNumber: good.goodClassNumber + '',
      subdelegationNumber: good.subDelegationNumber + '',
      delegationNumber: good.delegationNumber + '',
      receptionPhysicalDate: good.physicalReceptionDate,
      // ? format(good.physicalReceptionDate, 'yyyy-MM-dd')
      // : '',
      statusResourceRevision: good.statusResourceReview,
      certificateNumber: pno_acta ? pno_acta : null,
      judicialDate: good.judicialDate,
      // ? format(good.judicialDate, 'yyyy-MM-dd')
      // : '',
      expirationAbandonmentDate: good.abandonmentDueDate,
      // ? format(good.abandonmentDueDate, 'yyyy-MM-dd')
      // : '',
      iApproveDestructionDate: good.destructionApproveDate,
      // ? format(good.destructionApproveDate, 'yyyy-MM-dd')
      // : '',
      usrIapproveDestruction: good.destructionApproveUser,
      observationsDestruction: good.observationDestruction,
      destinationNumber: good.destinyNumber + '',
      agreementsecureDate: good.agreementDate,
      // ? format(good.agreementDate, 'yyyy-MM-dd')
      // : '',
      state: good.state,
      opinionType: good.opinionType,
      presentationDate: good.presentationDate,
      // ? format(good.presentationDate, 'yyyy-MM-dd')
      // : '',
      rectifyrecRevDate: good.revRecRemedyDate,
      // ? format(good.revRecRemedyDate, 'yyyy-MM-dd')
      // : '',
      statusReception: good.receptionStatus,
      userpromoterdecorationDevo: good.promoterUserDecoDevo,
      scheduledxdecorationDevoDate: new Date(good.scheduledDateDecoDev),
      goodFatherpartializationNumber: good.goodsPartializationFatherNumber + '',
      statementAbnBe: good.seraAbnDeclaration,
      identifier: good.identifier,
      inventorysiabiId: good.siabiInventoryId,
      propertyCisiId: good.cisiPropertyId,
      invacualsiabiId: good.siabiInvalidId,
      tesofeDate: new Date(good.tesofeDate),
      invoiceTesofe: good.tesofeFolio,
      situation: good.situation + '',
      labelNumber: good.labelNumber + '',
      unit: good.unit,
      processExtSun: pproextdom,
      pEviction: pdesalojo + '',
      changeUser: good.val50,
      percentage: 1 + '',
    };
    return firstValueFrom(this.partializeGoodService.pupInsertGood(request));
    // const PVAL14 = pval2;
    // const v_est_proced = await this.estatusProceed(pestatus, pproextdom);
    // if (!v_est_proced) return false;
    // [
    //   this.goodService.create({
    //     ...this.good,
    //     id: item.noBien,
    //     description: v_est_proced + ', ' + this.good.description,
    //     status: pestatus,
    //     val2: pval2 + '',
    //     val10: item.val10 + '',
    //     val11: item.val11 + '',
    //     val12: item.val12 + '',
    //     val13: item.val13 + '',
    //     val14: PVAL14 + '',
    //     appraisedValue: item.avaluo,
    //     goodReferenceNumber: item.noBien,
    //     observations: pobservaciones,
    //     goodsPartializationFatherNumber: item.noBien,
    //     extDomProcess: pproextdom,
    //   }),
    //   this.historyGoodService.create({
    //     propertyNum: item.noBien,
    //     status: pestatus,
    //     changeDate: new Date(),
    //     userChange: localStorage.getItem('username'),
    //     reasonForChange: 'Parcialización',
    //     statusChangeProgram: 'FACTGENPARCBIEN',
    //     extDomProcess: pproextdom,
    //   }),
    // ];
    // return true;
  }
}
