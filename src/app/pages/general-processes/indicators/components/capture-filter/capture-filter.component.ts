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
import { ICaptureDig } from 'src/app/core/models/ms-documents/documents';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'capture-filter',
  templateUrl: './capture-filter.component.html',
  standalone: true,
  imports: [SharedModule],
  styles: [],
})
export class CaptureFilterComponent implements OnInit {
  formCapture: FormGroup;
  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  @Output() consultEmmit = new EventEmitter<any>();
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
  isLoading = false;
  captura: ICaptureDig;
  capturasDig: ICaptureDig[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  // form = this.fb.group({
  //   de: [null, [Validators.required]],
  //   a: [null, [Validators.required]],
  //   fecha: [null, [Validators.required]],
  //   cordinador: [null, [Validators.required]],
  //   usuario: [null, [Validators.required]],
  //   transference: [null, Validators.required],
  //   station: [null, Validators.required],
  //   authority: [null, Validators.required],
  //   clave: [null, [Validators.required]],
  //   tipoVolante: [null, [Validators.required]],
  //   tipoEvento: [null],
  // });
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
      coordinacion_regional: [null],
      cve_oficio_externo: [null],
      no_expediente: [null],
      no_volante: [null],
      no_tramite: [null],
      urecepcion: [null],
      programa: [null],
      finicia: [null],
      fmaxima: [null],
      cumplio: [null],
      tipoVolante: [null],
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

  getAllUsers(params: FilterParams) {
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

    // let params = {
    //   P_T_CUMP: this.formCapture.controls['delegation'].value
    //   P_T_NO_CUMP:
    //     P_CUMP:
    //   P_USR: this.formCapture.controls['delegation'].value
    // };

    // console.log('params', params);

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

  // find(find: ICaptureDig) {
  //   this.documentsService.getDocCapture(find).subscribe({
  //     next: data => {
  //       this.capturasDig = data.data;
  //       this.consultEmmit.emit(this.formCapture);
  //       console.log(this.capturasDig);
  //     },
  //   });
  // }

  find(find: ICaptureDig) {
    let params = new ListParams();
    // params['filter.finicia'] = this.formCapture.controls['finicia'].value;
    // params['filter.fmaxima'] = this.formCapture.controls['fmaxima'].value;
    // params['filter.finingrs'] = this.formCapture.controls['finingrs'].value;
    if (this.formCapture.controls['tipoVolante'].value) {
      params['filter.tipo_volante'] =
        this.formCapture.controls['tipoVolante'].value;
    }
    if (this.formCapture.controls['coordinacion_regional'].value != null) {
      params['filter.coordinacion_regional'] =
        this.formCapture.controls['coordinacion_regional'].value.id;
    }
    // params['filter.urecepcion'] = this.formCapture.controls['urecepcion'].value;
    // params['filter.cve_oficio_externo'] = this.formCapture.controls['cve_oficio_externo'].value;
    // params['filter.no_transferente'] = this.formCapture.controls['transference'].value;
    // params['filter.no_emisora'] = this.formCapture.controls['station'].value;
    // params['filter.no_autoridad'] = this.formCapture.controls['authority'].value;
    console.log('Estos son los parametros: ', params);
    this.consultEmmit.emit(params);
  }

  valid(value: any) {
    if (value == null) {
      return '';
    }
    return value;
  }
}
