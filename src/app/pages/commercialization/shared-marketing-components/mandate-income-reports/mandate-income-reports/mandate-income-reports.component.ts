import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { data } from './data';
//XLSX
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ExcelService } from 'src/app/common/services/excel.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-mandate-income-reports',
  templateUrl: './mandate-income-reports.component.html',
  styles: [],
})
export class MandateIncomeReportsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  dataOI: any[] = data;
  selectedRows: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //Range Picker
  dateSelected?: (Date | undefined)[];
  selectedClass: any[] = [];
  maxDate = new Date(new Date().getFullYear(), 11);
  minDate = new Date(new Date().getFullYear(), 0);

  eventSelect = new DefaultSelect();
  user1 = new DefaultSelect();
  user2 = new DefaultSelect();
  user3 = new DefaultSelect();

  result1: any;
  result: any;
  result2: any;
  result3: any;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private comerEventService: ComerEventService,
    private securityService: SecurityService,
    private usersService: UsersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data.load(this.dataOI);
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      batch: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      event: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
      capturingUserName: [null, [Validators.required]],
      capturingUserPost: [null, [Validators.required]],
      authorizingUser: [null, [Validators.required]],
      authorizingUserName: [null, [Validators.required]],
      authorizingUserPost: [null, [Validators.required]],
      requestingUser: [null, [Validators.required]],
      requestingUserName: [null, [Validators.required]],
      requestingUserPost: [null, [Validators.required]],
      incomeOrder: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      reportNumber: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getEvent(new ListParams());
      this.getAllSegUser1(new ListParams());
      this.getAllSegUser2(new ListParams());
      this.getAllSegUser3(new ListParams());
    }, 1000);

    this.form.get('capturingUserName').disable();
    this.form.get('capturingUserPost').disable();
    this.form.get('authorizingUserName').disable();
    this.form.get('authorizingUserPost').disable();
    this.form.get('requestingUserName').disable();
    this.form.get('requestingUserPost').disable();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onUserRowSelect($event: any) {
    this.selectedRows = $event.selected;
  }

  exportAsXLSX(name: string): void {
    this.excelService.exportAsExcelFile(this.selectedRows, name);
  }

  getEvent(params: ListParams) {
    if (params.text) {
      params['search'] = `${params.text}`;
      //params['filter.status'] = `$ilike:${params.text}`;
    }
    this.comerEventService.getAllEvent(params).subscribe({
      next: resp => {
        this.result1 = resp.data.map(async (item: any) => {
          item['keyObservation'] = item.processKey + ' - ' + item.observations;
        });
        this.eventSelect = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.eventSelect = new DefaultSelect();
      },
    });
  }
  changeEvent(event: any) {
    console.log(event);
  }

  report() {
    let params = {
      //PN_DEVOLUCION: this.data,
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
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

  getAllSegUser1(params: ListParams) {
    if (params.text) {
      params['filter.name'] = `$ilike:${params.text}`;
      //params['filter.status'] = `$ilike:${params.text}`;
    }
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.result = resp.data.map(async (item: any) => {
          item['userName'] = item.user + ' - ' + item.name;
        });
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  changeUser1(event: any) {
    console.log(event);
    this.form.get('capturingUserName').setValue(event.name);
    this.form.get('capturingUserPost').setValue(event.otvalor);
  }

  getAllSegUser2(params: ListParams) {
    if (params.text) {
      params['filter.name'] = `$ilike:${params.text}`;
      //params['filter.status'] = `$ilike:${params.text}`;
    }
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.result2 = resp.data.map(async (item: any) => {
          item['userName'] = item.user + ' - ' + item.name;
        });
        this.user2 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user2 = new DefaultSelect();
      },
    });
  }

  changeUser2(event: any) {
    console.log(event);
    this.form.get('authorizingUserName').setValue(event.name);
    this.form.get('authorizingUserPost').setValue(event.otvalor);
  }

  getAllSegUser3(params: ListParams) {
    if (params.text) {
      params['filter.name'] = `$ilike:${params.text}`;
      //params['filter.status'] = `$ilike:${params.text}`;
    }
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.result3 = resp.data.map(async (item: any) => {
          item['userName'] = item.user + ' - ' + item.name;
        });
        this.user3 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user3 = new DefaultSelect();
      },
    });
  }

  changeUser3(event: any) {
    console.log(event);
    this.form.get('requestingUserName').setValue(event.name);
    this.form.get('requestingUserPost').setValue(event.otvalor);
  }
}
