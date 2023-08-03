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
import { ICaptureDigFilter } from 'src/app/core/models/ms-documents/documents';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { LocalListParamsTest } from 'src/app/core/services/goodsquery/goods-query.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-capture-filter-history-indicators',
  templateUrl: './capture-filter-history-indicators.component.html',
  styles: [],
})
export class CaptureFilterHistoryIndicatorsComponent implements OnInit {
  formCapture: FormGroup;
  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  @Output() consultEmmit = new EventEmitter<any>();
  @Output() dateFinicia = new EventEmitter<string>();
  delegations = new DefaultSelect();
  affairName = new DefaultSelect();
  station = new DefaultSelect();
  authority = new DefaultSelect();
  transference = new DefaultSelect();
  users$ = new DefaultSelect<ISegUsers>();
  dictNumber: string | number = undefined;
  maxDate = new Date();
  from: string = '';
  to: string = '';
  activeRadio: boolean = true;
  isLoading = false;
  captura: ICaptureDigFilter;
  capturasDig: ICaptureDigFilter[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());

  flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T'];
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
    private documentsService: DocumentsService,
    private delegationService: DelegationService,
    private affairService: AffairService,
    private stationService: StationService,
    private issuingInstitutionService: IssuingInstitutionService,
    private authorityService: AuthorityService,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  cleanForm() {
    this.formCapture.reset();
  }
  prepareForm() {
    this.formCapture = this.fb.group({
      finicia: [null],
      finmaxima: [null],
      finingrs: [null],
      fecStart: [null],
      tipoVolante: [null],
      // tipoEvento: [null],
      coordinacion_regional: [null],
      urecepcion: [null],
      cve_asunto: [null],
      transference: [null],
      station: [null],
      authority: [null],
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
          this.formCapture.get('urecepcion').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  Generar() {
    this.isLoading = true;
    this.from = this.datePipe.transform(
      this.formCapture.controls['from'].value,
      'dd/MM/yyyy'
    );

    this.to = this.datePipe.transform(
      this.formCapture.controls['to'].value,
      'dd/MM/yyyy'
    );

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

  find() {
    const params = new LocalListParamsTest();

    const controlParamMap: any = {
      finicia: 'filter.finicia',
      finmaxima: 'filter.fmaxima',
      finingrs: 'filter.fescaneo',
      tipoVolante: 'filter.tipo_volante',
      coordinacion_regional: 'filter.coordinacion_regional',
      urecepcion: 'filter.urecepcion',
      cve_asunto: 'filter.cve_asunto',
      transference: 'filter.no_transferente',
      station: 'filter.no_emisora',
      authority: 'filter.no_autoridad',
    };
    for (const controlName in controlParamMap) {
      if (this.formCapture.controls[controlName].value != null) {
        const value = controlName.includes('fin')
          ? this.convertDate(this.formCapture.controls[controlName].value)
          : this.formCapture.controls[controlName].value;
        params[controlParamMap[controlName]] =
          value?.id || value?.idAuthority || value || this.convertDate(value);
      }
    }
    this.consultEmmit.emit(params);
    this.dateFinicia.emit(this.formCapture.controls['finicia'].value);
  }

  valid(value: any) {
    if (value == null) {
      return '';
    }
    return value;
  }

  convertDate(value: string) {
    let date: string;
    date = this.datePipe.transform(value, 'yyyy-MM-dd');
    return date;
  }
}
