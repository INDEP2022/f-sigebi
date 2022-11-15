import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCMnceAdmDepositoryAuditorModalComponent } from '../c-p-c-mnce-adm-depository-auditor-modal/c-p-c-mnce-adm-depository-auditor-modal.component';
import { ADM_DEPOSITORY_AUDITOR_COLUMNS } from './adm-depository-auditor-columns';

@Component({
  selector: 'app-c-p-c-mnce-adm-depository-auditor',
  templateUrl: './c-p-c-mnce-adm-depository-auditor.component.html',
  styles: [],
})
export class CPCMnceAdmDepositoryAuditorComponent
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

  openModal(context?: Partial<CPCMnceAdmDepositoryAuditorModalComponent>) {
    const modalRef = this.modalService.show(
      CPCMnceAdmDepositoryAuditorModalComponent,
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
