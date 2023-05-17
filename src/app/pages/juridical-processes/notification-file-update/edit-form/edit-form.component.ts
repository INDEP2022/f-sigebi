import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DeductiveService } from 'src/app/core/services/catalogs/deductive.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-edit-exp-noti',
  templateUrl: './edit-form.component.html',
  styles: [],
})
export class EditFormComponent extends BasePage implements OnInit {
  deductiveForm: ModelForm<any>;
  title: string = 'Dictaminación';
  edit: boolean = false;
  dict: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private deductiveService: DeductiveService,
    private dictationServices: DictationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.deductiveForm = this.fb.group({
      id: [null],
      expedientNumber: [null],
      wheelNumber: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      affairKey: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      protectionKey: [null, [Validators.required]],
      preliminaryInquiry: [null, [Validators.required]],
      criminalCase: [null, [Validators.required]],
      status: [null, [Validators.required]],
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
    this.dictationServices.update(this.dict).subscribe({
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
}
