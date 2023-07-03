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
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  emailBody: IVigEmailBody;
  modalRef: any;
  constructor(
    private emailService: EmailService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings.columns = EMAIL_CONFIG_COLUMNS;
    this.settings.actions.delete = true;
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
    this.prepareform2();
  }

  getEmailSend(): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
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
    };
    this.modalService.show(
      CreateOrEditEmailMaintenencekDialogComponent,
      config
    );
  }
  private prepareform2() {
    this.formCorreo = this.fb.group({
      id: ['', [Validators.required]],
      bodyEmail: ['', [Validators.required]],
      subjectEmail: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    if (this.emailBody != null) {
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

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro guardado correctamente', '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  createBody() {
    this.loading = true;
    this.emailService.createEmailBody(this.formCorreo.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert('warning', 'Error al guardar registros', '');
        this.data.refresh();
      },
    });
  }

  resetForm() {
    this.formCorreo.reset();
  }

  showData() {
    //descomentar si usan FilterParams ejemplo de consulta
    //this.filterParams.getValue().addFilter('id', 3429640, SearchFilter.EQ)
    //this.filterParams.getValue().addFilter('keyTypeDocument', 'ENTRE', SearchFilter.ILIKE)

    //ejemplo de uso con ListParams
    //this.params.getValue()['filter.id'] = '$eq:3429640'

    let config: ModalOptions = {
      initialState: {
        //filtros
        paramsList: this.params,
        //filterParams: this.filterParams, // en caso de no usar FilterParams no enviar
        callback: (next: boolean, data: any /*Modelado de datos*/) => {
          if (next) {
            //mostrar datos de la búsqueda
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MailBodyListDataComponent, config);
  }
}
