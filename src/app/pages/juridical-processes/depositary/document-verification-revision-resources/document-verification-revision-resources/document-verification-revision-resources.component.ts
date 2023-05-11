/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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

  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaPresentacionRecursoRevision: null,
      protectionKey: [null],

      goodId: [null],
      initialAgreement: [null, [Validators.pattern(STRING_PATTERN)]],
      statusDictaminacion: '',
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      initialAgreementDate: [null],
      status: [null, [Validators.pattern(STRING_PATTERN)]], //Estatus del bien detalle
      notificationDate: [null],
      estatusDictaminacion: ['', [Validators.pattern(STRING_PATTERN)]],
      motivoRecursoRevision: ['', [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.formInforme = this.fb.group({
      id: [null],
      noBien: [null],
    });
    this.formAutoridad = this.fb.group({
      autoridad: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  expedientSelect(expedient: any) {
    console.log(expedient);
    this.form.patchValue(expedient);
    let params = new ListParams();
    params.limit = 1;
    params.page = 1;
    params.text = '';
    this.goodService.getByExpedient(expedient.id, params).subscribe({
      next: value => {
        console.log(value.data);
        this.form.get('description').patchValue(value.data[0].description);
        this.form.get('goodId').patchValue(value.data[0].goodId);
        this.form.get('status').patchValue(value.data[0].status);
      },
    });
  }

  selectGood(good: any) {
    console.log(good);
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
