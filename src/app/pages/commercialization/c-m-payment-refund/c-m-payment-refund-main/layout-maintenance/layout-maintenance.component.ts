import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LayoutMaintenanceModalComponent } from '../layout-maintenance-modal/layout-maintenance-modal.component';
import { LayoutMaintenanceStructureModalComponent } from '../layout-maintenance-structure-modal/layout-maintenance-structure-modal.component';
import { TableCheckComponent } from './../table-check/table-check.component';
import {
  LAYOUT_COLUMNS,
  LAYOUT_STRUCTURE_COLUMNS,
} from './layout-maintenance-columns';

@Component({
  selector: 'app-layout-maintenance',
  templateUrl: './layout-maintenance.component.html',
  styles: [],
})
export class LayoutMaintenanceComponent extends BasePage implements OnInit {
  editedRow: any;
  positions: number[] = [];
  selectedLayout: any[] = [];
  layoutParams = new BehaviorSubject<ListParams>(new ListParams());
  structureParams = new BehaviorSubject<ListParams>(new ListParams());
  layoutTotalItems: number = 0;
  structureTotalItems: number = 0;
  layoutColumns: any[] = [];
  structureColumns: any[] = [];
  layoutSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: true,
    },
  };
  structureSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: true,
    },
  };
  @Output() onReturn = new EventEmitter<boolean>();

  layoutTestData = [
    {
      id: 1,
      description: 'BANCOMER',
      screen: 'FCOMERCTLDPAG',
      table: 'VW_COMER_PAGOS_SADEV',
      filter: 'SUBSTR(CLABE_INTERBANCARIA,1,3) = "012"',
      status: 'ACTIVO',
    },
    {
      id: 2,
      description: 'INTERBANCARIA',
      screen: 'FCOMERCTLDPAG',
      table: 'VW_COMER_PAGOS_SADEV',
      filter: 'SUBSTR(CLABE_INTERBANCARIA,1,3) <> "012"',
      status: 'INACTIVO',
    },
  ];

  structureTestData = [
    {
      position: 1,
      column: 'CLABE_INTERBANCARIA',
      type: 'VARCHAR2',
      length: 18,
      constant: '',
      fillCharacter: '0',
      fillPosition: 'Izquierda',
      decimals: '',
      dateFormat: '',
    },
    {
      position: 2,
      column: '',
      type: '',
      length: 18,
      constant: '196363768',
      fillCharacter: '0',
      fillPosition: 'Izquierda',
      decimals: '',
      dateFormat: '',
    },
    {
      position: 3,
      column: '',
      type: '',
      length: 3,
      constant: 'MXP',
      fillCharacter: '_',
      fillPosition: 'Derecha',
      decimals: '',
      dateFormat: '',
    },
    {
      position: 4,
      column: 'MONTO',
      type: 'NUMBER',
      length: 16,
      constant: '',
      fillCharacter: '0',
      fillPosition: 'Izquierda',
      decimals: 2,
      dateFormat: '',
    },
    {
      position: 5,
      column: '',
      type: '',
      length: 24,
      constant: 'S-',
      fillCharacter: '_',
      fillPosition: 'Izquierda',
      decimals: '',
      dateFormat: '',
    },
    {
      position: 6,
      column: 'FOLIO_PAGO_SIRSAE',
      type: 'NUMBER',
      length: 6,
      constant: '',
      fillCharacter: '0',
      fillPosition: 'Izquierda',
      decimals: '0',
      dateFormat: '',
    },
  ];

  constructor(private modalService: BsModalService) {
    super();
    this.layoutSettings.columns = LAYOUT_COLUMNS;
    this.structureSettings.columns = LAYOUT_STRUCTURE_COLUMNS;
    this.layoutSettings.columns = {
      ...this.layoutSettings.columns,
      status: {
        title: 'Activo',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckComponent,
      },
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  return() {
    this.onReturn.emit(true);
  }

  getData() {
    this.layoutColumns = this.layoutTestData;
    this.layoutTotalItems = this.layoutColumns.length;
  }

  loadStructure(row: any[]) {
    this.selectedLayout = row;
    if (row.length > 0) {
      this.structureColumns = this.structureTestData;
      this.structureTotalItems = this.structureColumns.length;
      this.structureColumns.forEach(e => this.positions.push(e.position));
    } else {
      this.structureColumns = [];
      this.structureTotalItems = 0;
      this.positions = [];
    }
  }

  openFormLayout(layout?: any) {
    this.openModalLayout({ layout });
    this.editedRow = layout;
  }

  openModalLayout(context?: Partial<LayoutMaintenanceModalComponent>) {
    const modalRef = this.modalService.show(LayoutMaintenanceModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onAdd.subscribe(data => {
      if (data) this.addRowLayout(data);
    });
    modalRef.content.onEdit.subscribe(data => {
      if (data) this.editRowLayout(data);
    });
  }

  addRowLayout(row: any) {
    // LLamar servico para agregar registro
    console.log(row);
  }

  editRowLayout(row: any) {
    // LLamar servico para agregar registro
    console.log(row);
  }

  openFormStructure(structure?: any) {
    this.openModalStructure({ structure });
    this.editedRow = structure;
  }

  openModalStructure(
    context?: Partial<LayoutMaintenanceStructureModalComponent>
  ) {
    const modalRef = this.modalService.show(
      LayoutMaintenanceStructureModalComponent,
      {
        initialState: { ...context, positions: this.positions },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onAdd.subscribe(data => {
      if (data) this.addRowStructure(data);
    });
    modalRef.content.onEdit.subscribe(data => {
      if (data) this.editRowStructure(data);
    });
  }

  addRowStructure(row: any) {
    // LLamar servico para agregar registro
    console.log(row);
  }

  editRowStructure(row: any) {
    // LLamar servico para agregar registro
    console.log(row);
  }

  duplicateLayout() {
    // Llamar servicio para duplicar layout
    console.log(this.selectedLayout);
  }

  askDelete(row: any, type: string) {
    this.alertQuestion(
      'question',
      '¿Desea eliminar este registro?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        switch (type) {
          case 'LAYOUT':
            this.deleteLayout(row);
            break;
          case 'STRUCTURE':
            this.deleteStructure(row);
            break;
          default:
            break;
        }
      }
    });
  }

  deleteLayout(layout: any) {
    // Llamar servicio para eliminar registro
    console.log(layout);
  }

  deleteStructure(layout: any) {
    // Llamar servicio para eliminar registro
    console.log(layout);
  }
}
