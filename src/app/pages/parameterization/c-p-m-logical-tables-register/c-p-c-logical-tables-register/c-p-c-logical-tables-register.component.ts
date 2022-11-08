import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCLogicalTablesRegisterModalComponent } from '../c-p-c-logical-tables-register-modal/c-p-c-logical-tables-register-modal.component';
import { LOGICAL_TABLES_REGISTER_COLUMNS } from './logical-tables-register-columns';

@Component({
  selector: 'app-c-p-c-logical-tables-register',
  templateUrl: './c-p-c-logical-tables-register.component.html',
  styles: [],
})
export class CPCLogicalTablesRegisterComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...LOGICAL_TABLES_REGISTER_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<CPCLogicalTablesRegisterModalComponent>) {
    const modalRef = this.modalService.show(
      CPCLogicalTablesRegisterModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  data = [
    {
      noTable: 1,
      name: 'CAT_ENTFED',
      access: 'Acceso único',
      type: 'Una clave',
      description: 'EEntidades Federativas',
    },
    {
      noTable: 2,
      name: 'Delitos',
      access: 'Acceso único',
      type: 'Una clave',
      description: 'Catálogos de delitos',
    },
    {
      noTable: 3,
      name: 'CAT_MON',
      access: 'Acceso único',
      type: 'Cinco claves',
      description: 'Catálogos de monedas',
    },
    {
      noTable: 4,
      name: 'COLORES',
      access: 'Acceso único',
      type: 'Una clave',
      description: 'Catálogos de colores',
    },
    {
      noTable: 6,
      name: 'TASACETES',
      access: 'Acceso por transacción',
      type: 'Cinco claves',
      description: 'Tipos de cetes a 28 días',
    },
    {
      noTable: 7,
      name: 'NOMBRAMIEN',
      access: 'Acceso único',
      type: 'Una clave',
      description: 'Tipos de nombramientos',
    },
    {
      noTable: 8,
      name: 'GIROSEMPR',
      access: 'Acceso único',
      type: 'Una clave',
      description: 'Giros de empresas',
    },
  ];
}
