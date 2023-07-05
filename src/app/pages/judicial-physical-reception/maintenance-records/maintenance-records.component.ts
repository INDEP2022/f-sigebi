import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, takeUntil } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { format } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import {
  ProceedingsDetailDeliveryReceptionService,
  trackerGoodToDetailProceeding,
} from 'src/app/core/services/ms-proceedings';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { formatForIsoDate } from 'src/app/shared/utils/date';
import { getTrackedGoods } from '../../general-processes/goods-tracker/store/goods-tracker.selector';
import { GOOD_TRACKER_ORIGINS } from '../../general-processes/goods-tracker/utils/constants/origins';
import {
  deliveryReceptionToInfo,
  IProceedingInfo,
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
  loadingGoods = false;
  loadingNewGoods = true;
  newLimit = new FormControl(1);
  pageGoods = 1;
  // rowsSelected: any[] = [];
  rowsSelectedLocal: any[] = [];
  rowsSelectedNotLocal: any[] = [];
  pageSizeOptions: number[] = [1];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private service: MaintenanceRecordsService,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private safeService: SafeService,
    private warehouseService: WarehouseService
  ) {
    super();
    this.params.value.limit = 1;

    this.params.next({ ...this.params.getValue(), limit: 1 });
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

  get rowsSelected() {
    return this.rowsSelectedLocal.concat(this.rowsSelectedNotLocal);
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

  get registro() {
    return this.service.registro;
  }

  set registro(value) {
    this.service.registro = value;
  }

  deleteRow(event: any) {
    console.log(event);
    this.alertQuestion(
      'question',
      'Bienes',
      '¿Desea eliminar el bien ' + event.numberGood + '?'
    ).then(question => {
      if (question.isConfirmed) {
        this.detailService
          .deleteById(event.numberGood, +(this.infoForm.id + ''))
          .subscribe({
            next: response => {
              this.alert(
                'success',
                'Bien' + event.numberGood,
                'Eliminado exitosamente'
              );
              this.getGoods();
            },
            error: err => {
              this.alert(
                'error',
                'Bien' + event.numberGood,
                'No se pudo eliminar'
              );
            },
          });
      }
    });
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
          console.log(response, this.infoForm);
          this.detailService
            .createMassive(
              response.map(item =>
                trackerGoodToDetailProceeding(item, this.infoForm.id)
              )
            )
            .subscribe({
              next: response2 => {
                const goods = response.map(good => good.goodNumber);
                let message = '';
                goods.forEach((good, index) => {
                  message += good + (index < goods.length - 1 ? ',' : '');
                });
                this.alert('success', 'Bienes Agregados', message);
                this.getGoods();
              },
              error: err => {
                this.alert('error', 'Bienes', 'No Agregados');
              },
            });
          // this.service.dataForAdd = [
          //   ...this.service.dataForAdd.concat(
          //     response.map(item =>
          //       trackerGoodToDetailProceeding(item, this.infoForm.id)
          //     )
          //   ),
          // ];
        }

        // this.loading = false;
      },
      error: err => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  private addFilter2(
    name: string,
    value: any,
    operator: SearchFilter = SearchFilter.EQ
  ) {
    if (value) {
      this.filterParams.addFilter(name, value, operator);
    }
  }

  updateData(event: any) {
    console.log(event);
    this.pageGoods = event.page;
    this.goodParams.limit = event.limit;
    this.goodParams.page = event.page;
    // this.infoForm && this.infoForm.id
    this.getGoods();
  }

  getData(form: IProceedingInfo) {
    if (this.fillParams(form)) {
      this.loading = true;
      this.loadingGoods = true;
      this.proceedingService.getAll(this.filterParams.getParams()).subscribe({
        next: response => {
          // debugger;
          if (response.data && response.data.length > 0) {
            this.infoForm = response.data[0];
            this.service.formValue = deliveryReceptionToInfo(this.infoForm);
            // console.log(this.infoForm, this.service.formValue);
            if (!this.registro) {
              this.service.totalProceedings = response.count;
            }
            // console.log(this.params.getValue());
            this.loading = false;
            this.registro = true;
            // this.goodParams.limit = 10;
            this.goodParams.page = 1;
            this.pageGoods = 1;
            this.getGoods();
          } else {
            this.loading = false;
            this.loadingGoods = false;
            this.alert('error', 'Actas', 'No encontradas');
          }
        },
        error: error => {
          this.loading = false;
          this.loadingGoods = false;
          this.alert('error', 'Actas', 'No encontradas');
        },
      });
    }
  }

  async getGoods() {
    // debugger;
    this.loadingGoods = true;
    this.rowsSelectedNotLocal = [];
    if (this.infoForm && this.infoForm.id) {
      const filterParams = new FilterParams();
      filterParams.limit = this.goodParams.limit;
      filterParams.page = this.goodParams.page;
      filterParams.addFilter('numberProceedings', this.infoForm.id);

      try {
        // debugger;
        const response = await firstValueFrom(
          this.detailService.getAll(filterParams.getParams())
        );
        // const newData: IDetailProceedingsDeliveryReception[] = [];
        const newData = response.data.map(async item => {
          const warehouse = item.good?.storeNumber
            ? await firstValueFrom(
                this.warehouseService
                  .getById(item.good?.storeNumber)
                  .pipe(map(item => item.idWarehouse + '-' + item.description))
              )
            : null;
          const vault = item.good?.vaultNumber
            ? await firstValueFrom(
                this.safeService
                  .getById(item.good?.vaultNumber)
                  .pipe(map(item => item.idSafe + '-' + item.description))
              )
            : null;
          return {
            ...item,
            description: item.good?.description ?? '',
            approvedDateXAdmon: item.approvedDateXAdmon
              ? formatForIsoDate(item.approvedDateXAdmon + '', 'string')
              : null,
            approvedUserXAdmon: item.approvedUserXAdmon ?? null,
            dateIndicatesUserApproval: item.dateIndicatesUserApproval
              ? formatForIsoDate(item.dateIndicatesUserApproval + '', 'string')
              : null,
            // amount: item.good.quantity,
            status: item.good?.status ?? null,
            warehouse,
            vault,
          };
        });
        Promise.all(newData)
          .then(x => {
            console.log(x);
            this.service.data = [
              ...x.sort((a, b) => a.numberGood - b.numberGood),
            ];
            this.service.totalGoods = response.count;
            this.loadingGoods = false;
          })
          .catch(error => {
            this.service.data = [];
            this.service.totalGoods = 0;
            this.loadingGoods = false;
            // this.onLoadToast('error', 'Actas', 'No encontradas');
          });
      } catch (x) {
        this.service.data = [];
        this.service.totalGoods = 0;
        this.loadingGoods = false;
      }
      // this.detailService.getAll(filterParams.getParams()).subscribe({
      //   next: response => {

      //   }
      // })
      // this.detailService.getAll3(filterParams.getParams()).subscribe({
      //   next: response => {
      //     // console.log(response);

      //     // console.log(this.service.data, response.data);

      //     this.service.data = [...response.data];
      //     this.service.totalGoods = response.count;
      //     this.loadingGoods = false;
      //   },
      //   error: error => {
      //     // console.log(error);
      //     this.service.data = [];
      //     this.loadingGoods = false;
      //   },
      // });
    } else {
      this.loadingGoods = false;
    }
  }

  // addGood(good: IDetailProceedingsDeliveryReception) {
  //   this.service.dataForAdd.push(good);
  //   this.service.dataForAdd = [...this.service.dataForAdd];
  // }

  private fillParams(form: IProceedingInfo) {
    // debugger;
    if (!form) return false;
    this.service.formValue = form;
    if (this.registro === false) {
      this.filterParams = new FilterParams();
    }
    this.filterParams.limit = 1;
    this.filterParams.page = this.params.getValue().page;
    if (this.registro === true) return true;
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
    this.addFilter2('numFile', numFile);
    this.addFilter2('typeProceedings', tipoActa);
    this.addFilter2('label', labelActa, SearchFilter.ILIKE);
    this.addFilter2('receiptKey', receiptKey);
    this.addFilter2('statusProceedings', statusActa);
    this.addFilter2('address', address, SearchFilter.ILIKE);
    this.addFilter2('observations', observations, SearchFilter.ILIKE);
    this.addFilter2('numDelegation1', numDelegation1);
    this.addFilter2('numDelegation2', numDelegation2);
    this.addFilter2(
      'elaborationDate',
      elaborationDate ? format(new Date(elaborationDate), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'closeDate',
      closeDate ? format(new Date(closeDate), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'datePhysicalReception',
      datePhysicalReception,
      SearchFilter.ILIKE
    );
    this.addFilter2(
      'maxDate',
      maxDate ? format(new Date(maxDate), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'dateElaborationReceipt',
      dateElaborationReceipt,
      SearchFilter.ILIKE
    );
    this.addFilter2(
      'dateCaptureHc',
      dateCaptureHc ? format(new Date(dateCaptureHc), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'dateDeliveryGood',
      dateDeliveryGood ? format(new Date(dateDeliveryGood), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'dateCloseHc',
      dateCloseHc ? format(new Date(dateCloseHc), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'captureDate',
      captureDate ? format(new Date(captureDate), 'yyyy-MM-dd') : null
    );
    this.addFilter2(
      'dateMaxHc',
      dateMaxHc ? format(new Date(dateMaxHc), 'yyyy-MM-dd') : null
    );
    this.addFilter2('witness1', witness1, SearchFilter.ILIKE);
    this.addFilter2('witness2', witness2, SearchFilter.ILIKE);
    this.addFilter2(
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
