import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MnceAdmDepositoryAuditorModalComponent } from '../mnce-adm-depository-auditor-modal/mnce-adm-depository-auditor-modal.component';
import { ADM_DEPOSITORY_AUDITOR_COLUMNS } from './adm-depository-auditor-columns';

@Component({
  selector: 'app-mnce-adm-depository-auditor',
  templateUrl: './mnce-adm-depository-auditor.component.html',
  styles: [],
})
export class MnceAdmDepositoryAuditorComponent
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
      columns: { ...ADM_DEPOSITORY_AUDITOR_COLUMNS },
    };
  }

  ngOnInit(): void {}

  openModal(context?: Partial<MnceAdmDepositoryAuditorModalComponent>) {
    const modalRef = this.modalService.show(
      MnceAdmDepositoryAuditorModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    // modalRef.content.refresh.subscribe(next => {
    //   if (next) this.getData();
    // });
  }

  data = [
    {
      cve: 'NOM_PERSONA',
      description: 'DESCRIPCIÓN',
    },
  ];
}
