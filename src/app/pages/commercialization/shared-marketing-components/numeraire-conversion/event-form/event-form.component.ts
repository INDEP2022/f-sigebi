import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { secondFormatDateTofirstFormatDate } from 'src/app/shared/utils/date';
import { NumerarieService } from '../services/numerarie.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  toggleInformation = true;
  @Input() address: string;
  @Input() pathEvent: string;
  @Input() eventService: any;
  @Input() ilikeFilters: string[] = [];
  @Input() dateFilters: string[] = [];
  @Input() selectNewEvent: IComerEvent;
  @Input() eventColumns: any;
  @Output() resetEvent = new EventEmitter();
  @Output() selectEventEmit = new EventEmitter();
  @Input() functionFilterName: string = 'getAllFilterSelf';
  constructor(
    private fb: FormBuilder,
    private numerarieService: NumerarieService,
    private comertpEventService: ComerTpEventosService
  ) {}

  ngOnInit() {
    this.prepareForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectNewEvent'] && changes['selectNewEvent'].currentValue) {
      this.selectEvent(changes['selectNewEvent'].currentValue);
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      nameEvent: [''],
      processKey: [''],
      observations: [''],
      statusVtaId: [''],
      eventDate: [''],
      place: [''],
      failureDate: [''],
    });
  }

  get nameEvent() {
    return this.form.get('nameEvent');
  }

  resetForm() {
    this.form.reset();
    this.resetEvent.emit(true);
    // this.selectedEvent = null;
    // this.numerarieService.selectedExpenseData = null;
    // this.reloadExpenses++;
  }

  selectEvent(event: IComerEvent) {
    console.log(event);

    this.form.get('nameEvent').setValue('');
    this.form.get('processKey').setValue(event.processKey);
    this.form.get('statusVtaId').setValue(event.statusVtaId);
    this.form
      .get('eventDate')
      .setValue(secondFormatDateTofirstFormatDate(event.eventDate as string));
    this.form.get('place').setValue(event.place);
    this.form
      .get('failureDate')
      .setValue(secondFormatDateTofirstFormatDate(event.failureDate));
    this.form.get('observations').setValue(event.observations);

    const filterParams = new FilterParams();
    filterParams.addFilter('id', event.eventTpId);
    this.comertpEventService
      .getAllComerTpEvent(filterParams.getParams())
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response && response.data) {
            this.form.get('nameEvent').setValue(response.data[0].description);
          }
        },
      });
    this.selectEventEmit.emit(event);
  }

  get showParcial() {
    return this.numerarieService.showParcial;
  }

  set showParcial(value) {
    this.numerarieService.showParcial = value;
  }
}
