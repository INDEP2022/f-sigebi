/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import {
  KEYGENERATION_PATTERN,
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  public form: FormGroup;
  public checked = false;

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: '', //*
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
      bienesMensaje: '', //* Sin Mensaje, Con Mensaje

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
}
