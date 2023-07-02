import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IVigEmailSend } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateOrEditEmailMaintenencekDialogComponent } from '../components/create-or-edit-maintenence-mail-dialog/create-or-edit-maintenence-mail-dialog.component';
import { EMAIL_CONFIG_COLUMNS } from './mail-configuration-columns';

@Component({
  selector: 'app-maintenance-mail-configuration',
  templateUrl: './maintenance-mail-configuration.component.html',
  styles: [],
})
export class MaintenanceMailConfigurationComponent
  extends BasePage
  implements OnInit
{
  sendMail: IVigEmailSend[] = [];
  columnFilters: any = [];
  formCorreo: FormGroup = new FormGroup({});
  createOrEditEmailMaintenencekDialogComponent: CreateOrEditEmailMaintenencekDialogComponent;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private emailService: EmailService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings.columns = EMAIL_CONFIG_COLUMNS;
    this.settings.actions.delete = true;
  }

  private prepareform2() {
    this.formCorreo = this.fb.group({
      identifier: ['', [Validators.required]],
      asunto: ['', [Validators.required]],
      body: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getEmailSend();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEmailSend());
  }

  getEmailSend(): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };
    this.emailService.getVigEmailSend(params).subscribe({
      next: async (res: any) => {
        let result = res.data.map(async (item: any) => {});

        Promise.all(result).then(async (resp: any) => {
          this.sendMail = res.data;
          this.totalItems = res.count || 0;
          this.data.load(res.data);
          this.data.refresh();
          this.loading = false;
          console.log(res);
        });
      },
      error: () => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  openForm(send?: IVigEmailSend) {
    let config: ModalOptions = {
      initialState: {
        send,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getEmailSend());
            console.log(this.params);
          }
        },
      },
    };
    this.modalService.show(
      CreateOrEditEmailMaintenencekDialogComponent,
      config
    );
  }

  delete(Email: IVigEmailSend) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deleteEmail(Email.id);
      }
    });
  }

  deleteEmail(id: string) {
    this.emailService.deleteSendMail(id).subscribe({
      next: () => {
        this.getEmailSend(),
          this.alert('success', 'Registro de estado', 'Borrado');
      },
      error: error => {
        this.alert(
          'warning',
          'Estados',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
        console.log(error);
      },
    });
  }
}
