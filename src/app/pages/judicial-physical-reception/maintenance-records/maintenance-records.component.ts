import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';

import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IProceedingInfo } from './components/proceeding-info/models/proceeding-info';

@Component({
  selector: 'app-maintenance-records',
  templateUrl: './maintenance-records.component.html',
  styleUrls: ['maintenance-records.component.scss'],
})
export class MaintenanceRecordsComponent extends BasePage implements OnInit {
  itemsSelect = new DefaultSelect();
  totalItems = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  infoForm: IProceedingDeliveryReception;
  formValue: IProceedingInfo;
  filterParams = new FilterParams();

  data: IDetailProceedingsDeliveryReception[] = [];
  statusActa = 'CERRADA';
  goodParams = new ListParams();
  loadingGoods = true;
  totalGoods = 0;
  newLimit = new FormControl(1);
  rowsSelected: any[] = [];
  constructor(
    private fb: FormBuilder,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {
    super();

    this.params.value.limit = 1;
    // this.params.value.pageSize = 1;
    // this.params.value.take = 1;
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      this.getData(this.formValue);
    });
  }

  private addFilter(
    name: string,
    value: any,
    operator: SearchFilter = SearchFilter.EQ
  ) {
    if (value) {
      this.filterParams.addFilter(name, value, operator);
    }
  }

  getData(form: IProceedingInfo) {
    if (this.fillParams(form)) {
      this.loading = true;
      this.proceedingService.getAll(this.filterParams.getParams()).subscribe({
        next: response => {
          this.infoForm = response.data[0];
          this.statusActa = this.infoForm.statusProceedings;
          this.totalItems = response.count;
          console.log(this.params.getValue());
          this.loading = false;
          this.getGoods();
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  getGoods() {
    if (this.infoForm && this.infoForm.id) {
      const filterParams = new FilterParams();
      filterParams.limit = this.goodParams.limit;
      filterParams.page = this.goodParams.page;
      filterParams.addFilter('numberProceedings', this.infoForm.id);
      this.detailService.getAll3(filterParams.getParams()).subscribe({
        next: response => {
          this.data = response.data;
          this.totalGoods = response.count;
          this.loadingGoods = false;
        },
        error: error => {
          this.loadingGoods = false;
        },
      });
    }
  }

  addGood(good: IDetailProceedingsDeliveryReception) {
    this.data.push();
  }

  private fillParams(form: IProceedingInfo) {
    // debugger;
    if (!form) return false;
    this.formValue = form;
    this.filterParams = new FilterParams();
    this.filterParams.limit = 1;
    this.filterParams.page = this.params.getValue().page;
    const {
      id,
      cveActa,
      numFile,
      tipoActa,
      labelActa,
      receiptKey,
      statusActa,
      address,
      observations,
      numDelegation1,
      numDelegation2,
      elaborationDate,
      closeDate,
      datePhysicalReception,
      maxDate,
      dateElaborationReceipt,
      dateCaptureHc,
      dateDeliveryGood,
      dateCloseHc,
      captureDate,
      dateMaxHc,
      witness1,
      witness2,
      comptrollerWitness,
    } = form;
    if (id) {
      this.filterParams.addFilter('id', id);
      return true;
    }
    if (cveActa) {
      this.filterParams.addFilter('keysProceedings', cveActa.trim());
      return true;
    }
    this.addFilter('numFile', numFile);
    this.addFilter('typeProceedings', tipoActa);
    this.addFilter('label', labelActa, SearchFilter.ILIKE);
    this.addFilter('receiptKey', receiptKey);
    this.addFilter('statusProceedings', statusActa);
    this.addFilter('address', address, SearchFilter.ILIKE);
    this.addFilter('observations', observations, SearchFilter.ILIKE);
    this.addFilter('numDelegation1', numDelegation1);
    this.addFilter('numDelegation2', numDelegation2);
    this.addFilter('elaborationDate', elaborationDate, SearchFilter.ILIKE);
    this.addFilter('closeDate', closeDate, SearchFilter.ILIKE);
    this.addFilter(
      'datePhysicalReception',
      datePhysicalReception,
      SearchFilter.ILIKE
    );
    this.addFilter('maxDate', maxDate, SearchFilter.ILIKE);
    this.addFilter(
      'dateElaborationReceipt',
      dateElaborationReceipt,
      SearchFilter.ILIKE
    );
    this.addFilter('dateCaptureHc', dateCaptureHc, SearchFilter.ILIKE);
    this.addFilter('dateDeliveryGood', dateDeliveryGood, SearchFilter.ILIKE);
    this.addFilter('dateCloseHc', dateCloseHc, SearchFilter.ILIKE);
    this.addFilter('captureDate', captureDate, SearchFilter.ILIKE);
    this.addFilter('dateMaxHc', dateMaxHc, SearchFilter.ILIKE);
    this.addFilter('witness1', witness1, SearchFilter.ILIKE);
    this.addFilter('witness2', witness2, SearchFilter.ILIKE);
    this.addFilter(
      'comptrollerWitness',
      comptrollerWitness,
      SearchFilter.ILIKE
    );
    if (this.filterParams.getFilterParams()) {
      return true;
    }
    return false;
  }
}

const EXAMPLE_DATA = [
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
];
