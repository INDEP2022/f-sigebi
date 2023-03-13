import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MasiveConversionPermissionsDeleteComponent } from '../masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
import {
  PERMISSIONSUSER_COLUMNS,
  PRIVILEGESUSER_COLUMNS,
} from './massive-conversion-permissions-columns';

@Component({
  selector: 'app-massive-conversion-permissions',
  templateUrl: './massive-conversion-permissions.component.html',
  styles: [],
})
export class MassiveConversionPermissionsComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };

  data1: ISegUsers[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private usersService: UsersService,
    private tvalTable1Service: TvalTable1Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERMISSIONSUSER_COLUMNS,
    };
    this.settings2.columns = PRIVILEGESUSER_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  close() {
    this.modalRef.hide();
  }
  getValuesAll() {
    this.loading = true;

    this.usersService.getAllSegUsers(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.data1 = response.data;
        this.data1.forEach(element => {
          this.tvalTable1Service.getById5(element.id).subscribe({
            next: response => {
              console.log(response);
              this.tvalTable1Service.getById6(response.otKey).subscribe({
                next: response => {
                  console.log(response);
                },
                error: error => {
                  this.loading = false;
                  console.log(error);
                },
              });
            },
            error: error => {
              this.loading = false;
              console.log(error);
            },
          });
        });

        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  openPermissionsDelete(data: any) {
    // let config: ModalOptions = {
    //   initialState: {
    //     data,
    //     callback: (next: boolean) => { },
    //   },
    //   class: 'modal-xl modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // };
    // this.modalService.show(MassiveConversionPermissionsComponent, config);
    const modalRef = this.modalService.show(
      MasiveConversionPermissionsDeleteComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
