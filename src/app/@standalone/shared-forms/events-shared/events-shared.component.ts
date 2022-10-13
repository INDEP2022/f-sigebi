import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from "@angular/forms";
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IEvent } from 'src/app/core/models/commercialization/event.model';
import { eventsData } from './eventsData';

@Component({
  selector: 'app-events-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './events-shared.component.html',
  styles: [
  ]
})
export class EventsSharedComponent extends BasePage implements OnInit {

  @Input() form: FormGroup;
  @Input() eventField: string = "event";

  @Input() showEvents: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  events = new DefaultSelect<IEvent>();

  /*get event() {
    return this.form.get(this.eventField);
  }*/

  constructor(){
    super();
  }

  ngOnInit(): void {
  }

  getEvents(params: ListParams) {
    //Provisional data
    let data=eventsData;
    let count= data.length;
    this.events = new DefaultSelect(data,count);
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
    fields.forEach((field) => {
      //field.setValue(null);
      field=null;
    });
    this.form.updateValueAndValidity();
  }

}

