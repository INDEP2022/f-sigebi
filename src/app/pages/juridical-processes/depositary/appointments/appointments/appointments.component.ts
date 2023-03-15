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
  globalVars = {
    noExiste: 0,
  };

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
      descriptionGood: [''], //*
      averiguacionPrevia: ['', [Validators.pattern(STRING_PATTERN)]], //*
      causaPenal: ['', [Validators.pattern(STRING_PATTERN)]],
      estatusBien: ['', [Validators.pattern(STRING_PATTERN)]], //*
      fechaAcuerdoAsegurado: '', //*
      fechaRecepcion: '', //*
      fechaDecomiso: '', //*

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

  /**
   * Validar el número de bien
   */
  async validGoodNumberInDepositaryAppointment() {
    if (this.form.get('noBien').valid) {
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 10,
      };
      this.params.getValue().getParams();
      params['filter.goodNumber'] = this.form.get('noBien').value;
      await this.appointmentsService
        .getGoodAppointmentDepositaryByNoGood(params)
        .subscribe({
          next: res => {
            console.log(res);
            if (res.count == 0) {
              this.globalVars.noExiste = 0;
              this.getGoodDataByNoGood();
            }
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
    } else {
      this.alert('warning', 'Número de Bien', 'Ingresa un número de Bien.');
    }
  }

  /**
   * Obtener los datos del bien por el número de Bien
   */
  async getGoodDataByNoGood() {
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: 10,
    };
    this.params.getValue().getParams();
    params['filter.goodId'] = this.form.get('noBien').value;
    params['filter.status'] = 'DEP';
    await this.appointmentsService.getGoodByNoGoodAndStatus(params).subscribe({
      next: res => {
        console.log(res);
        // b.descripcion,
        //   b.no_expediente,
        //   b.fec_recepcion_fisica,
        //   b.fec_acuerdo_aseg,
        //   e.averiguacion_previa,
        //   e.causa_penal;
      },
      error: err => {
        console.log(err);
        this.alert('warning', 'Número de Bien', 'El número de Bien no existe.');
      },
    });
  }

  /**
   * Obtener los datos del expediente por el número de expediente
   */
  async getExpedientDataByNoExpedient(noExpedient: string) {
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: 10,
    };
    this.params.getValue().getParams();
    params['filter.goodId'] = this.form.get('noBien').value;
    params['filter.status'] = 'DEP';
    await this.appointmentsService.getGoodByNoGoodAndStatus(params).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        console.log(err);
        this.alert('warning', 'Número de Bien', 'El número de Bien no existe.');
      },
    });
  }

  /**
   * INCIDENCIA 530
   * Obtener el estatus del bien por el número del Bien
   */
  async getStatusGoodByNoGood() {
    // const params: ListParams = {
    //   page: this.params.getValue().page,
    //   limit: 10,
    // };
    // this.params.getValue().getParams();
    // params['filter.goodId'] = this.form.get('noBien').value;
    // params['filter.status'] = 'DEP';
    // await this.appointmentsService.getGoodByNoGoodAndStatus(params).subscribe({
    //   next: res => {
    //     console.log(res);
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.alert('warning', 'Número de Bien', 'El número de Bien no existe.');
    //   },
    // });
  }
}
