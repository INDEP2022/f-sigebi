import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-classification-goods-form',
  templateUrl: './classification-goods-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class ClassificationGoodsFormComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = true;
  totalItems: number = 0;
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
  rowSelected: boolean = false;
  selectedRow: any = null;
  //Columns
  columns = COLUMNS;
  constructor() {
    super();

    this.settings = {
      ...this.settings,
      actions: { add: false, edit: true, delete: false },
      edit: {
        editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.available) {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },
      columns: COLUMNS,
    };

    this.data = [
      {
        item: '4564564',
        numberInventory: '56567567',
        gestionNumber: 456456,
        descriptionGood: 'Descripción bien',
        numberSae: 456456,
        quantityEstate: 1,
        measureUnit: 456456,
        totalGoodsDelivered: 5435345,

        observation: 'ninguna',
      },
    ];
  }

  ngOnInit(): void {}

  save() {
    this.alert(
      'question',
      'confirmar',
      '¿Desea enviar la aprobación de bienes en especie para la programación con folio 56564?'
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  onSaveConfirm(event: any) {
    //console.log(event);
    event.confirm.resolve();
    /**
     * Call Service
     * **/

    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
