import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/index';
import { BasePage } from 'src/app/core/shared/base-page';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { IParametersIndicators } from './../../../../core/models/catalogs/parameters-indicators.model';
import { IProceedingDeliveryReception } from './../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { GOOD_TRACKER_ORIGINS } from './../../../general-processes/goods-tracker/utils/constants/origins';
import { columnsGoods, settingsGoods } from './const';

@Component({
  selector: 'app-scheduled-maintenance-detail',
  templateUrl: './scheduled-maintenance-detail.component.html',
  styleUrls: [
    '../scheduled-maintenance.scss',
    './scheduled-maintenance-detail.component.scss',
  ],
})
export class ScheduledMaintenanceDetailComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  paramsForAdd = new BehaviorSubject<ListParams>(new ListParams());
  paramsStatus: ListParams = new ListParams();
  data: IGoodsByProceeding[] = [];
  dataForAdd: IGoodsByProceeding[] = [];
  totalItems: number = 0;
  selecteds: IGoodsByProceeding[] = [];
  selectedsNews: IGoodsByProceeding[] = [];
  settingsGoods = { ...settingsGoods };
  settingsGoodsForAdd = {
    ...settingsGoods,
    edit: { ...settingsGoods.edit, confirmSave: false },
    delete: { ...settingsGoods.delete, confirmDelete: false },
  };
  params: ListParams = new ListParams();
  initialValue: any;
  $trackedGoods = this.store.select(getTrackedGoods);
  origin = GOOD_TRACKER_ORIGINS.DetailProceedings;
  proceedingIndicators: IParametersIndicators[];
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private store: Store,
    private service: MsIndicatorGoodsService,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private indicatorService: ParameterIndicatorsService
  ) {
    super();
    this.fillColumnsGoods();
    this.prepareForm();
    this.statusActa.valueChanges.subscribe(x => {
      console.log(x);
      if (x === 'CERRADA') {
        const detail = JSON.parse(
          window.localStorage.getItem('detailActa')
        ) as IProceedingDeliveryReception;
        detail.keysProceedings = this.form.get('claveActa').value;
        detail.statusProceedings = this.statusActaValue;
        let message = '';
        this.proceedingService
          .update2(detail)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              this.massiveUpdate(`Se actualizo el acta N° ${detail.id} `);
            },
            error: err => {
              this.massiveUpdate('');
            },
          });
      }
    });
  }

  get statusActa() {
    return this.form.get('statusActa');
  }

  get statusActaValue() {
    return this.statusActa ? this.statusActa.value : 'CERRADA';
  }

  get actaId() {
    return this.form.get('acta') ? this.form.get('acta').value : '';
  }

  get typeProceeding() {
    return this.form.get('tipoEvento') ? this.form.get('tipoEvento').value : '';
  }

  private massiveUpdate(message = '') {
    if (this.data.length > 0) {
      this.service
        .updateMassive(this.data, this.actaId)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            let goods = '';
            this.data.forEach((selected, index) => {
              goods +=
                selected.no_bien +
                (index < this.selecteds.length - 1 ? ',' : '');
            });
            if (message === '') {
              message = `Se actualizaron los bienes N° ${goods} `;
            } else {
              message += ` y los bienes N° ${goods}`;
            }
            this.onLoadToast('success', 'Exito', message);
          },
          error: err => {
            if (message === '') {
              this.onLoadToast('error', 'Error', 'Programación no actualizada');
            } else {
              this.onLoadToast(
                'warning',
                'Exito',
                message + ' pero no se pudieron actualizar los bienes'
              );
            }
          },
        });
    } else {
      if (this.form.value !== this.initialValue) {
        this.onLoadToast('success', 'Exito', message);
        this.initialValue = { ...this.form.value };
      }
    }
  }

  private prepareForm() {
    const acta: IProceedingDeliveryReception = JSON.parse(
      localStorage.getItem('detailActa')
    );
    this.form = this.fb.group({
      acta: [acta.id],
      fechaCaptura: [new Date(acta.captureDate)],
      statusActa: [acta.statusProceedings],
      claveActa: [acta.keysProceedings],
      tipoEvento: [acta.typeProceedings],
    });
    this.initialValue = { ...this.form.value };
  }

  return() {
    this.location.back();
  }

  private fillSelectedsForUpdate(
    newData: IGoodsByProceeding,
    data: IGoodsByProceeding
  ) {
    if (
      newData.fec_aprobacion_x_admon !== data.fec_aprobacion_x_admon ||
      newData.fec_indica_usuario_aprobacion !==
        data.fec_indica_usuario_aprobacion
    ) {
      let index = this.data.findIndex(x => x.no_bien === newData.no_bien);
      if (index === -1) {
        this.data.push(newData);
      } else {
        this.data[index] = newData;
      }
    }
  }

  updateDatesTable() {
    console.log(this.data);
  }

  updateGoodsRow(event: any) {
    console.log(event);
    let { newData, confirm, data } = event;
    if (
      !newData.fec_aprobacion_x_admon ||
      !newData.fec_indica_usuario_aprobacion
    ) {
      this.alertTableIncompleteFields();
      return;
    }
    if (
      newData.fec_aprobacion_x_admon &&
      newData.fec_indica_usuario_aprobacion &&
      new Date(newData.fec_aprobacion_x_admon) >
        new Date(newData.fec_indica_usuario_aprobacion)
    ) {
      this.alertTableRangeError();
      return;
    }
    this.fillSelectedsForUpdate(newData, data);
    confirm.resolve(newData);
  }

  alertTableRangeError() {
    this.onLoadToast(
      'error',
      'Campos no concuerdan',
      'Fecha final no puede ser menor a inicial'
    );
  }

  alertTableIncompleteFields() {
    this.onLoadToast(
      'error',
      'Campos incompletos',
      'Complete todos los campos para agregar un registro'
    );
  }

  ngOnInit(): void {
    this.getData();
    this.$trackedGoods.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        // response.forEach(good => {
        //   this.getGoodByID(good.goodNumber);
        // });
        console.log(response);
        if (response && response.length > 0) {
          this.service
            .getByGoodRastrer(
              response.map(item => +item.goodNumber),
              this.data[0]
            )
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: goods => {
                this.dataForAdd = goods.data;
              },
              complete: () => {
                this.loading = false;
              },
            });
        } else {
          this.loading = false;
        }
      },
      error: err => {
        console.log(err);
        this.loading = false;
      },
    });
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
    //   // console.log(x);
    //   this.getData();
    // });
  }

  private fillColumnsGoods() {
    let columnGoodId = {
      title: 'Localidad Ent. Transferente.',
      type: 'string',
      sort: false,
      editable: false,
    };
    const params = new ListParams();
    params.limit = 100;
    this.indicatorService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          // debugger;
          let newColumns;
          this.proceedingIndicators = response.data.filter(
            indicator => indicator.description === 'ENTREGA FISICA'
          );
          const indicator = this.proceedingIndicators.find(
            indicator => indicator.typeActa === this.typeProceeding
          );
          if (!indicator) return;
          if (indicator.areaProcess === 'RF') {
            newColumns = { ciudad_transferente: columnGoodId, ...columnsGoods };
          }
          if (indicator.areaProcess === 'DN') {
            newColumns = {
              clave_contrato_donacion: columnGoodId,
              ...columnsGoods,
            };
          }
          if (indicator.areaProcess === 'DV') {
            newColumns = {
              clave_acta_devolucion: columnGoodId,
              ...columnsGoods,
            };
          }
          if (indicator.areaProcess === 'CM') {
            newColumns = { clave_dictamen: columnGoodId, ...columnsGoods };
          }
          if (indicator.areaProcess === 'DS') {
            newColumns = {
              clave_acta_destruccion: columnGoodId,
              ...columnsGoods,
            };
          }
          this.settingsGoods = { ...this.settingsGoods, columns: newColumns };
          this.settingsGoodsForAdd = {
            ...this.settingsGoodsForAdd,
            columns: newColumns,
          };
        },
      });
  }

  getData() {
    const idActa = this.actaId;
    console.log(idActa);
    console.log(new Date());
    console.log(new Date().toISOString());
    this.params['id'] = idActa;
    if (idActa) {
      this.service
        .getGoodsByProceeding(this.params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.data = response.data;
            this.totalItems = response.count;
          },
          error: err => {
            this.data = [];
            this.totalItems = 0;
          },
        });
    }
  }

  rowsSelected(selecteds: IGoodsByProceeding[]) {
    this.selecteds = selecteds;
  }

  showDeleteAlert(item: IGoodsByProceeding) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.detailService
          .deleteByIdBP(this.actaId, this.typeProceeding, item)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              console.log(response);
              this.getData();
              this.onLoadToast(
                'success',
                'Exito',
                `Se elimino el bien N° ${item.no_bien}`
              );
            },
            error: err => {
              console.log(err);
              this.onLoadToast(
                'error',
                'ERROR',
                `No se pudo eliminar el bien N° ${item.no_bien}`
              );
            },
          });
      }
    });
  }
}
