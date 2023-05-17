/** BASE IMPORT */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDocumentsForDictum } from 'src/app/core/models/catalogs/documents-for-dictum.model';
import { IDocumentsDictumXState } from 'src/app/core/models/ms-documents/documents-dictum-x-state.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGoodService } from 'src/app/core/services/ms-dictation/dictation-x-good.service';
import { DocumentsDictumXStateService } from 'src/app/core/services/ms-documents-dictum-x-state/documents-dictum-x-state.service';
import { DocumentsRequestPerGoodService } from 'src/app/core/services/ms-documents-request-per-good/ms-documents-request-per-good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
      key: {
        title: 'Cve. Documento',
      },
      keyDocument: {
        title: 'Descripción',
        type: 'string',
        valuePrepareFunction: (value: any) => {
          return value[0].description;
        },
      },
      dateReceipt: {
        title: 'Fecha Recibió',
        type: 'string',
        valuePrepareFunction: (value: any) => {
          return value ? value.split('-').reverse().join('-') : '';
        },
      },
      status: {
        title: 'Status',
      },
      solicitarDocumentacion: {
        title: 'Solicitar Documentación',
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggle.subscribe((data: any) => {
            data.row.cb_solicitar_doctos = data.toggle ? 'S' : 'N';
            const now = new Date().valueOf();
            const { notifyRevRecDate, di_disponible } = this.form.value;
            let day;
            if (notifyRevRecDate) {
              day = this.sumarDias(new Date(notifyRevRecDate), 7);
            } else {
              day = this.sumarDias(new Date(), 7);
            }

            if (now > day.valueOf()) {
              this.onLoadToast(
                'info',
                'No puedes solicitar documentación después de 5 días habiles'
              );
            } else {
              if (di_disponible == 'S') {
                if (data.row.key) {
                  if (data.row.cb_solicitar_doctos == 'S') {
                    data.row.situacion_documentos = 'SOLICITADO';
                    this.insertSolic(data.row);
                    this.goRed(data.row);
                  } else {
                    this.deleteSolic(data.row);
                    this.goCommon(data.row);
                    data.row.situacion_documentos = null;
                  }
                } else {
                  this.onLoadToast('info', 'Seleccione primero el documento');
                  data.row.cb_solicitar_doctos = 'N';
                }
              } else {
                data.row.cb_solicitar_doctos = 'N';
              }
            }
          });
        },
      },
    },
  };

  tableSettingsDoc = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    columns: {
      id: {
        title: 'Cve. Documento',
      },
      description: {
        title: 'Descripción',
        type: 'string',
      },
      solicitarDocumentacion: {
        title: 'Seleccionar',
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: any) => {
          console.log(instance);

          instance.toggle.subscribe((data: any) => {
            if (data.toggle) {
              if (!this.buffer(data.row)) {
                instance.box.nativeElement.checked = false;
                data.toggle = false;
              }
            } else {
            }
          });
        },
      },
    },
  };

  // Data table
  public dataTable: IListResponse<IDocumentsDictumXState> =
    {} as IListResponse<IDocumentsDictumXState>;

  public dataTableDoc: IListResponse<IDocumentsForDictum> =
    {} as IListResponse<IDocumentsForDictum>;

  public form: FormGroup;
  public formExp: FormGroup;
  public formInforme: FormGroup;
  public formAutoridad: FormGroup;
  public informes: boolean = false;
  public autoridad: boolean = false;
  public isHistory: boolean = false;
  public goodId: any = null;
  @ViewChild('df', { static: false }) histo: ElementRef<HTMLElement>;
  @ViewChild('docTable', { static: false }) doc: ElementRef<HTMLElement>;
  public params = new BehaviorSubject<FilterParams>(new FilterParams());
  public paramsDoc = new BehaviorSubject<FilterParams>(new FilterParams());
  public loadingDoc: boolean = false;

  public activeBlocDoc: boolean = false;
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly dictaminationServ: DictationXGoodService,
    private readonly viewStatus: StatusXScreenService,
    private readonly documents: DocumentsDictumXStateService,
    private readonly solicServ: DocumentsRequestPerGoodService,
    private readonly user: AuthService,
    private readonly jasperService: SiabService,
    private readonly sanitizer: DomSanitizer,
    private readonly modalService: BsModalService,
    private readonly dictumForService: DocumentsForDictumService
  ) {
    super();
  }

  sumarDias(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  buffer(data: IDocumentsForDictum) {
    const sysdate = new Date();
    let change = true;
    for (let index = 0; index < this.dataTable.data.length; index++) {
      const doc = this.dataTable.data[index];
      if (doc.key == data.id) {
        this.onLoadToast(
          'info',
          'Documento ya seleccionado para este expediente'
        );
        change = false;
      }
      if (!doc.key) {
        break;
      }
    }

    return change;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  insertSolic(data: any) {
    data.fec_inserto_sol = new Date();
    const { id } = this.formExp.value;
    const { goodId } = this.form.value;
    const user = this.user.decodeToken();

    const dataSend = {
      proceedingsNumber: id,
      goodNumber: goodId,
      rulingType: data.typeDictum,
      cveDocument: data.key,
      solicitousDate: data.fec_inserto_sol,
      receivedDate: '',
      solicitousUser: user.username.toUpperCase(),
    };

    this.solicServ.create(dataSend).subscribe({
      next: () => {
        this.onLoadToast('success', 'Solicitud documento bien ha sido creado');
      },
      error: error => {
        this.onLoadToast('error', error.error.message);
      },
    });
  }

  deleteSolic(data: any) {
    if (!data.fec_inserto_sol) return;
    const { goodId } = this.form.value;
    this.solicServ.remove(goodId).subscribe({
      next: () => {
        this.onLoadToast('success', 'Solicitud eliminada correctamente');
        data.fec_inserto_sol = null;
      },
      error: () => {
        this.onLoadToast('error', 'No se pudo eliminar la solicitud');
      },
    });
  }

  goRed(data: any) {
    const index = this.dataTable.data.findIndex(
      good => good.goodNumber == data.goodNumber
    );
    const table = document.getElementById('table').children[0].children[1];
    table.children[index].children[3].classList.add('bg-danger', 'text-white');
  }

  goCommon(data: any) {}

  private prepareForm() {
    this.form = this.fb.group({
      goodId: [null],
      initialAgreement: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      agreementDate: [null],
      status: [null, [Validators.pattern(STRING_PATTERN)]], //Estatus del bien detalle
      descriptionStatus: [null],
      notifyRevRecDate: [null],
      dateDict: [null],
      statusDict: [null, [Validators.pattern(STRING_PATTERN)]],
      revRecCause: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      di_situacion_bien: [null],
      di_fec_dictaminacion: [null],
      di_disponible: [null],
      ti_autoridad_ordena_dictamen: [
        null,
        [Validators.pattern(STRING_PATTERN)],
      ],
      cb_solicitar_doctos: [null],
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
      goodId: [null],
    });
    this.formAutoridad = this.fb.group({});
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
      console.log(expedient);
      const format = expedient.dateAgreementAssurance
        ? expedient.dateAgreementAssurance.split('-').reverse().join('-')
        : '';
      expedient.dateAgreementAssurance = format;
      this.formExp.patchValue(expedient);
      let params = new ListParams();
      params.limit = 1;
      params.page = 1;
      params.text = '';
      this.goodService.getByExpedient(expedient.id, params).subscribe({
        next: value => {
          const good = value.data[0];

          if (good.agreementDate) {
            good.agreementDate = good.agreementDate
              .toString()
              .split('-')
              .reverse()
              .join('-') as any;
          }

          if (good.notifyDate) {
            good.notifyDate = good.notifyDate
              .toString()
              .split('-')
              .reverse()
              .join('-') as any;
          }

          this.form.patchValue(good);
          this.form
            .get('descriptionStatus')
            .patchValue(
              good.estatus ? good.estatus.descriptionStatus : 'NO DEFINIDO'
            );
          this.getDateAndStatus();
          this.checkAvaliable();
          this.getDocuments();
        },
        error: () => {
          this.form.reset();
        },
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
    this.loading = true;
    this.documents.getAllFirters(filter.getParams()).subscribe({
      next: resp => {
        this.dataTable = resp;
        this.loading = false;
      },
      error: () => {
        this.dataTable.data = [];
        this.dataTable.count = 0;
        this.loading = false;
      },
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
        this.lookNotReceived();
      }
    }
  }

  lookNotReceived() {
    let no_recibidos = false;
    let con_documentos = false;

    for (let index = 0; index < this.dataTable.data.length; index++) {
      const element = this.dataTable.data[index];
      if (element.key)
        if (element.key) {
          con_documentos = true;
          break;
        }
    }

    for (let index = 0; index < this.dataTable.data.length; index++) {
      const element = this.dataTable.data[index];
      if (element.key)
        if (!element.dateReceipt) {
          no_recibidos = true;
          break;
        }
    }

    if (con_documentos) {
      if (no_recibidos) {
        this.alertQuestion(
          'info',
          'Alerta',
          'Falta recibir documentación. ¿Desea proseguir con la aprobación del dictámen?'
        ).then(answer => {
          if (answer.value) {
            this.autoridad = true;
            const { ti_autoridad_ordena_dictamen } = this.form.value;
            if (ti_autoridad_ordena_dictamen) {
              this.form.get('ti_autoridad_ordena_dictamen').patchValue(null);
            }
          }
        });
        this.onLoadToast(
          'info',
          'Falta recibir documentación. ¿Desea proseguir con la aprobación del dictámen?'
        );
      } else {
        this.onLoadToast('success', 'Operación realizada dictámen autorizado');
        this.form.get('di_fec_dictaminacion').patchValue(new Date());
        this.form.get('di_situacion_bien').patchValue('DICTAMINADO');
      }
    } else {
      this.onLoadToast(
        'info',
        'Debe iniciar el proceso de dictaminación y elegir al menos un documento'
      );
    }
  }

  btnRecursos() {
    const { id } = this.formExp.value;
    const { goodId } = this.form.value;
    if (!id) {
      this.onLoadToast('info', 'Favor de seleccionar un expediente');
    } else {
      this.formInforme.patchValue({ id: id, goodId: goodId });
      this.informes = true;
    }
  }
  btnSeleccionarDocumentos() {
    const now = new Date().valueOf();
    const { notifyRevRecDate, di_disponible, di_situacion_bien, goodId } =
      this.form.value;
    const { id, dateAgreementAssurance } = this.formExp.value;
    let vquery: string[] = [];
    let day;
    if (notifyRevRecDate) {
      day = this.sumarDias(new Date(notifyRevRecDate), 7);
    } else {
      day = this.sumarDias(new Date(), 7);
    }

    if (now > day.valueOf()) {
      this.onLoadToast(
        'info',
        'No puedes solicitar documentación después de 5 días hábiles'
      );
    } else {
      if (di_situacion_bien == 'DICTAMINADO') {
        this.onLoadToast('info', 'Bien ya dictaminado');
      } else {
        if (!id) {
          this.onLoadToast('info', 'Obligatorio seleccionar un expediente');
        } else {
          if (!goodId) {
            this.onLoadToast('info', 'Obligatorio seleccionar un bien');
          } else {
            if (!dateAgreementAssurance) {
              this.onLoadToast(
                'info',
                'Obligatorio la fecha de presentación del recurso de revisión'
              );
            } else {
              for (let index = 0; index < this.dataTable.data.length; index++) {
                const doc = this.dataTable.data[index];
                if (doc.key) {
                  vquery.push(doc.key);
                } else {
                  break;
                }
              }

              if (
                id &&
                dateAgreementAssurance &&
                goodId &&
                di_situacion_bien != 'DICTAMINADO'
              ) {
                this.activeBlocDoc = true;
                this.getData();
              } else {
                this.activeBlocDoc = true;
                this.getData();
              }
            }
          }
        }
      }
    }
  }

  getData() {
    this.loadingDoc = true;
    this.dictumForService.getAll(new ListParams()).subscribe({
      next: resp => {
        this.loadingDoc = false;
        this.dataTableDoc = resp;
        this.doc.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      },
      error: err => {
        this.loadingDoc = false;
        this.dataTableDoc.data = [];
        this.dataTable.count = 0;
      },
    });
  }

  btnEjecutarAutoridad() {
    const { ti_autoridad_ordena_dictamen } = this.form.value;
    if (ti_autoridad_ordena_dictamen) {
      this.onLoadToast('success', 'Operación realizada dictámen autorizado');
      this.autoridad = false;
      this.form.get('di_fec_dictaminacion').patchValue(new Date());
      this.form.get('di_situacion_bien').patchValue('DICTAMINADO');
    } else {
      this.onLoadToast(
        'info',
        'Debe ingresar el nombre de la autoridad que aprueba el dictámen'
      );
    }
  }
  btnSalirAutoridad() {
    this.autoridad = false;
  }
  btnEjecutarInformes() {
    const { id, goodId } = this.formInforme.value;
    this.onLoadToast('success', 'Generando reporte...', '');
    const params = {
      PN_EXPINI: id,
      PN_BIEN: goodId,
      PC_TIPO_DICTAM: '',
    };
    const msg = setTimeout(() => {
      this.jasperService
        .fetchReport('RCONJURDOCSPENDIE', params)
        .pipe(
          tap(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
            clearTimeout(msg);
          })
        )
        .subscribe();
    }, 1000);
  }

  btnSalirDoc() {
    this.activeBlocDoc = false;
    this.dataTableDoc.data = [];
    this.dataTableDoc.count = 0;
  }

  btnSalir() {
    this.formInforme.reset();
    this.informes = false;
  }
}
