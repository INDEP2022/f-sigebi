import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICalendar } from 'src/app/core/models/catalogs/calendar-model';
import { CalendarService } from 'src/app/core/services/catalogs/calendar.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NonWorkingDaysModalComponent } from '../non-working-days-modal/non-working-days-modal.component';
import { NONWORKINGDAYS_COLUMNS } from './non-working-days-columns';

@Component({
  selector: 'app-non-working-days',
  templateUrl: './non-working-days.component.html',
  styles: [],
})
export class NonWorkingDaysComponent extends BasePage implements OnInit {
  calendar: ICalendar[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  nonWorkingDaysForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private calendarService: CalendarService
  ) {
    super();
    this.settings.columns = NONWORKINGDAYS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCalendarAll());
  }
  private prepareForm() {
    this.nonWorkingDaysForm = this.fb.group({
      year: [null, Validators.required],
    });
  }
  getCalendarAll() {
    this.loading = true;
    this.calendarService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.calendar = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  private getCalendar() {
    this.loading = true;
    let file = this.nonWorkingDaysForm.controls['year'].value;
    this.calendarService.getById3(file).subscribe({
      next: response => {
        this.calendar = response.data;
        console.log(response);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(calendar?: ICalendar) {
    console.log(calendar);
    let config: ModalOptions = {
      initialState: {
        calendar,
        callback: (next: boolean) => {
          if (next) this.getCalendarAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NonWorkingDaysModalComponent, config);
  }
  public search() {
    this.getCalendar();
  }
}
