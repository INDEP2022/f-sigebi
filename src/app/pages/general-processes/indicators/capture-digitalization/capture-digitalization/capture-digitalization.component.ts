import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import {
  ICaptureDigFilter,
  Info,
} from 'src/app/core/models/ms-documents/documents';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS } from './capture-digitalization-columns';

interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
}

@Component({
  selector: 'app-capture-digitalization',
  templateUrl: './capture-digitalization.component.html',
  styles: [],
})
export class CaptureDigitalizationComponent extends BasePage implements OnInit {
  // data = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA;
  formCapture: FormGroup;
  dataFactCapt: LocalDataSource = new LocalDataSource();
  totalItemsCaptura = 0;
  userName: string;
  captura: ICaptureDigFilter;
  capturasDig: ICaptureDigFilter[] = [];
  info: Info;
  nombreUser: string = '';
  flyerTypes: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  P_T_CUMP: number = 0;
  P_T_NO_CUMP: number = 0;
  P_CUMP: number = 0;
  delegations = new DefaultSelect();
  data: IExcelToJson[] = [];
  authorityName: string = '';
  stationName: string = '';
  affairName = new DefaultSelect();
  station = new DefaultSelect();
  reporte_flag: boolean = false;
  idDelegation: number[] = [];
  showFileErrorMessage2 = false;
  authority = new DefaultSelect();
  transference = new DefaultSelect();
  users$ = new DefaultSelect<ISegUsers>();
  delegations$ = new DefaultSelect<IDelegation>();
  dictNumber: string | number = undefined;
  maxDate = new Date();
  from: string = '';
  to: string = '';
  isData: boolean = true;
  activeRadio: boolean = true;
  isLoading = false;
  search: ICaptureDigFilter;
  titelFileForfeiture: string = 'Nombre del Archivo Excel(CapturayDigital)';
  dataDelivery: any[] = [];
  selectedItems: any[] = [];
  formExcel: FormGroup;
  get cvCoors() {
    return this.formCapture.get('cvCoors');
  }
  get cveJobExternal() {
    return this.formCapture.get('cveJobExternal');
  }
  get user() {
    return this.formCapture.get('user');
  }
  get fecStart() {
    return this.formCapture.get('fecStart');
  }
  get fecEnd() {
    return this.formCapture.get('fecEnd');
  }
  get tipoVolante() {
    return this.formCapture.get('tipoVolante');
  }
  get noTransfere() {
    return this.formCapture.get('noTransfere');
  }
  get noStation() {
    return this.formCapture.get('noStation');
  }
  get noAuthority() {
    return this.formCapture.get('noAuthority');
  }

  eventTypes = [
    'Entrega-Comercialización',
    'Entrega-Donación',
    'Entrega-Destrucción',
    'Entrega-Devolución',
    'Recepción Física',
    'Entrega',
  ];

