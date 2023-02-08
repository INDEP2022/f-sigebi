import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MailModalComponent } from '../mail-modal/mail-modal.component';
import { EMAIL_COLUMNS } from './email-columns';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styles: [],
})
export class MailComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...EMAIL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  columns: any[] = [];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  openForm() {
    const modalConfig = MODAL_CONFIG;

    this.modalService.show(MailModalComponent, modalConfig);
  }

  data = [
    {
      cveScreen: 'FADMAMPAROS',
      noRegistro: 381165438,
      user: 'OST12488',
      name: 'Pedrito',
      delegation: 'Tijuana',
      typeD: 'P',
    },
  ];
}
