import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { format } from 'date-fns';
import { concatMap, firstValueFrom, from, map, tap } from 'rxjs';
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
import Swal from 'sweetalert2';
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
      if (!this.good || this.loading || this.bienesPar.length === 0) {
        return;
      }
      this.apply();
    }
  }
  @Output() fillPagedRow = new EventEmitter();
  checkSum: CheckSum;
  vsumimp = 0;
  finalStatus: string;
  finalExtDomProcess: string;
  constructor(
    private partializeGoodService: PartializeGoodService,
    private goodSSSubtypeService: GoodSssubtypeService,
    private detailReceptionService: ProceedingsDetailDeliveryReceptionService,
    private statusScreenService: StatusXScreenService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
    this.checkSum = new CheckSum();
  }

  get saldo() {
    return this.form.get('saldo');
  }

  get saldoValue() {
    return this.saldo ? this.saldo.value : 0;
  }

  get vimporte() {
    return this.service.vimporte;
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

  private fillDescriptions(item: IBienesPar, vimpbien: number) {
    // debugger;
    let vobserv_padre = 'Bien(es) parcializado(s): ';
    let vdesc_padre = 'Bien(es) generado(s): ';

    return this.goodService.getValidSeq().pipe(
      map(x => {
        item.noBien = x;
        vobserv_padre =
          vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
        vobserv_padre = vobserv_padre.substring(
          0,
          vobserv_padre.length > 600 ? 600 : vobserv_padre.length
        );
        vdesc_padre = vdesc_padre + item.noBien;
        vdesc_padre = vdesc_padre.substring(
          0,
          vdesc_padre.length > 1250 ? 1250 : vdesc_padre.length
        );
        return { vobserv_padre, vdesc_padre, noBien: item.noBien, item };
      })
    );
    // try {
    //   item.noBien = await this.getBienDual();
    // } catch (x) { }
    // vobserv_padre = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
    // vobserv_padre = vobserv_padre.substring(
    //   0,
    //   vobserv_padre.length > 600 ? 600 : vobserv_padre.length
    // );
    // vdesc_padre = vdesc_padre + item.noBien;
    // vdesc_padre = vdesc_padre.substring(
    //   0,
    //   vdesc_padre.length > 1250 ? 1250 : vdesc_padre.length
    // );
    // return { vobserv_padre, vdesc_padre, noBien: item.noBien };
  }

  // async insertaBien2(
  //   item: IBienesPar,
  //   statusNew: string,
  //   pval2: number,
  //   observations: string,
  //   pFactorNumber: number,
  // ) {
  //   // return true;
  //   const newGood: IGoodP = {
  //     ...this.good,
  //     observations,
  //     amount: item.cantidad,
  //     val2: pval2 + '',
  //     val11: item.val11 + '',
  //     val12: item.val12 + '',
  //     val13: item.val13 + '',
  //     val14: this.good.val14 + '',
  //     worthappraisal: item.avaluo ? +(item.avaluo + '') : null,
  //     goodReferenceNumber: item.noBien,
  //   };
  //   let request: GoodDTO = {
  //     screenKey: 'FACTGENPARCBIEN',
  //     changeUser: localStorage.getItem('username'),
  //     good: newGood,
  //     statusNew,
  //     pFactorNumber,
  //   };
  //   return firstValueFrom(this.partializeGoodService.insertGood(request));
  // }

  private insertaBien(
    item: IBienesPar,
    good: IGood,
    observations: string,
    statusNew: string,
    pproextdom: string,
    pval2: number,
    vimpbien: number,
    pEviction: number,
    pno_acta: number
  ) {
    // return this.partializeGoodService.pupInsertGood()
    // return true;
    // debugger;
    console.log('Entro a insertaBien', good, pno_acta);
    delete good.statusDetails;
    delete good.expediente;
    const newGood: IGoodP = {
      ...good,
      observations,
      amount: item.cantidad,
      appraisedValue: item.avaluo,
      quantity: item.cantidad,
      val2: pval2 + '',
      val11: item.val11 + '',
      val12: item.val12 + '',
      val13: item.val13 + '',
      val14: good.val14 + '',
      description: item.descripcion,
      worthappraisal: item.avaluo ? +(item.avaluo + '') : null,
      goodReferenceNumber: item.noBien,
      extDomProcess: pproextdom,
      subDelegationNumber: good.subDelegationNumber
        ? good.subDelegationNumber.id
        : null,
      delegationNumber: good.delegationNumber ? good.delegationNumber.id : null,
    };
    let request: GoodDTO = {
      screenKey: 'FACTGENPARCBIEN',
      pno_acta,
      changeUser: localStorage.getItem('username'),
      good: newGood,
      vimpbien,
      pEviction,
      statusNew,
    };
    return this.partializeGoodService.pupInsertGood(request);
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

  private async validationsV1(v_importe: number, v_estatus: string) {
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
    if (this.validationClasif()) {
      v_importe = +(+(
        this.good.appraisedValue
          ? this.good.appraisedValue + ''
          : this.good.val14
          ? this.good.val14
          : '0'
      ).replace(',', '.')).toFixed(4);
    } else {
      v_importe = +(this.good.quantity + '');
    }

    this.form.get('ind').setValue('N');
    v_estatus = this.good.status;
    // vaccion = 'FINAL';
    // vproextdom = this.good.extDomProcess;
    // debugger;
    try {
      const { status, process } = await this.getStatusProcessxPantalla();
      console.log(status, process);
      this.finalStatus = status;
      this.finalExtDomProcess = process;
    } catch (x) {
      // this.onLoadToast(
      //   'error',
      //   'Error',
      //   'No se tienen cantidades a parcializar...'
      // );
      // return;
    }

    return {
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

  // private async insertGoodByGoodPar(
  //   vobserv_padre: string,
  //   estatus_nuevo_bien: string,
  //   bienesPar: IBienesPar[]
  // ) {
  //   let vval2: number, vimpbien: number, vobservaciones: string;
  //   for (let index = 0; index < bienesPar.length; index++) {
  //     const item = bienesPar[index];
  //     if (this.validationClasif()) {
  //       vval2 = item.importe; //Number(item.importe.toFixed(2).trim())
  //       vimpbien = Number(item.importe.toFixed(2).trim());
  //     } else {
  //       vval2 = +this.good.val2;
  //       vimpbien = item.cantidad;
  //     }
  //     this.vfactor = vimpbien / this.vimporte;
  //     let vfactornum = vimpbien / (this.vimporte - this.vsumimp);
  //     this.vsumimp += vimpbien;

  //     item.noBien = await this.getBienDual();
  //     if (item.noBien === 0) {
  //       this.onLoadToast(
  //         'error',
  //         'Parcialización',
  //         'No se pudo conseguir número de bien por secuencia'
  //       );
  //       return null;
  //     }
  //     let mensaje = vobserv_padre + item.noBien + ' por: ' + vimpbien + ', ';
  //     vobserv_padre =
  //       mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
  //     vobservaciones = 'Parcializado del bien: ' + this.good.id;
  //     try {
  //       this.insertaBien2(
  //         item,
  //         estatus_nuevo_bien,
  //         vval2,
  //         vobservaciones,
  //         vfactornum
  //       );
  //     } catch (x) {
  //       this.onLoadToast('error', 'Inserción', 'No se pudo insertar bien');
  //       return null;
  //     }
  //   }
  //   return vobserv_padre;
  // }

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

  // private async fillRow(vobserv_padre: string, estatus_nuevo_bien: string) {
  //   let item: IBienesPar;
  //   let vfactor = (this.vimporte - this.vsumimp) / this.vimporte;

  //   let vfactornum =
  //     (this.vimporte - this.vsumimp) / (this.vimporte - this.vsumimp);
  //   // this.vident++;
  //   let descripcion =
  //     'Parcialización de Bien No.' +
  //     this.good.id +
  //     ', ' +
  //     this.good.description;
  //   descripcion =
  //     descripcion.length > 1250 ? descripcion.substring(0, 1250) : descripcion;
  //   let avaluo = this.good.appraisedValue
  //     ? +(this.good.appraisedValue * this.vfactor).toFixed(2)
  //     : this.good.appraisedValue;
  //   let { cantidad, importe } = this.fillImporteCant();
  //   // let noBien = await this.getBienDual();
  //   const { vval2, vimpbien } = this.getVal2AndImpbien(importe, cantidad);
  //   // const mensaje = vobserv_padre + noBien + ' por: ' + vimpbien + ', ';
  //   // vobserv_padre = mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
  //   // const vobservaciones = 'Saldo parcializado del bien ' + this.good.goodId;
  //   // item = {
  //   //   id: this.bienesPar[this.bienesPar.length - 1].id + 1,
  //   //   noBien:null,
  //   //   descripcion,
  //   //   proceso: this.good.extDomProcess,
  //   //   cantidad,
  //   //   avaluo,
  //   //   importe,
  //   //   val10: 0,
  //   //   val11: 0,
  //   //   val12: 0,
  //   //   val13: 0,
  //   // };
  //   // this.bienesPar.push(item);
  //   this.insertaBien(
  //     item,
  //     this.good,
  //     estatus_nuevo_bien,
  //     this.good.extDomProcess,
  //     +vval2,
  //     vimpbien,
  //     0,
  //     this.service.noActa
  //   );
  // }

  private async fillRestRow(
    vsumimp: number,
    v_importe: number,
    vfactor: number,
    vfactornum: number,
    vval2: number,
    vimpbien: number,
    v_estatus: string,
    v_verif_des: number
  ) {
    // let vobservaciones: string;
    // debugger;
    if (vsumimp < v_importe) {
      // vfactor = (v_importe - vsumimp) / v_importe;
      // vfactornum = (v_importe - vsumimp) / (v_importe - vsumimp);
      console.log(vfactor, vfactornum);
      let item: IBienesPar;
      item = {
        id: null,
        noBien: null,
        descripcion: null,
        proceso: null,
        cantidad: null,
        avaluo: null,
        importe: 0,
        val10: null,
        val11: null,
        val12: null,
        val13: null,
      };
      // debugger;
      const { v_cantidad, v_unidad, v_avaluo } = await this.setMeasureData();
      const clasificador = this.good.goodClassNumber;
      const numerarioValidation = await firstValueFrom(
        this.goodSSSubtypeService.getAll2(
          'filter.numClasifGoods=' + clasificador + '&filter.numType=7'
        )
      );
      const v_numerario = numerarioValidation.count
        ? numerarioValidation.count
        : 0;
      if (v_numerario !== 0) {
        if (this.validationClasif()) {
          item = {
            ...item,
            val10: 0,
            val11: 0,
            val12: 0,
            val13: 0,
          };
        }
      }
      // item.id = vident + 1;
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
          +(this.form.get('saldo').value + '') +
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
          +(this.form.get('saldo').value + '') +
          ' ' +
          v_avaluo +
          ' ' +
          mensaje;
      }
      item.proceso = this.good.extDomProcess;
      // if (this.good.appraisedValue) {
      //   item.avaluo = Number((this.good.appraisedValue * vfactor).toFixed(2));
      // } else {
      //   item.avaluo = this.good.appraisedValue;
      // }
      item.avaluo = this.good.appraisedValue
        ? +(+(this.good.appraisedValue + '') - this.service.sumAvaluo).toFixed(
            2
          )
        : null;
      if (this.validationClasif()) {
        item.importe = +(this.saldo.value + '');

        // if (this.good.quantity !== 1) {
        //   item.cantidad = v_importe - vsumimp;
        // } else {
        //   item.cantidad = this.good.quantity;
        // }
        vval2 = Number((item.avaluo ? item.avaluo : item.importe).toFixed(2));
        vimpbien = item.importe;
      } else {
        // item.cantidad = v_importe - vsumimp;
        vval2 = +this.good.val14;
        vimpbien = item.cantidad;
      }
      item.cantidad = +(this.saldo.value + '');

      this.service.sumCant += item.cantidad;
      this.service.sumVal14 += item.importe;
      this.service.sumAvaluo += item.avaluo;
      // const descriptions = await firstValueFrom(
      //   this.fillDescriptions(item, vimpbien)
      // );

      // vobservaciones = 'Saldo parcializado del bien: ' + this.good.goodId;
      // return descriptions;
      try {
        const bien = await firstValueFrom(
          this.insertaBien(
            item,
            this.good,
            'Saldo parcializado del bien: ' + this.good.goodId,
            v_estatus,
            this.good.extDomProcess,
            vval2,
            vimpbien,
            v_verif_des,
            this.service.noActa
          )
        );
        // console.log(response);

        if (bien) {
          // const bien = response.data;
          item.noBien = bien.no_bien;
          this.bienesPar.pop();
          this.bienesPar.push(item);
          this.bienesPar.push({
            id: null,
            noBien: null,
            descripcion: null,
            proceso: null,
            cantidad: this.service.sumCant,
            avaluo: this.service.sumAvaluo,
            importe: this.service.sumVal14,
            val10: 0,
            val11: 0,
            val12: 0,
            val13: 0,
          });
          // this.fillPagedRow.emit();
          return bien.no_bien;
        } else {
          this.alert('error', 'Inserta Bien', 'No se pudo parcializar');
          // this.loading = false;
          this.loader.load = false;
          return null;
        }
      } catch (x: any) {
        console.log(x);
        this.alert('error', 'Inserta Bien', 'No se pudo parcializar');
        // this.loading = false;
        this.loader.load = false;
        return null;
      }
    } else {
      return null;
    }
  }

  private async finishApply(vobserv_padre: string, vdesc_padre: string) {
    // debugger;
    const oldObservations = this.good.observations
      ? this.good.observations
      : '';
    const observations =
      vobserv_padre +
      ' fecha: ' +
      format(new Date(), 'dd/MM/yyyy') +
      '. ' +
      oldObservations;
    this.good.observations = observations.substring(
      0,
      observations.length > 600 ? 600 : observations.length
    );
    const oldDescription = this.good.description ? this.good.description : '';
    const description = vdesc_padre + oldDescription;
    this.good.description = description.substring(
      0,
      observations.length > 1250 ? 1250 : observations.length
    );
    // this.formGood.get('descripcion').setValue(this.good.description);
    if (this.service.noActa > 0) {
      await firstValueFrom(
        this.detailReceptionService.deleteById(
          this.good.goodId,
          this.service.noActa
        )
      );
    }

    // this.service.pageLoading = false;
    this.loader.load = false;
    // this.onLoadToast(
    //   'success',
    //   'Parcialización',
    //   'La parcialización de bienes se realizo con éxito'
    // );
    try {
      // this.good.status = 'PEA';
      await firstValueFrom(this.goodService.updateCustom(this.good));
      this.alert(
        'success',
        'Parcialización',
        'La Parcialización de Bienes se Realizó Correctamente'
      );
      this.service.haveAply = false;
    } catch (x) {
      this.alert(
        'error',
        'Parcialización',
        'Error al actualizar el bien ' + this.good.goodId
      );
    }

    // this.service.bienesPar = [];
    // this.service.pagedBienesPar = [];
    // this.service.formGood.reset();
    // this.service.formControl.reset();
  }

  private async applyContent() {
    // this.service.pageLoading = true;
    this.loader.load = true;
    let v_importe: number,
      v_estatus: string,
      vaccion: string,
      v_verif_des: number = 0;
    if (this.version === 1) {
      if (this.bienesPar.length === 0) {
        this.alert(
          'error',
          'Error',
          'No se tienen cantidades a parcializar...'
        );
        return;
      }
      // debugger;
      const result = await this.validationsV1(v_importe, v_estatus);
      console.log(result, this.good);
      v_verif_des = this.service.verif_des;
      v_importe = result.v_importe;
      v_estatus = result.v_estatus;
      let vsumimp = 0;
      let vimpbien: number,
        vident: number,
        vval2: number,
        vfactor: number,
        vfactornum: number,
        // vobservaciones: string = 'Parcializado del bien: ' + this.good.goodId,
        vobserv_padre: string = 'Bien(es) parcializado(s): ',
        vdesc_padre: string = 'Bien(es) generado(s): ';

      const observable = from(
        this.bienesPar.slice(0, this.bienesPar.length - 1)
      );
      // this.bienesPar.forEach((item, index) => {
      //   if (this.validationClasif()) {
      //     vval2 = Number((+(item.importe + '')).toFixed(2).trim());
      //     vimpbien = +(item.importe + '');
      //   } else {
      //     vval2 = +this.good.val14;
      //     vimpbien = +(item.cantidad + '');
      //   }
      //   if (index < this.bienesPar.length - 1) {
      //     const newObservation =
      //       vobserv_padre + item.noBien + ' por:  ' + vimpbien + ', ';
      //     vobserv_padre = newObservation.substring(
      //       0,
      //       newObservation.length > 600 ? 600 : newObservation.length
      //     );
      //   }

      // })
      // const newObservation =
      //   vobserv_padre + 2 + ' por:  ' + +(this.saldo.value + '') + ', ';
      // vobserv_padre = newObservation.substring(
      //   0,
      //   newObservation.length > 600 ? 600 : newObservation.length
      // );
      // console.log(vobserv_padre);

      let i = 0;
      observable
        .pipe(
          concatMap(item => {
            console.log(item);
            if (this.validationClasif()) {
              vval2 = Number((+(item.importe + '')).toFixed(2).trim());
              vimpbien = +(item.importe + '');
            } else {
              vval2 = +this.good.val14;
              vimpbien = +(item.cantidad + '');
            }
            vident = item.id;
            vfactor = vimpbien / v_importe;
            vfactornum = vimpbien / (v_importe - vsumimp);
            vsumimp = vsumimp + vimpbien;
            console.log(vsumimp, vimpbien);
            return this.insertaBien(
              item,
              this.good,
              'Parcializado del bien: ' + this.good.goodId,
              v_estatus,
              this.good.extDomProcess,
              vval2,
              vimpbien,
              v_verif_des,
              this.service.noActa
            ).pipe(
              tap(bien => {
                console.log(bien);
                // const bien = response.data
                if (bien) {
                  this.bienesPar[i].noBien = bien.no_bien;
                  const newObservation =
                    vobserv_padre + bien.no_bien + ' por:  ' + vimpbien + ', ';
                  vobserv_padre = newObservation.substring(
                    0,
                    newObservation.length > 600 ? 600 : newObservation.length
                  );
                  const newDescription = vdesc_padre + bien.no_bien + ', ';
                  vdesc_padre = newDescription.substring(
                    0,
                    newDescription.length > 1250 ? 1250 : newDescription.length
                  );
                  // vobservaciones = 'Parcializado del bien: ' + this.good.goodId;
                }
                i++;
              })
            );

            // return this.fillDescriptions(item, vimpbien).pipe(
            //   mergeMap(descriptions => {
            //     console.log(descriptions, this.bienesPar[i]);
            //     this.bienesPar[i].noBien = descriptions.noBien;
            //     i++;
            //     vobserv_padre = descriptions.vobserv_padre;
            //     vdesc_padre = descriptions.vdesc_padre;
            //     vobservaciones = 'Parcializado del bien: ' + this.good.goodId;
            //     // const delayedMessage = (message: string, delayedTime: number) =>
            //     //   EMPTY.pipe(startWith(message), delay(delayedTime));
            //     // return this.goodService.getById(this.good.goodId);
            //     return this.insertaBien(
            //       descriptions.item,
            //       this.good,
            //       v_estatus,
            //       this.good.extDomProcess,
            //       vval2,
            //       vimpbien,
            //       v_verif_des,
            //       this.service.noActa
            //     );
            //   })
            // );
          })
        )
        .subscribe({
          next: async response => {
            console.log(response, i);
            if (this.bienesPar.length > 0 && i === this.bienesPar.length - 1) {
              console.log('FINALIZO');
              this.loader.load = false;
              // this.fillPagedRow.emit();
              // debugger;
              const no_bien = await this.fillRestRow(
                vsumimp,
                v_importe,
                vfactor,
                vfactornum,
                vval2,
                vimpbien,
                v_estatus,
                v_verif_des
              );
              if (no_bien !== null) {
                const newObservation =
                  vobserv_padre +
                  no_bien +
                  ' por:  ' +
                  +(this.saldo.value + '') +
                  ', ';
                vobserv_padre = newObservation.substring(
                  0,
                  newObservation.length > 600 ? 600 : newObservation.length
                );
                const newDescription = vdesc_padre + no_bien + '; ';
                vdesc_padre = newDescription.substring(
                  0,
                  newDescription.length > 1250 ? 1250 : newDescription.length
                );
                this.saldo.setValue(0);
              }
              this.fillPagedRow.emit();
              await this.finishApply(vobserv_padre, vdesc_padre);
              console.log(this.good);
              this.good.status = this.finalStatus;
              this.good.extDomProcess = this.finalExtDomProcess;
            }
          },
          error: error => {
            console.log(error);
            this.alert('error', 'Inserta Bien', 'No se pudo parcializar');
            this.loader.load = false;
            return;
          },
        });
    } else {
      // const checkSum = new CheckSum();
      // checkSum.firstCase = this.firstCase;
      // this.checkSum.version = this.version;
      // if (!this.checkSum.execute('O')) {
      //   return;
      // }
      // let { estatus_nuevo_bien, estatus_final } =
      //   await this.getStatusxPantalla();
      // if (!estatus_nuevo_bien || !estatus_final) {
      //   this.onLoadToast('error', 'Parcialización', 'Pantalla no encontrada');
      //   return;
      // }
      // this.good.status = estatus_final;
      // let vobserv_padre = 'Bien(es) parcializado(s): ';
      // vobserv_padre = await this.insertGoodByGoodPar(
      //   vobserv_padre,
      //   estatus_nuevo_bien,
      //   this.bienesPar
      // );
      // if (vobserv_padre != null) {
      //   if (this.vsumimp < this.vimporte) {
      //     this.vfactor = (this.vimporte - this.vsumimp) / this.vimporte;
      //     await this.fillRow(vobserv_padre, estatus_nuevo_bien);
      //   }
      //   const mensaje =
      //     vobserv_padre +
      //     ' fecha: ' +
      //     format(new Date(), 'dd/mm/yyy') +
      //     '. ' +
      //     this.good.observations;
      //   this.good.observations =
      //     mensaje.length > 600 ? mensaje.substring(0, 600) : mensaje;
      // }
    }
  }

  async apply() {
    // debugger;
    // this.loading = true;
    this.msgSaveModal(
      'Aceptar',
      '¿Desea parcializar los bienes?',
      'Confirmación',
      undefined
    );
  }

  msgSaveModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      text: message,
      icon: typeMsg,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: btnTitle,
      cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        this.applyContent();
      }
    });
  }
}
