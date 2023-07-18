import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventStadisticsForm } from '../../utils/forms/event-stadistics-form';

@Component({
  selector: 'event-preparation-stadistics',
  templateUrl: './event-preparation-stadistics.component.html',
  styles: [],
})
export class EventPreparationStadisticsComponent implements OnInit {
  @Input() stadisticsForm: FormGroup<EventStadisticsForm>;

  get controls() {
    return this.stadisticsForm.controls;
  }
  constructor() {}

  ngOnInit(): void {}
}
