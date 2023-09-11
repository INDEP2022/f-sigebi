import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ServiceOrdersFormatHistoricComponent } from '../service-orders-format-historic/service-orders-format-historic.component';
import { ServiceOrdersSelectModalComponent } from '../service-orders-select-modal/service-orders-select-modal.component';
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
  NO_ACTA: any;
  select: boolean = false;

  public process = new DefaultSelect();
  public regionalCoordination = new DefaultSelect();
  public transference = new DefaultSelect();
  public station = new DefaultSelect();
  public authority = new DefaultSelect();
  public keyStore = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.NO_ACTA = params['NO_ACTA'] ? Number(params['NO_ACTA']) : null;
      });
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
      serviceOrderKey: [null, Validators.required],
      cancellationAuthorizationDate: [null, Validators.required],
      uniqueKey: [null, Validators.required],
      transference: [null, Validators.required],
      station: [null, Validators.required],
      authority: [null, Validators.required],
      keyStore: [null, Validators.required],
      location: [null, Validators.required],
      municipality: [null, Validators.required],
      entity: [null, Validators.required],
      supplierFolio: [null, Validators.required],
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

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, formatKey?: any, id?: any) => {
          console.log('callback ', id, ' ', formatKey);

          if (id != null) {
            console.log('si hay id');
            this.prepareForm();
            this.getStrategyById(formatKey, id);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersSelectModalComponent, config);
  }
  getStrategyById(formatKey?: any, id?: any) {
    this.goodPosessionThirdpartyService.getAllStrategyFormatById(id).subscribe({
      next: response => {
        let formattedfecCapture: any;
        const Capture =
          response.data[0].captureDate != null
            ? new Date(response.data[0].captureDate)
            : null;
        if (Capture == null) {
          formattedfecCapture = null;
        } else {
          formattedfecCapture = this.formatDate(
            new Date(Capture.getTime() + Capture.getTimezoneOffset() * 60000)
          );
        }
        console.log('respuesta id ', response);
        this.serviceOrdersForm
          .get('type')
          .setValue(response.data[0].typeStrategy);
        this.serviceOrdersForm
          .get('process')
          .setValue(response.data[0].processNumber);
        this.serviceOrdersForm.get('dateCapture').setValue(formattedfecCapture);
        this.serviceOrdersForm
          .get('regionalCoordination')
          .setValue(response.data[0].delegation1Number);
        this.serviceOrdersForm
          .get('serviceOrderKey')
          .setValue(response.data[0].formatKey);
        this.serviceOrdersForm
          .get('cancellationAuthorizationDate')
          .setValue(response.data[0].authorizeDate);
        this.serviceOrdersForm
          .get('transference')
          .setValue(response.data[0].transferenceNumber);
        this.serviceOrdersForm
          .get('station')
          .setValue(response.data[0].stationNumber);
        this.serviceOrdersForm
          .get('authority')
          .setValue(response.data[0].authorityNumber);
        this.serviceOrdersForm
          .get('keyStore')
          .setValue(response.data[0].storeNumber);
        this.serviceOrdersForm
          .get('location')
          .setValue(response.data[0].catWarehouses.location);
        this.serviceOrdersForm
          .get('municipality')
          .setValue(response.data[0].catWarehouses.codeMunicipality);
        this.serviceOrdersForm
          .get('entity')
          .setValue(response.data[0].catWarehouses.codeCity);
        this.serviceOrdersForm
          .get('supplierFolio')
          .setValue(response.data[0].folSupplier);

        /*// this.serviceOrdersForm.patchValue({
          type: response.data[0].typeStrategy,
          process: response.data[0].processNumber,
          dateCapture: formattedfecCapture,
          regionalCoordination: response.data[0].delegation1Number
          //serviceOrderKey: response.data[0].formatKey,
          //cancellationAuthorizationDate: response.data[0].authorizeDate,
          //uniqueKey: 'Prueba',
          // transference: response.data[0].transferenceNumber,
          // station: response.data[0].stationNumber,
          // authority: response.data[0].authorityNumber,
          // keyStore: response.data[0].storeNumber,
          // location: response.data[0].catWarehouses.location,
          // municipality: response.data[0].catWarehouses.codeMunicipality,
          // entity: response.data[0].catWarehouses.codeCity,
          // supplierFolio: response.data[0].folSupplier
        })*/
        this.select = true;
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day} /${month}/${year}`;
  }
}
