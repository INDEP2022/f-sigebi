import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-mandate-income-reports-i',
  templateUrl: './mandate-income-reports-i.component.html',
  styles: [],
})
export class MandateIncomeReportsIComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  selectedRows: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  dateSelected?: (Date | undefined)[];
  selectedClass: any[] = [];
  maxDate = new Date(new Date().getFullYear(), 11);
  minDate = new Date(new Date().getFullYear(), 0);

  eventSelect = new DefaultSelect();
  user1 = new DefaultSelect();
  user2 = new DefaultSelect();
  user3 = new DefaultSelect();
  selectLot = new DefaultSelect();
  result: any;
  result1: any;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private comerEventService: ComerEventService,
    private securityService: SecurityService,
    private usersService: UsersService,
    private lotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      batch: [null, []],
      event: [null, [Validators.required]],
      startDate: [null, []],
      //endDate: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
      capturingUserName: [null, [Validators.required]],
      capturingUserPost: [null, [Validators.required]],
      authorizingUser: [null, [Validators.required]],
      authorizingUserName: [null, [Validators.required]],
      authorizingUserPost: [null, [Validators.required]],
      requestingUser: [null, [Validators.required]],
      requestingUserName: [null, [Validators.required]],
      requestingUserPost: [null, [Validators.required]],
      incomeOrder: [null, []],
      //reportNumber: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getEvent(new ListParams());
      this.getAllSegUser1(new ListParams());
      this.getAllSegUser2(new ListParams());
      this.getAllSegUser3(new ListParams());
      this.getLot(new ListParams());
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
      IDEVENTO: this.form.get('event').value,
      P_CONSEC: 0,
      P_ORIGEN: 0,
      P_USUARIO: this.form.get('capturingUserName').value,
      P_USUARIO2: this.form.get('authorizingUserName').value,
      P_USUARIO3: this.form.get('requestingUserName').value,
    };
    this.siabService
      .fetchReport('FCOMEREPINGXMAND_I', params)
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
    //name otvalor
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
        this.result = resp.data.map(async (item: any) => {
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
        this.result = resp.data.map(async (item: any) => {
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

  getLot(params: ListParams) {
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.idLot'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.lotService.getAllComerLot(params).subscribe({
      next: resp => {
        this.result = resp.data.map(async (item: any) => {
          item['idLotDescription'] = item.idLot + ' - ' + item.description;
        });
        console.log(resp.data);
        this.selectLot = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectLot = new DefaultSelect();
        this.loading = false;
      },
    });
  }
  changeLot(event: any) {}
}
