import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPMRegisterKeysLogicalTablesModalComponent } from '../c-p-m-register-keys-logical-tables-modal/c-p-m-register-keys-logical-tables-modal.component';
import { REGISTER_KEYS_LOGICAL_COLUMNS } from './register-keys-logical-columns';

@Component({
  selector: 'app-c-p-c-register-keys-logical-tables',
  templateUrl: './c-p-c-register-keys-logical-tables.component.html',
  styles: [],
})
export class CPCRegisterKeysLogicalTablesComponent
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
      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<CPMRegisterKeysLogicalTablesModalComponent>) {
    const modalRef = this.modalService.show(
      CPMRegisterKeysLogicalTablesModalComponent,
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
      name: 'CAT_ENTFED',
      description: 'ENTIDADES FEDERATIVAS',
      type1: true,
      type5: false,
      cve1: 'NÚMERO',
      format1: 'Numérico',
      minLong1: 1,
      maxLong1: 2,
    },
    {
      name: 'CAT_DELEG',
      description: 'DELEGACIONES',
      type1: true,
      type5: true,
      cve1: 'NÚMERO',
      format1: 'Numérico',
      minLong1: 4,
      maxLong1: 9,
      cve2: 'NÚMERO 2',
      format2: 'Numérico 2',
      minLong2: 4,
      maxLong2: 9,
    },
    {
      name: 'CAT_SUBDELEG',
      description: 'SUBDELEGACIONES',
      type1: true,
      type5: false,
      cve1: 'NÚMERO',
      format1: 'Numérico',
      minLong1: 2,
      maxLong1: 4,
    },
    {
      name: 'CAT_BIENES_MUEBLES',
      description: 'BIENES MUEBLES',
      type1: true,
      type5: true,
      cve1: 'NÚMERO 1',
      format1: 'Numérico 1',
      minLong1: 1,
      maxLong1: 5,
      cve2: 'NÚMERO 2',
      format2: 'Numérico 2',
      minLong2: 1,
      maxLong2: 5,
      cve3: 'NÚMERO 3',
      format3: 'Numérico 3',
      minLong3: 1,
      maxLong3: 5,
      cve4: 'NÚMERO 4',
      format4: 'Numérico 4',
      minLong4: 1,
      maxLong4: 5,
      cve5: 'NÚMERO 5',
      format5: 'Numérico 5',
      minLong5: 1,
      maxLong5: 5,
    },
  ];
}
