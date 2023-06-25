import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/good/good.model';
import { IConvertiongood } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FlyersService } from 'src/app/pages/documents-reception/flyers/services/flyers.service';
import { AddCopyComponent } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/add-copy/add-copy.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IDataGoodsTable } from '../proceedings-conversion-column';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
import {
  PROCEEDINGSCONVERSIONS_COLUMNS,
  PROCEEDINGSCONVERSION_COLUMNS,
} from './proceedings-conversion-columns';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};

export type IDocumentJobManagement = {
  cveDocument: string;
  goodNumber: any;
  managementNumber: string;
  recordNumber: string;
  rulingType: string;
  description?: string;
};
export interface IGoodJobManagement {
  managementNumber: string;
  goodNumber: number;
  recordNumber: string;
  classify: string | number;
  goods: string;
  good: IGood;
}
@Component({
  selector: 'app-proceedings-conversion',
  templateUrl: './proceedings-conversion.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
      .disabled-input {
        color: #939393;
        pointer-events: none;
      }
      #bienesJuridicos table:not(.normal-hover) tbody tr:hover {
        color: black !important;
        font-weight: bold;
      }
    `,
  ],
})
export class ProceedingsConversionComponent extends BasePage implements OnInit {
  // proceedingsConversionForm: ModelForm<any>;
  settings2 = { ...this.settings, actions: false };
  procs: any;
  fCreate: string = '';
  typeConv: number | string = 0;
  actaO: number | string;
  loadingText = '';
  userName: string = '';
  insert = false;
  update = false;
  delete = false;
  statusConv: string | number = '';
  read = false;
  isLoadingSender = false;
  origin = '';
  department = '';
  delegation: string = null;
  data1: any[] = [];
  p_valor: number;
  proceedingsConversionForm: FormGroup;
  dataGoodTable: LocalDataSource = new LocalDataSource();
  // expedientData: IExpedient;
  loadingGoods = false;
  select: any;
  fileNumber: number = 0;
  conversion: number = 0;
  goodFatherNumber: string | number = 0;
  isLoadingGood = false;
  dataTableGoods: IGoodAndAvailable[] = [];
  convertionData: IConvertiongood;
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  dataUserLoggedTokenData: any;
  pageParams: IInitFormProceedingsBody = null;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  loadingSend = false;
  screenKey = 'FACTDBCONVBIEN';
  dataTableGoodsConvertion: IConvertiongood[] = [];
  copyActa: any[] = [];
  dataGoodFilter: IGood[] = [];
  dataGood: IDataGoodsTable[] = [];
  dataTableGoodsJobManagement: IGoodJobManagement[] = [];
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @ViewChild('tableDocs') tableDocs: Ng2SmartTableComponent;

  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  dataGoodsSelected = new Map<number, IGoodAndAvailable>();

  paramsScreen: IParamsProceedingsParamsActasConvertion = {
    PAR_IDCONV: 0, // P_GEST_OK
  };

  isDisabledBtnDocs = false;
  isDisabledBtnPrint = false;
  // Send variables
  blockSend: boolean = false;
  variablesSend = {
    ESTATUS: '',
    PAR_IDCONV: '',
    origin: '',
  };
  senders = new DefaultSelect();
  disabled: boolean = true;
  filtroPersonaExt: ICopiesJobManagementDto[] = [];
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  constructor(
    private authService: AuthService,
    protected flyerService: FlyersService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private router: Router,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private regionalDelegacionService: RegionalDelegationService,
    protected modalService: BsModalService,
    private convertiongoodService: ConvertiongoodService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private securityService: SecurityService,
    protected goodprocessService: GoodProcessService,
    protected serviceOficces: GoodsJobManagementService
  ) {
    super();
    this.procs = new LocalDataSource();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PROCEEDINGSCONVERSION_COLUMNS },
    };
    this.settings2.columns = PROCEEDINGSCONVERSIONS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    const token = this.authService.decodeToken();
    this.dataUserLoggedTokenData = token;
    this.pageParams = this.actasConvertionCommunicationService.actasParams;
    this.pageParams.PAR_IDCONV ||= this.route.snapshot.params?.['PAR_IDCONV'];
    this.route.queryParamMap.subscribe(params => {
      this.origin = params.get('origin');
      console.log(this.origin);
    });
    this.initFormPostGetUserData();
  }

  private prepareForm() {
    this.department = this.authService.decodeToken().department;
    this.userTracker(
      this.screenKey,
      this.authService.decodeToken().preferred_username
    );
    this.proceedingsConversionForm = this.fb.group({
      idConversion: [null, Validators.required],
      goodFatherNumber: [null, Validators.required],
      noExpedient: [null, Validators.required],
      acta: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      preliminaryInquiry: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      criminalCase: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      cveActaConv: [null, Validators.required],
      statusConv: [null, Validators.required],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      conv: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fConversions: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      hourConv: [null, Validators.required],
      fCreate: [null, Validators.required],

      respConv: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      respCharge: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioUniversalAsoc: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userSend: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      areaSend: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateSent: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  exportToExcel() {
    const filename: string = this.userName + '-Actas';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(this.procs['data'], { filename });
  }

  // searchProcs() {
  //   this.params = new BehaviorSubject<ListParams>(new ListParams());
  //   this.params
  //     .pipe(
  //       takeUntil(this.$unSubscribe),
  //       tap(() => this.getProcs())
  //     )
  //     .subscribe();
  // }

  userTracker(screen: string, user: string) {
    let isfilterUsed = false;
    const params = this.params.getValue();
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.securityService.getScreenUser(screen, user).subscribe({
      next: (data: any) => {
        data.data.map((filter: any) => {
          if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'S'
          ) {
            this.read = true;
            this.update = true;
            this.delete = true;
            this.insert = true;
            console.log('readYes and writeYes');
          } else if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'N'
          ) {
            this.read = true;
            console.log('readYes and writeNO');
          } else if (
            filter.readingPermission == 'N' &&
            filter.writingPermission == 'S'
          ) {
            this.insert = true;
            console.log('readNo and writeYes');
          } else {
            this.alert(
              'info',
              'No tiene permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá ingresar',
              ''
            );
            return;
          }
        });
      },
      error: (error: any) => {
        this.alert(
          'info',
          'No tiene permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá ingresar',
          ''
        );
        return;
      },
    });
  }
  execute_PUP_LLAMA_VALIDACION() {
    this.loadingSend = false;
    // Call form FATRIBREQUERIDO
    // this.alertInfo('info', 'Se llama la pantalla FATRIBREQUERIDO', '');
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        NO_INDICADOR: this.convertionData.id,
        // origin2: this.origin,
        // origin3: this.origin3,
        ...this.paramsScreen,
      },
    });
  }

  // private getProcs() {
  //   let isfilterUsed = false;
  //   const params = this.params.getValue();
  //   this.filterParams.getValue().removeAllFilters();
  //   this.filterParams.getValue().page = params.page;
  //   const user = this.authService.decodeToken() as any;
  //   this.proceedingsConversionForm.controls['txtNoDelegacionRegional'].setValue(
  //     Number.parseInt(user.department)
  //   );
  //   this.filterParams.getValue();
  //   const filterStatus = this.proceedingsConversionForm.get('status').value;
  //   // console.log(filterStatus);
  //   if (filterStatus) {
  //     isfilterUsed = true;
  //     if (filterStatus === 'null') {
  //       this.filterParams
  //         .getValue()
  //         .addFilter('Estatus', '', SearchFilter.NULL);
  //       // this.getDelegationRegional(user.department);
  //     }
  //   }
  //   this.loading = true;
  //   params.text = this.proceedingsConversionForm.value.txtSearch;
  //   params['others'] = this.userName;
  //   this.procs = new LocalDataSource();
  //   this.totalItems = 0;
  //   let filter = this.filterParams.getValue().getParams();
  //   console.log(filter);
  //   this.convertiongoodService.getAll(this.params.getValue()).subscribe({
  //     next: response => {
  //       console.log('Response: ', response);
  //       this.loading = false;
  //       console.log('Hay un filtro activo? ', isfilterUsed);
  //       response.data.map((item: any) => {
  //         item.idConversion =
  //           item.idConversion != null ? item.idConversion : this.alert('info', 'No hay Conversiones', '');
  //       });

  //       this.procs.load(response.data);
  //       this.totalItems = response.count;
  //     },
  //     error: () => (
  //       (this.procs = new LocalDataSource()), (this.loading = false)
  //     ),
  //   });
  // }

  initFormPostGetUserData() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(this.paramsScreen);
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin2']
          ? params['origin2']
          : params['origin'] ?? null;
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_IDCONV) {
        this.initForm();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de dictaminaciones
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de dictaminaciones
        } else {
          // this.alertInfo(
          //   'info',
          //   'Error en los paramétros',
          //   'Los paramétros No. Oficio: ' +
          //     this.paramsScreen.P_VALOR +
          //     ' y el Tipo Oficio: ' +
          //     this.paramsScreen.TIPO +
          //     ' al iniciar la pantalla son requeridos'
          // );
        }
      }
    }
  }

  initForm() {
    let body: IInitFormProceedingsBody = {
      PAR_IDCONV: Number(this.paramsScreen.PAR_IDCONV),
    };
    let subscription = this.convertiongoodService
      .getById(body.PAR_IDCONV)
      .subscribe({
        next: (res: IConvertiongood) => {
          console.log('INIT FORM ', res);
          this.fileNumber = res.fileNumber.id;
          this.conversion = res.id;
          this.goodFatherNumber = res.goodFatherNumber;
          this.fCreate = this.datePipe.transform(res.fCreate, 'dd/MM/yyyy');

          this.typeConv = res.typeConv;
          this.statusConv = res.statusConv;
          // this.actaO = res.statusConv;

          console.log(this.fileNumber);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);

          subscription.unsubscribe();
        },
      });
  }

  cleanFilter() {
    this.proceedingsConversionForm.reset();
    this.proceedingsConversionForm.updateValueAndValidity();
    this.proceedingsConversionForm.controls['txtSearch'].setValue('');
    // this.searchProcs();
  }

  goBack() {
    let params = this.actasConvertionCommunicationService.actasParams;
    params = {
      PAR_IDCONV: this.pageParams?.PAR_IDCONV,
    };
    this.actasConvertionCommunicationService.derivationParams = params;
    if (this.origin == 'FACTDBCONVBIEN') {
      this.router.navigateByUrl(
        '/pages/administrative-processes/proceedings-conversion'
      );
    } else {
      this.router.navigate(
        ['/pages/administrative-processes/derivation-goods'],
        {
          queryParams: {
            PAR_IDCONV: this.pageParams.PAR_IDCONV,
          },
        }
      );
    }
  }

  searchProcs() {}
  openDialogSelectedManagement() {}
  // goBack() { }

  async getSenderByDetail(params: ListParams) {
    // this.isLoadingSender = true;
    params.take = 20;
    params['order'] = 'DESC';
    const delegationNumber = this.department;
    params['no_delegacion'] = delegationNumber;
    params['search'] = params['search'] ? params['search'] : '';
    this.convertiongoodService.getRegSender(params).subscribe({
      next: data => {
        console.log(data);
        // let result = data.data.map(item => {
        //   return {
        //     // ...item,
        //     // userAndName: item.usuario + ' - ' + item.nombre,
        //     console.log(item)
        //   };
        // });
        this.senders = new DefaultSelect(data.data, data.count);
        this.isLoadingSender = false;
      },
      error: err => {
        console.log(err);
        this.select = new DefaultSelect([], 0);
        this.isLoadingSender = false;
      },
    });
  }
  openFormCcp(context?: Partial<AddCopyComponent>) {
    const modalRef = this.modalService.show(AddCopyComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataCopy.subscribe((next: any) => {
      // console.log('next', next);

      if (next.typePerson_I == 'I') {
        let array = this.copyActa;
        let arr = [];

        let obj: any = {
          managementNumber: null,
          addresseeCopy: next.senderUser_I,
          delDestinationCopyNumber: null,
          nomPersonExt: null,
          personExtInt: 'I',
          recordNumber: null,
          personExtInt_: 'INTERNO',
          userOrPerson: next.senderUser_I + ' - ' + next.personaExt_I,
        };

        arr.push(obj);
        for (let i = 0; i < array.length; i++) {
          arr.push(array[i]);
        }
        this.copyActa = arr;
      } else if (next.typePerson_I == 'E') {
        let array = this.copyActa;
        let arr = [];

        let obj: any = {
          managementNumber: null,
          addresseeCopy: null,
          delDestinationCopyNumber: null,
          nomPersonExt: next.personaExt_I,
          personExtInt: 'E',
          personExtInt_: 'EXTERNO',
          recordNumber: null,
          userOrPerson: next.personaExt_I,
        };

        arr.push(obj);
        for (let i = 0; i < array.length; i++) {
          arr.push(array[i]);
        }
        this.copyActa = arr;
      }
    });
    modalRef.content.refresh.subscribe((next: any) => {
      this.initForm();
    });
  }

  changeSender(sender: IRSender) {
    console.log({ sender });
    this.proceedingsConversionForm
      .get('delRemNumber')
      .setValue(sender.no_delegacion);

    this.proceedingsConversionForm
      .get('depRemNumber')
      .setValue(sender.no_departamento);
    //TODO: lov remitente
  }
  async getFromSelect(params: ListParams) {
    const senderUser = this.proceedingsConversionForm.value.sender.usuario;
    params['remitente'] = senderUser;
    this.convertiongoodService.getRegAddressee(params).subscribe(
      data => {
        // console.log({ addressee: data });
        let result = data.data.map(item => {
          return {
            ...item,
            userAndName: item.usuario + ' - ' + item.nombre,
          };
        });
        this.select = new DefaultSelect(result, data.count);
      },
      () => {
        this.select = new DefaultSelect();
      }
    );
  }
  refreshTableCopies() {
    this.initForm();
  }

  refreshTableGoods() {
    const params = new ListParams();

    params['filter.fileNumber'] =
      this.proceedingsConversionForm.value.noExpedient;
    // this.getGoods1(params);
  }

  async refreshTableGoodsJobManagement() {
    const params = new ListParams();
    params['filter.id'] = this.proceedingsConversionForm.value.idConversion;
    params.limit = 100000000;
    try {
      this.dataTableGoodsConvertion = (
        await this.getGoodsJobManagement(params)
      ).data;
    } catch (ex) {
      console.log(ex);
    }
  }

  getQueryParams(name: string) {
    return this.route.snapshot.queryParamMap.get(name);
  }
  convertDataGoods(data: { data: any[] }) {
    const _data = data.data.map((data: any) => {
      return {
        goodId: data.no_bien,
        description: data.descripcion,
        quantity: data.cantidad,
        identifier: data.identificador,
        status: data.estatus,
        proceedingsNumber: data.no_expediente,
        goodClassNumber: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        selected: this.dataGoodsSelected.has(data.no_bien),
      };
    });
    return _data;
  }

  convertDataGoodsAvailable(data: any) {
    const _data = data.data.map((data: any) => {
      return {
        goodNumber: data.no_bien,
        goods: data.descripcion,
        classify: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        managementNumber: this.proceedingsConversionForm.value.idConversion,
      };
    });
    return _data;
  }
  // getGoods1(params: ListParams) {
  //   this.isLoadingGood = true;
  //   params['fileNumber'] = this.proceedingsConversionForm.value.noExpedient;
  //   this.goodprocessService.getGoodAvailable(params).subscribe({
  //     next: async (data: { data: any[]; count: number }) => {
  //       this.dataTableGoods = this.convertDataGoods(data);
  //       console.log(`this.dataTableGoods`, this.dataTableGoods);
  //       this.dataTableGoodsMap = new Map<number, IGoodAndAvailable>(
  //         this.dataTableGoods.map(x => [x.goodId, x])
  //       );
  //       this.totalItems = data.count;
  //       this.isLoadingGood = false;
  //     },
  //     error: () => {
  //       this.isLoadingGood = false;
  //     },
  //   });
  // }

  // async getGoodsOnlyAvailable(params: ListParams = new ListParams()) {
  //   this.isLoadingGood = true;
  //   params.limit = this.totalItems;
  //   this.dataTableGoodsJobManagement = [];
  //   params['proceedingsNumber'] = this.formNotification.value.expedientNumber;
  //   try {
  //     const data = await firstValueFrom(
  //       this.goodprocessService.getGoodAvailable(params)
  //     );

  //     this.dataTableGoodsJobManagement = this.convertDataGoodsAvailable(
  //       data
  //     ).filter((x: { available: any }) => x.available);

  //     this.isLoadingGood = false;
  //   } catch (ex) {
  //     this.isLoadingGood = false;
  //     this.alert(
  //       'error',
  //       'Error',
  //       'Error al obtener los bienes disponibles',
  //       'error'
  //     );
  //   }
  // }
  async getAvailableGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    if (this.proceedingsConversionForm.value.idConversion) {
      await this.flyerService
        .getGoodsJobManagementByIds({
          goodNumber: dataGoodRes.goodId,
          managementNumber: this.proceedingsConversionForm.value.idConversion,
        })
        .subscribe({
          next: res => {
            console.log(res);
            if (res.count > 0) {
              this.dataGood[count].disponible = false;
            }
            this.validStatusGood(this.dataGood[count], count, total);
          },
          error: err => {
            console.log(err);
            this.dataGood[count].disponible = true;
            this.validStatusGood(this.dataGood[count], count, total);
          },
        });
    } else {
      this.dataGood[count].disponible = true;
      this.validStatusGood(this.dataGood[count], count, total);
    }
  }

  async validStatusGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodNumber', dataGoodRes.goodId);
    await this.flyerService
      .getGoodExtensionsFields(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data[0].managementJob == '1') {
            this.dataGood[count].seleccion = true;
            this.dataGood[count].improcedente = false;
          } else if (res.data[0].managementJob == '2') {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = true;
          } else {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = false;
          }
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
        error: err => {
          console.log(err);
          this.dataGood[count].seleccion = false;
          this.dataGood[count].improcedente = false;
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
      });
  }
  getGoodsJobManagement(params: ListParams) {
    return firstValueFrom(
      this.serviceOficces.getGoodsJobManagement(params).pipe(
        map(x => {
          return {
            ...x,
            data: x.data.map(item => {
              return {
                ...item,
                goods: item.goodNumber.description,
                classify: item.goodNumber.goodClassNumber,
                goodNumber: item.goodNumber.goodId,
                good: item.goodNumber,
              };
            }),
          } as any;
        })
        // catchError((error, _a) => {
        //   if (error.status >= 400 && error.status < 500) {
        //     // return of(null);
        //     throw error;
        //   }
        //   console.log({ error });
        //   this.alert(
        //     'error',
        //     'Error',
        //     'Error al obtener los bienes de la gestión por favor recarga la página'
        //   );
        //   throw error;
        // })
      )
    );
  }
  reviewGoodData(dataGoodRes: IDataGoodsTable, count: number, total: number) {
    // this.getGoodStatusDescription(dataGoodRes, count, total);
  }
}

export interface IParamsProceedingsParamsActasConvertion {
  PAR_IDCONV: number;
}
export interface IInitFormProceedingsBody {
  PAR_IDCONV: number;
}

export interface IParamsProceedingsParamsDerivationGoods {
  PAR_IDCONV: number;
}
export interface IRSender {
  no_delegacion: string;
  no_departamento: string;
  no_subdelegacion: string;
  nombre: string;
  usuario: string;
}
