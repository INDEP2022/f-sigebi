import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  GoodDTO,
  IGoodP,
} from 'src/app/common/repository/interfaces/ms-partialize-good';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { IBienesPar } from '../../models/bienesPar.model';
import { FunctionButtons } from '../../models/function-buttons';

@Component({
  selector: 'app-apply-button',
  templateUrl: './apply-button.component.html',
  styleUrls: ['./apply-button.component.scss'],
})
export class ApplyButtonComponent extends FunctionButtons implements OnInit {
  @Input() set press(value: boolean) {
    // debugger;
    if (this.service) {
      if (
        this.formGood?.invalid ||
        this.loading ||
        this.bienesPar.length === 0
      ) {
        return;
      }
      this.apply();
    }
  }
  constructor(
    private partializeGoodService: PartializeGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
    private statusScreenService: StatusXScreenService
  ) {
    super();
  }

  get saldo() {
    return this.form.get('saldo');
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

  private async getVerificaDesCargaMasiva() {
    return firstValueFrom(
      this.goodService.getValidMassiveDownload(this.good.goodId)
    );
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

  private async insertaBien(
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

  private validateStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FACTGENPARCBIEN');
    filterParams.addFilter('processExtSun', this.good.extDomProcess);
    filterParams.addFilter('status', this.good.status);
    return firstValueFrom(
      this.statusScreenService
        .getList(filterParams.getFilterParams())
        .pipe(map(x => x.data[0]))
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
    let vb_estatus_valido = false;
    try {
      vb_estatus_valido = (await this.validateStatusXPantalla()) ? true : false;
    } catch (x) {}
    if (!vb_estatus_valido) {
      this.onLoadToast(
        'error',
        'Error',
        'El Bien no cuenta con un estatus correcto'
      );
      return;
    }
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
      this.good.status = status;
      this.good.extDomProcess = process;
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
      // this.onLoadToast(
      //   'error',
      //   'Verificación Descarga Masiva',
      //   x.error.message
      // );
      // this.loading = false;
      // return;
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
}
