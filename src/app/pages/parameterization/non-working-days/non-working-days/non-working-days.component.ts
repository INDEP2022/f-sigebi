import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
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
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getCalendarAll();
        }
      });
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
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.calendarService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.calendar = response.data;
        this.data.load(this.calendar);
        this.data.refresh();
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
  opendelete(calendar: any) {
    console.log(calendar);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        let data = {
          id: calendar.id,
        };
        this.calendarService.remove(data).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha eliminado', '');
            this.getCalendarAll();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
