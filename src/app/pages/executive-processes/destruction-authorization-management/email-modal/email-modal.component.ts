import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BOOK_EMAIL_COLUMNS_TO } from 'src/app/pages/administrative-processes/insurance-and-surveillance/email-book-config/email-book-config/book-email-columns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: [],
})
export class EmailModalComponent extends BasePage implements OnInit {
  title: string = 'Lista de distribución de correos pendiente';
  action: 'C' | 'A' = null;
  emailForm = this.fb.group({
    body: new FormControl(null, [Validators.maxLength(6000)]),
    asunto: new FormControl('Cambio de Estatus de Bienes a RGA'),
  });
  message: string = null;
  proceeding: Partial<IProccedingsDeliveryReception> = {};
  emailsBook: LocalDataSource = new LocalDataSource();
  emailsBook2: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  users = new DefaultSelect();
  totalItems: number = 0;
  totalItems2: number = 0;
  parameterData: any[] = [];
  parameterData2: any[] = [];
  usersValue: ISegUsers;
  columnFilters: any = [];
  columnFilters2: any = [];
  array: any = [];
  array2: any = [];
  loading2: boolean = false;
  settings1: any = [];

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private emailService: EmailService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private massiveGoodService: MassiveGoodService,
    private tranfergoodService: TranfergoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...BOOK_EMAIL_COLUMNS_TO,
        selection: {
          title: '',
          sort: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectedEmail(instance),
        },
      },
      hideSubHeader: false,
    };

    this.settings1 = {
      ...this.settings1,
      actions: false,
      columns: {
        ...BOOK_EMAIL_COLUMNS_TO,
        selection: {
          title: '',
          sort: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectedEmailCopy(instance),
        },
      },
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.emailForm.controls.body.setValue(this.message);

    this.emailsBook
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
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
          this.getVigMailBook();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getVigMailBook());

    this.emailsBook2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getVigMailBookCopy();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getVigMailBookCopy());
  }

  private tempArray: any[] = [];
  onSelectedEmail(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        // Haz una copia del array antes de la acción de selección o deselección
        this.tempArray = [...this.array];
        console.log(data.toggle, data.row.bookEmail);
        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array.includes(data.row.bookEmail)) {
            this.array.push(data.row.bookEmail);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array.indexOf(data.row.bookEmail);
          if (index !== -1) {
            this.array.splice(index, 1);
          }
        }
        console.log(this.array);

        // Ahora puedes realizar la consulta, teniendo en cuenta los cambios en this.array
      },
    });
  }

  private tempArray2: any[] = [];
  onSelectedEmailCopy(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        // Haz una copia del array antes de la acción de selección o deselección
        this.tempArray2 = [...this.array2];
        console.log(data.toggle, data.row.bookEmail);
        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array2.includes(data.row.bookEmail)) {
            this.array2.push(data.row.bookEmail);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array2.indexOf(data.row.bookEmail);
          if (index !== -1) {
            this.array2.splice(index, 1);
          }
        }
        console.log(this.array2);

        // Ahora puedes realizar la consulta, teniendo en cuenta los cambios en this.array
      },
    });
  }

  //Select dinámico para mostrar lista de correos con @indep
  getEmailIndep(params: ListParams) {
    this.emailService.getVigMailBook(params).subscribe({
      next: data => (this.users = new DefaultSelect(data.data, data.count)),
    });
  }

  //Al seleccionar un item del select dinámico se autorellenan los inputs siguientes

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    if (this.action == 'C') {
      await this.closeProceeding();
    }

    if (this.action == 'A') {
    }
  }

  sendEmail() {
    if (!this.array) {
      this.alert(
        'warning',
        'Se debe seleccionar al menos una direccion de correo para poder enviar',
        ''
      );
      return;
    }

    let body = {
      destination: this.array,
      copy: this.array2,
      message: this.emailForm.get('body').value,
      subject: 'Cambio de Estatus de Bienes a RGA',
      header: 'Cambio de Estatus de Bienes a RGA',
    };

    this.tranfergoodService.sendEmail(body).subscribe();
  }

  async closeProceeding() {
    const response = await this.alertQuestion(
      'question',
      '¿Estas seguro?',
      '¿Está seguro que desea cerrar la Solicitud?'
    );

    if (response.isConfirmed) {
      this.proceeding.statusProceedings = 'CERRADA';
      this.proceedingsDeliveryReceptionService
        .update(this.proceeding.id, this.proceeding)
        .subscribe({
          next: () => {
            if (this.array) {
              this.sendEmail();
              this.updateGoods();
              this.handleSuccess();
            } else {
              this.handleSuccess();
            }
          },
          error: () => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al cerrar el acta'
            );
          },
        });
    }
  }

  updateGoods() {
    this.massiveGoodService
      .updateMassiveGoods({
        screen: 'FESTATUSRGA',
        proceedingNumber: this.proceeding.id,
      })
      .subscribe({
        error: error => console.log(error),
      });
  }

  handleSuccess() {
    const message =
      this.action == 'C'
        ? 'La Solicitud ha sido cerrada'
        : 'Los Bienes fueron sacados de la Solicitud';
    this.onLoadToast('success', message);
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Para:

  getVigMailBook() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    params['filter.bookType'] = `$ilike:P`;
    params['filter.bookStatus'] = `$eq:1`;
    this.emailService.getVigMailBook(params).subscribe({
      next: res => {
        this.parameterData = res.data;
        this.totalItems = res.count || 0;
        this.emailsBook.load(res.data);
        this.emailsBook.refresh();
        this.loading = false;
        console.log(res);
      },
      error: () => {
        this.loading = false;
        this.emailsBook.load([]);
        this.emailsBook.refresh();
        this.totalItems = 0;
      },
    });
  }

  //CC:
  getVigMailBookCopy() {
    this.loading2 = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    params['filter.bookType'] = `$ilike:C`;
    params['filter.bookStatus'] = `$eq:1`;
    this.emailService.getVigMailBook(params).subscribe({
      next: res => {
        this.parameterData2 = res.data;
        this.totalItems2 = res.count || 0;
        this.emailsBook2.load(res.data);
        this.emailsBook2.refresh();
        this.loading2 = false;
        console.log(res);
      },
      error: () => {
        this.loading2 = false;
        this.emailsBook2.load([]);
        this.emailsBook2.refresh();
        this.totalItems2 = 0;
      },
    });
  }
}
