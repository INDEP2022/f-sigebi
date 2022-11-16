import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCAttributesRegLogicalTablesModalComponent } from '../c-p-c-attributes-reg-logical-tables-modal/c-p-c-attributes-reg-logical-tables-modal.component';
import { ATT_REG_LOG_TAB_COLUMNS } from './attributes-reg-logical-tables-columns';

@Component({
  selector: 'app-c-p-c-attributes-reg-logical-tables',
  templateUrl: './c-p-c-attributes-reg-logical-tables.component.html',
  styles: [],
})
export class CPCAttributesRegLogicalTablesComponent
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
      columns: { ...ATT_REG_LOG_TAB_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<CPCAttributesRegLogicalTablesModalComponent>) {
    const modalRef = this.modalService.show(
      CPCAttributesRegLogicalTablesModalComponent,
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

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      name: 'NOMBRE 01',
      type: 'TIPO DE TABLA 01',
      noAtt: 1,
      description: 'DESCRIPCIÓN 01',
      format: 'FORMATO 01',
      maxLong: 10,
    },
    {
      name: 'NOMBRE 02',
      type: 'TIPO DE TABLA 02',
      noAtt: 2,
      description: 'DESCRIPCIÓN 02',
      format: 'FORMATO 02',
      maxLong: 20,
    },
    {
      name: 'NOMBRE 03',
      type: 'TIPO DE TABLA 03',
      noAtt: 3,
      description: 'DESCRIPCIÓN 03',
      format: 'FORMATO 03',
      maxLong: 30,
    },
    {
      name: 'NOMBRE 04',
      type: 'TIPO DE TABLA 04',
      noAtt: 4,
      description: 'DESCRIPCIÓN 04',
      format: 'FORMATO 04',
      maxLong: 40,
    },
  ];
}
