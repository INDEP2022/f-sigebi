import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import {
  IDictation,
  IDictationCopies,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { BankAccount } from 'src/app/pages/administrative-processes/numerary/tesofe-movements/list-banks/bank';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { ModalComponent } from '../modal/modal-component';
import { tablaModalComponent } from '../tabla-modal/tablaModal-component';
import { EXTERNOS_COLUMS } from '../tabla-modal/tableUserExt';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit, OnChanges {
  /*==================================================*/
  form: FormGroup = this.fb.group({
    expedientNumber: [
      null,
      [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
    ],
    registerNumber: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(11)],
    ],
    wheelNumber: [
      null,
      [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
    ],
    typeDict: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    cve_banco: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    charge: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    senderUserRemitente: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    addressee: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    addressee_I: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    paragraphInitial: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    paragraphFinish: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    paragraphOptional: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    descriptionSender: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ] /*
    typePerson: [null, null],
    senderUser: [null, null],
    personaExt: [null, null],*/,
    typePerson_I: [null, null],
    senderUser_I: [null, null],
    personaExt_I: [null, null],
    key: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
    numberDictamination: [
      null,
      [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
    ],
    masInfo_1: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    masInfo_2: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    masInfo_3: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    masInfo_1_1: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    masInfo_1_2: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    extPerson: this.fb.array([]),
  });
  totalItems: number;
  dataExt: IDictationCopies[];
  intIDictation: IDictation;
  localInterfazOfficialDictation: IOfficialDictation;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  options: any[];
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  UserDestinatario: ISegUsers[] = [];
  nameUserDestinatario: ISegUsers;
  verBoton: boolean = false;
  filterParamsLocal = new BehaviorSubject<FilterParams>(new FilterParams());

  //=======================================================================
  users$ = new DefaultSelect<ISegUsers>();
  users$$ = new DefaultSelect<ISegUsers>();
  usersExtCombo = new DefaultSelect<ISegUsers>();
  @Input() oficnum: number | string;

  datosOpinion: any = [];

  valueCharge: Observable<String>;

  no_cuenta: number;
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;

  dataSelect: BankAccount;

  contadorCCP: IDictationCopies[] = [];

  dictatesNumber: number;
  rulingType: string;
  recordNumber: number;
  copyDestinationNumber: number;
  idCopias: number;

  constructor(
    private fb: FormBuilder,
    private oficialDictationService: OficialDictationService,
    private dictationService: DictationService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private siabServiceReport: SiabService,
    private usersService: UsersService,
    private service: BankAccountService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private jobDictumTextsServices: JobDictumTextsService
  ) {
    super();

    this.settings.columns = EXTERNOS_COLUMS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.oficnum != null) {
      this.form.get('expedientNumber').setValue(this.oficnum);
      this.buscardictamen();
    }
  }

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'S', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    this.loadUserDestinatario();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  /*
======================================================================
Obtiene los filtros y en base a ellos se hace la búsqueda
======================================================================
*/
  buscardictamen() {
    this.filterParamsLocal.getValue().removeAllFilters();

    if ((this.form.get('expedientNumber').value || '').trim().length > 0) {
      if (!(this.form.get('expedientNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'expedientNumber',
            this.form.get('expedientNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('registerNumber').value || '').trim().length > 0) {
      if (!(this.form.get('registerNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'registerNumber',
            this.form.get('registerNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('wheelNumber').value || '').trim().length > 0) {
      if (!(this.form.get('wheelNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'wheelNumber',
            this.form.get('wheelNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('typeDict').value || '').trim().length > 0) {
      if (!(this.form.get('typeDict').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'typeDict',
            this.form.get('typeDict').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('key').value || '').trim().length > 0) {
      if (!(this.form.get('key').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'passOfficeArmy',
            this.form.get('key').value,
            SearchFilter.EQ
          );
      }
    }

    this.filterParamsLocal
      .getValue()
      .addFilter('fecha_inserto', new Date().getFullYear(), SearchFilter.EQ);

    this.onEnterSearch(this.filterParamsLocal);
    this.verBoton = true;
  }

  onEnterSearch(filterParams: BehaviorSubject<FilterParams>) {
    let valida: boolean = false;
    this.dictationService
      .findByIdsOficNum(filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          if (resp.data.length > 1) {
            this.loadModal(true, filterParams);
          } else {
            this.intIDictation = resp.data[0];
            //this.form.get('expedientNumber').setValue(this.intIDictation.expedientNumber);
            console.log(' this.intIDictation.id => ' + this.intIDictation.id);
            this.form.get('registerNumber').setValue(this.intIDictation.id);
            this.form
              .get('wheelNumber')
              .setValue(this.intIDictation.wheelNumber);
            this.form.get('typeDict').setValue(this.intIDictation.statusDict);
            this.form.get('key').setValue(this.intIDictation.passOfficeArmy);
            let obj = {
              officialNumber: this.intIDictation.id,
              typeDict: this.intIDictation.typeDict,
            };
            this.complementoFormulario(obj);
            this.getPersonaExt_Int(
              'this.intIDictation => ',
              this.intIDictation
            );
          }
        },
        error: err => {
          this.onLoadToast('error', 'error', err.error.message);
        },
      });
  }

  loadModal(resp: boolean, filterParams: BehaviorSubject<FilterParams>) {
    this.openModal(false, filterParams);
  }

  openModal(newOrEdit: boolean, filterParams: BehaviorSubject<FilterParams>) {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    modalConfig.initialState = {
      newOrEdit,
      filterParams,
      callback: (next: any) => {
        const data = JSON.parse(JSON.stringify(next));

        this.form.get('expedientNumber').setValue(data.expedientNumber);
        this.form.get('registerNumber').setValue(data.id);
        this.form.get('wheelNumber').setValue(data.wheelNumber);
        this.form.get('typeDict').setValue(data.typeDict);
        this.form.get('key').setValue(data.passOfficeArmy);
        let obj = {
          officialNumber: this.form.get('registerNumber').value,
          typeDict: this.form.get('typeDict').value,
        };
        this.complementoFormulario(obj);
        this.getPersonaExt_Int('data => ', data);
      },
    };
    this.modalService.show(tablaModalComponent, modalConfig);
  }

  //#################################################################################
  /*================================================================================
carga la  información de la parte media de la página
==================================================================================*/
  complementoFormulario(obj: any) {
    this.oficialDictationService.getById(obj).subscribe({
      next: resp => {
        this.form.get('addressee').setValue(resp.recipient);
        this.form.get('senderUserRemitente').setValue(resp.sender);
        const param = new ListParams();
        param.text = resp.sender;
        this.getUsers$(param);
        this.getPuestoUser(resp.cveChargeRem);
        this.form.get('addressee_I').setValue(resp.typeDict);
        this.form.get('numberDictamination').setValue(resp.officialNumber);

        this.form.get('paragraphInitial').setValue(resp.text1);
        this.form.get('paragraphFinish').setValue(resp.text2);
        this.form.get('paragraphOptional').setValue(resp.text3);
        this.form.get('descriptionSender').setValue(resp.desSenderPa);
        this.getPersonaExt_Int('resp => ', resp);

        this.getPartBodyInputs();
      },
      error: error => {
        this.onLoadToast('info', 'info', error.error.message);
      },
    });
  }
  /*=========================================================================
         Carga los usuarios para mandar a imprimir el reporte
===========================================================================*/
  loadUSers() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'numberOfDicta',
        this.form.value.expedientNumber,
        SearchFilter.EQ
      );
    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          let datos: IDictationCopies[] = resp.data;

          this.form.get('senderUser').setValue(datos[0].namePersonExt);
          this.nrSelecttypePerson = datos[0].personExtInt === 'S' ? 'S' : 'I';

          this.form.get('senderUser').setValue(datos[1].namePersonExt);
          this.nrSelecttypePerson_I = datos[1].personExtInt === 'S' ? 'S' : 'I';
        },
        error: error => {
          this.onLoadToast('error', 'error', error.error.message);
        },
      });
  }
  getPersonaExt_Int(d: string, datos: any) {
    this.filterParams.getValue().removeAllFilters();
    let variable: IDictation = JSON.parse(JSON.stringify(datos));

    this.filterParams
      .getValue()
      .addFilter('id', this.form.get('expedientNumber').value, SearchFilter.EQ);

    //this.filterParams.getValue().addFilter('id', 36, SearchFilter.EQ);

    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log(' EXTERNOS ', JSON.stringify(resp.data));
          this.dataExt = resp.data;
          let datos: IDictationCopies[] = resp.data;
          this.idCopias = datos[0].id;
          this.copyDestinationNumber = datos[0].copyDestinationNumber;
        },
        error: errror => {
          this.onLoadToast('error', 'Error', errror.error.message);
        },
      });
  }

  /*===========================================================
          FORMULARIO
==============================================================*/

  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    if (control === 'control') {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    }
  }

  /*=====================================================================================
    funcionalida para limpiar los campos cuando se limpia y se hace una nueva busqueda 
  =====================================================================================*/
  nuevaBusquedaOficio() {
    this.cleanfields();
  }

  cleanfields() {
    this.form.reset();
    this.verBoton = false;
    this.filterParamsLocal.getValue().removeAllFilters();
  }

  /*=====================================================================================
    método para obtener el puesto de la persona interna 
  =====================================================================================*/
  getPuestoUser(idCode: string) {
    this.dynamicCatalogsService.getPuestovalue(idCode).subscribe({
      next: resp => {
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        this.form.get('charge').setValue('');
        this.onLoadToast('error', 'Error', err.error.message);
      },
    });
  }

  /*=====================================================================================
    método para obtener los usuarios del combo para obtener la clave y los nombres
  =====================================================================================*/

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  /*=====================================================================================
    método para obtener los usuarios del combo para obtener la clave y los nombres
  =====================================================================================*/
  getUsers$($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers$(params).subscribe();
  }

  getAllUsers$(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  usersExt($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsersExt(params).subscribe();
  }

  getAllUsersExt(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.usersExtCombo = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.usersExtCombo = new DefaultSelect(response.data, response.count);
      })
    );
  }

  /*====================================================================
    método para actualizar el dictamen en la parte del body
=======================================================================*/
  updateDictamen() {
    let ofis: Partial<IOfficialDictation> = this.getDatosToUpdateDictamenBody(
      this.form
    );
    this.oficialDictationService.update(ofis).subscribe({
      next: resp => {
        this.onLoadToast('info', 'info', resp.message[0]);
      },
      error: err => {
        this.onLoadToast('error', 'Error', err.error.message);
      },
    });

    let data: Partial<IJobDictumTexts> = this.getDatosToUpdateDictamenBodyText(
      this.form
    );

    this.jobDictumTextsServices.update(data).subscribe({
      next: resp => {
        this.onLoadToast('success', 'success', resp.message[0]);
      },
      error: erro => {
        this.onLoadToast('error', 'Error', erro.error.message);
      },
    });

    let obj = {
      id: this.idCopias,
      copyDestinationNumber: this.copyDestinationNumber,
      typeDictamination: this.form.get('typeDict').value,
      recipientCopy: this.form.get('typeDict').value,
      numberOfDicta: this.form.get('registerNumber').value,
      personExtInt: this.form.get('typePerson_I').value,
      namePersonExt: this.form.get('personaExt_I').value,
      registerNumber: this.form.get('registerNumber').value,
    };

    this.dictationService.updateUserByOficNum(obj).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp[0].message);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  /*====================================================================
    método para actualizar el dictamen y  la parte de inicio 
=======================================================================*/

  getDatosToUpdateDictamenBody(f: FormGroup) {
    return {
      officialNumber: f.value.numberDictamination,
      typeDict: f.value.addressee_I,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      recipient: f.value.senderUserRemitente,
      desSenderPa: f.value.addressee,
      text3: f.value.paragraphOptional,
      text2To: f.value.descriptionSender,
      cveChargeRem: f.value.valueCharge,
    };
  }

  getDatosToUpdateDictamenBodyText(f: FormGroup) {
    return {
      dictatesNumber: this.dictatesNumber,
      rulingType: this.rulingType,
      textx: f.value.masInfo_1,
      textoy: f.value.masInfo_2,
      textoz: f.value.masInfo_3,
      recordNumber: this.recordNumber,
    };
  }

  getDatosToUpdateDictamen(f: FormGroup) {
    return {
      id: f.value.expedientNumber,
      expedientNumber: f.value.registerNumber,
      wheelNumber: f.value.wheelNumber,
      typeDict: f.value.typeDict,
      registerNumber: f.value.key,
    };
  }

  /*====================================================================
             método para obtener el puesto de la persona
=======================================================================*/
  getDescUserPuesto(event: Event) {
    let userDatos = JSON.parse(JSON.stringify(event));
    this.dynamicCatalogsService
      .getPuestovalue(userDatos.positionKey)
      .subscribe({
        next: resp => {
          this.valueCharge = resp.data.value;
          this.form.get('charge').setValue(resp.data.value);
        },
        error: err => {
          this.form.get('charge').setValue('');
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
  }

  /*====================================================================
             método para mandar a llamar el reporte
=======================================================================*/
  public confirm() {
    const params = {
      PNOOFICIO: this.form.value.expedientNumber,
      PTIPODIC: this.form.value.typeDict,
    };
    this.siabServiceReport.fetchReport('RGENABANDEC', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }
  //======================================================================

  get extPerson(): FormArray {
    return this.form.get('extPerson') as FormArray;
  }

  addExtPersonArray() {
    const filterForm = this.fb.group({
      typePerson: ['', Validators.required],
      senderUser: ['', Validators.required],
      personaExt: ['', Validators.required],
    });
    this.extPerson.push(filterForm);
  }

  deleteExtPerson(indice: number) {
    this.extPerson.removeAt(indice);
  }

  // NO SE USAN PERO HAY QUE REVISAR SU FUNCIONAMIENTO
  //=======================================================================

  loadUserDestinatario() {
    this.usersService.getUsersJob().subscribe({
      next: resp => {
        this.UserDestinatario = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  getPartBodyInputs() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'dictatesNumber',
        this.form.value.registerNumber,
        SearchFilter.EQ
      );
    this.jobDictumTextsServices
      .getAll(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('  jobDictumTextsServices  ');
          console.log(resp.data);
          this.dictatesNumber = resp.data[0].dictatesNumber;
          this.rulingType = resp.data[0].rulingType;
          this.recordNumber = resp.data[0].recordNumber;
          this.form.get('masInfo_1').setValue(resp.data[0].textx);
          this.form.get('masInfo_2').setValue(resp.data[0].textoy);
          this.form.get('masInfo_3').setValue(resp.data[0].textoz);
        },
        error: erro => {
          this.onLoadToast('error', 'Error', erro.error.message);
        },
      });
  }

  insertRegistroExtCCP(data: IDictationCopies) {
    this.dictationService.createPersonExt(data).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  showDeleteAlert(legend: ILegend) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(legend.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    alert('BORRARO ' + id);
    //  this.legendService.remove(id).subscribe({
    //  next: () => this.getDeductives(),
    //});
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean, datos: any) => {
        if (next) {
          this.seteaTabla(datos);
          alert('next' + next + ' ' + datos);
        }
      },
    };
    this.modalService.show(ModalComponent, modalConfig);
  }
  close() {
    this.modalRef.hide();
  }
  seteaTabla(datos: any) {
    let dato = JSON.parse(JSON.stringify(datos));

    let obj: IDictationCopies = {
      id: this.idCopias,
      copyDestinationNumber: this.copyDestinationNumber,
      typeDictamination: this.form.get('typeDict').value,
      recipientCopy: this.form.get('typeDict').value,
      numberOfDicta: this.form.get('registerNumber').value,
      personExtInt: dato.typePerson_I,
      namePersonExt: dato.personaExt_I,
      registerNumber: this.form.get('registerNumber').value,
    };

    this.dataExt.push(obj);
  }
}
