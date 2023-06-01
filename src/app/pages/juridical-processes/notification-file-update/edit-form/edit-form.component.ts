import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { INotificationUpdate } from 'src/app/core/models/ms-notification/notification.model';
import { DeductiveService } from 'src/app/core/services/catalogs/deductive.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';

@Component({
  selector: 'app-edit-exp-noti',
  templateUrl: './edit-form.component.html',
  styles: [],
})
export class EditFormComponent extends BasePage implements OnInit {
  deductiveForm: ModelForm<any>;
  title: string = 'Dictaminación';
  notification: INotificationUpdate[] = [];
  edit: boolean = false;
  dict: any;
  dictation: IDictation;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private deductiveService: DeductiveService,
    private dictationServices: DictationService,
    private modalService: BsModalService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    /*for (const controlName in this.deductiveForm.controls) {
      if (this.deductiveForm.controls.hasOwnProperty(controlName)) {
        if (controlName != 'expedientNumber') {
          this.deductiveForm.controls[controlName].disable();
          //console.log(controlName);
        }
      }
    }*/
    //this.example();
  }

  example() {
    const modalConfig = MODAL_CONFIG;
    const modalRef = this.modalService.show(EditFormComponent, modalConfig);
    modalRef.content.$unSubscribe.subscribe(formData => {
      // Manejar los valores del formulario rescatados
      console.log(formData);
    });
  }

  private prepareForm() {
    console.log(this.deductiveForm);
    this.deductiveForm = this.fb.group({
      //id: [null],
      expedientNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(11),
          this.positiveNumberValidator,
        ],
      ],
      /*wheelNumber: [null],
      receiptDate: [null],
      officeExternalKey: [null],
      externalOfficeDate: [null],

      observations: [null,],
      affairKey: [null],
      captureDate: [null],
      protectionKey: [null],
      preliminaryInquiry: [null],
      criminalCase: [null],
      //status: [null],

      externalRemitter: [null],
      touchPenaltyKey: [null],
      circumstantialRecord: [null],
      addressee: [null],
      crimeKey: [null],
      entFedKey: [null],
      viaKey: [null],
      consecutiveNumber: [null],
      delegationNumber: [null],
      subDelegationNumber: [null],
      indiciadoNumber: [null],
      delDestinyNumber: [null],
      subDelDestinyNumber: [null],
      departamentDestinyNumber: [null],
      officeNumber: [null],
      minpubNumber: [null],
      cityNumber: [null],
      courtNumber: [null],
      registerNumber: [null],
      dictumKey: [null],
      identifier: [null],
      observationDictum: [null],
      wheelStatus: [null],
      transference: [null],
      expedientTransferenceNumber: [null],
      priority: [null],
      wheelType: [null],
      reserved: [null],
      entryProcedureDate: [null],
      userInsert: [null],
      originNumber: [null],
      stationNumber: [null],
      autorityNumber: [null],
      endTransferNumber: null,
      dailyEviction:  [null],
      hcCaptureDate: [null],
      hcEntryProcedureDate: [],
      desKnowingDate: null,
      addressGeneral: [null]*/
    });
    debugger;
    if (this.dict != null) {
      this.edit = true;
      this.deductiveForm.patchValue(this.dict);
    }
  }

  formatDate(date: string) {
    return new Date(date);
  }

  loadDataNotification() {
    // this.dictationServices.getById('')
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //console.log(this.dict);
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.deductiveService.create(this.deductiveForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    // this.loading = true;
    // let parsedID = parseInt(this.dict.wheelNumber);
    // this.dict.wheelNumber = parsedID;
    // http://sigebimsdev.indep.gob.mx/dictation/api/v1/dictation
    //console.log(this.dict);
    const data: any = {};
    for (const controlName in this.deductiveForm.controls) {
      if (this.deductiveForm.controls.hasOwnProperty(controlName)) {
        const control = this.deductiveForm.controls[controlName];
        data[controlName] = control.value;
      }
    }

    console.log(data);

    this.dict['expedientNumber'] =
      this.deductiveForm.controls['expedientNumber'].value;
    //this.dict['affair'] = null;
    const id = this.dict['wheelNumber'];

    //console.log(this.dict);

    this.notificationService.updateWithBody(id, data).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  positiveNumberValidator(control: FormControl) {
    const value = control.value;
    if (value < 0) {
      return { negativeNumber: true };
    }
    return null;
  }
}
