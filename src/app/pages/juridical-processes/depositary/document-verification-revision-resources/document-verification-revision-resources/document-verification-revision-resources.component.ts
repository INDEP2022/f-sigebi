/** BASE IMPORT */
import { DatePipe } from '@angular/common';
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
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGoodParameter } from 'src/app/core/models/ms-good-parameter/good-parameter.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGoodService } from 'src/app/core/services/ms-dictation/dictation-x-good.service';
import { DocumentsDictumXStateService } from 'src/app/core/services/ms-documents-dictum-x-state/documents-dictum-x-state.service';
import { DocumentsRequestPerGoodService } from 'src/app/core/services/ms-documents-request-per-good/ms-documents-request-per-good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
              this.alert(
                'info',
                'No puedes solicitar documentación después de 5 días habiles',
                ''
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
                  this.alert('info', 'Seleccione primero el documento', '');
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
          instance.toggle.subscribe((data: any) => {
            if (data.toggle) {
              if (!this.buffer(data.row)) {
                instance.box.nativeElement.checked = false;
                data.toggle = false;
              } else {
                this.createDoc(data.row);
              }
            } else {
              for (let index = 0; index < this.dataTable.data.length; index++) {
                const doc = this.dataTable.data[index];
                if (data.row.id == doc.key) {
                  this.removeDoc();
                  break;
                }
              }
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
  public expedient: DefaultSelect<IExpedient> = new DefaultSelect();
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
    private readonly dictumForService: DocumentsForDictumService,
    private readonly expedienteSer: ExpedientService,
    private readonly parameter: GoodParametersService,
    private readonly datePipe: DatePipe
  ) {
    super();
    this.dataTable.count = 0;
  }

  createDoc(data: any) {
    const dataSend = {
      recordNumber: 0,
      goodNumber: 0,
      key: '',
      typeDictum: '',
      dateReceipt: '',
      userReceipt: '',
      insertionDate: '',
      userInsertion: '',
      numRegister: 0,
      officialNumber: 0,
    };
  }

  removeDoc() {}

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

  getExpedient(params?: ListParams) {
    const fil: FilterParams = new FilterParams();
    if (params.text)
      fil.addFilter('protectionKey', params.text, SearchFilter.ILIKE);
    fil.sortBy = 'id:ASC';
    fil.page = params.page;
    this.expedienteSer.getAllFilter(fil.getParams()).subscribe({
      next: resp => {
        this.expedient = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.expedient = new DefaultSelect();
      },
    });
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
        this.alert('success', 'Solicitud documento bien ha sido creado', '');
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
        this.alert('success', 'Solicitud eliminada correctamente', '');
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
      goodId: [null, Validators.required],
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
      proceedingsNumber: [null],
      estatus_recurso_revision: [null],
    });
    this.formExp = this.fb.group({
      id: [null, Validators.required],
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      dateAgreementAssurance: [null],
      protectionKey: [null, Validators.required],
      date_parameter: [null],
      articulo_validado: [null],
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
    if (expedient) {
      this.form.reset();
      this.formExp.reset();
      this.isHistory = false;
      if (!expedient.id) return;
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
          this.form.patchValue(good);
          this.checkAvaliable();
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

          this.form.get('proceedingsNumber').patchValue(expedient.id);

          this.form.patchValue(good);
          this.form
            .get('descriptionStatus')
            .patchValue(
              good.estatus ? good.estatus.descriptionStatus : 'NO DEFINIDO'
            );
          this.getDateAndStatus();
          this.getDocuments();
        },
        error: () => {
          this.form.reset();
        },
      });
    } else {
      this.form.reset();
      this.formExp.reset();
      this.isHistory = false;
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
        console.log('encontradoo', resp);

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

    setTimeout(() => {
      const { di_disponible, di_situacion_bien } = this.form.value;
      const { id, dateAgreementAssurance } = this.formExp.value;
      if (di_disponible == 'S') {
        if (di_situacion_bien == 'DICTAMINADO') {
          this.alert(
            'info',
            'No se pueden realizar modificaciones porque el bien está dictaminado',
            ''
          );
        }
        if (!id) {
          this.alert('info', 'Obligatorio seleccionar un expediente', '');
        } else if (!dateAgreementAssurance) {
          this.alert(
            'info',
            'Obligatorio la fecha de presentación del recurso de revisión',
            ''
          );
        }
      }
    }, 1000);
  }

  selectGood(good: any) {
    console.log(good);
  }

  btnAprobar() {
    const { di_situacion_bien } = this.form.value;
    const { id, dateAgreementAssurance } = this.formExp.value;

    if (di_situacion_bien == 'DICTAMINADO') {
      this.alert('info', 'Bien ya dictaminado', '');
    } else {
      if (!id) {
        this.alert('info', 'Falta seleccionar expediente', '');
      } else {
        if (!dateAgreementAssurance) {
          this.alert(
            'info',
            'Obligatoria la fecha de presentación del recurso de revisión',
            ''
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
      if (element.key) {
        con_documentos = true;
        break;
      }
    }

    for (let index = 0; index < this.dataTable.data.length; index++) {
      const element = this.dataTable.data[index];
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
      } else {
        this.alert('success', 'Operación realizada dictámen autorizado', '');
        this.form.get('di_fec_dictaminacion').patchValue(new Date());
        this.form.get('di_situacion_bien').patchValue('DICTAMINADO');
      }
    } else {
      this.alert(
        'info',
        'Debe iniciar el proceso de dictaminación y elegir al menos un documento',
        ''
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
      this.alert(
        'info',
        'No puedes solicitar documentación después de 5 días hábiles',
        ''
      );
    } else {
      if (di_situacion_bien == 'DICTAMINADO') {
        this.alert('info', 'Bien ya dictaminado', '');
      } else {
        if (!id) {
          this.alert('info', 'Obligatorio seleccionar un expediente', '');
        } else {
          if (!goodId) {
            this.alert('info', 'Obligatorio seleccionar un bien', '');
          } else {
            if (!dateAgreementAssurance) {
              this.alert(
                'info',
                'Obligatorio la fecha de presentación del recurso de revisión',
                ''
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

              vquery = ['CVD', 'DFD'];

              if (
                id &&
                dateAgreementAssurance &&
                goodId &&
                di_situacion_bien != 'DICTAMINADO'
              ) {
                this.activeBlocDoc = true;
                this.getDataWihtVquery(vquery.join(', '));
              } else {
                this.activeBlocDoc = true;
                this.getDataNotVquery();
              }
            }
          }
        }
      }
    }
  }

  getDataNotVquery() {
    this.loadingDoc = true;
    const { proceedingsNumber, goodId } = this.form.value;
    const data = {
      proceedingsNumber,
      goodNumber: goodId,
    };

    this.dictumForService.getAplication2(data).subscribe({
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
        if (err.status == 404) {
          this.onLoadToast('error', 'No se encontraron registros');
        }
      },
    });
  }

  getDataWihtVquery(vc_query: string) {
    this.loadingDoc = true;
    const { proceedingsNumber, goodId } = this.form.value;
    const data = {
      proceedingsNumber,
      goodNumber: goodId,
      vc_query,
    };

    console.log(data);

    this.dictumForService.getAplication1(data).subscribe({
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
      this.alert('success', 'Operación realizada dictámen autorizado', '');
      this.autoridad = false;
      this.form.get('di_fec_dictaminacion').patchValue(new Date());
      this.form.get('di_situacion_bien').patchValue('DICTAMINADO');
    } else {
      this.alert(
        'info',
        'Debe ingresar el nombre de la autoridad que aprueba el dictámen',
        ''
      );
    }
  }

  btnSalirAutoridad() {
    this.autoridad = false;
  }

  btnEjecutarInformes() {
    const { id, goodId } = this.formInforme.value;
    this.alert('success', 'Generando reporte...', '');
    const params = {
      PN_EXPINI: id,
      PN_BIEN: goodId,
      PC_TIPO_DICTAM: 'RECREVISION',
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

  async validateItem(date: Date) {
    if (date) {
      const dataResp = await this.readParameters();
      if (dataResp) {
        if (date) {
          this.formExp
            .get('articulo_validado')
            .patchValue(
              this.convertDate(date) <= this.convertDate(dataResp.initialValue)
                ? 4
                : 6
            );
        }
      }
    }
  }

  convertDate(date: Date | string) {
    let newDate;
    const type = typeof date;
    if (type == 'string') {
      newDate = date.toString().split('-').reverse().join('/');
    } else {
      newDate = this.datePipe.transform(date, 'yyyy/MM/dd');
    }
    return new Date(newDate).valueOf();
  }

  readParameters() {
    return new Promise<IGoodParameter>((resolve, reject) => {
      this.parameter.getById('FARTICULO4').subscribe({
        next: resp => {
          this.formExp.get('date_parameter').patchValue(resp.initialValue);
          resolve(resp);
        },
        error: () => {
          this.formExp.get('date_parameter').patchValue(null);
          this.alert(
            'info',
            'No hay parámetros para obtener la fecha de aseguramiento de ley',
            ''
          );
          resolve(null);
        },
      });
    });
  }

  async preUpdateGood() {
    const {
      di_fec_dictaminacion,
      goodId,
      proceedingsNumber,
      di_situacion_bien,
      ti_autoridad_ordena_dictamen,
      observations,
    } = this.form.value;
    let existData: any = {};
    if (di_fec_dictaminacion) {
      this.form
        .get('estatus_recurso_revision')
        .patchValue('DICTAMINADO RECURSO DE REVISION');
    }

    const exist = await new Promise<number>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('proceedingsNumber', proceedingsNumber, SearchFilter.EQ);
      filter.addFilter('goodNumber', goodId, SearchFilter.EQ);
      filter.addFilter('typeDict', 'RECREVISION', SearchFilter.EQ);
      this.dictaminationServ.getAllFilter(filter.getParams()).subscribe({
        next: resp => {
          existData = resp.data[0];
          resolve(resp.count);
        },
        error: error => {
          if (error.status == 400) {
            resolve(0);
          } else {
            resolve(-1);
          }
        },
      });
    });

    const user = this.user.decodeToken();

    if (exist == 0) {
      const data = {
        proceedingsNumber: proceedingsNumber,
        goodNumber: goodId,
        typeDict: 'RECREVISION',
        statusDict: di_situacion_bien,
        dateDict: di_fec_dictaminacion,
        userDict: user.name.toUpperCase(),
        authorityOrdersDict: ti_autoridad_ordena_dictamen,
        observations,
        delegationDictamNumber: '',
        areaDict: '',
      };

      this.dictaminationServ.create(data).subscribe({
        next: () => {
          this.alert('success', 'Ha sido creado con éxito el dictamen', '');
        },
        error: error => {
          this.alert('error', error.error.message, '');
        },
      });
    } else if (exist > 0) {
      delete existData.files;
      delete existData.goods;
      this.dictaminationServ.update(existData, existData.goodNumber).subscribe({
        next: () => {
          this.alert(
            'success',
            'Dictamen ha sido actualizado correctamente',
            ''
          );
        },
        error: error => {
          this.alert('error', error.error.message, '');
        },
      });
    }
  }
}
