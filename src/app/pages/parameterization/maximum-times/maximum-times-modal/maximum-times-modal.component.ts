import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IMaximumTimes,
  IUsers,
} from 'src/app/core/models/catalogs/maximum-times-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { MaximumTimesService } from 'src/app/core/services/catalogs/maximum-times.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
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
      activated: [null],
      user: [null],
      date: [null],
    });
    if (this.maximumTimes != null) {
      console.log('editar');
      this.edit = true;
      this.user = this.maximumTimes.user as IUsers;
      this.maximumTimesForm.patchValue(this.maximumTimes);
      this.maximumTimesForm.controls['activated'].setValue(
        this.maximumTimes.activated == 'N' ? false : true
      );
    } else {
      this.maximumTimesForm.controls['certificateType'].setValue('0');
      this.maximumTimesForm.controls['date'].setValue(new Date());
      // this.maximumTimesForm.controls['user'].setValue(this.authService.decodeToken().preferred_username);
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
      this.maximumTimesForm.controls['activated'].value == 'true' ? 'S' : 'N'
    );
    console.log(this.maximumTimesForm.value);
    this.maximumTimesService.create(this.maximumTimesForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    this.maximumTimesForm.controls['activated'].setValue(
      this.maximumTimesForm.controls['activated'].value == 'true' ? 'S' : 'N'
    );
    console.log(this.maximumTimesForm.value);
    this.maximumTimesService
      .update(
        this.maximumTimes.certificateType.toString(),
        this.maximumTimesForm.value
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
}
