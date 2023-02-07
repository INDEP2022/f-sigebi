import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ITevents } from 'src/app/core/models/catalogs/tevents.model';
import { UserEventTypesService } from 'src/app/core/services/catalogs/users-event-types.service';

@Component({
  selector: 'app-event-type-shared',
  templateUrl: './event-type-shared.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styles: [],
})
export class EventTypeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() eventField: string = 'event';
  @Input() label: string = 'Tipo de evento';
  @Input() bindLabel: string = 'descripcion';
  @Input() showEvents: boolean = true;
  @Output() emitTevents = new EventEmitter<ITevents>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  events = new DefaultSelect<ITevents>();

  constructor(private userEventTypesService: UserEventTypesService) {
    super();
  }

  ngOnInit(): void {
    let eventType = this.form.controls[this.eventField].value;
    if (eventType !== null && this.form.contains('eventDescription')) {
      let description = this.form.controls['eventDescription'].value;
      this.events = new DefaultSelect([
        {
          id: eventType,
          description: description,
        },
      ]);
    }
  }

  getEvents(params: ListParams) {
    //Provisional data
    this.userEventTypesService.getAllType(params).subscribe(
      (data: any) => {
        this.events = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onEventsChange(type: any) {
    this.form.updateValueAndValidity();
    this.events = new DefaultSelect();
    this.emitTevents.emit(type);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
