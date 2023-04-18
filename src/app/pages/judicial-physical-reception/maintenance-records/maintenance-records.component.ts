import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';

import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { getTrackedGoods } from '../../general-processes/goods-tracker/store/goods-tracker.selector';
import { GOOD_TRACKER_ORIGINS } from '../../general-processes/goods-tracker/utils/constants/origins';
import {
  IProceedingInfo,
  trackerGoodToDetailProceeding,
} from './components/proceeding-info/models/proceeding-info';
import { MaintenanceRecordsService } from './services/maintenance-records.service';

@Component({
  selector: 'app-maintenance-records',
  templateUrl: './maintenance-records.component.html',
  styleUrls: ['maintenance-records.component.scss'],
})
export class MaintenanceRecordsComponent extends BasePage implements OnInit {
  itemsSelect = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new FilterParams();
  origin = GOOD_TRACKER_ORIGINS.MaintenanceProceedings;
  $trackedGoods = this.store.select(getTrackedGoods);
  goodParams = new ListParams();
  loadingGoods = true;
  loadingNewGoods = true;
  newLimit = new FormControl(1);
  rowsSelected: any[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private service: MaintenanceRecordsService,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {
    super();
    this.params.value.limit = 1;
    this.service.updateWarehouseVault.subscribe(x => {
      this.getGoods();
    });
    this.service.updateAct.subscribe(x => {
      this.getData(this.service.formValue);
    });
    // this.params.value.pageSize = 1;
    // this.params.value.take = 1;
  }

  get infoForm() {
    return this.service.selectedAct;
  }

  set infoForm(value) {
    this.service.selectedAct = value;
  }

  get data() {
    return this.service.data ? this.service.data : [];
  }

  get totalProceedings() {
    return this.service.totalProceedings ? this.service.totalProceedings : 0;
  }

  get totalGoods() {
    return this.service.totalGoods ? this.service.totalGoods : 0;
  }

  get dataForAdd() {
    return this.service.dataForAdd ? this.service.dataForAdd : [];
  }

  get statusActa() {
    return this.service.formValue
      ? this.service.formValue.statusActa
        ? this.service.formValue.statusActa
        : 'CERRADA'
      : 'CERRADA';
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      this.getData(this.service.formValue);
    });
    this.$trackedGoods.subscribe({
      next: response => {
        // response.forEach(good => {
        //   this.getGoodByID(good.goodNumber);
        // });
        if (response) {
          console.log(response);
          this.service.dataForAdd = [
            ...this.service.dataForAdd.concat(
              response.map(item =>
                trackerGoodToDetailProceeding(item, this.infoForm.id)
              )
            ),
          ];
        }

        // this.loading = false;
      },
      error: err => {
        console.log(err);
        this.loading = false;
      },
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
          this.service.totalProceedings = response.count;
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
          this.service.data = response.data;
          this.service.totalGoods = response.count;
          this.loadingGoods = false;
        },
        error: error => {
          this.loadingGoods = false;
        },
      });
    }
  }

  addGood(good: IDetailProceedingsDeliveryReception) {
    this.service.dataForAdd.push(good);
    this.service.dataForAdd = [...this.service.dataForAdd];
  }

  private fillParams(form: IProceedingInfo) {
    if (!form) return false;
    this.service.formValue = form;
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
