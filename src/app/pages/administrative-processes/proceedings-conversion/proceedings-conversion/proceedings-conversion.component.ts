import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  PROCEEDINGSCONVERSIONS_COLUMNS,
  PROCEEDINGSCONVERSION_COLUMNS,
} from './proceedings-conversion-columns';

@Component({
  selector: 'app-proceedings-conversion',
  templateUrl: './proceedings-conversion.component.html',
  styles: [],
})
export class ProceedingsConversionComponent extends BasePage implements OnInit {
  // proceedingsConversionForm: ModelForm<any>;
  settings2 = { ...this.settings, actions: false };
  procs: any;
  loadingText = '';
  userName: string = '';
  origin = '';
  department = '';
  delegation: string = null;
  data1: any[] = [];
  p_valor: number;
  proceedingsConversionForm: FormGroup;
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  dataUserLoggedTokenData: any;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  paramsScreen: IParamsProceedingsCon = {
    PAQUETE: '', // PAQUETE
    P_ID_OK: '', // P_GEST_OK
    NO_EXP: '',
  };
  constructor(
    private authService: AuthService,
    private excelService: ExcelService,
    public router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private regionalDelegacionService: RegionalDelegationService,
    private convertiongoodService: ConvertiongoodService,
    private activatedRoute: ActivatedRoute
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
    console.log(token);
    this.dataUserLoggedTokenData = token;
  }
  private prepareForm() {
    this.userName = this.authService.decodeToken().preferred_username;
    this.department = this.authService.decodeToken().department;
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

  searchProcs() {
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getProcs())
      )
      .subscribe();
  }

  private getProcs() {
    let isfilterUsed = false;
    const params = this.params.getValue();
    console.log(params);
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    const user = this.authService.decodeToken() as any;

    this.proceedingsConversionForm.controls['txtNoDelegacionRegional'].setValue(
      Number.parseInt(user.department)
    );
    console.log(this.proceedingsConversionForm.value);
    this.filterParams.getValue();
    const filterStatus = this.proceedingsConversionForm.get('status').value;
    console.log(filterStatus);
    if (filterStatus) {
      isfilterUsed = true;
      if (filterStatus === 'null') {
        this.filterParams
          .getValue()
          .addFilter('Estatus', '', SearchFilter.NULL);
        // this.getDelegationRegional(user.department);
      }
    }

    console.log(
      'this.filterParams: ',
      this.filterParams.getValue().getParams()
    );

    this.loading = true;
    this.loadingText = 'Cargando';

    params.text = this.proceedingsConversionForm.value.txtSearch;
    params['others'] = this.userName;

    //this.tasks = [];
    this.procs = new LocalDataSource();
    this.totalItems = 0;

    let filter = this.filterParams.getValue().getParams();
    console.log(filter);
    this.convertiongoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log('Response: ', response);
        this.loading = false;
        console.log('Hay un filtro activo? ', isfilterUsed);
        response.data.map((item: any) => {
          item.idConversion = item.id;
          item.fileNumber =
            item.fileNumber != null ? item.fileNumber : item.idConversion;
        });

        this.procs.load(response.data);
        this.totalItems = response.count;
      },
      error: () => (
        (this.procs = new LocalDataSource()), (this.loading = false)
      ),
    });
  }
  getAll() {
    let filter = this.filterParams.getValue().getParams();
    console.log(filter);
    this.convertiongoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log('Response: ', response);
        this.loading = false;
        response.data.map((item: any) => {
          item.idConversion = item.id;
          item.fileNumber =
            item.fileNumber != null ? item.fileNumber : item.idConversion;
        });

        this.procs.load(response.data);
        this.totalItems = response.count;
      },
      error: () => (
        (this.procs = new LocalDataSource()), (this.loading = false)
      ),
    });
  }

  initFormPostGetUserData() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
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
        // this.origin3 = params['origin3'] ?? null;
        // this.TIPO_VO = params['TIPO_VO'] ?? null;
        // this.CONSULTA = params['CONSULTA'] ?? null;
        // this.NO_EXP = params['NO_EXP'] ?? null;
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.P_ID_OK && this.paramsScreen.NO_EXP) {
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
    // if (this.paramsScreen.TIPO == 'RESARCIMIENTO') {
    //   this.form.get('cveOfficeGenerate').enable();
    // } else {
    //   this.form.get('cveOfficeGenerate').disable();
    // }
    let body: IInitFormProceedingsBody = {
      P_ID_OK: Number(this.paramsScreen.P_ID_OK),
      NO_EXP: this.paramsScreen.NO_EXP,
    };
    let subscription = this.convertiongoodService
      .getById(body.P_ID_OK)
      .subscribe({
        next: (res: any) => {
          console.log('INIT FORM ', res);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          // this.alertInfo(
          //   'info',
          //   'Error al cargar la información inicial de la pantalla de acuerdo a los paramétros recibidos',
          //   'No se encontró el identificador'
          // );
          subscription.unsubscribe();
        },
      });
    // this.btnSearchAppointment();
  }

  getDelegationRegional(id: number | string) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.regionalDelegacionService.getAll(params).subscribe({
      next: resp => {
        this.delegation = resp.data[0].id + ' - ' + resp.data[0].description;
      },
      error: error => {
        console.log(error);
      },
    });
  }
  cleanFilter() {
    this.proceedingsConversionForm.reset();
    this.proceedingsConversionForm.updateValueAndValidity();
    this.proceedingsConversionForm.controls['txtSearch'].setValue('');
    this.searchProcs();
  }
}

export interface IParamsProceedingsCon {
  PAQUETE: string;
  P_ID_OK: string;
  NO_EXP: string;
}
export interface IInitFormProceedingsBody {
  NO_EXP: string;
  P_ID_OK: number;
}
