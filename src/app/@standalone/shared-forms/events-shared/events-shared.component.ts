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
//import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IEvent } from 'src/app/core/models/commercialization/event.model';
import { eventsData } from './data';

@Component({
  selector: 'app-events-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './events-shared.component.html',
  styles: [],
})
export class EventsSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() eventField: string = 'event';
  @Input() label: string = 'Eventos';
  @Input() bindLabel: string = 'eventKey';
  @Input() showEvents: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  events = new DefaultSelect<IEvent>();

  /*get event() {
    return this.form.get(this.eventField);
  }*/

  constructor() {
    super();
  }

  ngOnInit(): void {
    let eventId = this.form.controls[this.eventField].value;
    if (eventId !== null && this.form.contains('eventKey')) {
      let eventKP = this.form.controls['eventKey'].value;
      this.events = new DefaultSelect([
        {
          id: eventId,
          eventKey: eventKP,
        },
      ]);
    }
  }

  getEvents(params: ListParams) {
    //Provisional data
    let data = eventsData;
    let count = data.length;
    this.events = new DefaultSelect(data, count);
    /*this.service.getAll(params).subscribe(data => {
        this.delegations = new DefaultSelect(data.data,data.count);
    },err => {
      let error = '';
      if (err.status === 0) {
        error = 'Revise su conexión de Internet.';
      } else {
        error = err.message;
      }
      this.onLoadToast('error', 'Error', error);

    }, () => {});*/
  }

  onEventsChange(type: any) {
    //this.resetFields([this.subdelegation]);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
