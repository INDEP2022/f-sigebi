import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
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
  vimporte: number;
  v_inmueble: any;
  v_numerario: any;
  vsum: any = 0;
  vfactor: any;
  vres: any;
  vident: any;
  constructor(
    private service: PartializeGeneralGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private goodService: GoodService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
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

  private validationClasif() {
    return [1424, 1426, 1427, 1575, 1590].includes(+this.good.goodCategory);
  }

  private validationImporte() {
    // debugger;
    const cantidad = this.good.quantity;
    if (!this.validationClasif()) {
      this.vimporte = cantidad;
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
      this.vimporte = +this.good.val14;
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
    const clasificador = this.good.goodCategory;
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
    const unidad = this.good.unit;
    const decimalesValidation = await firstValueFrom(
      this.goodService.getMeasurementUnits(unidad)
    );
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
      if (!this.validationImporte()) return;
      this.vsum = 0;
      const validationIn = await this.validationInmueble();
      if (!validationIn) return;
      const validationDec = await this.validationDecimales();
      if (!validationDec) return;
      const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      const validationNum = await this.validationNumerario();
      if (!validationNum) return;
      if (!this.validationClasif()) {
        this.vsum = this.sumCant ?? 0;
      } else {
        this.vsum = this.sumVal14 ?? 0;
      }
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
      if (this.isFirstCase) this.bienesPar.pop();
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
      if (this.isFirstCase)
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

  private getBienDual(): any {
    return firstValueFrom(this.goodService.getValidSeq());
    /**
     *  SELECT seq_bienes.nextval
            INTO   vn_bien_new
            FROM   dual;
     */
    return null;
  }

  private async fillDescriptions(item: IBienesPar, vimpbien: number) {
    let vobserv_padre = 'Bien(es) parcializado(s): ';
    let vdesc_padre = 'Bien(es) generado(s): ';
    item.noBien = await this.getBienDual();
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
    this.loading = true;
    let v_importe: number,
      v_estatus: string,
      vaccion: string,
      vproextdom: string,
      vno_acta: number,
      v_verif_des: number;
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
      v_importe = this.good.quantity;
    }
    this.form.get('ind').setValue('N');
    v_estatus = this.good.status;
    vaccion = 'FINAL';
    vproextdom = this.good.extDomProcess;
    vno_acta = await this.getNoActa();
    const { status, process } = await this.getStatusProcessxPantalla();
    this.formGood.get('estatus').setValue(status);
    this.formGood.get('extDom').setValue(process);
    v_verif_des = await this.getVerificaDesCargaMasiva();
    let vsumimp = 0;
    let vval2: number,
      vimpbien: number,
      vident: number,
      vfactor: number,
      vfactornum: number,
      vobservaciones: string,
      vobserv_padre: string,
      vdesc_padre: string;
    this.bienesPar.forEach(async item => {
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
      vobserv_padre = descriptions.vobserv_padre;
      vdesc_padre = descriptions.vdesc_padre;
      vobservaciones = 'Parcializado del bien: ' + this.good.id;
      this.insertaBien(
        item,
        v_estatus,
        vproextdom,
        vval2,
        vobservaciones,
        vfactor,
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
      const clasificador = this.good.goodCategory;
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
        v_estatus,
        vproextdom,
        vval2,
        vobservaciones,
        vfactor,
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
    pestatus: string,
    pproextdom: string,
    pval2: number,
    pobservaciones: string,
    pfactor: number,
    pfactornum: number,
    pdesalojo: number,
    pno_acta: number
  ) {
    const PVAL14 = pval2;
    const v_est_proced = await this.estatusProceed(pestatus, pproextdom);
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
