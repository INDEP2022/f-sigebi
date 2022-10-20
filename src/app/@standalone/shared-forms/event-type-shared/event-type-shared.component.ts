import { CommonModule, } from '@angular/common';
import { Component, OnInit, Input  } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from '@angular/forms';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { eventsTypeData } from './events-type-data';
import { IEventsType } from 'src/app/core/models/commercialization/events-type.model';

@Component({
  selector: 'app-event-type-shared',
  templateUrl: './event-type-shared.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styles: [
  ]
})
export class EventTypeSharedComponent extends BasePage implements OnInit {

 @Input() form: FormGroup;
  @Input() eventField: string = 'event';
  @Input() label: string ="Tipo de evento";
  @Input() bindLabel: string ="descripcion"
  @Input() showEvents: boolean = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  events = new DefaultSelect<IEventsType>();

  constructor() {
    super();
   }

  ngOnInit(): void {
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
