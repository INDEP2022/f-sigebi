import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IDateDocuments,
  IExpedient,
  IKey,
  IState,
} from 'src/app/core/models/catalogs/date-documents.model';
import { IDocumentsForDictum } from 'src/app/core/models/catalogs/documents-for-dictum.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DateDocumentsService } from 'src/app/core/services/catalogs/date-documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { EventSelectionModalComponent } from 'src/app/pages/commercialization/catalogs/components/event-selection-modal/event-selection-modal.component';
import { DateDocumentsDictumComponent } from '../date-documents-dictum/date-documents-dictum.component';

@Component({
  selector: 'app-date-documents-modal',
  templateUrl: './date-documents-modal.component.html',
  styles: [],
})
export class DateDocumentsModalComponent extends BasePage implements OnInit {
  title: string = 'Fecha para Documento';
  edit: boolean = false;
  event: IDocumentsForDictum = null;
  dateDocuments: IDateDocuments;
  id: IKey;
  expedientNumber: IExpedient;
  stateNumber: IState;
  dateDocumentsModalForm: ModelForm<IDateDocuments>;
  isDisabled = true;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private dateDocumentsService: DateDocumentsService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.dateDocumentsModalForm = this.fb.group({
      expedientNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      stateNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      key: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      typeDictum: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      dateReceipt: [null],
      userReceipt: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      insertionDate: [null, [Validators.required]],
      userInsertion: [null],
      numRegister: [null],
      officialNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      notificationDate: [null],
      secureKey: [null],
    });

    if (this.dateDocuments != null) {
      console.log(this.dateDocuments);
      this.id = this.dateDocuments.key as IKey;
      this.expedientNumber = this.dateDocuments.expedientNumber as IExpedient;
      this.stateNumber = this.dateDocuments.stateNumber as IState;
      this.edit = true;
      this.dateDocumentsModalForm.patchValue(this.dateDocuments);

      let date = new Date(this.dateDocuments.insertionDate);
      if (this.dateDocuments.notificationDate) {
        //let dateNoti = new Date(this.dateDocuments.notificationDate); dateReceipt
        const dateNotif = this.transformDate(
          this.dateDocuments.notificationDate
        );

        this.dateDocumentsModalForm.controls['notificationDate'].setValue(
          dateNotif
        );
      }
      const dateInsert = this.transformDate(this.dateDocuments.insertionDate);
      this.dateDocumentsModalForm.controls['insertionDate'].setValue(
        dateInsert
      );

      const dateReceipt = this.transformDate(this.dateDocuments.dateReceipt);
      this.dateDocumentsModalForm.controls['dateReceipt'].setValue(dateReceipt);
      this.dateDocumentsModalForm.controls['key'].setValue(this.id.key);
      this.dateDocumentsModalForm.controls['expedientNumber'].disable();
      this.dateDocumentsModalForm.controls['stateNumber'].disable();
      this.dateDocumentsModalForm.controls['typeDictum'].disable();
      this.dateDocumentsModalForm.controls['key'].disable();
    } else {
      this.dateDocumentsModalForm.controls['userInsertion'].setValue(
        this.authService.decodeToken().preferred_username
      );
    }
  }

  transformDate(date: Date) {
    const date2 = new Date(date);
    const datePipe = new DatePipe('en-US');
    const formatTrans1 = datePipe.transform(date2, 'yyyy-MM-dd', 'UTC');
    return formatTrans1;
  }

  close() {
    this.modalRef.hide();
  }
  openDictum(context?: Partial<EventSelectionModalComponent>) {
    const modalRef = this.modalService.show(DateDocumentsDictumComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.dateDocumentsModalForm.controls['typeDictum'].setValue(
          this.event.typeDictum
        );
        this.dateDocumentsModalForm.controls['key'].setValue(this.event.id);
      }
    });
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;

    /*const newDateDocument = this.dateDocumentsModalForm.value;

    Object.defineProperties(newDateDocument, {
      insertionDate: {
        value: this.datePipe.transform(
          newDateDocument.insertionDate,
          'dd-mm-yyyy'
        ),
      },
      notificationDate: {
        value: this.datePipe.transform(
          newDateDocument.notificationDate,
          'dd-mm-yyyy'
        ),
      },
    });*/

    //console.log('PAYLOAD', newDateDocument);

    this.dateDocumentsService
      .create(this.dateDocumentsModalForm.getRawValue())
      .subscribe({
        next: data => {
          console.log('success', data);
          this.handleSuccess();
        },
        error: error => {
          console.log('success', error);
          this.loading = false;
        },
      });
  }

  transformDateUpdate(date: Date) {
    const date2 = new Date(date);
    const datePipe = new DatePipe('en-US');
    const formatTrans1 = datePipe.transform(date2, 'yyyy-MM-dd', 'UTC');
    return formatTrans1;
  }

  incognitDateToDate(date: any) {
    if (date) {
      // console.log(date);
      if (date instanceof Date) {
        return date;
      }
      if (date.includes('/')) {
        const partesFecha = date.split('/');
        const newDate = new Date(
          Number(partesFecha[2]),
          Number(partesFecha[1]) - 1,
          Number(partesFecha[0])
        );
        // console.log(newDate);
        return newDate;
      } else {
        new Date(date);
      }
    }
    return null;
  }

  update() {
    this.loading = true;

    this.dateDocumentsService
      .update3(this.dateDocumentsModalForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
