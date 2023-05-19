import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  GoodDTO,
  IGoodP,
} from 'src/app/common/repository/interfaces/ms-partialize-good';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IScreenXStatus } from 'src/app/core/models/ms-screen-status/screen-status.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { IBienesPar } from '../../models/bienesPar.model';
import { CheckSum } from '../../models/checksum';
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
  vsumimp = 0;
  constructor(
    private partializeGoodService: PartializeGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
    private statusScreenService: StatusXScreenService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
  }

  get saldo() {
    return this.form.get('saldo');
  }

  get vimporte() {
    return this.service.vimporte;
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
    vfactor: number,
    vfactornum: number,
    pEviction: number,
    pno_acta: number
  ) {
    // return this.partializeGoodService.pupInsertGood()
    // return true;
    // debugger;
    console.log('Entro a insertaBien', good, pno_acta);
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

  private async validationsV1(
    v_verif_des: number,
    v_importe: number,
    v_estatus: string
  ) {
    // try {
    //   vb_estatus_valido = (await this.validateStatusXPantalla()) ? true : false;
    // } catch (x) { }
    // if (!vb_estatus_valido) {
    //   this.onLoadToast(
    //     'error',
    //     'Error',
    //     'El Bien no cuenta con un estatus correcto'
    //   );
    //   return {
    //     v_verif_des,
    //     v_importe,
    //     v_estatus,
    //     vno_acta,
    //     vb_estatus_valido,
    //   };
    // }
    if (this.bienesPar.length === 0) {
      this.onLoadToast(
        'error',
        'Error',
        'No se tienen cantidades a parcializar...'
      );
      return {
        v_verif_des,
        v_importe,
        v_estatus,
      };
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
    // vaccion = 'FINAL';
    // vproextdom = this.good.extDomProcess;
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
    return {
      v_verif_des,
      v_importe,
      v_estatus,
    };
  }

  private async getStatusxPantalla() {
    const filterParams = new FilterParams();
    filterParams.limit = 1000000;
    filterParams.addFilter('screenKey', 'FACTGENPARCBIEN');
    filterParams.addFilter('action', 'FINAL');
    let regs: IScreenXStatus[] = [];
    let estatus_nuevo_bien: string, estatus_final: string;
    try {
      regs = await firstValueFrom(
        this.statusScreenService
          .getList(filterParams.getParams())
          .pipe(map(x => x.data))
      );
      regs.forEach(async x => {
        estatus_nuevo_bien = x.statusNewGood;
        estatus_final = x.statusFinal.status;
        await firstValueFrom(
          this.historyGoodService.create({
            propertyNum: this.good.goodId,
            status: estatus_final,
            changeDate: new Date(),
            userChange: localStorage.getItem('username'),
            reasonForChange: 'Parcialización',
            statusChangeProgram: 'FACTGENPARCBIEN',
          })
        );
      });
    } catch (x) {
      // regs = [];
    }

    return { estatus_nuevo_bien, estatus_final };
  }

  private async insertGoodByGoodPar(
    vobserv_padre: string,
    estatus_nuevo_bien: string,
    bienesPar: IBienesPar[]
  ) {
    let vval2: number, vimpbien: number, vobservaciones: string;
    for (let index = 0; index < bienesPar.length; index++) {
      const item = bienesPar[index];
      if (this.validationClasif()) {
        vval2 = item.importe; //Number(item.importe.toFixed(2).trim())
        vimpbien = Number(item.importe.toFixed(2).trim());
      } else {
        vval2 = +this.good.val2;
        vimpbien = item.cantidad;
      }
      this.vfactor = vimpbien / this.vimporte;
      let vfactornum = vimpbien / (this.vimporte - this.vsumimp);
      this.vsumimp += vimpbien;

      item.noBien = await this.getBienDual();
      if (item.noBien === 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se pudo conseguir número de bien por secuencia'
        );
        return null;
      }
      let mensaje = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
      vobserv_padre =
        mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      vobservaciones = 'Parcializado del bien: ' + this.good.id;
      try {
        this.insertaBien(
          item,
          this.good,
          estatus_nuevo_bien,
          this.good.extDomProcess,
          vval2,
          vobservaciones,
          this.vfactor,
          vfactornum,
          0,
          this.service.noActa
        );
      } catch (x) {
        this.onLoadToast('error', 'Inserción', 'No se pudo insertar bien');
        return null;
      }
    }
    return vobserv_padre;
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    if (this.validationClasif()) {
      importe = +(this.vimporte - this.vsumimp).toFixed(2);
      const cantGood = this.good.quantity;
      if (cantGood != 1) {
        cantidad = this.vimporte - this.vsumimp;
      } else {
        cantidad = cantGood;
      }
    } else {
      cantidad = this.vimporte - this.vsumimp;
    }
    return {
      cantidad,
      importe,
    };
  }

  private getVal2AndImpbien(importe: number, cantidad: number) {
    let vval2, vimpbien;
    if (this.validationClasif()) {
      vval2 = importe;
      vimpbien = +importe.toFixed(4);
    } else {
      vval2 = this.good.val2;
      vimpbien = cantidad;
    }
    return { vval2, vimpbien };
  }

  private async fillRow(vobserv_padre: string, estatus_nuevo_bien: string) {
    let item: IBienesPar;
    let vfactor = (this.vimporte - this.vsumimp) / this.vimporte;

    let vfactornum =
      (this.vimporte - this.vsumimp) / (this.vimporte - this.vsumimp);
    // this.vident++;
    let descripcion =
      'Parcialización de Bien No.' +
      this.good.id +
      ', ' +
      this.good.description;
    descripcion =
      descripcion.length > 1250 ? descripcion.substring(0, 1250) : descripcion;
    let avaluo = this.good.appraisedValue
      ? +(this.good.appraisedValue * this.vfactor).toFixed(2)
      : this.good.appraisedValue;
    let { cantidad, importe } = this.fillImporteCant();
    let noBien = await this.getBienDual();
    const { vval2, vimpbien } = this.getVal2AndImpbien(importe, cantidad);
    const mensaje = vobserv_padre + noBien + ' por: ' + vimpbien + ', ';
    vobserv_padre = mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
    const vobservaciones = 'Saldo parcializado del bien ' + this.good.goodId;
    item = {
      id: this.bienesPar[this.bienesPar.length - 1].id + 1,
      noBien,
      descripcion,
      proceso: this.good.extDomProcess,
      cantidad,
      avaluo,
      importe,
      val10: 0,
      val11: 0,
      val12: 0,
      val13: 0,
    };
    this.bienesPar.push(item);
    this.insertaBien(
      item,
      this.good,
      estatus_nuevo_bien,
      this.good.extDomProcess,
      +vval2,
      vobservaciones,
      vfactor,
      vfactornum,
      0,
      this.service.noActa
    );
  }

  async apply() {
    // debugger;
    this.loading = true;
    let v_importe: number,
      v_estatus: string,
      vaccion: string,
      v_verif_des: number = 0;
    if (this.version === 1) {
      const result = await this.validationsV1(
        v_verif_des,
        v_importe,
        v_estatus
      );
      v_verif_des = result.v_verif_des;
      v_importe = result.v_importe;
      v_estatus = result.v_estatus;
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
            vfactor,
            vfactornum,
            v_verif_des,
            this.service.noActa
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
            vfactor,
            vfactornum,
            v_verif_des,
            this.service.noActa
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
      if (this.service.noActa > 0) {
        await firstValueFrom(
          this.detailReceptionService.deleteById(
            this.good.goodId,
            this.service.noActa
          )
        );
      }
      this.saldo.setValue(0);
    } else {
      const checkSum = new CheckSum();
      // checkSum.firstCase = this.firstCase;
      checkSum.version = this.version;
      if (!checkSum.execute('O')) {
        return;
      }
      let { estatus_nuevo_bien, estatus_final } =
        await this.getStatusxPantalla();
      if (!estatus_nuevo_bien || !estatus_final) {
        this.onLoadToast('error', 'Parcialización', 'Pantalla no encontrada');
        return;
      }
      this.good.status = estatus_final;
      let vobserv_padre = 'Bien(es) parcializado(s): ';
      vobserv_padre = await this.insertGoodByGoodPar(
        vobserv_padre,
        estatus_nuevo_bien,
        this.bienesPar
      );
      if (vobserv_padre != null) {
        if (this.vsumimp < this.vimporte) {
          this.vfactor = (this.vimporte - this.vsumimp) / this.vimporte;
          await this.fillRow(vobserv_padre, estatus_nuevo_bien);
        }
        const mensaje =
          vobserv_padre +
          ' fecha: ' +
          format(new Date(), 'dd/mm/yyy') +
          '. ' +
          this.good.observations;
        this.good.observations =
          mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      }
    }

    this.onLoadToast(
      'success',
      'Parcialización',
      'La parcialización de bienes se realizo con éxito'
    );
  }
}
