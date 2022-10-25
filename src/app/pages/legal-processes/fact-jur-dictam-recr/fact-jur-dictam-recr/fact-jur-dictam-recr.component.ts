import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-fact-jur-dictam-recr',
  templateUrl: './fact-jur-dictam-recr.component.html',
  styleUrls: ['./fact-jur-dictam-recr.component.scss'],
})
export class FactJurDictamRecrComponent {
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: '',
      averiguacionPrevia: '',
      causaPenal: '',
      fechaPresentacionRecursoRevision: '',
      noAmparo: '',

      noBien: '',
      descripcion: '',
      fechaAcuerdoInicial: '',
      estatusBien: '', //Estatus del bien detalle
      fechaNotificacion: '',
      estatusDictaminacion: '',
      motivoRecursoRevision: '',
      observaciones: '',
    });
  }

  btnAprobar() {
    console.log('Aprobar');
  }

  /**
   * Formulario
   */
  //  public returnField(form, field) { return form.get(field); }
  //  public returnShowRequirements(form, field) {
  //    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched;
  //  }
}
