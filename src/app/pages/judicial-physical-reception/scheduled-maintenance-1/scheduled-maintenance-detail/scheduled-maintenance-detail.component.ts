import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { RangePickerModalComponent } from 'src/app/@standalone/modals/range-picker-modal/range-picker-modal.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { firstFormatDate } from 'src/app/shared/utils/date';
import { IProceedingDeliveryReception } from './../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { TypeEvents } from './../../scheduled-maintenance/interfaces/typeEvents';
import { dataDummy, settingKeysProceedings, settingsGoods } from './const';
import { IscheduleMaintenanceDetail } from './interfaces';

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
  datepicker: any;
  source: LocalDataSource;
  paramsStatus: ListParams = new ListParams();
  data: IscheduleMaintenanceDetail[] = [];
  tiposEvento = TypeEvents;
  paramsTypes: ListParams = new ListParams();
  totalItems: number = 0;
  selecteds: IscheduleMaintenanceDetail[];
  settingKeysProceedings = settingKeysProceedings;
  settingsGoods = settingsGoods;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private service: ProceedingsDetailDeliveryReceptionService
  ) {
    super();
    this.prepareForm();
    this.statusActa.valueChanges.subscribe(x => {
      console.log(x);
      this.updateSettingsKeysProceedings(x);
    });
  }

  get statusActa() {
    return this.form.get('statusActa');
  }

  get statusActaValue() {
    return this.statusActa ? this.statusActa.value : 'CERRADA';
  }

  private updateSettingsKeysProceedings(value = this.statusActaValue) {
    this.settingKeysProceedings = {
      ...this.settingKeysProceedings,
      actions: {
        ...this.settingKeysProceedings.actions,
        edit: value !== 'CERRADA',
      },
    };
    this.updateTableKeysProceedings(this.form.get('claveActa').value);
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
  }

  return() {
    this.location.back();
  }
  updateGoodsRow(event: any) {
    console.log(event);
    let { newData, confirm } = event;
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
      this.getData(params);
    });
  }

  getData(params: ListParams) {
    this.data = dataDummy.slice(
      (params.page - 1) * params.limit,
      params.page * params.limit
    );
    this.totalItems = dataDummy.length;
  }

  deleteGoods() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar estos registros?'
    ).then(question => {
      if (question.isConfirmed) {
        this.service.deleteMasive(this.selecteds).subscribe({
          next: response => {
            let bienes = '';
            this.selecteds.forEach((selected, index) => {
              bienes +=
                selected.no_bien +
                (index < this.selecteds.length - 1 ? ',' : '');
            });
            this.onLoadToast(
              'success',
              'Exito',
              `Se eliminaron los bienes N° ${bienes}`
            );
            // this.getData();
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

  rowsSelected(event: { selected: IscheduleMaintenanceDetail[] }) {
    this.selecteds = event.selected;
  }

  showDeleteAlert(item: IscheduleMaintenanceDetail) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        // this.service.deleteById(item).subscribe({
        //   next: response => {
        //     console.log(response);
        //     this.getData(null);
        //     this.onLoadToast(
        //       'success',
        //       'Exito',
        //       `Se elimino el bien N° ${item.no_bien}`
        //     );
        //   },
        //   error: err => {
        //     console.log(err);
        //     this.onLoadToast(
        //       'error',
        //       'ERROR',
        //       `No se pudo eliminar el bien N° ${item.no_bien}`
        //     );
        //   },
        // });
      }
    });
  }
}
