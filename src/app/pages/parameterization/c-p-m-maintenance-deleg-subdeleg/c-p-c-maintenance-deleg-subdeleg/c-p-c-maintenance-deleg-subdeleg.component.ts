import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCMaintenanceDelegSubdelegModalComponent } from '../c-p-c-maintenance-deleg-subdeleg-modal/c-p-c-maintenance-deleg-subdeleg-modal.component';
import { MAINTENANCE_DELEG_SUB_COLUMNS } from './maintenance-deleg-sub-columns';

@Component({
  selector: 'app-c-p-c-maintenance-deleg-subdeleg',
  templateUrl: './c-p-c-maintenance-deleg-subdeleg.component.html',
  styles: [],
})
export class CPCMaintenanceDelegSubdelegComponent
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
      columns: { ...MAINTENANCE_DELEG_SUB_COLUMNS },
    };
  }

  ngOnInit(): void {}

  openModal(context?: Partial<CPCMaintenanceDelegSubdelegModalComponent>) {
    const modalRef = this.modalService.show(
      CPCMaintenanceDelegSubdelegModalComponent,
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

  data = [
    {
      idDeleg: '0',
      descriptionDeleg: 'OFICINAS CENTRALES',
      idSubDeleg: '0',
      descriptionSubDeleg: 'OFICINAS CENTRALES',
    },
  ];
}
