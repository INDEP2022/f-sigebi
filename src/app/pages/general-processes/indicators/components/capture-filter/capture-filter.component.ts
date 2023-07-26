import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICaptureDigFilter } from 'src/app/core/models/ms-documents/documents';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import * as XLSX from 'xlsx';

interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
}

@Component({
  selector: 'capture-filter',
  templateUrl: './capture-filter.component.html',
  standalone: true,
  imports: [SharedModule],
  styles: [],
})
export class CaptureFilterComponent extends BasePage implements OnInit {
  formCapture: FormGroup;

  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  @Output() consultEmmit = new EventEmitter<any>();
  @Input() P_T_CUMP: number;
  @Input() P_T_NO_CUMP: number;
  @Input() P_CUMP: number;

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
  dictNumber: string | number = undefined;
  maxDate = new Date();
  from: string = '';
  to: string = '';
  activeRadio: boolean = true;
  isLoading = false;
  search: ICaptureDigFilter;
  capturasDig: ICaptureDigFilter[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  titelFileForfeiture: string = 'Nombre del Archivo Excel(CapturayDigital)';
  dataDelivery: any[] = [];
  selectedItems: any[] = [];

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

  flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T  '];
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
    private delegationService: DelegationService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private affairService: AffairService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    // this.stationService.getAll().subscribe({
    //   next: data => {
    //     this.stationName = data.data[0].stationName;
    //   },
    //   error: error => {
    //     this.stationName = '';
    //   },
    // });

    // this.authorityService.getAll().subscribe({
    //   next: data => {
    //     this.authorityName = data.data[0].authorityName;
    //   },
    //   error: error => {
    //     this.authorityName = '';

    //   },
    // });
  }

  cleanForm() {
    this.formCapture.reset();
  }
  prepareForm() {
    this.formCapture = this.fb.group({
      finicia: [null],
      fmaxima: [null],
      finingrs: [null],
      fecStart: [null],
      fecEnd: [null],
      typeSteering: [null],
      noTransfere: [null],
      noStation: [null],
      noAuthority: [null],
      file1: [null],
    });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: res => (this.delegations = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.delegations = new DefaultSelect([], 0);
      },
    });
  }
  // getDelegations(params: ListParams) {
  //   this.delegationService.getAll(params).subscribe({
  //     next: res => (this.delegations = new DefaultSelect(res.data, res.count)),
  //     error: () => {
  //       this.delegations = new DefaultSelect([], 0);
  //     },
  //   });
  // }

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
  // getSubjects(params: ListParams) {
  //   this.affairService.getAll(params).subscribe({
  //     next: data => {
  //       this.affairName = new DefaultSelect(data.data, data.count);
  //     },
  //     error: () => {
  //       this.affairName = new DefaultSelect();
  //     },
  //   });
  // }

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

  // getStation(params: ListParams) {
  //   this.stationService.getAll(params).subscribe({
  //     next: data => {
  //       this.station = new DefaultSelect(data.data, data.count);
  //     },
  //     error: () => {
  //       this.station = new DefaultSelect();
  //     },
  //   });
  // }
  // getAuthority(params: ListParams) {
  //   this.authorityService.getAll(params).subscribe({
  //     next: data => {
  //       this.authority = new DefaultSelect(data.data, data.count);
  //     },
  //     error: () => {
  //       this.authority = new DefaultSelect();
  //     },
  //   });
  // }
  getAuthority(idTransferent: number, idStation: number, idAuthority: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idStation'] = `$eq:${idStation}`;
      params['filter.idTransferer'] = `$eq:${idTransferent}`;
      params['filter.idAuthority'] = `$eq:${idAuthority}`;
      this.authorityService.getAll(params).subscribe({
        next: data => {
          this.authorityName = data.data[0].authorityName;
          resolve(true);
        },
        error: error => {
          this.authorityName = '';
          resolve(true);
        },
      });
    });
  }

  getStation(idTransferent: number, idStation: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${idStation}`;
      params['filter.idTransferent'] = `$eq:${idTransferent}`;
      this.stationService.getAll(params).subscribe({
        next: data => {
          this.stationName = data.data[0].stationName;
          resolve(true);
        },
        error: error => {
          this.stationName = '';
          resolve(true);
        },
      });
    });
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.formCapture.controls['urecepcion'].value;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: any) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.formCapture.get('urecepcion').value;
          const data = response.data.filter(m => m.id == name);
          console.log(data);
          this.formCapture.get('urecepcion').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  Generar() {
    this.isLoading = true;
    // this.consultEmmit.emit(this.formCapture);
    let params = {
      P_T_CUMP: this.P_T_CUMP,
      P_T_NO_CUMP: this.P_T_NO_CUMP,
      P_CUMP: this.P_CUMP,
      P_USR: this.formCapture.controls['user'].value,
    };

    console.log('params', params);

    this.siabService
      // .fetchReport('RGERADBCONCNUMEFE', params)
      .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
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
    this.search = {
      cvCoors: this.idDelegation,
      cveJobExternal: this.formCapture.value.cveJobExternal,
      user: this.formCapture.value.user,
      typeSteering: this.formCapture.value.typeSteering,
      fecStart: this.from,
      fecEnd: this.to,
      noTransfere: this.formCapture.value.noTransfere,
      noStation: this.formCapture.value.noStation,
      noAuthorityts: this.formCapture.value.noStation,
    };
    this.consultEmmit.emit(this.search);
  }

  onFileChangeDelivery(event: Event) {
    this.exportExcel();
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataDelivery, {
      skipHeader: true,
    });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
    this.cleanPlaceholder('nameFileA', 'reporteindicator.xlsx');
    XLSX.writeFile(workBook, 'reporteindicator.xlsx');
  }

  cleanPlaceholder(element: string, newMsg: string) {
    const nameFile = document.getElementById(element) as HTMLInputElement;
    nameFile.placeholder = `${newMsg}`;
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
      console.log('data excel: ', this.data);
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const archivo = files[0];
    this.titelFileForfeiture = archivo.name;
    this.showFileErrorMessage2 = false;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  onItemsSelected() {
    console.log(this.selectedItems);
  }
}
