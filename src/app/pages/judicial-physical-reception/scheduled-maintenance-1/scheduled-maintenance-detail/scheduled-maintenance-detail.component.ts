import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/index';
import { BasePage } from 'src/app/core/shared/base-page';
import { IProceedingDeliveryReception } from './../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { settingsGoods } from './const';

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
  paramsStatus: ListParams = new ListParams();
  data: IGoodsByProceeding[] = [];
  totalItems: number = 0;
  selecteds: IGoodsByProceeding[];
  selectedsForUpdate: IGoodsByProceeding[] = [];
  settingsGoods = settingsGoods;
  params: ListParams = new ListParams();
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private service: MsIndicatorGoodsService,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private proceedingService: ProceedingsDeliveryReceptionService
  ) {
    super();
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
        this.proceedingService.update2(detail).subscribe({
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

  private massiveUpdate(message = '') {
    if (this.selectedsForUpdate.length > 0) {
      this.detailService
        .updateMasive(this.selectedsForUpdate, this.actaId)
        .subscribe({
          next: response => {
            let goods = '';
            this.selectedsForUpdate.forEach((selected, index) => {
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
      let index = this.selectedsForUpdate.findIndex(
        x => x.no_bien === newData.no_bien
      );
      if (index === -1) {
        this.selectedsForUpdate.push(newData);
      } else {
        this.selectedsForUpdate[index] = newData;
      }
    }
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
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
    //   // console.log(x);
    //   this.getData();
    // });
  }

  getData() {
    const idActa = this.actaId;
    console.log(idActa);
    console.log(new Date());
    console.log(new Date().toISOString());
    this.params['id'] = idActa;
    if (idActa) {
      this.service.getGoodsByProceeding(this.params).subscribe({
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

  rowsSelected(event: { selected: IGoodsByProceeding[] }) {
    this.selecteds = event.selected;
  }

  showDeleteAlert(item: IGoodsByProceeding) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.detailService.deleteById(+item.no_bien, this.actaId).subscribe({
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
