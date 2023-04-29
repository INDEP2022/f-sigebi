/** BASE IMPORT */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { format } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS,
  JURIDICAL_FILE_UPDATE_SEARCH_FIELDS,
} from '../../file-data-update/interfaces/columns';
import { IJuridicalFileDataUpdateForm } from '../../file-data-update/interfaces/file-data-update-form';
import { JuridicalFileUpdateService } from '../../file-data-update/services/juridical-file-update.service';
import { JURIDICAL_FILE_DATA_UPDATE_FORM } from '../constants/form-declarations';
import { AbandonmentsDeclarationTradesService } from '../service/abandonments-declaration-trades.service';

/** ROUTING MODULE */

@Component({
  selector: 'app-abandonments-declaration-trades',
  templateUrl: './abandonments-declaration-trades.component.html',
  styleUrls: ['./abandonments-declaration-trades.component.scss'],
})
export class AbandonmentsDeclarationTradesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public optionsTipoVolante = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Procesal', label: 'Procesal' },
    { value: 'Admin. Trans', label: 'Admin. Trans' },
    { value: 'Transferente', label: 'Transferente' },
  ];
  public form: FormGroup;
  public formOficio: FormGroup;
  public formFolioEscaneo: FormGroup;
  public formCcpOficio: FormGroup;
  public formDeclaratoria: FormGroup;
  public formDeclaratoriaTabla: FormGroup;
  public formOficiopageFin: FormGroup;
  public formDeclaratoriapageFin: FormGroup;
  declarationForm = this.fb.group(JURIDICAL_FILE_DATA_UPDATE_FORM);
  searchMode: boolean = false;
  confirmSearch: boolean = false;
  formData: Partial<IJuridicalFileDataUpdateForm> = null;
  selectedRow: INotification;
  columnsType = { ...JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS };
  fieldsToSearch = [...JURIDICAL_FILE_UPDATE_SEARCH_FIELDS];
  showTabs: boolean = true;
  senders = new DefaultSelect<IUserAccessAreaRelational>();
  recipients = new DefaultSelect<IUserAccessAreaRelational>();
  cities = new DefaultSelect<ICity>();

  /** Tabla bienes */
  data1 = [{}];
  settings1 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      goodId: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      quantity: {
        title: 'Cantidad',
        type: 'string',
      },
      status: {
        title: 'Ident.',
        type: 'string',
      },
      processStatus: {
        title: 'Est',
        type: 'string',
      },
      origin: {
        title: 'Proceso',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  /** Tabla bienes */

  /** Tabla bienes */
  data2 = [
    {
      cveDocumento: 25,
      description: 'UNA BOLSA',
    },
  ];
  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      cveDocumento: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  /** Tabla bienes */

  constructor(
    private fb: FormBuilder,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    public fileUpdateService: JuridicalFileUpdateService,
    private changeDetectorRef: ChangeDetectorRef,
    private docDataService: DocumentsReceptionDataService,
    private readonly goodServices: GoodService
  ) {
    super();
  }

  get formControls() {
    return this.declarationForm.controls;
  }

  get dictDate() {
    return format(new Date(), 'dd-MM-yyyy');
    return this.declarationForm.controls['dictDate'].value;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.onLoadGoodList();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: [''],
      noVolante: ['', [Validators.required]], //*
      tipoVolante: ['', [Validators.required]], //*
      fechaRecepcion: ['', [Validators.required]], //*
      consecutivoDiario: ['', [Validators.required]], //*
      actaCircunst: [''],
      averigPrevia: [''],
      causaPenal: [''],
      noAmparo: [''],
      tocaPenal: [''],
      noOficio: ['', [Validators.required]], //*
      fechaOficio: ['', [Validators.required]], //*
      descripcionAsunto: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]], //*
      // idAsunto: [''],
      asunto: [''],
      // idDesahogoAsunto: [''],
      desahogoAsunto: ['', [Validators.required]], //*
      // idCiudad: [''],
      ciudad: ['', [Validators.required]], //*
      // idEntidadFederativa: [''],
      entidadFederativa: ['', [Validators.required]], //*
      claveUnica: ['', [Validators.required]], //*
      transferente: ['', [Validators.required]], //*
      emisora: ['', [Validators.required]], //*
      autoridad: ['', [Validators.required]], //*
      autoridadEmisora: [''],
      ministerioPublico: [''],
      juzgado: ['', [Validators.required]], //*
      indiciado: ['', [Validators.required]],
      delito: [''],
      solicitante: ['', [Validators.required]], //*
      contribuyente: ['', [Validators.required]], //*
      viaRecepcion: ['', [Validators.required]], //*
      areaDestino: ['', [Validators.required]], //*
      destinatario: ['', [Validators.required]], //*
      justificacionConocimiento: [''],
      reaccionacionConocimiento: [''],
    });
    this.formDeclaratoria = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiPrevia: ['', [Validators.required]], //*
      causaPenal: ['', [Validators.required]], //*
      tipoOficio: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]],
      destinatario: ['', [Validators.required]],
      cveOficio: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
    });
    this.formDeclaratoriaTabla = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiPrevia: ['', [Validators.required]], //*
    });
    this.formDeclaratoriapageFin = this.fb.group({
      page: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]], //*
      fin: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]], //*
    });
    this.formOficiopageFin = this.fb.group({
      page: ['', [Validators.required]], //*
      fin: ['', [Validators.required]], //*
    });

    this.formOficio = this.fb.group({
      tipoOficio: [''],
      remitente: [''],
      destinatario: [''],
      ciudad: [''],

      noVolante: ['', [Validators.required]], //*
      noExpediente: ['', [Validators.required]], //*
      cveOficio: ['', [Validators.required]], //*
      oficio: [''],
      fechaCaptura: ['', [Validators.required]], //*
      estatus: ['', [Validators.required]], //*
    });

    this.formCcpOficio = this.fb.group({
      ccp: [null, [Validators.minLength(1)]], //*
      usuario: ['', [Validators.minLength(1)]], //*
      nombreUsuario: '',
      ccp2: [null, [Validators.minLength(1)]], //*
      usuario2: ['', [Validators.minLength(1)]], //*
      nombreUsuario2: '',
    });
    this.formFolioEscaneo = this.fb.group({
      folioEscaneo: ['', [Validators.required]], //*
    });
  }

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }

  mostrarInfoOficio(allFormsOficio: any): any {
    console.log(allFormsOficio);
  }

  mostrarInfoDeclaratoria(formDeclaratoria: FormGroup): any {
    console.log(formDeclaratoria.value);
  }

  oficioRelacionado(event: any) {
    console.log('Oficio Relacionado', event);
  }

  capturaCopias(event: any) {
    console.log('Captura copias', event);
  }

  checkSearchMode(searchMode: boolean) {
    this.searchMode = searchMode;
    this.changeDetectorRef.detectChanges();
  }

  confirm(confirm: boolean) {
    this.confirmSearch = confirm;
    this.changeDetectorRef.detectChanges();
  }

  search(formData: Partial<IJuridicalFileDataUpdateForm>) {
    this.formData = formData;
    this.changeDetectorRef.detectChanges();
    console.log(formData);
  }

  selectData(data: INotification) {
    this.selectedRow = data;
    this.changeDetectorRef.detectChanges();
    console.log(data);
  }

  getSenders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: data => {
        this.senders = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.senders = new DefaultSelect();
      },
    });
  }

  getRecipients(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: data => {
        this.recipients = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.recipients = new DefaultSelect();
      },
    });
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('nameCity', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }
  params = new BehaviorSubject<ListParams>(new ListParams());
  onLoadGoodList() {
    this.goodServices
      .getByExpedient(
        this.formDeclaratoriaTabla.get('noExpediente').value,
        this.params.getValue()
      )
      .subscribe({
        next: response => {
          debugger;
          this.data1 = response.data;
        },
        error: err => {
          this.data1 = [];
        },
      });
  }
}
