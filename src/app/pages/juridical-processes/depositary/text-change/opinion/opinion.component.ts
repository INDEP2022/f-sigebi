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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BankAccount } from 'src/app/pages/administrative-processes/numerary/tesofe-movements/list-banks/bank';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ModalComponent } from '../modal/modal-component';
import { EXTERNOS_COLUMS } from '../tabla-modal/tableUserExt';
import { TablaOficioModalComponent } from '../tabla-oficio-modal/tabla-oficio-modal.component';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit, OnChanges {
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  /*==================================================*/
  form: FormGroup;
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

  tipoReporteImpresion: string;

  tipoImpresion: string;

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
  year: number;
  SPECIAL_STRINGPATTERN: '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ/s.,-()Üü“”;:]*';
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
    private jobDictumTextsServices: JobDictumTextsService,
    private dictationService_1: DictationService,
    private securityService: SecurityService,
    private notificationService: NotificationService,
    private token: AuthService,
    private segAcessXAreasService: SegAcessXAreasService
  ) {
    super();

    this.settings.columns = EXTERNOS_COLUMS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'left',
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.oficnum != null) {
      this.form.get('expedientNumber').setValue(this.oficnum);
      this.buscardictamen();
    }
  }
  validUserToolbar: any;
  async ngOnInit() {
    await this.prepareForm();
    this.year = new Date().getFullYear();
    console.log('this.token.decodeToken()', this.token.decodeToken());
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'S', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    this.loadUserDestinatario();
    this.validUserToolbar = await this.getRTdictaAarusr(
      this.token.decodeToken().preferred_username,
      1
    );
  }

  async prepareForm() {
    this.form = this.fb.group({
      expedientNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      ],
      registerNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
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
      typeDict_: [
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
      key: [null],
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
  }

  async getRTdictaAarusr(toolbar_user: any, filter: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      if (filter == 1) {
        params['filter.user'] = `$eq:${toolbar_user}`;
        params['filter.reading'] = `$eq:S`;
        params['filter.writing'] = `$eq:S`;
        params['filter.typeNumber'] = `$eq:MODTEXTO`;
      } else {
        params['filter.user'] = `$eq:${toolbar_user}`;
      }

      this.dictationService.getRTdictaAarusr(params).subscribe({
        next: async (resp: any) => {
          console.log('USER', resp);
          if (filter == 1) {
            resolve(1);
          } else {
            resolve(resp.data[0]);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          if (filter == 1) {
            resolve(0);
          } else {
            resolve(null);
          }
          this.loading = false;
          return;
        },
      });
    });
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
            'id',
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
            'typeDictamination',
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
            SearchFilter.ILIKE
          );
      }
    }

    if (this.validUserToolbar > 0) {
      this.filterParamsLocal
        .getValue()
        .addFilter(
          'delegationDictNumber',
          this.token.decodeToken().department,
          SearchFilter.EQ
        );
    } else {
      // Obtener la fecha actual
      const fechaActual = new Date();

      // Obtener el primer día del mes actual
      const primerDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        1
      );

      // Obtener el último día del mes actual
      const ultimoDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        0
      );

      // Formatear las fechas como cadenas de texto en formato ISO
      const primerDiaDelMesString = primerDiaDelMes.toISOString().slice(0, 10);
      const ultimoDiaDelMesString = ultimoDiaDelMes.toISOString().slice(0, 10);

      // Mostrar los resultados
      console.log('El primer día del mes es:', primerDiaDelMesString);
      console.log('El último día del mes es:', ultimoDiaDelMesString);

      this.filterParamsLocal
        .getValue()
        .addFilter(
          'dictDate',
          `${primerDiaDelMesString}','${ultimoDiaDelMesString}`,
          SearchFilter.BTW
        );

      // this.filterParamsLocal
      //   .getValue()
      //   .addFilter('dictDate', this.year + '-01-01' + ',' + this.year + '-12-31', SearchFilter.BTW);

      this.filterParamsLocal
        .getValue()
        .addFilter(
          'delegationDictNumber',
          this.token.decodeToken().department,
          SearchFilter.EQ
        );
    }

    // this.filterParamsLocal
    //   .getValue()
    //   .addFilter(
    //     'dictDate',
    //     new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01' + ',' +
    //     new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-31',
    //     SearchFilter.BTW
    //   );

    //Valida los campos de búsqueda

    if (
      this.form.get('expedientNumber').value ||
      this.form.get('registerNumber').value ||
      this.form.get('wheelNumber').value ||
      this.form.get('typeDict').value ||
      this.form.get('key').value
    ) {
      this.onEnterSearch(this.filterParamsLocal);
      this.verBoton = true;
    } else {
      this.alert('info', 'Se requiere un filtro de búsqueda', '');
    }
  }

  idDict: any;
  keyArmyNumber: any;
  onEnterSearch(filterParams: BehaviorSubject<FilterParams>) {
    let valida: boolean = false;
    this.dictationService
      .findByIdsOficNum(filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('onEnterSearch => ', resp);

          if (resp.count > 1) {
            this.loadModal(2, filterParams);
          } else {
            this.keyArmyNumber = resp.data[0].keyArmyNumber;
            this.intIDictation = resp.data[0];
            this.idDict = this.intIDictation.id;
            this.form
              .get('expedientNumber')
              .setValue(this.intIDictation.expedientNumber);
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
          // if (err.message.indexOf('registros') !== -1) {
          this.onLoadToast('warning', 'No se encontraron registros', '');
          // }
          //   console.log('Error ' + error);
          //  this.onLoadToast('info', 'Registro', 'No se obtuvo información');
          console.log('error', 'Error', err.error.message);
          // this.onLoadToast('error', 'error', err.error.message);
        },
      });
  }

  loadModal(resp: number, filterParams: BehaviorSubject<FilterParams>) {
    this.openModal(resp, filterParams);
  }

  //false dictamen true oficio
  openModal(status: number, OficioOrdictamen: BehaviorSubject<FilterParams>) {
    console.log('MODAL 2=> ' + status);
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    modalConfig.initialState = {
      status,
      OficioOrdictamen,
      callback: (next: any) => {
        const data = JSON.parse(JSON.stringify(next));
        this.idDict = data.id;
        this.form.get('expedientNumber').setValue(data.expedientNumber);
        this.form.get('registerNumber').setValue(data.id);
        this.form.get('wheelNumber').setValue(data.wheelNumber);
        this.form.get('typeDict').setValue(data.typeDict);
        this.form.get('key').setValue(data.passOfficeArmy);
        this.keyArmyNumber = data.keyArmyNumber;
        let obj = {
          officialNumber: this.form.get('registerNumber').value,
          typeDict: this.form.get('typeDict').value,
        };
        this.complementoFormulario(obj);
        this.getPersonaExt_Int('data => ', data);
      },
    };
    this.modalService.show(TablaOficioModalComponent, modalConfig);
  }

  //#################################################################################
  /*================================================================================
carga la  información de la parte media de la página
==================================================================================*/
  oficioDict: any;
  async complementoFormulario(obj: any) {
    this.oficialDictationService.getById(obj).subscribe({
      next: async resp => {
        console.warn('complementoFormulario DICTAMENT : >===>> ', resp);
        this.dictatesNumber = resp.officialNumber;
        this.oficioDict = resp;
        this.form.get('addressee').setValue(resp.recipient);
        this.form.get('senderUserRemitente').setValue(resp.sender);
        const param = new ListParams();
        param.text = resp.sender;
        this.getUsers$(param);

        if (resp.cveChargeRem == null) {
          this.getPuestoUser(resp.cveChargeRem);
        }

        const param_ = new ListParams();
        param_.text = resp.recipient;
        this.getUsers$$(param_);
        this.form.get('typeDict_').setValue(resp.typeDict);
        this.form.get('numberDictamination').setValue(resp.officialNumber);

        this.form.get('paragraphInitial').setValue(resp.text1);
        this.form.get('paragraphFinish').setValue(resp.text2);
        this.form.get('paragraphOptional').setValue(resp.text3);
        this.form.get('masInfo_1').setValue(resp.text2To);
        this.getPersonaExt_Int('resp => ', resp);

        this.getPartBodyInputs();
      },
      error: err => {
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }
        console.log('error', 'Error', err.error.message);
        // this.onLoadToast('info', 'info', error.error.message);
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
        },
        error: err => {
          if (err.message.indexOf('registros') !== -1) {
            // this.onLoadToast('error', 'Error 1 ', err.message);
          }
          /*
          this.onLoadToast(
            'info',
            'Registro',
            'No tiene información asociada con el bloque'
          );*/

          console.log('error', 'Error', err.error.message);
          //this.onLoadToast('error', 'error', error.error.message);
        },
      });
  }

  getPersonaExt_Int(d: string, datos: any) {
    this.filterParams.getValue().removeAllFilters();
    let variable: IDictation = JSON.parse(JSON.stringify(datos));
    this.dataExt = [];
    this.refreshTabla();
    this.filterParams
      .getValue()
      .addFilter('id', this.form.get('expedientNumber').value, SearchFilter.EQ);

    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          let algo = {};
          this.dataExt = resp.data.map((data: any) => this.usuariosCCP(data));
          //this.dataExt = resp.data;
        },
        error: errror => {
          // this.onLoadToast('info', 'Registro', 'No se obtuvo información');
          console.log('error', 'Error', errror.error.message);
          // this.onLoadToast('error', 'Error', errror.error.message);
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
    this.dataExt = [];
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
        // this.onLoadToast('error', 'Error', err.error.message);
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
  nameOfUser: any;
  department: any;
  getAllUsers$(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(async response => {
        this.users$$ = new DefaultSelect(response.data, response.count);
        this.nameOfUser = response.data[0].name;
        console.log('this.nameOfUser', response);
        this.department = await this.getsegAcessXAreasService(
          response.data[0].id
        );
        console.log('this.department', this.department);
        this.getDescUserPuesto2(response.data[0].positionKey);
      })
    );
  }

  getsegAcessXAreasService(user: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.user'] = `$eq:${user}`;
      this.segAcessXAreasService.getAll(params).subscribe({
        next: async (resp: any) => {
          console.log('USER222', resp);
          let result = resp.data.map(async (item: any) => {
            item['departmentD'] = item.departament.description;
          });

          resolve(resp.data[0].departmentD);

          this.loading = false;
        },
        error: err => {
          resolve(null);
          this.loading = false;
          return;
        },
      });
    });
  }

  getUsers$$($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers$$(params).subscribe();
  }

  getAllUsers$$(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        console.log();
        this.users$ = new DefaultSelect(response.data, response.count);
        // this.getDescUserPuesto2(response.data[0].positionKey);
      })
    );
  }

  getDescUserPuesto2(event: any) {
    this.dynamicCatalogsService.getPuestovalue(event).subscribe({
      next: resp => {
        console.log('AQUI', resp);
        // alert('  getDescUserPuesto ' + resp.data.value);
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        let error = '';
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        // } else {
        //   error = err.message;
        // }
        // if (err.message.indexOf('registros') !== -1) {
        //   this.alert('warning',
        //     'No se encontró el puesto del usuario', err.message,
        //   );
        // }
        console.log(error);
        console.log('error Error  =>  ' + error);
      },
    });
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

  async updateDictamen() {
    let actulizacion = '';
    let errorBusqueda = '';
    console.log('this.form', this.form);

    let ofis: any = await this.getDatosToUpdateDictamenBody(this.form);
    let f = this.form;
    let obj = {
      officialNumber: f.value.numberDictamination,
      typeDict: f.value.typeDict_,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      sender: f.value.senderUserRemitente,
      desSenderPa: f.value.addressee,
      text3: f.value.paragraphOptional,
      text2To: f.value.masInfo_1,
      cveChargeRem: f.value.valueCharge,
      recipient: f.value.addressee,
    };
    console.log(' insert =>  ' + ofis);
    this.oficialDictationService.update(obj).subscribe({
      next: resp => {
        this.alert('success', 'Se actualizaron los datos correctamente', '');
        actulizacion = actulizacion + ' Se actualizo';
      },
      error: err => {
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }
        this.alert('error', 'Ocurrió un error al actualizar', '');
        //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
        console.log('error', 'Error', err.error.message);
        // this.onLoadToast('error', 'Error', err.error.message);
      },
    });

    // let data: IJobDictumTexts = await this.getDatosToUpdateDictamenBodyText(this.form);
    let data = {
      dictatesNumber: f.value.registerNumber,
      rulingType: this.form.value.typeDict_,
      textx: this.form.value.masInfo_1_1,
      textoy: this.form.value.masInfo_1_2,
      textoz: this.form.value.masInfo_2,
    };
    console.log('data JO', data);
    this.jobDictumTextsServices.update(data).subscribe({
      next: resp => {
        console.log('!JO', resp);
        actulizacion = actulizacion + ' Se actualizo';
        // this.onLoadToast('success', 'success', resp.message[0]);
      },
      error: err => {
        this.insertTextos(data);
        console.log(err);
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }
      },
    });

    // this.onLoadToast('info', 'Actualización', actulizacion);

    /*
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

 this.dictationService_1.create(obj).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp[0].message);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });*/
    /*
    this.dictationService_1.updateUserByOficNum(obj).subscribe({
      next: resp => {
        console.log(JSON.stringify(resp));
        //this.onLoadToast('warning', 'Info', resp[0].message);
      },
      error: errror => {
        this.insertCopies(obj); 
      },
    });*/
  }

  // UPDATE SILENCIOSO
  async updateDictamen2() {
    let actulizacion = '';
    let errorBusqueda = '';
    console.log('this.form', this.form);
    let ofis: any = await this.getDatosToUpdateDictamenBody(this.form);
    let f = this.form;
    let obj = {
      officialNumber: f.value.numberDictamination,
      typeDict: f.value.typeDict_,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      sender: f.value.senderUserRemitente,
      desSenderPa: f.value.addressee,
      text3: f.value.paragraphOptional,
      text2To: f.value.masInfo_1,
      cveChargeRem: f.value.valueCharge,
      recipient: f.value.addressee,
    };
    console.log(' insert =>  ', ofis);
    this.oficialDictationService.update(obj).subscribe({
      next: resp => {
        actulizacion = actulizacion + ' Se actualizo';
      },
      error: err => {
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }

        //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
        console.log('error', 'Error', err.error.message);
        // this.onLoadToast('error', 'Error', err.error.message);
      },
    });

    // let data: IJobDictumTexts = await this.getDatosToUpdateDictamenBodyText(
    //   this.form
    // );

    let data = {
      dictatesNumber: this.form.value.registerNumber,
      rulingType: this.form.value.typeDict_,
      textx: this.form.value.masInfo_1_1,
      textoy: this.form.value.masInfo_1_2,
      textoz: this.form.value.masInfo_2,
    };
    this.jobDictumTextsServices.update(data).subscribe({
      next: resp => {
        console.log('TEXTOS', resp);
        actulizacion = actulizacion + ' Se actualizo';
        // this.onLoadToast('success', 'success', resp.message[0]);
      },
      error: err => {
        this.insertTextos(data);
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }
      },
    });
  }

  insertCopies(obj: any) {
    this.dictationService_1.create(obj).subscribe({
      next: resp => {
        // this.onLoadToast('warning', 'Info', resp[0].message);
      },
      error: err => {
        //this.onLoadToast('info', 'Registro', 'No se obtuvo información');

        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }

        console.log('error', 'Error', err.error.message);
        // this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  insertTextos(data: IJobDictumTexts) {
    this.jobDictumTextsServices.create(data).subscribe({
      next: resp => {
        // Swal.fire('Se actualizo de manera correcta', '', 'success');
        //this.onLoadToast('success', 'Registro', resp.message[0]);
      },
      error: err => {
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }

        console.log('info', 'Registro', err.error.message);
        /* if (erro.error.message == 'No se encontrarón registros.') {
          this.onLoadToast('info', 'Registro', erro.error.message);
        } else {
          this.onLoadToast('info', 'Registro', erro.error.message);
        }*/
      },
    });
  }

  /*====================================================================
    método para actualizar el dictamen y  la parte de inicio 
=======================================================================*/

  async getDatosToUpdateDictamenBody(f: FormGroup) {
    return {
      officialNumber: f.value.numberDictamination,
      typeDict: f.value.typeDict_,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      recipient: f.value.senderUserRemitente,
      desSenderPa: f.value.addressee,
      text3: f.value.paragraphOptional,
      text2To: f.value.masInfo_1,
      addressee: f.value.addressee,
      cveChargeRem: f.value.valueCharge,
    };
  }

  getDatosToUpdateDictamenBodyText(f: FormGroup) {
    return {
      dictatesNumber: this.form.get('numberDictamination').value,
      rulingType: this.form.get('typeDict').value,
      textx: this.form.get('masInfo_1_1').value,
      textoy: this.form.get('masInfo_1_2').value,
      textoz: this.form.get('masInfo_2').value,
      recordNumber: this.form.get('registerNumber').value,
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
  getDescUserPuesto(event: any) {
    console.log('event', event);
    this.nameOfUser = event.name;
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
          if (err.message.indexOf('registros') !== -1) {
            // this.onLoadToast('error', 'Error 1 ', err.message);
          }

          //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
          /* this.onLoadToast(
            'info',
            'Registro',
            'No existe información asociada con el puesto'
          );*/
          console.log('error', 'Error', err.error.message);
          // this.onLoadToast('error', 'Error', err.error.message);
        },
      });
  }

  /*====================================================================
             método para mandar a llamar el reporte
=======================================================================*/
  async confirm() {
    await this.updateDictamen2();
    await this.reporteExterno();
  }
  // ENDPOINT 1 //
  async getStationClue(expedientNumber: any) {
    return new Promise((resolve, reject) => {
      this.securityService.getStationClue(expedientNumber).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp.data);
        },
        error: err => {
          this.loading = false;
          resolve([]);
        },
      });
    });
  }

  // ENDPOINT 2 //
  async getIdDelegationDelegationForwards(senderUserRemitente: any) {
    return new Promise((resolve, reject) => {
      this.securityService
        .getIdDelegationDelegationForwards(senderUserRemitente)
        .subscribe({
          next: (resp: any) => {
            this.loading = false;
            resolve(resp.data);
          },
          error: err => {
            this.loading = false;
            resolve([]);
          },
        });
    });
  }

  // ENDPOINT 3 //
  async getIdDelegationDelegationAddressee(addressee: any) {
    return new Promise((resolve, reject) => {
      this.securityService
        .getIdDelegationDelegationAddressee(addressee)
        .subscribe({
          next: (resp: any) => {
            this.loading = false;
            resolve(resp.data);
          },
          error: err => {
            this.loading = false;
            resolve([]);
          },
        });
    });
  }

  // ENPOINT 4 //
  async getNotification() {
    const query = `filter.expedientNumber=$eq:${this.form.value.expedientNumber}&filter.wheelNumber=$eq:${this.form.value.wheelNumber}`;
    return new Promise((resolve, reject) => {
      this.notificationService.getAllFilter(query).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // ENDPOINT 5 //
  async getQueryIdenti(params: any) {
    return new Promise((resolve, reject) => {
      this.securityService.getQueryIdenti(params).subscribe({
        next: (resp: any) => {
          this.loading = false;
          console.log('RESPUESTA:', resp);
          if (resp.data.length > 0) {
            resolve(resp.data[0].identi);
          } else {
            resolve('');
          }
        },
        error: err => {
          this.loading = false;
          resolve('');
        },
      });
    });
  }

  async reporteExterno() {
    let params = {
      PDEPARTAMENTO: this.department,
      PELABORO_DICTA: this.nameOfUser,
      POFICIO: this.oficioDict.officialNumber,
      PESTADODICT: this.oficioDict.statusOf,
      PDICTAMEN: this.oficioDict.typeDict,
    };
    console.log('aasd', this.users$$);
    console.log('params', params);
    let vEMISORA: any;
    let vTRANSF: any;
    let vNO_DELDEST: any;
    let vDELEGADEST: any;
    let vNO_DELREM: any;
    let vDELEGAREM: any;
    let vNOTR_FINAL: any;
    let vT_ACTA: string;
    let vDELAGACION: string = '';
    let vCLAVE_ARMADA: string = '';

    // console.log('FORM', this.form.value);

    if (this.form.get('typeDict_').value == 'PROCEDENCIA') {
      const getStationClue: any = await this.getStationClue(
        this.form.value.expedientNumber
      );
      console.log('AQUIIIIIIIIII', getStationClue);
      if (getStationClue.length > 0) {
        vEMISORA = getStationClue[0].nombre_emisora;
        vTRANSF = getStationClue[0].clave_transferente;
      }

      // REMITENTE
      console.log(
        'this.form.value.senderUserRemitente',
        this.form.value.senderUserRemitente
      );
      const getIdDelegationDelegationForwards_: any =
        await this.getIdDelegationDelegationForwards(
          this.form.value.senderUserRemitente
        );
      console.log('AASD2', getIdDelegationDelegationForwards_);
      if (getIdDelegationDelegationForwards_.length > 0) {
        console.log('SI ENTRA1');
        vNO_DELREM = getIdDelegationDelegationForwards_[0].id_delegacion;
        vDELEGAREM = getIdDelegationDelegationForwards_[0].delegacion;
      }

      // DESTINATARIO
      const getIdDelegationDelegationAddressee_: any =
        await this.getIdDelegationDelegationAddressee(
          this.form.value.addressee
        );
      console.log('AASD3', getIdDelegationDelegationAddressee_);
      if (getIdDelegationDelegationAddressee_.length > 0) {
        console.log('SI ENTRA2');
        vNO_DELDEST = getIdDelegationDelegationAddressee_[0].id_delegacion;
        vDELEGADEST = getIdDelegationDelegationAddressee_[0].delegacion;
      }

      // NOTIFICATION
      const getNotification_: any = await this.getNotification();
      console.log('AASD4', getNotification_);
      if (getNotification_.length > 0) {
        vNOTR_FINAL = getNotification_[0].transference;
      }
      this.form.get('key').value;
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();

      let armyKe = 0;
      if (this.keyArmyNumber == null) {
        armyKe = 0;
      } else {
        armyKe = this.keyArmyNumber;
      }
      const ln_oficio = armyKe; // Reemplaza 123 por el valor de LN_OFICIO
      console.log(ln_oficio, 'aaaaaa');
      const ln_oficio_str = ln_oficio.toString(); // Convierte el número a una cadena de caracteres
      // console.log("3", ln_oficio_str)
      // Rellena la cadena de caracteres con ceros a la izquierda hasta que tenga una longitud de 5 caracteres
      const ln_oficio_padded = ln_oficio_str.padStart(5, '0');
      // console.log("2", ln_oficio_padded)
      // Remueve los espacios en blanco a la izquierda de la cadena de caracteres
      const ln_oficio_trimmed = ln_oficio_padded.trimStart();
      // console.log("1", ln_oficio_trimmed)
      if (vNOTR_FINAL == 1 || vNOTR_FINAL == 3) {
        vT_ACTA = 'A';
      } else {
        vT_ACTA = 'RT';
      }

      if (vNO_DELDEST == 0) {
        vDELAGACION = 'CRB';
        if (vTRANSF == 'SAT') {
          vCLAVE_ARMADA = `${vT_ACTA}/${
            vEMISORA == undefined ? ' ' : vEMISORA
          }/ADM/${vDELAGACION}/${vDELAGACION}/${ln_oficio_trimmed}/${year}/${month}`;
        } else {
          vCLAVE_ARMADA = `${vT_ACTA}/${
            vTRANSF == undefined ? ' ' : vTRANSF
          }/ADM/${vDELAGACION}/${vDELAGACION}/${ln_oficio_trimmed}/${year}/${month}`;
        }
      } else {
        console.log('SI ENTRA3', vDELEGADEST);
        vDELAGACION = vDELEGADEST;

        if (vNO_DELREM == 3) {
          if (vNO_DELDEST == 2) {
            vDELAGACION = vDELEGAREM;
          }
        }

        if (vTRANSF == 'SAT') {
          vCLAVE_ARMADA = `${vT_ACTA}/${
            vEMISORA == undefined ? ' ' : vEMISORA
          }/ADM/${vDELAGACION}/${vDELAGACION}/${ln_oficio_trimmed}/${year}/${month}`;
        } else {
          // vCLAVE_ARMADA = `${vT_ACTA}/${(vTRANSF == undefined) ? ' ' : vTRANSF}/ADM/${vDELAGACION}/${vDELAGACION}/?/${year}/${month}`;
          vCLAVE_ARMADA = `${vT_ACTA}/${
            vTRANSF == undefined ? ' ' : vTRANSF
          }/ADM/${vDELAGACION}/${vDELAGACION}/${ln_oficio_trimmed}/${year}/${month}`;
        }
      }
      console.log('vCLAVE_ARMADA', vCLAVE_ARMADA);
    }

    let body = {
      ofDictaNumber: this.form.value.registerNumber,
      typeRuling: this.form.value.typeDict_,
    };

    const VARIABLES: any = await this.getQueryIdenti(body);
    console.log('AASD5 ', VARIABLES);

    let valor1 = VARIABLES.includes('4');
    // REPORTE PROCEDENCIA 1 // ---------------------------------------------------
    if (valor1 == true && this.form.value.typeDict_ == 'PROCEDENCIA') {
      let params = {
        PDEPARTAMENTO: this.department,
        PELABORO_DICTA: this.nameOfUser,
        POFICIO: this.oficioDict.officialNumber,
        PESTADODICT: this.oficioDict.statusOf,
        PDICTAMEN: this.oficioDict.typeDict,
        NOME_DICTPRO: vCLAVE_ARMADA,
      };

      await this.reporteProcedencia1(params);
      // this.alert('success', 'bien1', '');
    } // --------------------------------------------------------------------------

    let valor2 = VARIABLES.includes('4');
    // REPORTE PROCEDENCIA 2 // ---------------------------------------------------
    if (valor2 == true && this.form.value.typeDict_ != 'PROCEDENCIA') {
      let params = {
        PDEPARTAMENTO: this.department,
        PELABORO_DICTA: this.nameOfUser,
        POFICIO: this.oficioDict.officialNumber,
        PESTADODICT: this.oficioDict.statusOf,
        PDICTAMEN: this.oficioDict.typeDict,
        NOME_DICTPRO: vCLAVE_ARMADA,
      };

      await this.reporteProcedencia2(params);
    } // --------------------------------------------------------------------------

    let valor3 = VARIABLES.includes('A');
    // REPORTE PROCEDENCIA 3 // ---------------------------------------------------
    if (valor3 == true && this.form.value.typeDict_ != 'ABANDONO') {
      let params: any = {
        PDEPARTAMENTO: this.department,
        PELABORO_DICTA: this.nameOfUser,
        POFICIO: this.oficioDict.officialNumber,
        PESTADODICT: this.oficioDict.statusOf,
        PDICTAMEN: this.oficioDict.typeDict,
      };
      if (this.form.value.typeDict == 'PROCEDENCIA') {
        params.NOME_DICTPRO = vCLAVE_ARMADA;
      }

      await this.reporteProcedencia3(params);
    } // --------------------------------------------------------------------------

    let valor4 = VARIABLES.includes('T');
    // REPORTE PROCEDENCIA 4 // ---------------------------------------------------
    if (valor4 == true && this.form.value.typeDict_ != 'ABANDONO') {
      let params: any = {
        PDEPARTAMENTO: this.department,
        PELABORO_DICTA: this.nameOfUser,
        POFICIO: this.oficioDict.officialNumber,
        PESTADODICT: this.oficioDict.statusOf,
        PDICTAMEN: this.oficioDict.typeDict,
      };
      if (this.form.value.typeDict == 'PROCEDENCIA') {
        params.NOME_DICTPRO = vCLAVE_ARMADA;
      }
      await this.reporteProcedencia3(params);
    } // --------------------------------------------------------------------------
    // REPORTE ABANDONO //
    if (this.form.value.typeDict_ == 'ABANDONO') {
      await this.reporteAbandono(this.form.value);
    } // --------------------------------------------------------------------------
  }

  async reporteProcedencia1(params: any) {
    this.siabServiceReport
      .fetchReport('RGENADBDICTAMASIV_EXT', params)
      .subscribe({
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
    this.onLoadToast('success', 'Reporte Generado', '');
  }

  async reporteProcedencia2(params: any) {
    this.siabServiceReport.fetchReport('RGENADBDICTAMASIV', params).subscribe({
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
    this.onLoadToast('success', 'Reporte Generado', '');
  }

  async reporteProcedencia3(params: any) {
    this.siabServiceReport.fetchReport('RGENADBDICTAMASIV', params).subscribe({
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
    this.onLoadToast('success', 'Reporte Generado', '');
  }

  async reporteProcedencia4(params: any) {
    this.siabServiceReport.fetchReport('RGENADBDICTAMASIV', params).subscribe({
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
    this.onLoadToast('success', 'Reporte Generado', '');
  }

  async reporteAbandono(data: any) {
    let params = {
      // PNOOFICIO: 53,
      PNOOFICIO: parseInt(data.registerNumber),
      PTIPODIC: data.typeDict_,
    };
    console.log('params AQUI', params);
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
    this.onLoadToast('success', 'Reporte Generado', '');
  }

  reporteInterno() {
    const params = {
      no_of_ges: this.form.value.managementNumber,
    };

    this.siabServiceReport.fetchReport('RGEROFGESTION', params).subscribe({
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
        if (err.message.indexOf('registros') !== -1) {
          // this.onLoadToast('error', 'Error 1 ', err.message);
        }

        //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
        console.log('error', 'Error', err.error.message);
        /*  let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }*/
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
          this.form.get('masInfo_1_1').setValue(resp.data[0].textx);
          this.form.get('masInfo_1_2').setValue(resp.data[0].textoy);
          this.form.get('masInfo_2').setValue(resp.data[0].textoz);
        },
        error: err => {
          //this.onLoadToast('info', 'info', 'No existen registros');
          //this.onLoadToast('error', 'Error', erro.error.message);
          /* this.onLoadToast(
            'info',
            'Registro',
            'No existe información asociada con el bloque de texto'
          );*/

          if (err.message.indexOf('registros') !== -1) {
            this.onLoadToast('error', 'Error 1 ', err.message);
          }

          console.log('error', 'Error', err.error.message);
        },
      });
  }

  insertRegistroExtCCP(data: any) {
    this.dataExt = [];
    this.dictationService_1.createPersonExt(data).subscribe({
      next: resp => {
        this.alert('success', 'Se creó correctamente el usuario', '');
        this.refreshTabla();
      },
      error: err => {
        this.onLoadToast('error', 'Error al guardar', err.error.message);
        this.refreshTabla();
        console.log('error', 'Error', err.error.message);
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
        this.deleteExterno(legend.id);
      }
    });
  }

  deleteExterno(id: number) {
    let idd = {
      id: id,
    };
    this.dictationService.deleteCopiesdictamenetOfficialOpinion(idd).subscribe({
      next: resp => {
        this.alert('success', 'Dato eliminado correctamente', '');
        this.extPerson.removeAt(id);
        this.refreshTabla();
      },
      error: err => {
        // if (err.message.indexOf('registros') !== -1) {
        this.onLoadToast('error', 'Error al eliminar', err.error.message);
        // }

        //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
        console.log('error', 'Error', err.error.message);
        // this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean, datos: any) => {
        if (next) {
          this.seteaTabla(datos);
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
    // let obj: any;

    if (datos.typePerson_I == 'I') {
      let obj: any = {
        numberOfDicta: this.idDict,
        typeDictamination: this.form.get('typeDict_').value,
        recipientCopy: datos.senderUser_I,
        copyDestinationNumber: null,
        recordNumber: null,
        personExtInt: datos.typePerson_I,
        namePersonExt: null,
      };
      this.insertRegistroExtCCP(obj);
    } else if (datos.typePerson_I == 'E') {
      let obj: any = {
        numberOfDicta: this.idDict,
        typeDictamination: this.form.get('typeDict_').value,
        recipientCopy: null,
        copyDestinationNumber: null,
        recordNumber: null,
        personExtInt: datos.typePerson_I,
        namePersonExt: datos.personaExt_I,
      };
      console.log('obj', obj);
      this.insertRegistroExtCCP(obj);
    }

    // let obj: IDictationCopies = {
    //   numberOfDicta: this.form.get('registerNumber').value,
    //   typeDictamination: this.form.get('typeDict').value,
    //   recipientCopy: dato.typePerson_I,
    //   copyDestinationNumber: 0,
    //   personExtInt: dato.typePerson_I,
    //   namePersonExt: dato.personaExt_I,
    //   registerNumber: this.form.get('registerNumber').value,
    // };

    // this.refreshTabla();
  }

  refreshTabla() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'numberOfDicta',
        this.form.get('registerNumber').value,
        SearchFilter.EQ
      );
    this.filterParams
      .getValue()
      .addFilter(
        'typeDictamination',
        this.form.get('typeDict_').value,
        SearchFilter.EQ
      );

    console.log(
      'refreshTabla() => ' + this.filterParams.getValue().getParams()
    );
    this.dataExt = [];
    this.dictationService
      .findUserByOficNum(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          let result = resp.data.map(async (data: any) => {
            if (data.personExtInt == 'I') {
              data['personExtInt_'] = 'INTERNO';
              data['userOrPerson'] = await this.getSenders2OfiM2___(
                data.recipientCopy
              );
            } else if (data.personExtInt == 'E') {
              data['personExtInt_'] = 'EXTERNO';
              data['userOrPerson'] = data.namePersonExt;
            }
          });

          Promise.all(result).then(async (data: any) => {
            this.dataExt = resp.data;
          });

          // console.log('RESP', resp);
          // this.dataExt = resp.data.map((data: any) => this.usuariosCCP(data));

          // console.log('refreshTabla() => ' + JSON.stringify(this.dataExt));
        },
        error: err => {
          if (err.message.indexOf('registros') !== -1) {
            // this.onLoadToast('error', 'Error 1 ', err.message);
          }
          console.log('Error ' + err);
          //this.onLoadToast('info', 'Registro', 'No se obtuvo información');
          console.log('error', 'Error', err.error.message);
          // this.onLoadToast('error', 'Error', errror.error.message);
        },
      });
  }

  async getSenders2OfiM2___(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe(
        (data: any) => {
          // this.formCcpOficio.get('nombreUsuario2').setValue(data.data[0]);
          console.log('COPYY2', data);
          let result = data.data.map(async (item: any) => {
            item['userAndName'] = item.user + ' - ' + item.name;
          });

          resolve(data.data[0].userAndName);

          this.loading = false;
        },
        error => {
          resolve(null);
          // this.senders = new DefaultSelect();
        }
      );
    });
  }

  usuariosCCP(obj: IDictationCopies) {
    return {
      id: obj.id,
      numberOfDicta: obj.numberOfDicta,
      typeDictamination: obj.typeDictamination,
      recipientCopy: obj.recipientCopy,
      copyDestinationNumber: obj.copyDestinationNumber,
      personExtInt: obj.personExtInt == 'I' ? 'INTERNO' : 'EXTERNO',
      namePersonExt: obj.namePersonExt,
      registerNumber: obj.registerNumber,
    };
  }
}