  select = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private documentsService: DocumentsService,
    private stationService: StationService,
    private issuingInstitutionService: IssuingInstitutionService,
    private authorityService: AuthorityService,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private token: AuthService,
    private delegationService: DelegationService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private affairService: AffairService
  ) {
    super();
    this.userName = this.token.decodeToken().username;
    this.flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T  '];
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: {
        ...GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS,
      },
      noDataMessage: 'No se encontraron registros',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.dataFactCapt
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'preliminaryInquiry' ||
            filter.field == 'criminalCase' ||
            filter.field == 'expedientType' ||
            filter.field == 'stateCode' ||
            filter.field == 'expedientStatus' ||
            filter.field == 'stationNumber' ||
            filter.field == ' authorityNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.find();
        }
      });
  }
  cleanForm() {
    this.formCapture.reset();
    this.capturasDig = [];
    this.nombreUser = '';
    this.P_T_CUMP = 0;
    this.P_T_NO_CUMP = 0;
    this.P_CUMP = 0;
    this.dataFactCapt = new LocalDataSource();
  }

  getEvent() {
    this.flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T  '];
  }
  prepareForm() {
    this.formCapture = this.fb.group({
      cvCoors: [null],
      cveJobExternal: [null],
      user: [null],
      fecStart: [null],
      fecEnd: [null],
      typeSteering: [null],
      noTransfere: [null],
      noStation: [null],
      noAuthority: [null],
      file1: [null],
    });
  }

  excelPrepareForm() {
    this.formExcel = this.fb.group({
      file1: [null, [Validators.required]],
    });
  }
  getDelegations(params: FilterParams) {
    // this.delegationService.getAll(params).subscribe({
    //   next: res => {
    //     this.delegations = new DefaultSelect(res.data, res.count);
    //     const name = this.formCapture.get('cvCoors').value;
    //     const data = res.data.filter(m => m.id == name);
    //     console.log(data[0]);
    //     this.formCapture.get('cvCoors').patchValue(data[0]);
    //   },

    //   error: () => {
    //     this.delegations = new DefaultSelect([], 0);
    //   },
    // });
    return this.delegationService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.delegations$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.formCapture.get('cvCoors').value;
          const data = response.data.filter(m => {
            return m.id;
          });
          console.log(data[0]);
          this.formCapture.get('cvCoors').patchValue(data[0]);
        }
        this.delegations$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  getSubjects(params: ListParams) {
    this.affairService.getAll(params).subscribe({
      next: data => {
        this.affairName = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.affairName = new DefaultSelect();
      },
    });
  }

  getTransference(params: ListParams) {
    this.issuingInstitutionService.getTransfers(params).subscribe({
      next: data => {
        this.transference = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.transference = new DefaultSelect();
      },
    });
  }

  getStation(params: ListParams) {
    this.stationService.getAll(params).subscribe({
      next: data => {
        this.station = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.station = new DefaultSelect();
      },
    });
  }
  getAuthority(params: ListParams) {
    this.authorityService.getAll(params).subscribe({
      next: data => {
        this.authority = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authority = new DefaultSelect();
      },
    });
  }
  // getAuthority(idTransferent: number, idStation: number, idAuthority: number) {
  //   return new Promise((resolve, reject) => {
  //     const params = new ListParams();
  //     params['filter.idStation'] = `$eq:${idStation}`;
  //     params['filter.idTransferer'] = `$eq:${idTransferent}`;
  //     params['filter.idAuthority'] = `$eq:${idAuthority}`;
  //     this.authorityService.getAll(params).subscribe({
  //       next: data => {
  //         this.authorityName = data.data[0].authorityName;
  //         resolve(true);
  //       },
  //       error: error => {
  //         this.authorityName = '';
  //         resolve(true);
  //       },
  //     });
  //   });
  // }

  // getStation(idTransferent: number, idStation: number) {
  //   return new Promise((resolve, reject) => {
  //     const params = new ListParams();
  //     params['filter.id'] = `$eq:${idStation}`;
  //     params['filter.idTransferent'] = `$eq:${idTransferent}`;
  //     this.stationService.getAll(params).subscribe({
  //       next: data => {
  //         this.stationName = data.data[0].stationName;
  //         resolve(true);
  //       },
  //       error: error => {
  //         this.stationName = '';
  //         resolve(true);
  //       },
  //     });
  //   });
  // }
  getDels($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.formCapture.controls['cvCoors'].value;
    params.search = $params.text;
    this.getDelegations(params).subscribe();
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.formCapture.controls['user'].value;
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
        if (response.count > 0) {
          const name = this.formCapture.get('user').value;
          const data = response.data.filter(m => {
            m.id == name;
          });
          console.log(data[0]);
          this.formCapture.get('user').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  Generar() {
    this.loading = true;
    if (this.formCapture.value.user == null && this.capturasDig.length == 0) {
      this.alert(
        'info',
        'Debe seleccionar un usuario para generar reporte',
        ''
      );
      return;
    }

    let params = {
      P_T_CUMP: this.P_T_CUMP,
      P_T_NO_CUMP: this.P_T_NO_CUMP,
      P_CUMP: this.P_CUMP,
      P_USR: this.formCapture.value.user,
    };

    console.log('params', params);

    this.siabService
      .fetchReport('RINDICA_0001', params)
      // .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
          this.loading = false;
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          this.loading = false;
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
  getTotalDelegation() {
    for (let item of this.formCapture.value.cvCoors) {
      this.idDelegation.push(parseInt(item));
    }
  }

  find() {
    this.loading = true;
    this.from = this.datePipe.transform(
      this.formCapture.controls['fecStart'].value,
      'yyyy-MM-dd'
    );

    this.to = this.datePipe.transform(
      this.formCapture.controls['fecEnd'].value,
      'yyyy-MM-dd'
    );
    const cvCoorsId: number[] = [];
    // this.delegations.forEach(p => {
    //   cvCoorsId.push(p.id);
    // });
    // const cvCoorsId: number[] = this.idDelegation.map(opcion => opcion.delegationId);
    this.search = {
      cvCoors: cvCoorsId,
      cveJobExternal: this.formCapture.value.cveJobExternal,
      user: this.formCapture.value.user,
      typeSteering: this.formCapture.value.typeSteering,
      fecStart: this.from,
      fecEnd: this.to,
      noTransfere: this.formCapture.value.noTransfere,
      noStation: this.formCapture.value.noStation,
      noAuthorityts: this.formCapture.value.noStation,
    };
    this.documentsService
      .getDocCaptureFind(this.search, this.params.getValue())
      .subscribe({
        next: data => {
          this.loading = false;
          this.capturasDig = data.result;
          console.log(this.capturasDig);
          let noCumple = data.result.filter(
            (elemento: any) => elemento.cumplio == 0
          );
          let cumple = data.result.filter(
            (elemento: any) => elemento.cumplio == 1
          );
          this.P_T_CUMP = cumple.length;
          this.P_T_NO_CUMP = noCumple.length;
          this.P_CUMP = (this.P_T_CUMP / data.result.length) * 100;
          this.dataFactCapt.load(data.result);
          this.totalItemsCaptura = data.count;
          console.log(this.totalItemsCaptura);
          this.loading = false;
          this.dataFactCapt.refresh();
          // this.P_T_NO_CUMP = data.info.total_no_cumplio;
          // this.P_T_CUMP = data.info.total_cumplio;
          // this.P_CUMP = data.info.porcen_cumplidos;
        },
        error: () => {
          this.loading = false;
          this.isData = false;
          this.capturasDig = [];
          this.nombreUser = '';
          this.dataFactCapt.refresh();
        },
      });
  }

  exportToExcel() {
    this.isLoading = true;
    if (this.capturasDig.length == 0) {
      this.alert('info', 'No hay información para descargar', '');
      return;
    }
    const filename: string = this.userName + '-CapturaYdigita';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.loading = false;
    this.excelService.export(this.capturasDig, { filename });
  }

  onItemsSelected() {
    console.log(this.selectedItems);
  }
  goBack() {}
}
