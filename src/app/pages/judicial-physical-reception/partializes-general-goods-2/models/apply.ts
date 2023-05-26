import { inject } from '@angular/core';
import { format } from 'date-fns';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  GoodDTO,
  IGoodP,
} from 'src/app/common/repository/interfaces/ms-partialize-good';
import { IScreenXStatus } from 'src/app/core/models/ms-screen-status/screen-status.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { IBienesPar } from '../../partializes-general-goods-1/models/bienesPar.model';
import { CheckSum } from './checksum';
import { PartializeFunctions } from './partialize-functions';
export class Apply extends PartializeFunctions {
  v_importe: number;
  vsumimp = 0;
  vaccion = 'FINAL';
  estatus_nuevo_bien: string;
  vobserv_padre: string;
  vfactor: number;
  vfactornum: number;
  vestatus: string;
  // vident: number = 0;
  private statusXScreenService = inject(StatusXScreenService);
  private historyGoodService = inject(HistoryGoodService);
  private goodService = inject(GoodService);
  private partializeGoodService = inject(PartializeGoodService);

  private fillImporte() {
    if (this.validationClasif()) {
      this.v_importe = +(this.good.appraisedValue
        ? this.good.appraisedValue
        : this.good.val14
        ? this.good.val14
        : '0');
    } else {
      this.v_importe = this.good.quantity;
    }
  }

  async execute() {
    this.fillImporte();
    const checkSum = new CheckSum().execute('O');
    if (!checkSum) {
      return false;
    }
    return await this.alertQuestion(
      'question',
      'Parcialización',
      'Quiere continuar con la aplicación?'
    )
      .then(async question => {
        console.log(question);
        if (question.isConfirmed) {
          return this.applyContinue(this.bienesPar);
        } else {
          return false;
        }
      })
      .catch(x => {
        return false;
      });
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
        this.statusXScreenService
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

  private getBienDual(): any {
    /**
     *  SELECT seq_bienes.nextval
            INTO   vn_bien_new
            FROM   dual;
     */
    return firstValueFrom(
      this.goodService.getValidSeq().pipe(catchError(x => of(0)))
    );
  }

  async insertaBien(
    item: IBienesPar,
    statusNew: string,
    pval2: number,
    observations: string,
    pFactorNumber: number
  ) {
    // return true;
    const newGood: IGoodP = {
      ...this.good,
      observations,
      amount: item.cantidad,
      val2: pval2 + '',
      val11: item.val11 + '',
      val12: item.val12 + '',
      val13: item.val13 + '',
      val14: this.good.val14 + '',
      worthappraisal: item.avaluo ? +(item.avaluo + '') : null,
      goodReferenceNumber: item.noBien,
    };
    let request: GoodDTO = {
      screenKey: 'FACTGENPARCBIEN',
      changeUser: localStorage.getItem('username'),
      good: newGood,
      statusNew,
      pFactorNumber,
    };
    return firstValueFrom(this.partializeGoodService.insertGood(request));
  }

  private async insertGoodByGoodPar(bienesPar: IBienesPar[]) {
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
      this.vfactor = vimpbien / this.v_importe;
      this.vfactornum = vimpbien / (this.v_importe - this.vsumimp);
      this.vsumimp += vimpbien;

      item.noBien = await this.getBienDual();
      if (item.noBien === 0) {
        this.onLoadToast(
          'error',
          'Parcialización',
          'No se pudo conseguir número de bien por secuencia'
        );
        return false;
      }
      let mensaje =
        this.vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
      this.vobserv_padre =
        mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      vobservaciones = 'Parcializado del bien: ' + this.good.id;
      try {
        this.insertaBien(
          item,
          this.vestatus,
          vval2,
          vobservaciones,
          this.vfactornum
        );
      } catch (x) {
        this.onLoadToast('error', 'Inserción', 'No se pudo insertar bien');
        return false;
      }
    }
    return true;
  }

  private fillImporteCant() {
    let importe = 0;
    let cantidad = 0;
    if (this.validationClasif()) {
      importe = +(this.v_importe - this.vsumimp).toFixed(2);
      const cantGood = this.good.quantity;
      if (cantGood != 1) {
        cantidad = this.v_importe - this.vsumimp;
      } else {
        cantidad = cantGood;
      }
    } else {
      cantidad = this.v_importe - this.vsumimp;
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

  private async fillRow() {
    let item: IBienesPar;
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
    const mensaje = this.vobserv_padre + noBien + ' por: ' + vimpbien + ', ';
    this.vobserv_padre =
      mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
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
      this.vestatus,
      +vval2,
      vobservaciones,
      this.vfactornum
    );
  }

  private async applyContinue(bienesPar: IBienesPar[]) {
    this.vestatus = this.good.status;

    // let vsumimp = 0;
    let { estatus_nuevo_bien, estatus_final } = await this.getStatusxPantalla();
    if (!estatus_nuevo_bien || !estatus_final) {
      this.onLoadToast('error', 'Parcialización', 'Pantalla no encontrada');
      return false;
    }
    this.vestatus = estatus_nuevo_bien;
    this.good.status = estatus_final;
    this.vobserv_padre = 'Bien(es) parcializado(s): ';
    if (this.insertGoodByGoodPar(bienesPar)) {
      if (this.vsumimp < this.v_importe) {
        this.vfactor = (this.v_importe - this.vsumimp) / this.v_importe;
        this.vfactornum =
          (this.v_importe - this.vsumimp) / (this.v_importe - this.vsumimp);
        await this.fillRow();
      }
      const mensaje =
        this.vobserv_padre +
        ' fecha: ' +
        format(new Date(), 'dd/mm/yyy') +
        '. ' +
        this.good.observations;
      this.good.observations =
        mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      return true;
    } else {
      return false;
    }
  }
}
