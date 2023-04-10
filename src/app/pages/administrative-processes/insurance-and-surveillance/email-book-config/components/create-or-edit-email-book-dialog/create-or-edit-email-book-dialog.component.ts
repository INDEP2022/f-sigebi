import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { showToast } from 'src/app/common/helpers/helpers';
import { IVigMailBook } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';

@Component({
  selector: 'app-create-or-edit-email-book-dialog',
  templateUrl: './create-or-edit-email-book-dialog.component.html',
  styleUrls: ['./create-or-edit-email-book-dialog.component.css'],
})
export class CreateOrEditEmailBookDialogComponent {
  form = new FormGroup({
    id: new FormControl(null),
    bookName: new FormControl('', [Validators.required]),
    bookEmail: new FormControl('', [Validators.required, Validators.email]),
    bookType: new FormControl('', [Validators.required]),
    delegationNumber: new FormControl('', [Validators.required]),
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
  isLoading = false;
  initOption: any = null;

  constructor(
    private dialogService: BsModalService,
    private emailService: EmailService
  ) {}

  openDialog() {
    this.dialogRef = this.dialogService.show(this.templateRefDialog);
  }

  closeDialog() {
    this.oldData = null;
    this.form.reset();
    this.dialogRef.hide();
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
      showToast({
        icon: 'error',
        text: 'Formulario invalido, complete los campos requeridos',
      });
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
        this.closeDialog();
        this.isLoading = false;
      },
      error: () => {
        showToast({
          icon: 'error',
          text: 'Error al guardar el libro de correo',
        });
        this.isLoading = false;
      },
    });
  }
}
