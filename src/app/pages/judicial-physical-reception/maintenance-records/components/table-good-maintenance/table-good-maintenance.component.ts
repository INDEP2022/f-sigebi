import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
import { DatePickerComponent } from 'src/app/shared/render-components/date-picker/date-picker.component';
import { firstFormatDateToSecondFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-table-good-maintenance',
  templateUrl: './table-good-maintenance.component.html',
  styles: [],
})
export class TableGoodMaintenanceComponent extends BasePage implements OnInit {
  @Input() override loading = false;
  statusActa = 'ABIERTA';
  @Input() page: number;
  @Input() totalItems: number;
  @Input() data: IDetailProceedingsDeliveryReception[];
  @Output() updateData = new EventEmitter();
  @Output() showDeleteAlert = new EventEmitter();
  @Output() updateRowEvent = new EventEmitter();
  @Output() rowsSelected = new EventEmitter();
  constructor(private service: ProceedingsDetailDeliveryReceptionService) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      mode: 'inline',
      actions: { ...this.settings.actions, position: 'left' },
      edit: {
        editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
        saveButtonContent:
          '<i class="fa fa-solid fa-check text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="fa fa-solid fa-ban text-danger mx-2"></i>',
        confirmSave: true,
      },

      columns: {
        numberGood: {
          title: 'No. Bien',
          sort: false,
          editable: false,
        },
        amount: {
          title: 'Cantidad',
          sort: false,
          editable: false,
        },
        description: {
          title: 'Descripción',
          sort: false,
          editable: false,
        },
        approvedDateXAdmon: {
          title: 'Fecha de Aprobación',
          sort: false,
          editor: {
            type: 'custom',
            component: DatePickerComponent,
          },
        },
        dateIndicatesUserApproval: {
          title: 'Fecha Indica Usuario Aprobación',
          sort: false,
          editor: {
            type: 'custom',
            component: DatePickerComponent,
          },
        },
        approvedUserXAdmon: {
          title: 'Usuario Aprobo por Admon',
          sort: false,
          editable: false,
        },
        warehouse: {
          title: 'Almacén',
          sort: false,
          editable: false,
        },
        vault: {
          title: 'Bóveda',
          sort: false,
          editable: false,
        },
        approvedXAdmon: {
          title: 'Aprobado',
          sort: false,
          type: 'custom',
          renderComponent: CheckboxDisabledElementComponent,
          valuePrepareFunction: (
            value: any,
            row: IDetailProceedingsDeliveryReception
          ) => {
            // DATA FROM HERE GOES TO renderComponent
            return {
              checked:
                row.approvedXAdmon === 'S' || row.approvedXAdmon === true
                  ? true
                  : false,
              disabled: true,
            };
          },
          editor: {
            type: 'custom',
            component: CheckboxDisabledElementComponent,
          },
        },
        received: {
          title: 'Recibido',
          sort: false,
          type: 'custom',
          editable: true,
          valuePrepareFunction: (
            value: any,
            row: IDetailProceedingsDeliveryReception
          ) => {
            // DATA FROM HERE GOES TO renderComponent
            return {
              checked:
                row.received === 'S' || row.received === true ? true : false,
              disabled: true,
            };
          },
          renderComponent: CheckboxDisabledElementComponent,
          editor: {
            type: 'custom',
            component: CheckboxDisabledElementComponent,
          },
        },
      },
    };
  }

  ngOnInit(): void {}

  updateRow(event: {
    newData: IDetailProceedingsDeliveryReception;
    confirm: any;
  }) {
    // console.log(row);
    let { newData, confirm } = event;

    delete newData.good;
    delete newData.description;
    delete newData.status;
    delete newData.warehouse;
    delete newData.vault;
    newData = {
      ...newData,
      approvedXAdmon:
        typeof newData.approvedXAdmon == 'boolean'
          ? newData.approvedXAdmon === true
            ? 'S'
            : 'N'
          : newData.approvedXAdmon,
      received:
        typeof newData.received == 'boolean'
          ? newData.received === true
            ? 'S'
            : 'N'
          : newData.received,
      approvedDateXAdmon: firstFormatDateToSecondFormatDate(
        newData.approvedDateXAdmon + ''
      ),
      dateIndicatesUserApproval: firstFormatDateToSecondFormatDate(
        newData.dateIndicatesUserApproval + ''
      ),
    };
    if (!newData.createdLocal) {
      this.service.update(newData).subscribe({
        next: response => {
          this.updateRowEvent.emit();
          this.alert(
            'success',
            'Bien ' + newData.numberGood,
            'Actualizado correctamente'
          );
        },
        error: err => {},
      });
    }
  }
}
