import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//models
//Services
import { DatePipe } from '@angular/common';
import { addDays } from 'date-fns';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerTpEventFull,
  IComerTpEventId,
} from 'src/app/core/models/ms-event/event-type.model';
import { DelegationService } from 'src/app/core/services/maintenance-delegations/delegation.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-event-tprocess-form',
  templateUrl: './event-tprocess-form.component.html',
  styles: [],
})
export class EventTProcessFormComponent extends BasePage implements OnInit {
  title: string = 'proceso';
  edit: boolean = false;

  comerEventRlForm: ModelForm<IComerTpEventFull>;
  comerEventForm: ModelForm<IComerTpEventId>;

  comerEvent: any;

  delegations = new DefaultSelect();
  typeEvent = new DefaultSelect();

  today: Date;
  eventId: string;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerTpEventosService: ComerTpEventosService,
    private delegationService: DelegationService,
    private datePipe: DatePipe
  ) {
    super();
    this.today = new Date();
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'YYYY',
        minMode: 'year' as BsDatepickerViewMode,
      }
    );
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.comerEventRlForm);
  }

  private prepareForm() {
    this.comerEventForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      tpeventoId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      StatusvtaId: [null, [Validators.pattern(STRING_PATTERN)]],
      processKey: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
      failedDate: [null, []],
      place: [null, [Validators.pattern(STRING_PATTERN)]],
      eventDate: [null, [Validators.pattern(STRING_PATTERN)]],
      text1: [null, [Validators.pattern(STRING_PATTERN)]],
      text2: [null, [Validators.pattern(STRING_PATTERN)]],
      signatory: [null, [Validators.pattern(STRING_PATTERN)]],
      signatoryPost: [null, [Validators.pattern(STRING_PATTERN)]],
      notes: [null, [Validators.pattern(STRING_PATTERN)]],
      textEnd3: [null, [Validators.pattern(STRING_PATTERN)]],
      textEnd4: [null, [Validators.pattern(STRING_PATTERN)]],
      basisCost: [null, [Validators.pattern(STRING_PATTERN)]],
      basisVendNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      username: [null, [Validators.pattern(STRING_PATTERN)]],
      month: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      year: [null, []],
      delegationNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      phaseInmu: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      thirdEatId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      notificationDate: [null, [Validators.pattern(STRING_PATTERN)]],
      closingEventDate: [null, [Validators.pattern(STRING_PATTERN)]],
      tpsolavalId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      applyIva: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.comerEventRlForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      year: [
        null,
        [Validators.required, Validators.min(1970), Validators.max(3000)],
      ],
      phase: [
        null,
        [Validators.required, Validators.min(0), Validators.max(99)],
      ],
      topost: [null, [Validators.required]],
      warrantyDate: [null, [Validators.required]],
    });

    if (this.comerEvent != null) {
      this.edit = true;
      console.log(this.comerEvent);
      this.comerEventRlForm.patchValue(this.comerEvent);
      if (this.comerEvent.warrantyDate) {
        this.comerEventRlForm
          .get('warrantyDate')
          .setValue(addDays(new Date(this.comerEvent.warrantyDate), 1));
      }
      /*       this.comerEventForm.patchValue(this.comerEventRlForm.get('id').value); */
    }
    this.comerEventRlForm.controls['id'].setValue(this.eventId);
    this.comerEventRlForm.controls['id'].disable();
    console.log(this.eventId);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let year = this.comerEventRlForm.value.year;
    var date = new Date(year);
    year = date.getFullYear();
    this.comerEventRlForm.value.year = year;
    this.comerEventRlForm.controls['year'].setValue(year);

    this.comerTpEventosService
      .create(this.comerEventRlForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    /*console.log('t' + this.comerEventRlForm.get('topost').value);

    let editTpEvent: any = {
      id: this.comerEventRlForm.get('id').value,
      year: this.comerEventRlForm.get('year').value,
      phase: this.comerEventRlForm.get('phase').value,
      topost: this.comerEventRlForm.get('topost').value,
    };
    if (this.comerEventRlForm.get('topost').value == null) {
    } else if (this.comerEventRlForm.get('topost').value == false) {
      editTpEvent.topost = 0;
    } else {
      editTpEvent.topost = 1;
    }

    console.log('w ' + this.comerEventRlForm.get('warrantyDate').value);
    if (
      this.comerEventRlForm.get('warrantyDate').value != null &&
      this.comerEventRlForm.get('warrantyDate').value != ''
    ) {
      editTpEvent['warrantyDate'] = format(
        this.comerEventRlForm.get('warrantyDate').value,
        'yyyy-MM-dd'
      );
    }
    this.loading = true;
    console.log('ed ' + JSON.stringify(editTpEvent));
    this.comerTpEventosService
      .newUpdate(this.comerEvent.id, editTpEvent)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });*/
    this.loading = true;
    let year = this.comerEventRlForm.value.year;
    var date = new Date(year);
    year = date.getFullYear();
    this.comerEventRlForm.value.year = year;
    this.comerEventRlForm.controls['year'].setValue(year);

    //console.log(this.comerEventRlForm.controls['warrantyDate'].value);
    let dateComer: Date = new Date(
      this.comerEventRlForm.controls['warrantyDate'].value
    );

    const format = this.datePipe.transform(dateComer, 'yyyy-MM-dd');
    console.log(format);
    this.comerEventRlForm.controls['warrantyDate'].setValue(format);

    this.comerTpEventosService
      .newUpdate(this.eventId, this.comerEventRlForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'se ha actualizado'
      : 'ha sido guardado';
    this.onLoadToast('success', `El ${this.title} ${message}`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Métodos para obtener información en los select dinámicos
  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: data =>
        (this.delegations = new DefaultSelect(data.data, data.count)),
    });
  }

  /* getTypeEvent(params: ListParams) {
    this.comerEventosService.getAllTypeEvent(params).subscribe({
      next: data => (this.typeEvent = new DefaultSelect(data.data, data.count)),
    });
  } */
}
