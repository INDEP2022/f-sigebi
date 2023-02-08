import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ImplementationReportHistoricComponent } from '../implementation-report-historic/implementation-report-historic.component';
import {
  IMPLEMENTATIONREPORT_COLUMNS,
  IMPLEMENTATION_COLUMNS,
} from './implementation-report-columns';

@Component({
  selector: 'app-implementation-report',
  templateUrl: './implementation-report.component.html',
  styles: [],
})
export class ImplementationReportComponent extends BasePage implements OnInit {
  serviceOrdersForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings2 = { ...this.settings, actions: false };

  public serviceOrderKey = new DefaultSelect();
  public process = new DefaultSelect();
  public regionalCoordination = new DefaultSelect();
  public reportKey = new DefaultSelect();
  public status = new DefaultSelect();

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: IMPLEMENTATIONREPORT_COLUMNS,
    };
    this.settings2.columns = IMPLEMENTATION_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      serviceOrderKey: [null, Validators.required],
      type: [null, Validators.required],
      process: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      reportKey: [null, Validators.required],
      status: [null, Validators.required],
      authorizationDate: [null, Validators.required],
      dateCapture: [null, Validators.required],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
  public getServiceOrderKey(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getProcess(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getRegionalCoordination(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getReportKey(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getStatus(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  openHistoric(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ImplementationReportHistoricComponent, config);
  }
}
