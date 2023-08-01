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

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private comerEventService: ComerEventService,
    private securityService: SecurityService
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
      batch: [null, [Validators.required]],
      event: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
      authorizingUser: [null, [Validators.required]],
      requestingUser: [null, [Validators.required]],
      incomeOrder: [null, [Validators.required]],
      reportNumber: [null, [Validators.required]],
    });
    this.getEvent(new ListParams());
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
    this.comerEventService.getAllEvent(params).subscribe({
      next: data => {
        this.eventSelect = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.eventSelect = new DefaultSelect();
      },
    });
  }
  changeEvent(event: any) {}

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
}
