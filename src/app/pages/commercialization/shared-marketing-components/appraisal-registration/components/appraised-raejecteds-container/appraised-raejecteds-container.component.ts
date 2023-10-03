import { Component, OnInit } from '@angular/core';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';

@Component({
  selector: 'appraised-raejecteds-container',
  templateUrl: './appraised-raejecteds-container.component.html',
  styles: [],
})
export class AppraisedRaejectedsContainerComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
