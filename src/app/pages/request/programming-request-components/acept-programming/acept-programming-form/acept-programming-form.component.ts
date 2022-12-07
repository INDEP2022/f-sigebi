import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ConfirmProgrammingComponent } from '../../../shared-request/confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import { ESTATE_COLUMNS } from '../columns/estate-columns';
import { IUser, USER_COLUMNS } from '../columns/users-columns';

@Component({
  selector: 'app-acept-programming-form',
  templateUrl: './acept-programming-form.component.html',
  styles: [],
})
export class AceptProgrammingFormComponent extends BasePage implements OnInit {
  estateSettings = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS,
  };

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  usersData: IUser[] = [];
  estateData: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false, columns: USER_COLUMNS };
  }

  ngOnInit(): void {}

  confirm() {}

  signOffice() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showProg();
        }
      },
    };

    const confirmPro = this.modalService.show(
      ConfirmProgrammingComponent,
      config
    );
  }

  showProg() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.electronicSign();
        }
      },
    };
    const showProg = this.modalService.show(ShowProgrammingComponent, config);
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
