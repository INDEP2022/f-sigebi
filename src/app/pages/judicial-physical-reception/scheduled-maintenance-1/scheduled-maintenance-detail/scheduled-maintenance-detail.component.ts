import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { RangePickerModalComponent } from 'src/app/@standalone/modals/range-picker-modal/range-picker-modal.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { firstFormatDate } from 'src/app/shared/utils/date';
import { IProceedingDeliveryReception } from './../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import {
  IDeleted,
  INotDeleted,
} from './../../../../core/services/ms-proceedings/proceedings-delivery-reception.service';
import { TypeEvents } from './../../scheduled-maintenance/interfaces/typeEvents';
import { settingKeysProceedings, settingsGoods } from './const';

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
  params = new BehaviorSubject<ListParams>(new ListParams());
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  elementToExport: any[];
  datepicker: any;
  source: LocalDataSource;
  paramsStatus: ListParams = new ListParams();
  data: IGoodsByProceeding[] = [];
  tiposEvento = TypeEvents;
  paramsTypes: ListParams = new ListParams();
  totalItems: number = 0;
  selecteds: IGoodsByProceeding[];
  selectedsForUpdate: IGoodsByProceeding[] = [];
  settingKeysProceedings = settingKeysProceedings;
  settingsGoods = settingsGoods;
  loadingExcel = false;
  flagDownload = false;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private service: MsIndicatorGoodsService,
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {
    super();
    this.prepareForm();
    this.statusActa.valueChanges.subscribe(x => {
      console.log(x);
      this.updateSettingsKeysProceedings(x);
      this.updateSettingsGoods(x);
      if (x === 'CERRADA') {
        if (this.selectedsForUpdate.length > 0) {
          this.detailService
            .updateMasive(this.selectedsForUpdate, this.actaId)
            .subscribe(x => {
              let goods = '';
              this.selectedsForUpdate.forEach((selected, index) => {
                goods +=
                  selected.no_bien +
                  (index < this.selecteds.length - 1 ? ',' : '');
              });
              this.onLoadToast(
                'success',
                'Exito',
                `Se actualizaron los bienes N° ${goods} `
              );
            });
        }
      }
    });
  }

  get statusActa() {
    return this.form.get('statusActa');
  }

  get statusActaValue() {
    return this.statusActa ? this.statusActa.value : 'CERRADA';
  }

  get claveActa() {
    return this.form.get('claveActa') ? this.form.get('claveActa').value : '';
  }

  get actaId() {
    return this.form.get('acta') ? this.form.get('acta').value : '';
  }

  private updateSettingsKeysProceedings(value = this.statusActaValue) {
    this.settingKeysProceedings = {
      ...this.settingKeysProceedings,
      actions: {
        ...this.settingKeysProceedings.actions,
        edit: value !== 'CERRADA',
      },
    };
    this.updateTableKeysProceedings(this.claveActa);
  }

  private updateTableKeysProceedings(keysProceedings: string) {
    let keys = [];
    let key = {};
    keysProceedings.split('/').forEach((letra, index) => {
      key = { ...key, [index]: letra };
    });
    keys.push(key);
    this.source = new LocalDataSource(keys);
  }

  private updateSettingsGoods(value = this.statusActaValue) {
    this.settingsGoods = {
      ...this.settingsGoods,
      actions: {
        ...this.settingsGoods.actions,
        edit: value !== 'CERRADA',
        delete: value !== 'CERRADA',
      },
    };
    this.data = [...this.data];
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
    this.updateSettingsKeysProceedings();
    this.updateTableKeysProceedings(acta.keysProceedings);
    this.updateSettingsGoods();
  }

  nameExcel() {
    return (
      'Reporte Mantenimiento de Acta Entrega Recepción_' +
      this.claveActa +
      '.xlsx'
    );
  }

  exportExcel() {
    this.loadingExcel = true;
    this.service.getExcel(this.form.value).subscribe(x => {
      this.elementToExport = x;
      this.flagDownload = !this.flagDownload;
      console.log(x);
      this.loadingExcel = false;
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

  updateKeysProcedding(event: any) {
    console.log(event);
    let { newData, confirm } = event;
    confirm.resolve(newData);
    this.form
      .get('claveActa')
      .setValue(
        newData[0] +
          '/' +
          newData[1] +
          '/' +
          newData[2] +
          '/' +
          newData[3] +
          '/' +
          newData[4] +
          '/' +
          newData[5] +
          '/' +
          newData[6] +
          '/' +
          newData[7]
      );
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
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      this.getData();
    });
  }

  getData() {
    const idActa = this.actaId;
    console.log(idActa);
    console.log(new Date());
    console.log(new Date().toISOString());
    let params = this.params.getValue();
    if (idActa && idActa.length > 0) {
      this.service.getGoodsByProceeding(idActa).subscribe({
        next: response => {
          this.data = [...response.data].slice(
            (params.page - 1) * params.limit,
            params.page * params.limit
          );
          this.totalItems = response.data.length;
        },
        error: err => {
          this.data = [];
          this.totalItems = 0;
        },
      });
    }
  }

  private showMessageGoodsNotRemoved(notRemoveds: string[]) {
    let goods = '';
    if (notRemoveds.length > 0) {
      notRemoveds.forEach((selected, index) => {
        goods += selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      return `pero no se pudieron los bienes N° ${goods}`;
    } else {
      return '';
    }
  }

  private showMessageGoodsRemoved(removeds: string[], notRemoveds: string[]) {
    let goods = '';
    if (removeds.length > 0) {
      removeds.forEach((selected, index) => {
        goods += selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      this.onLoadToast(
        'success',
        'Exito',
        `Se eliminaron los bienes N° ${goods} ` +
          this.showMessageGoodsNotRemoved(notRemoveds)
      );
    }
  }

  deleteGoods() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar estos registros?'
    ).then(question => {
      if (question.isConfirmed) {
        this.detailService.deleteMasive(this.selecteds, this.actaId).subscribe({
          next: response => {
            console.log(response);
            const removeds: string[] = [];
            const notRemoveds: string[] = [];
            response.forEach(item => {
              const { deleted } = item as IDeleted;
              const { error } = item as INotDeleted;
              if (deleted) {
                removeds.push(deleted);
              }
              if (error) {
                notRemoveds.push(error);
              }
            });
            this.showMessageGoodsRemoved(removeds, notRemoveds);
            this.getData();
          },
          error: err => {
            let bienes = '';
            this.selecteds.forEach((selected, index) => {
              bienes +=
                selected.no_bien +
                (index < this.selecteds.length - 1 ? ',' : '');
            });
            this.onLoadToast(
              'error',
              'ERROR',
              `No se pudieron eliminar los bienes N° ${bienes}`
            );
          },
        });
      }
    });
  }

  updateGoods() {
    const modalRef = this.modalService.show(RangePickerModalComponent, {
      class: 'modal-md modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) {
        console.log(data);
        const { rangoFecha } = data;
        this.data = [
          ...this.data.map(x => {
            return {
              ...x,
              fec_aprobacion_x_admon: firstFormatDate(new Date(rangoFecha[0])),
              fec_indica_usuario_aprobacion: firstFormatDate(
                new Date(rangoFecha[1])
              ),
            };
          }),
        ];
        this.selectedsForUpdate = [...this.data];
        // this.service.updateMasive(this.data).subscribe({
        //   next: response => {
        //     this.getData();
        //     this.onLoadToast('success', 'Exito', `Se actualizaron los bienes`);
        //   },
        //   error: err => {
        //     this.onLoadToast(
        //       'error',
        //       'ERROR',
        //       `No se pudieron actualizar los bienes`
        //     );
        //   },
        // });
      }
    });
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
