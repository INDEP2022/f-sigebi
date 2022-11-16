import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { IEventsType } from 'src/app/core/models/commercialization/events-type.model';
import { eventsTypeData } from './events-type-data';

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
  params = new BehaviorSubject<ListParams>(new ListParams());
  events = new DefaultSelect<IEventsType>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    let eventType = this.form.controls[this.eventField].value;
    if(eventType !== null && this.form.contains('eventDescription')){
      let description= this.form.controls['eventDescription'].value;
      this.events=new DefaultSelect([
        {
          id_tpevento: eventType,
          descripcion: description,
        }
      ]);
    };
  }

  getEvents(params: ListParams) {
    //Provisional data
    let data = eventsTypeData;
    let count = data.length;
    this.events = new DefaultSelect(data, count);
  }

  onEventsChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
