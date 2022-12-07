import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared/base-page';
import { entity_class_data } from './data';
import { ENTITY_CLASS_COLUMNS } from './entity-classification-columns';

@Component({
  selector: 'app-entity-classification',
  templateUrl: './entity-classification.component.html',
  styles: [],
})
export class EntityClassificationComponent extends BasePage implements OnInit {
  rowSelected: boolean = false;
  selectedRow: any = null;

  data: LocalDataSource = new LocalDataSource();

  //Columns
  columns = ENTITY_CLASS_COLUMNS;

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: '',
      // rowClassFunction: (row: any) => {
      //   if (row.data.available) {
      //     return 'text-success';
      //   } else {
      //     return 'text-danger';
      //   }
      // },
      columns: { ...ENTITY_CLASS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data.load(entity_class_data);
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
