import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMLNS, COLUMLNS2, COLUMLNS3 } from './columns';
import {
  BlkControl,
  ISaeNsbGoodsNeB,
  ISaeNsbGoodsNeD,
  ISaeNsbGoodsNeH,
} from './interfaces';

@Component({
  selector: 'app-payment-of-goods',
  templateUrl: './payment-of-goods.component.html',
  styles: [],
})
export class PaymentOfGoodsComponent extends BasePage implements OnInit {
  title: string = 'Pago de Bienes / Admón de Ingresos';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  saeNsbGoodsNeH: ISaeNsbGoodsNeH = null;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  loading2 = this.loading;
  settings2 = this.settings;
  saeNsbGoodsNeD: ISaeNsbGoodsNeD = null;

  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;
  data3: LocalDataSource = new LocalDataSource();
  loading3 = this.loading;
  settings3 = this.settings;
  saeNsbGoodsNeB: ISaeNsbGoodsNeB = null;

  blkControl: BlkControl = null;
  txtButton: string = 'Proceso Por Generar';

  constructor(private parametergoodService: ParameterCatService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMLNS },
      mode: '',
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMLNS2 },
      mode: '',
    };
    this.settings3 = {
      ...this.settings3,
      actions: false,
      columns: { ...COLUMLNS3 },
      mode: '',
    };
  }

  ngOnInit(): void {}

  selectRow(event: any) {}

  async proceso() {
    let n_CONT = 0;
    if (this.saeNsbGoodsNeH.procStatus < 4) {
      n_CONT = 1;
    } else {
      if (this.saeNsbGoodsNeH.originId === 'B') {
        //// Lamar lo que voy a pedir al BACK
        n_CONT = await this.saeGestAdminIngreso();
      } else {
        //// No esta la tabla hay que pedirla al BAck
        n_CONT = await this.saeGestAdminIngreso();
      }
    }

    if (n_CONT === 0) {
      this.alert(
        'warning',
        this.title,
        'En Espera de Respuesta por Parte del SAMI, El Proceso no Puede Continuar.'
      );
      return;
    }

    switch (this.blkControl.statusProc) {
      case 2:
        const resp = await this.alertQuestion(
          'question',
          '¿Continua con la Generación de la Referencia?',
          '¿Desea Continua?'
        );
        if (resp.isConfirmed) {
          this.pupGeneraReferencia();
        }
        break;
      case 3:
        const resp2 = await this.alertQuestion(
          'question',
          '¿Continua con el Envío de la Referencia A SAMI?',
          '¿Desea Continua?'
        );
        if (resp2.isConfirmed) {
          this.pupEnviaReferencia();
        }
        break;
      case 4:
        const resp3 = await this.alertQuestion(
          'question',
          '¿Continua con la Validación de Pago de Referencia?',
          '¿Desea Continua?'
        );
        if (resp3.isConfirmed) {
          this.pupValidaPago();
        }
        break;
      case 5:
        const resp4 = await this.alertQuestion(
          'question',
          '¿Continua con la Generación de OI?',
          '¿Desea Continua?'
        );
        if (resp4.isConfirmed) {
          this.pupGeneraOi();
        }
        break;
      case 6:
        const resp5 = await this.alertQuestion(
          'question',
          '¿Continua con el Envío de OI a SIRSAE?',
          '¿Desea Continua?'
        );
        if (resp5.isConfirmed) {
          this.pupEnvioOiSirsae(1);
        }
        break;
      case 7:
        const resp6 = await this.alertQuestion(
          'question',
          '¿Continua con la Recepción de OI de SIRSAE?',
          '¿Desea Continua?'
        );
        if (resp6.isConfirmed) {
          this.pupEnvioOiSirsae(2);
        }
        break;
      case 8:
        const resp7 = await this.alertQuestion(
          'question',
          '¿Continua con la Validación de Pago de la OI?',
          '¿Desea Continua?'
        );
        if (resp7.isConfirmed) {
          this.pupValidaPagoOi();
        }
        break;
      case 9:
        const resp8 = await this.alertQuestion(
          'question',
          '¿Continua con el Envío de OI a SAMI?',
          '¿Desea Continua?'
        );
        if (resp8.isConfirmed) {
          this.pupEnvioOiNsb();
        }
        break;
      default:
        break;
    }
  }

  saeGestAdminIngreso() {
    return new Promise<number>((resolve, reject) => {});
  }

  saeInvBienesNoentOis() {
    return new Promise<number>((resolve, reject) => {});
  }

  async pupGeneraReferencia() {
    const c_SAE_NSB_UR = await this.getParameters();
    if (c_SAE_NSB_UR === null) {
      return;
    }
    const c_REFERENCIA = await this.fnGenRefPago(
      this.saeNsbGoodsNeH.procneId,
      this.saeNsbGoodsNeH.amount,
      c_SAE_NSB_UR
    );
    if (c_REFERENCIA === null) {
      this.alert('error', this.title, 'No se generó la Referencia.');
    } else {
      await this.updateSaeNsbGoodsNeH(c_REFERENCIA);
      this.saeNsbGoodsNeH.procStatus = this.blkControl.statusProc + 1;
      this.pupEtiquetaBoton();
      this.alert(
        'success',
        this.title,
        `Se generó la Referencia: ${c_REFERENCIA}`
      );
    }
  }

  pupEnviaReferencia() {}
  pupValidaPago() {}
  pupGeneraOi() {}
  pupEnvioOiSirsae(proces: number) {}
  pupValidaPagoOi() {}
  pupEnvioOiNsb() {}

  getParameters() {
    return new Promise<number>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.id'] = '$eq:SAE_NSB_UR';
      this.parametergoodService.getAll(params).subscribe({
        next: response => {
          resolve(response.data[0].initialValue);
        },
        error: error => {
          resolve(null);
          this.alert(
            'error',
            this.title,
            'No se Encontró Parámetro de Unidad Responsable.'
          );
        },
      });
    });
  }

  fnGenRefPago(
    n_ID_PROC_NE: number | string,
    monto: number | string,
    c_SAE_NSB_UR: number
  ) {
    return new Promise<number>((resolve, reject) => {
      ///// ESTO LO PEDI AL BACK
    });
  }

  updateSaeNsbGoodsNeH(c_REFERENCIA: number) {
    return new Promise<void>((resolve, reject) => {
      ///// ESTO LO PEDI AL BACK
      this.saeNsbGoodsNeH.procStatus = this.blkControl.statusProc;
      this.saeNsbGoodsNeH.reference = c_REFERENCIA;
      this.saeNsbGoodsNeH.referenceDate = this.getFecha();
      ////// LLamar aqui el de actualizar
    });
  }

  getFecha() {
    const fechaActual = new Date();
    // Obtener el año, mes y día
    const anio = fechaActual.getFullYear();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // El mes comienza desde 0, por lo que sumamos 1.
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    // Formatear la fecha en YYYYMMDD
    return `${anio}${mes}${dia}`;
  }

  pupEtiquetaBoton() {
    switch (this.blkControl.statusProc) {
      case 1:
        this.txtButton = 'Proceso Por Generar';
        break;
      case 2:
        this.txtButton = 'Generar Referencia';
        break;
      case 3:
        this.txtButton = 'Enviar Referencia a SAMI';
        break;
      case 4:
        this.txtButton = 'Validar Pago en SIRSAE';
        break;
      case 5:
        this.txtButton = 'Generar Orden de Ingreso';
        break;
      case 6:
        this.txtButton = 'Enviar Orden de Ingres a SIRSAE';
        break;
      case 7:
        this.txtButton = 'Recibir Orden de Ingres de SIRSAE';
        break;
      case 8:
        this.txtButton = 'Validar Orden de Ingreso (PT)';
        break;
      case 9:
        this.txtButton = 'Enviar Orden de Ingreso a SAMI';
        break;
      default:
        this.txtButton = 'Proceso concluido';
        break;
    }
  }
}
