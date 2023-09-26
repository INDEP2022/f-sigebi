import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IVigEmailBody,
  IVigEmailSend,
} from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EventSelectionModalComponent } from 'src/app/pages/commercialization/catalogs/components/event-selection-modal/event-selection-modal.component';
import { MailBodyListDataComponent } from '../body-mail-list/body-mail-list.component';
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
  formCorreo: ModelForm<IVigEmailBody>;
  createOrEditEmailMaintenencekDialogComponent: CreateOrEditEmailMaintenencekDialogComponent;
  mailBodyListDataComponent = MailBodyListDataComponent;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  emailBody: IVigEmailBody;
  event: IVigEmailBody = null;
  modalRef: any;
  constructor(
    private emailService: EmailService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        delete: true,
        edit: true,
        add: false,
        position: 'right',
      },
      columns: EMAIL_CONFIG_COLUMNS,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            //console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;

              case 'nameSend':
                searchFilter = SearchFilter.ILIKE;
                break;

              case 'postSend':
                searchFilter = SearchFilter.ILIKE;
                break;

              case 'emailSend':
                searchFilter = SearchFilter.ILIKE;
                break;

              case 'status':
                searchFilter = SearchFilter.EQ;
                break;

              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
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
    this.prepareform2();
  }

  getEmailSend(): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.emailService.getVigEmailSend(params).subscribe({
      next: async (res: any) => {
        this.sendMail = res.data;
        this.totalItems = res.count || 0;
        this.data.load(res.data);
        this.data.refresh();
        this.loading = false;
        console.log(res);
      },
      error: () => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  openForm(emailSend?: any, valEdit?: boolean) {
    const data = emailSend;
    console.log(emailSend);
    let config: ModalOptions = {
      initialState: {
        data,
        valEdit,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getEmailSend());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(
      CreateOrEditEmailMaintenencekDialogComponent,
      config
    );
  }
  private prepareform2() {
    this.formCorreo = this.fb.group({
      id: ['', [Validators.required]],
      bodyEmail: [{ value: '', disabled: true }, [Validators.required]],
      subjectEmail: [{ value: '', disabled: true }, [Validators.required]],
      status: [{ value: '', disabled: true }, [Validators.required]],
    });
    if (this.emailBody != null) {
      console.log(this.emailBody);
    }
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
          this.alert('success', 'Registro eliminado correctamente', '');
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

  handleSuccess() {
    const message: string = 'Actualizado';
    this.alert(
      'success',
      'El correo de responsables de envío ha sido actualizado',
      ''
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.emailService
      .updateEmailBody(
        this.formCorreo.controls['id'].value,
        this.formCorreo.value
      )
      .subscribe({
        next: data => {
          const readonlyFields = ['subjectEmail', 'bodyEmail', 'status'];

          readonlyFields.forEach(fieldName => {
            this.formCorreo.get(fieldName).disable();
          });
          this.handleSuccess();
        },
        error: error => {
          this.loading = false;
          this.alert('warning', 'Error al actualizar registros', '');
          this.data.refresh();
        },
      });
  }

  resetForm(): void {
    this.formCorreo.reset();
  }

  showData(context?: Partial<EventSelectionModalComponent>) {
    const modalRef = this.modalService.show(MailBodyListDataComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.formCorreo.controls['id'].setValue(this.event.id);
        this.formCorreo.controls['subjectEmail'].setValue(
          this.event.subjectEmail
        );
        this.formCorreo.controls['bodyEmail'].setValue(this.event.bodyEmail);
        this.formCorreo.controls['status'].setValue(this.event.status);
        Object.keys(this.formCorreo.controls).forEach(controlName => {
          this.formCorreo.get(controlName).enable();
        });
      }
    });
  }
}
