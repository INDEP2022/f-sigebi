/** BASE IMPORT */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { DictationXGoodService } from 'src/app/core/services/ms-dictation/dictation-x-good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
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
  public formExp: FormGroup;
  public formInforme: FormGroup;
  public formAutoridad: FormGroup;
  public informes: boolean = false;
  public autoridad: boolean = false;
  public isHistory: boolean = false;
  public goodId: any = null;
  @ViewChild('df', { static: false }) histo: ElementRef<HTMLElement>;

  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly dictaminationServ: DictationXGoodService,
    private readonly viewStatus: StatusXScreenService,
    private readonly documents: DocumentsDictumStatetMService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      goodId: [null],
      initialAgreement: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      agreementDate: [null],
      status: [null, [Validators.pattern(STRING_PATTERN)]], //Estatus del bien detalle
      descriptionStatus: [null],
      notificationDate: [null],
      dateDict: [null],
      statusDict: [null, [Validators.pattern(STRING_PATTERN)]],
      revRecCause: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      di_situacion_bien: [null],
      di_fec_dictaminacion: [null],
      di_disponible: [null],
    });
    this.formExp = this.fb.group({
      id: [null],
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      dateAgreementAssurance: [null],
      protectionKey: [null],
    });
    this.formInforme = this.fb.group({
      id: [null],
      noBien: [null],
    });
    this.formAutoridad = this.fb.group({
      autoridad: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  showHistory() {
    const { goodId, description } = this.form.value;
    this.goodId = { noBien: goodId, descripcion: description };

    const time = setTimeout(() => {
      this.histo.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
      this.isHistory = true;
      clearTimeout(time);
    }, 500);
  }

  expedientSelect(expedient: any) {
    if (expedient.id) {
      this.formExp.patchValue(expedient);
      let params = new ListParams();
      params.limit = 1;
      params.page = 1;
      params.text = '';
      this.goodService.getByExpedient(expedient.id, params).subscribe({
        next: value => {
          console.log(value.data[0]);
          this.form.patchValue(value.data[0]);
          this.form
            .get('descriptionStatus')
            .patchValue(
              value.data[0].estatus
                ? value.data[0].estatus.descriptionStatus
                : 'NO DEFINIDO'
            );
          this.getDateAndStatus();
          this.checkAvaliable();
          this.getDocuments();
        },
        error: () => {},
      });
    } else {
      this.form.reset();
      this.formExp.reset();
    }
  }

  getDateAndStatus() {
    const { id } = this.formExp.value;
    const { goodId } = this.form.value;
    const filter = new FilterParams();
    filter.addFilter('proceedingsNumber', id, SearchFilter.EQ);
    filter.addFilter('goodNumber', goodId, SearchFilter.EQ);
    filter.addFilter('typeDict', 'RECREVISION', SearchFilter.EQ);

    this.dictaminationServ.getAllFilter(filter.getParams()).subscribe({
      next: resp => {
        this.form.get('di_situacion_bien').patchValue(resp.data[0].statusDict);
        this.form.get('di_fec_dictaminacion').patchValue(resp.data[0].dateDict);
      },
      error: () => {
        this.form.get('di_situacion_bien').patchValue('NO DICTAMINADO');
      },
    });
  }

  checkAvaliable() {
    const { status } = this.form.value;
    const filter = new FilterParams();
    filter.addFilter('status', status, SearchFilter.EQ);
    filter.addFilter('screenKey', 'FACTJURDICTAMRECR', SearchFilter.EQ);
    this.viewStatus.getList(filter.getParams()).subscribe({
      next: () => {
        this.form.get('di_disponible').patchValue('S');
      },
      error: () => {
        this.form.get('di_disponible').patchValue('N');
      },
    });
  }

  getDocuments() {
    const filter = new FilterParams();
    filter.addFilter('typeDictum', 'RECREVISION');
    filter.sortBy = 'key:ASC';
    this.documents.getAllDictum(filter.getParams()).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: () => {},
    });
  }

  selectGood(good: any) {
    console.log(good);
  }

  btnAprobar() {
    const { di_situacion_bien } = this.form.value;
    const { id, dateAgreementAssurance } = this.formExp.value;

    if (di_situacion_bien == 'DICTAMINADO') {
      this.onLoadToast('info', 'Bien ya dictaminado', '');
    } else {
      if (!id) {
        this.onLoadToast('info', 'Falta seleccionar expediente', '');
      } else {
        if (!dateAgreementAssurance) {
          this.onLoadToast(
            'info',
            'Obligatoria la fecha de presentación del recurso de revisión'
          );
        }
      }

      if (id && dateAgreementAssurance) {
        this.autoridad = true;
      }
    }
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
