import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IProceedingInfo } from './components/proceeding-info/models/proceeding-info';

@Component({
  selector: 'app-maintenance-records',
  templateUrl: './maintenance-records.component.html',
  styleUrls: ['maintenance-records.scss'],
})
export class MaintenanceRecordsComponent extends BasePage implements OnInit {
  itemsSelect = new DefaultSelect();
  totalItems = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  infoForm: IProceedingDeliveryReception;
  formValue: IProceedingInfo;
  filterParams = new FilterParams();
  // settings = {
  //   ...TABLE_SETTINGS,
  //   pager: {
  //     display: false,
  //   },
  //   hideSubHeader: true,
  //   actions: false,
  //   selectedRowIndex: -1,
  //   mode: 'external',
  //   columns: {
  //     noBien: {
  //       title: 'No Bien',
  //       type: 'string',
  //       sort: false,
  //     },
  //     cantidad: {
  //       title: 'Cantidad',
  //       type: Date,
  //       sort: false,
  //     },
  //     descripcion: {
  //       title: 'Descripcion',
  //       type: 'string',
  //       sort: false,
  //     },
  //     fechaAprobacion: {
  //       title: 'Fecha Aprobacion',
  //       type: Date,
  //       sort: false,
  //     },
  //     usuarioAprobado: {
  //       title: 'Usuario Aprobado por Admon',
  //       type: 'string',
  //       sort: false,
  //     },
  //     fechaIndicaAprobacion: {
  //       title: 'Fecha Indica Usuario Aprobacion',
  //       type: Date,
  //       sort: false,
  //     },
  //   },
  //   noDataMessage: 'No se encontrarón registros',
  // };

  data = EXAMPLE_DATA;

  constructor(
    private fb: FormBuilder,
    private proceedingService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.params.value.limit = 1;
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
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
    }
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
      this.filterParams.addFilter('keysProceedings', cveActa);
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
    return true;
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
