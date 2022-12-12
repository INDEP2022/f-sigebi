/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-document-verification-revision-resources',
  templateUrl: './document-verification-revision-resources.component.html',
  styleUrls: ['./document-verification-revision-resources.component.scss'],
})
export class DocumentVerificationRevisionResourcesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      cveDocumento: {
        title: 'Cve. Documento',
      },
      descripcion: {
        title: 'Descripción',
      },
      fechaRecibo: {
        title: 'Fecha Recibió',
      },
      status: {
        title: 'Status',
      },
      solicitarDocumentacion: {
        title: 'Solicitar Documentación?',
      },
    },
  };
  // Data table
  dataTable = [
    {
      cveDocumento: 'DATA',
      descripcion: 'DATA',
      fechaRecibo: 'DATA',
      status: 'DATA',
      solicitarDocumentacion: 'DATA',
    },
  ];

  public form: FormGroup;
  public formInforme: FormGroup;
  public formAutoridad: FormGroup;
  public informes: boolean = false;
  public autoridad: boolean = false;

  constructor(private fb?: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: '',
      averiguacionPrevia: ['', [Validators.pattern(STRING_PATTERN)]],
      causaPenal: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaPresentacionRecursoRevision: '',
      noAmparo: '',

      noBien: '',
      acuerdoInicial: ['', [Validators.pattern(STRING_PATTERN)]],
      statusDictaminacion: '',
      descripcion: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaAcuerdoInicial: '',
      estatusBien: ['', [Validators.pattern(STRING_PATTERN)]], //Estatus del bien detalle
      fechaNotificacion: '',
      estatusDictaminacion: ['', [Validators.pattern(STRING_PATTERN)]],
      motivoRecursoRevision: ['', [Validators.pattern(STRING_PATTERN)]],
      observaciones: ['', [Validators.pattern(STRING_PATTERN)]],
    });
    this.formInforme = this.fb.group({
      noExpediente: '',
      noBien: '',
    });
    this.formAutoridad = this.fb.group({
      autoridad: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  btnAprobar() {
    console.log('Aprobar');
    this.autoridad = true;
  }
  btnRecursos() {
    console.log('Recursos');
    this.informes = true;
  }
  btnSeleccionarDocumentos() {
    console.log('SeleccionarDocumentos');
  }
  btnEjecutarAutoridad() {
    console.log('EjecutarAutoridad');
    this.autoridad = false;
  }
  btnSalirAutoridad() {
    console.log('Cancelar');
    this.autoridad = false;
  }
  btnEjecutarInformes() {
    console.log('EjecutarInformes');
    this.informes = false;
  }
  btnSalir() {
    console.log('Salir');
    this.informes = false;
  }
}
