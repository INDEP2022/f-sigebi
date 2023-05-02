import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IMaximumTimes,
  IUsers,
} from 'src/app/core/models/catalogs/maximum-times-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { MaximumTimesService } from 'src/app/core/services/catalogs/maximum-times.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { MaximumTimesUserComponent } from '../maximum-times-user/maximum-times-user.component';

@Component({
  selector: 'app-maximum-times-modal',
  templateUrl: './maximum-times-modal.component.html',
  styles: [],
})
export class MaximumTimesModalComponent extends BasePage implements OnInit {
  maximumTimesForm: ModelForm<IMaximumTimes>;
  maximumTimes: IMaximumTimes;
  title: string = 'Tiempo Máximo Para Cierre Actas Devolución';
  edit: boolean = false;
  user: IUsers;
  typeItem: any[];
  event: any;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private maximumTimesService: MaximumTimesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.typeItem = [
      { label: 'DEV', value: 'DEV' },
      { label: 'DON', value: 'DON' },
      { label: 'DES', value: 'DES' },
      { label: 'ABN', value: 'ABN' },
      { label: 'RESAR', value: 'RESAR' },
      { label: 'REC/DEC', value: 'RECDEC' },
      { label: 'CAN/SUS', value: 'CANSUS' },
      { label: 'PD3', value: 'PD3' },
    ];
  }
  private prepareForm() {
    this.maximumTimesForm = this.fb.group({
      certificateType: [null, [Validators.required]],
      tmpMax: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      activatedBool: [null],
      activated: [null],
      userName: [null],
      user: [null, [Validators.required]],
      date: [null],
    });
    if (this.maximumTimes != null) {
      console.log(this.maximumTimes);
      this.edit = true;
      this.user = this.maximumTimes.user as IUsers;
      this.maximumTimesForm.patchValue(this.maximumTimes);
      this.maximumTimesForm.controls['user'].setValue(this.user.id);
      this.maximumTimesForm.controls['userName'].setValue(this.user.name);

      this.maximumTimesForm.controls['activatedBool'].setValue(
        this.maximumTimes.activated == 'N' ? false : true
      );
    } else {
      this.maximumTimesForm.controls['certificateType'].setValue('0');
      this.maximumTimesForm.controls['date'].setValue(new Date());
    }
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    this.maximumTimesForm.controls['activated'].setValue(
      this.maximumTimesForm.controls['activatedBool'].value == 'true'
        ? 'S'
        : 'N'
    );
    let data = {
      certificateType: this.maximumTimesForm.controls['certificateType'].value,
      tmpMax: this.maximumTimesForm.controls['tmpMax'].value,
      activated: this.maximumTimesForm.controls['activated'].value,
      userName: this.maximumTimesForm.controls['userName'].value,
      user: this.maximumTimesForm.controls['user'].value,
      date: this.maximumTimesForm.controls['date'].value,
    };
    console.log(data);
    this.maximumTimesService.create(this.maximumTimesForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    console.log(this.maximumTimesForm.controls['activatedBool'].value);
    this.maximumTimesForm.controls['activated'].setValue(
      this.maximumTimesForm.controls['activatedBool'].value == true ? 'S' : 'N'
    );
    let data = {
      certificateType: this.maximumTimesForm.controls['certificateType'].value,
      tmpMax: this.maximumTimesForm.controls['tmpMax'].value,
      activated: this.maximumTimesForm.controls['activated'].value,
      user: this.maximumTimesForm.controls['user'].value,
      date: this.maximumTimesForm.controls['date'].value,
    };
    console.log(data);
    this.maximumTimesService
      .update(
        this.maximumTimesForm.controls['certificateType'].value.toString(),
        data
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  openUsers(context?: Partial<MaximumTimesUserComponent>) {
    const modalRef = this.modalService.show(MaximumTimesUserComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.maximumTimesForm.controls['user'].setValue(this.event.id);
        this.maximumTimesForm.controls['userName'].setValue(this.event.name);
      }
    });
  }
}
