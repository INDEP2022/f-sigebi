import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MailModalComponent } from '../mail-modal/mail-modal.component';
import { EMAIL_COLUMNS } from './email-columns';
//Models
import { IUserAccessAreas } from 'src/app/core/models/catalogs/users-access-areas-model';
//servicios

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styles: [],
})
export class MailComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  userAccessAreas: IUserAccessAreas[] = [];

  constructor(
    private modalService: BsModalService,
    private usersService: UsersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      edit: {
        editButtonContent: '<i class="fa fa-eye text-success mx-2"></i>',
      },
      columns: { ...EMAIL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSegRelEmail());
  }

  getSegRelEmail() {
    this.loading = true;
    this.usersService.getAllSegXAreasFind(this.params.getValue()).subscribe({
      next: response => {
        this.userAccessAreas = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(userAccessAreas?: IUserAccessAreas) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      userAccessAreas,
      callback: (next: boolean) => {
        if (next) this.getSegRelEmail();
      },
    };
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
