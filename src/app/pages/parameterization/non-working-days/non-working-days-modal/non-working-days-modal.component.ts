import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICalendar } from 'src/app/core/models/catalogs/calendar-model';
import { CalendarService } from 'src/app/core/services/catalogs/calendar.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-non-working-days-modal',
  templateUrl: './non-working-days-modal.component.html',
  styles: [],
})
export class NonWorkingDaysModalComponent extends BasePage implements OnInit {
  nonWorkingDaysForm: ModelForm<ICalendar>;
  calendar: ICalendar;
  title: string = 'Días Inhábiles';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    private calendarService: CalendarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.nonWorkingDaysForm = this.fb.group({
      id: [null],
      idDate: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.calendar != null) {
      console.log('editar');
      this.edit = true;
      this.nonWorkingDaysForm.patchValue(this.calendar);
      let date = new Date(this.calendar.id + 'T00:00:00-07:00');
      console.log(date);
      this.nonWorkingDaysForm.controls['idDate'].setValue(date);
      console.log(this.nonWorkingDaysForm.controls['idDate'].value);
      this.nonWorkingDaysForm.get('idDate').disable();
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
    let form = {
      id: this.datePipe.transform(
        this.nonWorkingDaysForm.controls['idDate'].value,
        'yyyy-MM-dd'
      ),
      idDate: this.nonWorkingDaysForm.controls['idDate'].value,
      description: this.nonWorkingDaysForm.controls['description'].value,
    };
    console.log(form);
    this.calendarService.create(form).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    this.calendarService
      .update(this.calendar.id.toString(), this.nonWorkingDaysForm.value)
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
