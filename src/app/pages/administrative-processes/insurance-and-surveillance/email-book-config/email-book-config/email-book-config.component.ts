import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, skip } from 'rxjs';
import { showQuestion, showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IVigMailBook } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  constructor(private emailService: EmailService) {
    super();
    this.settings.columns = BOOK_EMAIL_COLUMNS;
    this.settings.actions.delete = true;
  }
  ngOnInit(): void {
    this.params.pipe(skip(1)).subscribe(params => {
      if (this.formControlRegionalDelegation.invalid) {
        return;
      }
      this.getVigMailBook(params);
    });
  }

  ngAfterViewInit(): void {
    this.createOrEditEmailBookDialog.subject.subscribe(res => {
      showToast({
        text:
          res.action === 'create'
            ? 'Se ha creado el libro de correos correctamente'
            : 'Se ha editado el libro de correos correctamente',
        icon: 'success',
      });
      if (
        res.newData.delegationNumber !==
        this.formControlRegionalDelegation.value
      ) {
        return;
      }
      if (res.action === 'create') {
        this.emailsBook.prepend(res.newData);
      } else {
        this.emailsBook.update(res.oldData, res.newData);
      }
    });
  }

  createEmailBook(): void {
    this.createOrEditEmailBookDialog.openDialog();
  }

  editEmailBook(event: { data: IVigMailBook }): void {
    this.createOrEditEmailBookDialog.openDialogEdit(
      event.data,
      this.delegationRegional
    );
  }

  delegationRegional: any = null;
  onDelegationRegionalChange(event: any): void {
    this.delegationRegional = event;
  }
  getVigMailBook(listParams = new ListParams()): void {
    if (this.formControlRegionalDelegation.invalid) {
      showToast({
        text: 'Debe seleccionar una delegación regional',
        icon: 'error',
      });
      this.emailsBook.load([]);
      return;
    }
    this.loading = true;
    listParams['filter.delegationNumber'] =
      this.formControlRegionalDelegation.value;
    this.emailService.getVigMailBook(listParams).subscribe({
      next: res => {
        this.emailsBook.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.emailsBook.load([]);
      },
    });
  }

  onDeleteConfirm(event: { data: IVigMailBook }): void {
    console.log(event);
    showQuestion({
      text: '¿Está seguro de eliminar el registro?',
      title: 'Eliminar',
    }).then(result => {
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
        showToast({
          text: 'Registro eliminado correctamente',
          icon: 'success',
        });
        this.emailsBook.remove(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changeTable(event: any): void {
    if (event.id) {
      this.emailsBook.update(event.id, event);
    }
  }
}
