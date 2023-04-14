/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { BehaviorSubject } from 'rxjs';
import {
  IDescriptionByNoGoodBody,
  IFromGoodsAndExpedientsBody,
} from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  KEYGENERATION_PATTERN,
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppointmentsService } from '../services/appointments.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  public form: FormGroup;
  public checked = false;
  globalVars: any = {
    noExiste: 0,
    depositaria: '',
    no_dep: '',
    folescaneo: '',
    procgenimg: null,
    folsoldigt: null,
    folescaneo2: null,
  };
  public good: IGood;
  noBien: number = null;

  constructor(
    private fb: FormBuilder,
    private exampleService: ExampleService,
    private appointmentsService: AppointmentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', Validators.required], //*
      descriptionGood: { value: '', disabled: true }, //*
      noExpedient: { value: '', disabled: true }, //*
      averiguacionPrevia: [{ value: '', disabled: true }], //*
      causaPenal: [{ value: '', disabled: true }],
      estatusBien: [{ value: '', disabled: true }], //*
      fechaAcuerdoAsegurado: { value: '', disabled: true }, //*
      fechaRecepcion: { value: '', disabled: true }, //*
      fechaDecomiso: { value: '', disabled: true }, //*

      tipoNombramiento: '', //*
      ///*"Administrador, Depositaría, Interventor, Comodatarío,Bien en uso del SAE"
      tipoDepositaria: ['', [Validators.pattern(STRING_PATTERN)]], //*
      estatus: '', //* Provisional, Definitiva
      representanteSAE: ['', [Validators.pattern(STRING_PATTERN)]], //*
      nombre: ['', [Validators.pattern(STRING_PATTERN)]], //*
      bienesMenaje: '', //* Sin Menaje, Con Menaje

      depositaria: ['', [Validators.pattern(STRING_PATTERN)]], //*
      representante: ['', [Validators.pattern(STRING_PATTERN)]], //*
      calle: ['', [Validators.pattern(STRING_PATTERN)]], //*
      noExterno: '', //*
      noInterno: '', //*
      colonia: '', //*
      delegacionMunicipio: '', //*
      codigoPostal: '', //*
      entidadFederativa: '', //*
      telefono: ['', [Validators.pattern(PHONE_PATTERN)]], //*
      rfc: ['', [Validators.pattern(RFCCURP_PATTERN)]], //*
      curp: ['', [Validators.pattern(RFCCURP_PATTERN)]], //*
      tipoPersona: ['', [Validators.pattern(STRING_PATTERN)]], //*
      tipoPersona2: ['', [Validators.pattern(STRING_PATTERN)]], //*
      giro: ['', [Validators.pattern(STRING_PATTERN)]],
      referencia: ['', [Validators.pattern(STRING_PATTERN)]],

      remocion: '',
      fecha: '',
      noOficio: '',

      // Acuerdo Junta de Gobierno
      fechaAcuerdo: '',
      noAcuerdo: '',

      contraprestacion: '',
      honorarios: ['', [Validators.pattern(STRING_PATTERN)]],
      iva: '',
      noNombramiento: '',
      fechapage: '',

      anexo: ['', [Validators.pattern(STRING_PATTERN)]],
      observaciones: ['', [Validators.pattern(STRING_PATTERN)]],

      folioRemocion: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      folioActaDepositaria: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  toggleRemocion(checked: any) {
    this.checked = checked;
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  btnBienes() {
    console.log('Bienes');
  }

  btnCatalogoDepositarias() {
    console.log('Depositarias');
  }

  btnDetallesPago() {
    console.log('Detalle Pagos');
  }

  btnReportesJuridicos() {
    console.log('Reportes Juridicos');
  }

  btnReportesAdministrativos() {
    console.log('Reportes Administrativos');
  }

  btnIngresoMasivoPagos() {
    console.log('Ingresos Masivos Pagos');
  }

  btnCatalogoConceptosPagos() {
    console.log('Conceptos de Pagos');
  }

  btnCatalogoDepositariasPersona() {
    console.log('Cátalogo Depositarias');
  }

  btnFolioEscaneoSolicitud() {
    // IMG_SOLICITUD
    console.log('Escaneo Solicitud');
  }

  btnReplicarFolio() {
    console.log('Replicar Folio');
  }

  btnImprimirSolicitudEscaneo() {
    console.log('Solicitud Escaneo');
  }

  btnConsultarImagenesEscaneadas() {
    console.log('Consultar Imágenes Escaneadas');
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }

  changeMenaje() {
    if (this.form.get('bienesMenaje').value == '1') {
    }
  }

  async validFielddGoodNumber() {
    if (this.globalVars.noExiste != 1) {
      this.noBien = this.form.get('noBien').value;
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 10,
      };
      this.params.getValue().getParams();
      params['filter.goodId'] = this.noBien;
      params['filter.status'] = 'ADM';
      await this.appointmentsService.getGoodByParams(params).subscribe({
        next: res => {
          console.log(res);
          if (res.data.length > 0) {
            this.form.get('descriptionGood').setValue(res.data[0].description);
            this.form.get('noExpedient').setValue(res.data[0].fileNumber);
            this.form
              .get('fechaAcuerdoAsegurado')
              .setValue(res.data[0].agreementDate);
            this.form.updateValueAndValidity();
            this.getStatusGoodByStatus(res.data[0].id);
            this.getDataExpedientByNoExpedient(res.data[0].fileNumber);
          } else {
            this.alert(
              'warning',
              'Verificar el Número de Bien',
              'El No. de Bien ' +
                this.noBien +
                ' no existe ó el estatus para depositarias no es el adecuado.'
            );
          }
        },
        error: err => {
          console.log(err);
          this.alert(
            'warning',
            'Verificar el Número de Bien',
            'El No. de Bien ' +
              this.noBien +
              ' no existe ó el estatus para depositarias no es el adecuado.'
          );
        },
      });
    } else {
      this.alert('warning', 'Número de Bien', 'Ingresa un número de Bien.');
    }
  }

  async getStatusGoodByStatus(noGood: number) {
    await this.appointmentsService
      .getStatusAndDescriptionGoodByNoGood(noGood)
      .subscribe({
        next: res => {
          console.log(res);
          this.form.get('estatusBien').setValue(res.description);
          this.form.updateValueAndValidity();
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Estatus del Bien',
            'El estatus no se obtubo correctamente para el bien ' + noGood + '.'
          );
        },
      });
  }

  async getDataExpedientByNoExpedient(noExpedient: number) {
    await this.appointmentsService
      .getExpedientByNoExpedient(noExpedient)
      .subscribe({
        next: res => {
          console.log(res);
          this.form.get('averiguacionPrevia').setValue(res.preliminaryInquiry);
          this.form.get('causaPenal').setValue(res.keyPenalty);
          this.form.get('fechaRecepcion').setValue(res.receptionDate);
          this.form.updateValueAndValidity();
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Número de Expediente',
            'El número de expediente ' + noExpedient + ' NO existe.'
          );
        },
      });
  }

  /**
   * Validar el número de bien
   */
  async validGoodNumberInDepositaryAppointment() {
    if (this.form.get('noBien').valid) {
      this.noBien = this.form.get('noBien').value;
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 10,
      };
      this.params.getValue().getParams();
      params['filter.goodNumber'] = this.noBien;
      this.form.reset();
      this.form.get('noBien').setValue(this.noBien);
      this.form.updateValueAndValidity();
      await this.appointmentsService
        .getGoodAppointmentDepositaryByNoGood(params)
        .subscribe({
          next: res => {
            console.log(res);
            if (res.count == 0) {
              this.globalVars.noExiste = 0;
              this.getFromGoodsAndExpedients();
            }
          },
          error: err => {
            console.log(err);
            if (err.status == 400) {
              this.globalVars.noExiste = 0;
              this.getFromGoodsAndExpedients();
            } else {
              this.alert(
                'warning',
                'Número de Bien',
                'El número de Bien no existe.'
              );
            }
          },
        });
    } else {
      this.alert('warning', 'Número de Bien', 'Ingresa un número de Bien.');
    }
  }

  /**
   * INCIDENCIA 538 -- PENDIENTE -- 03/16/2023
   * Obtener los datos del bien de acuerdo al status DEP
   */
  async getFromGoodsAndExpedients() {
    let paramsGoodExpedient: IFromGoodsAndExpedientsBody = {
      goodNumber: this.noBien,
      page: 1,
      limit: 10,
    };
    await this.appointmentsService
      .getFromGoodsAndExpedients(paramsGoodExpedient)
      .subscribe({
        next: res => {
          console.log(res);
          this.getStatusGoodByNoGood();
        },
        error: err => {
          console.log(err);
          this.alert(
            'warning',
            'Número de Bien',
            'El número de Bien no existe.'
          );
        },
      });
  }

  /**
   * INCIDENCIA 530 -- RESUELTA -- 03/15/2023
   * Obtener el estatus del bien por el número del Bien
   */
  async getStatusGoodByNoGood() {
    let bodyRequest: IDescriptionByNoGoodBody = {
      goodNumber: this.noBien,
    };
    await this.appointmentsService
      .getDescriptionGoodByNoGood(bodyRequest)
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data.length > 0) {
          }
          this.validFielddGoodNumber();
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Descripción del Bien',
            'Error al consultar la descripción del Bien.'
          );
          this.validFielddGoodNumber();
        },
      });
  }
}
