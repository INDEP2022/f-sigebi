import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LogicalTablesRegisterModalComponent } from '../logical-tables-register-modal/logical-tables-register-modal.component';
import { LOGICAL_TABLES_REGISTER_COLUMNS } from './logical-tables-register-columns';
//models
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
//service
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logical-tables-register',
  templateUrl: './logical-tables-register.component.html',
  styles: [],
})
export class LogicalTablesRegisterComponent extends BasePage implements OnInit {
  dinamicTables: ITables[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private dinamicTablesService: DinamicTablesService
  ) {
    super();
    this.settings.columns = LOGICAL_TABLES_REGISTER_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDinamicTables());
  }

  getDinamicTables() {
    this.loading = true;
    this.dinamicTablesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.dinamicTables = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(dinamicTables?: ITables) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      dinamicTables,
      callback: (next: boolean) => {
        if (next) this.getDinamicTables();
      },
    };
    this.modalService.show(LogicalTablesRegisterModalComponent, modalConfig);
  }

  showDeleteAlert(dinamicTables: ITables) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(dinamicTables.table);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.dinamicTablesService.remove(id).subscribe({
      next: () => this.getDinamicTables(),
    });
  }

  // openForm(allotment?: any) {
  //   this.openModal({ allotment });
  // }

  // openModal(context?: Partial<LogicalTablesRegisterModalComponent>) {
  //   const modalRef = this.modalService.show(
  //     LogicalTablesRegisterModalComponent,
  //     {
  //       initialState: { ...context },
  //       class: 'modal-lg modal-dialog-centered',
  //       ignoreBackdropClick: true,
  //     }
  //   );
  //   modalRef.content.refresh.subscribe(next => {
  //     if (next) this.getData();
  //   });
  // }

  // getPagination() {
  //   this.columns = this.data;
  //   this.totalItems = this.columns.length;
  // }

  // getData() {
  //   this.loading = true;
  //   this.columns = this.data;
  //   this.totalItems = this.data.length;
  //   this.loading = false;
  // }

  // data = [
  //   {
  //     noTable: 1,
  //     name: 'CAT_ENTFED',
  //     access: 'Acceso único',
  //     type: 'Una clave',
  //     description: 'EEntidades Federativas',
  //   },
  //   {
  //     noTable: 2,
  //     name: 'Delitos',
  //     access: 'Acceso único',
  //     type: 'Una clave',
  //     description: 'Catálogos de delitos',
  //   },
  //   {
  //     noTable: 3,
  //     name: 'CAT_MON',
  //     access: 'Acceso único',
  //     type: 'Cinco claves',
  //     description: 'Catálogos de monedas',
  //   },
  //   {
  //     noTable: 4,
  //     name: 'COLORES',
  //     access: 'Acceso único',
  //     type: 'Una clave',
  //     description: 'Catálogos de colores',
  //   },
  //   {
  //     noTable: 6,
  //     name: 'TASACETES',
  //     access: 'Acceso por transacción',
  //     type: 'Cinco claves',
  //     description: 'Tipos de cetes a 28 días',
  //   },
  //   {
  //     noTable: 7,
  //     name: 'NOMBRAMIEN',
  //     access: 'Acceso único',
  //     type: 'Una clave',
  //     description: 'Tipos de nombramientos',
  //   },
  //   {
  //     noTable: 8,
  //     name: 'GIROSEMPR',
  //     access: 'Acceso único',
  //     type: 'Una clave',
  //     description: 'Giros de empresas',
  //   },
  // ];
}
