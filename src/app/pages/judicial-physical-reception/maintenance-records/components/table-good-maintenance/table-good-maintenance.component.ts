import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
import { DatePickerComponent } from 'src/app/shared/render-components/date-picker/date-picker.component';

@Component({
  selector: 'app-table-good-maintenance',
  templateUrl: './table-good-maintenance.component.html',
  styles: [],
})
export class TableGoodMaintenanceComponent extends BasePage implements OnInit {
  @Input() statusActa = 'CERRADA';
  @Input() totalItems: number;
  @Input() data: IDetailProceedingsDeliveryReception[];
  @Output() updateData = new EventEmitter();
  @Output() updateRowEvent = new EventEmitter();
  @Output() rowsSelected = new EventEmitter();
  constructor(private service: ProceedingsDetailDeliveryReceptionService) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      mode: 'inline',
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
          title: 'N° Bien',
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
          title: 'Fec. Aprobación',
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
        dateIndicatesUserApproval: {
          title: 'Fec. Indica Usuario Aprobación',
          sort: false,
          editor: {
            type: 'custom',
            component: DatePickerComponent,
          },
        },
        warehouse: {
          title: 'Almacén',
          sort: false,
        },
        vault: {
          title: 'Boveda',
          sort: false,
        },
        approvedXAdmon: {
          title: 'Apr.',
          sort: false,
          type: 'custom',
          renderComponent: CheckboxDisabledElementComponent,
          valuePrepareFunction: (
            value: any,
            row: IDetailProceedingsDeliveryReception
          ) => {
            // DATA FROM HERE GOES TO renderComponent
            return {
              checked: row.approvedXAdmon === 'S' ? true : false,
              disabled: true,
            };
          },
          editor: {
            type: 'custom',
            component: CheckboxDisabledElementComponent,
          },
        },
        received: {
          title: 'Rec.',
          sort: false,
          type: 'custom',
          editable: true,
          valuePrepareFunction: (
            value: any,
            row: IDetailProceedingsDeliveryReception
          ) => {
            // DATA FROM HERE GOES TO renderComponent
            return {
              checked: row.received === 'S' ? true : false,
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

  updateRow(row: any) {
    // console.log(row);
    delete row.good;
    delete row.description;
    delete row.status;
    row = {
      ...row,
      approvedXAdmon:
        typeof row.approvedXAdmon == 'boolean'
          ? row.approvedXAdmon === true
            ? 'S'
            : 'N'
          : row.approvedXAdmon,
      received:
        typeof row.received == 'boolean'
          ? row.received === true
            ? 'S'
            : 'N'
          : row.received,
    };

    this.service.update(row).subscribe({
      next: response => {
        this.updateRowEvent.emit();
        this.onLoadToast('success', 'Bien actualizado', '');
      },
      error: err => {},
    });
  }
}
