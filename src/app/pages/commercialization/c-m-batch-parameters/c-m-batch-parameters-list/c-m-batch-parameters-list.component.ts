import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EventSelectionComponent } from '../components/event-selection/event-selection.component';
import { BATCH_PARAMETERS_COLUMNS } from './batch-parameters-columns';

@Component({
  selector: 'app-c-m-batch-parameters-list',
  templateUrl: './c-m-batch-parameters-list.component.html',
  styles: [],
})
export class CMBatchParametersListComponent extends BasePage implements OnInit {
  adding: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramColumns: any[] = [];
  filterRow: any;
  addOption: any;
  addRowElement: any;
  cancelBtn: any;
  cancelEvent: any;
  createButton: string =
    '<span class="btn btn-success active font-size-12 me-2 mb-2 py-2 px-2">Agregar</span>';
  saveButton: string =
    '<span class="btn btn-info active font-size-12 me-2 mb-2 py-2 px-2">Actualizar</span>';
  cancelButton: string =
    '<span class="btn btn-warning active font-size-12 text-black me-2 mb-2 py-2 px-2 cancel">Cancelar</span>';

  paramSettings = {
    ...TABLE_SETTINGS,
    selectedRowIndex: -1,
    mode: 'internal',
    hideSubHeader: false,
    filter: {
      inputClass: 'd-none',
    },
    attr: {
      class: 'table-bordered normal-hover',
    },
    add: {
      createButtonContent: this.createButton,
      cancelButtonContent: this.cancelButton,
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
  };

  constructor() {
    super();
    this.paramSettings.columns = BATCH_PARAMETERS_COLUMNS;
    this.paramSettings.actions.delete = true;
    this.paramSettings.columns = {
      ...this.paramSettings.columns,
      event: {
        title: 'Evento',
        sort: false,
        type: 'html',
        width: '25%',
        editor: {
          type: 'custom',
          component: EventSelectionComponent,
        },
      },
    };
  }

  ngOnInit(): void {
    this.hideFilters();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSearch());
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  hideFilters() {
    setTimeout(() => {
      let filterArray = document.getElementsByClassName('ng2-smart-filters');
      this.filterRow = filterArray.item(0);
      this.filterRow.classList.add('d-none');
      this.addOption = document
        .getElementsByClassName('ng2-smart-action-add-add')
        .item(0);
    }, 200);
  }

  addRow() {
    this.adding = true;
    this.addOption.click();
    setTimeout(() => {
      this.addRowElement = document
        .querySelectorAll('tr[ng2-st-thead-form-row]')
        .item(0);
      this.addRowElement.classList.add('row-no-pad');
      this.addRowElement.classList.add('add-row-height');
      this.cancelBtn = document.querySelectorAll('.cancel').item(0);
      this.cancelEvent = this.handleCancel.bind(this);
      this.cancelBtn.addEventListener('click', this.cancelEvent);
    }, 300);
  }

  handleCancel() {
    this.adding = false;
    this.cancelBtn = document.querySelectorAll('.cancel').item(0);
    this.cancelBtn.removeEventListener('click', this.cancelEvent);
  }

  alertTable() {
    this.onLoadToast(
      'error',
      'Campos incompletos',
      'Complete todos los campos para agregar un registro'
    );
  }

  addEntry(event: any) {
    let { newData, confirm } = event;
    if (!newData.event || newData.batch == '' || newData.warranty == '') {
      this.alertTable();
      return;
    }
    newData.event = newData.event.id;
    // Llamar servicio para agregar registro
    confirm.resolve(newData);
    this.adding = false;
    this.totalItems += 1;
  }

  editEntry(event: any) {
    let { newData, confirm } = event;
    if (!newData.event || newData.batch == '' || newData.warranty == '') {
      this.alertTable();
      return;
    }
    newData.event = newData.event.id;
    // Llamar servicio para eliminar
    confirm.resolve(newData);
  }

  deleteEntry(event: any) {
    let { confirm } = event;
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar el registro?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        // Llamar servicio para eliminar
        confirm.resolve(event.newData);
        this.totalItems -= 1;
      }
    });
  }
}
