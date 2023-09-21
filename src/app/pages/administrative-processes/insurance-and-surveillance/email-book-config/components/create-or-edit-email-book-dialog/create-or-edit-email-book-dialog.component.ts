import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IVigMailBook } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BinnacleService } from 'src/app/core/services/ms-survillance/Binnacle-survillance.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//import { ModelForm } from 'src/app/core/interfaces/model-form';
@Component({
  selector: 'app-create-or-edit-email-book-dialog',
  templateUrl: './create-or-edit-email-book-dialog.component.html',
  styleUrls: ['./create-or-edit-email-book-dialog.component.css'],
})
export class CreateOrEditEmailBookDialogComponent
  extends BasePage
  implements OnInit
{
  form = new FormGroup({
    id: new FormControl(),
    bookName: new FormControl('', [Validators.required]),
    bookEmail: new FormControl('', [Validators.required, Validators.email]),
    bookType: new FormControl('', [Validators.required]),
    delegationNumber: new FormControl(null, [Validators.required]),
    bookStatus: new FormControl('', [Validators.required]),
  });
  @ViewChild('templateCreateOrEdit')
  templateRefDialog: TemplateRef<any>;

  oldData: IVigMailBook | null = null;
  subject = new Subject<{
    action: 'create' | 'edit';
    newData: IVigMailBook;
    oldData?: IVigMailBook;
  }>();

  dialogRef: BsModalRef;
  status: any = [];
  isLoading = false;
  initOption: any = null;
  formControlRegionalDelegation = new FormControl(null, [Validators.required]);
  // public regionalDelegations = new DefaultSelect();
  emailsBook = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnsD: IDelegation[] = [];
  parameterData: any[] = [];
  delegations = new DefaultSelect();
  constructor(
    private dialogService: BsModalService,
    private emailService: EmailService,
    private binnacleService: BinnacleService
  ) {
    super();
  }
  ngOnInit(): void {
    this.getDelegation(new ListParams());
  }

  openDialog() {
    this.dialogRef = this.dialogService.show(this.templateRefDialog);
    this.getVigMailBook();
  }

  /*openForm(city?: ICity) {
    console.log(city);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      city,
      callback: (next: boolean) => {
        if (next) this.getCities();
      },
    };
    this.modalService.show(CityDetailComponent, modalConfig);
  }*/

  closeDialog() {
    this.oldData = null;
    this.form.reset();
    this.dialogRef.hide();
    this.getVigMailBook();
  }

  openDialogEdit(formData: IVigMailBook, item: any): void {
    this.oldData = formData;
    this.initOption = item;
    this.form.patchValue(formData);
    this.openDialog();
  }

  saveInServer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert(
        'error',
        'Formulario Invalido, Complete los Campos Requeridos',
        ''
      );
      return;
    }

    this.isLoading = true;

    const formValues = this.form.value as Omit<Required<IVigMailBook>, 'id'>;
    const observer = this.oldData
      ? this.emailService.updateEmailBook(this.oldData.id, formValues)
      : this.emailService.createEmailBook(formValues);
    observer.subscribe({
      next: res => {
        const data = res?.data || formValues;
        this.subject.next({
          action: this.oldData ? 'edit' : 'create',
          newData: { id: this.oldData?.id, ...data },
          oldData: this.oldData,
        });

        callback: (next: boolean) => {
          if (next) this.getVigMailBook();
        };
        this.closeDialog();

        this.isLoading = false;
      },
      error: error => {
        this.alert('error', 'Error al Guardar Registros', '');
        this.isLoading = false;
      },
    });
  }

  getVigMailBook(listParams = new ListParams()): void {
    this.loading = true;
    listParams['filter.delegationNumber'] =
      this.formControlRegionalDelegation.value;
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

  getDelegation(params: ListParams) {
    this.loading = true;

    this.binnacleService.getDelegations2(params).subscribe(
      (resp: any) => {
        console.log(resp);
        this.status = resp.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.delegationNumber + ' - ' + item.description;
          return item; // Asegurarse de devolver el item modificado.
        });
        Promise.all(this.status).then((res: any) => {
          this.delegations = new DefaultSelect(resp.data, resp.count);
          console.log(this.status);
          console.log(this.delegations);

          this.loading = false; // Colocar el loading en false después de mostrar los datos.
        });
      },
      error => {
        this.delegations = new DefaultSelect([], 0);
      }
    );
  }
}
