import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, skip } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IVigMailBook } from 'src/app/core/models/ms-email/email-model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BinnacleService } from 'src/app/core/services/ms-survillance/Binnacle-survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CreateOrEditEmailBookDialogComponent } from '../components/create-or-edit-email-book-dialog/create-or-edit-email-book-dialog.component';
import { BOOK_EMAIL_COLUMNS } from './book-email-columns';

@Component({
  selector: 'app-email-book-config',
  templateUrl: './email-book-config.component.html',
  styles: [],
})
export class EmailBookConfigComponent
  extends BasePage
  implements AfterViewInit, OnInit
{
  @ViewChild(CreateOrEditEmailBookDialogComponent)
  createOrEditEmailBookDialog: CreateOrEditEmailBookDialogComponent;
  formControlRegionalDelegation = new FormControl(null, [Validators.required]);
  // public regionalDelegations = new DefaultSelect();
  emailsBook = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnsD: IDelegation[] = [];
  parameterData: any[] = [];
  path: string = '';
  delegations = new DefaultSelect();
  form: FormGroup;
  constructor(
    private emailService: EmailService,
    private delegationService: DelegationService,
    private binnacleService: BinnacleService,
    private fb: FormBuilder
  ) {
    super();
    this.settings.columns = BOOK_EMAIL_COLUMNS;
    this.settings.actions.delete = true;
  }
  ngOnInit(): void {
    this.params.pipe(skip(1)).subscribe(params => {
      if (this.form.get('delegation').value) {
        console.log(this.formControlRegionalDelegation);
        return;
      }
      this.getVigMailBook(params);
    });
    this.path = 'survillance/api/v1/views/v-vig-delegations';
    this.prepareForm();
    this.getDelegation(new ListParams());
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.createOrEditEmailBookDialog.subject.subscribe(res => {
      /*showToast({
        text:
          res.action === 'create'
            ? 'Se ha creado el libro de correos correctamente'
            : 'Se ha editado el libro de correos correctamente',
        icon: 'success',
      });*/
      this.alert(
        'success',
        res.action === 'create'
          ? 'Se ha creado el libro de correos correctamente'
          : 'Se ha editado el libro de correos correctamente',
        ''
      );
      if (res.newData.delegationNumber !== this.form.get('delegation').value) {
        return;
      }
      if (res.action === 'create') {
        this.emailsBook.prepend(res.newData);
        this.getVigMailBook();
      } else {
        this.emailsBook.update(res.oldData, res.newData);
      }
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
    });

    setTimeout(() => {}, 1000);
  }

  createEmailBook(): void {
    this.createOrEditEmailBookDialog.openDialog();
  }

  editEmailBook(event: { data: IVigMailBook }): void {
    this.delegationRegional = `${event.data.delegationNumber} - ${event.data.delegationDetails.description}`;
    this.createOrEditEmailBookDialog.openDialogEdit(
      event.data,
      this.delegationRegional
    );
    console.log(event.data);
    console.log(this.delegationRegional);

    console.log(this.delegationRegional);
  }

  delegationRegional: any = null;
  onDelegationRegionalChange(event: any): void {
    console.log(event);
    this.delegationRegional = event;
  }
  getVigMailBook(listParams = new ListParams()): void {
    if (!this.form.get('delegation').value) {
      this.alert('error', 'Debe Seleccionar una Delegación Regional', '');
      this.emailsBook.load([]);
      return;
    }
    console.log(this.form.get('delegation').value);

    this.loading = true;
    listParams['filter.delegationNumber'] = this.form.get('delegation').value;
    this.emailService.getVigMailBook(listParams).subscribe({
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

  onDeleteConfirm(event: { data: IVigMailBook }): void {
    console.log(event);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(result => {
      if (!result?.isConfirmed) {
        return;
      }
      this.deleteInServer(event.data);
    });
  }

  deleteInServer(data: IVigMailBook): void {
    this.loading = true;
    this.emailService.deleteEmailBook(data.id).subscribe({
      next: () => {
        this.alert(
          'success',
          'Dirección de Correo Electronico',
          'Eliminado correctamente'
        );
        this.emailsBook.remove(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changeTable(event: any): void {
    console.log(event);

    if (event.id) {
      this.emailsBook.update(event.id, event);
    }
  }

  getDelegation(params: ListParams) {
    this.binnacleService.getDelegations(params).subscribe({
      next: resp => {
        console.log(resp);

        this.delegations = new DefaultSelect(resp.data, resp.count);
        console.log(this.delegations);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }
}
