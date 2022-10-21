import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-fact-jurreg-dest-leg',
  templateUrl: './fact-jurreg-dest-leg.component.html',
  styleUrls: ['./fact-jurreg-dest-leg.component.scss'],
})
export class FactJurregDestLegComponent {
  public form: FormGroup;
  public checked = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
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

  /**
   * Formulario
   */
  //  public returnField(form, field) { return form.get(field); }
  //  public returnShowRequirements(form, field) {
  //    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched;
  //  }
}
