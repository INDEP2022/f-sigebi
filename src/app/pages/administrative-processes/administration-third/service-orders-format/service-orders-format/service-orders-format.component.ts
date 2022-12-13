import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ServiceOrdersFormatHistoricComponent } from '../service-orders-format-historic/service-orders-format-historic.component';
import {
  CONTROLSERVICEORDERS_COLUMNS,
  SERVICEORDERSFORMAT_COLUMNS,
} from './service-orders-format-columns';

@Component({
  selector: 'app-service-orders-format',
  templateUrl: './service-orders-format.component.html',
  styles: [],
})
export class ServiceOrdersFormatComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings2 = { ...this.settings, actions: false };
  serviceOrdersForm: FormGroup;

  public process = new DefaultSelect();
  public regionalCoordination = new DefaultSelect();
  public transference = new DefaultSelect();
  public station = new DefaultSelect();
  public authority = new DefaultSelect();
  public keyStore = new DefaultSelect();

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: SERVICEORDERSFORMAT_COLUMNS,
    };
    this.settings2.columns = CONTROLSERVICEORDERS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      type: [null, Validators.required],
      process: [null, Validators.required],
      dateCapture: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      serviceOrderKey: [
        null,
        Validators.required,
        Validators.pattern(KEYGENERATION_PATTERN),
      ],
      cancellationAuthorizationDate: [null, Validators.required],
      uniqueKey: [
        null,
        Validators.required,
        Validators.pattern(KEYGENERATION_PATTERN),
      ],
      transference: [null, Validators.required],
      station: [null, Validators.required],
      authority: [null, Validators.required],
      keyStore: [null, Validators.required],
      location: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      municipality: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      entity: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      supplierFolio: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      start: [null, Validators.required],
      finished: [null, Validators.required],
      hour: [null, Validators.required],
      status: [null, Validators.required],
    });
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
  public getTransference(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getStation(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getAuthority(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getKeyStore(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  openEstate(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersFormatHistoricComponent, config);
  }
}
