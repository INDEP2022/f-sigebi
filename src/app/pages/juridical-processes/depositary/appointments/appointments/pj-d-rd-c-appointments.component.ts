/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pj-d-rd-c-appointments',
  templateUrl: './pj-d-rd-c-appointments.component.html',
  styleUrls: ['./pj-d-rd-c-appointments.component.scss'],
})
export class PJDRDAppointmentsComponent
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
      averiguacionPrevia: '', //*
      causaPenal: '',
      estatusBien: '', //*
      fechaAcuerdoAsegurado: '', //*
      fechaRecepcion: '', //*
      fechaDecomiso: '', //*

      tipoNombramiento: '', //*
      ///*"Administrador, Depositaría, Interventor, Comodatarío,Bien en uso del SAE"
      tipoDepositaria: '', //*
      estatus: '', //* Provisional, Definitiva
      representanteSAE: '', //*
      nombre: '', //*
      bienesMensaje: '', //* Sin Mensaje, Con Mensaje

      depositaria: '', //*
      representante: '', //*
      calle: '', //*
      noExterno: '', //*
      noInterno: '', //*
      colonia: '', //*
      delegacionMunicipio: '', //*
      codigoPostal: '', //*
      entidadFederativa: '', //*
      telefono: '', //*
      rfc: '', //*
      curp: '', //*
      tipoPersona: '', //*
      tipoPersona2: '', //*
      giro: '',
      referencia: '',

      remocion: '',
      fecha: '',
      noOficio: '',

      // Acuerdo Junta de Gobierno
      fechaAcuerdo: '',
      noAcuerdo: '',

      contraprestacion: '',
      honorarios: '',
      iva: '',
      noNombramiento: '',
      fechaInicio: '',

      anexo: '',
      observaciones: '',

      folioRemocion: '',
      folioActaDepositaria: '',
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
