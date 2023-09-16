import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppraisalRegistrationMain } from '../classes/appraisal-registration-main';

@Component({
  selector: 'app-appraisal-registration',
  templateUrl: './appraisal-registration.component.html',
  styles: [],
})
export class AppraisalRegistrationComponent
  extends AppraisalRegistrationMain
  implements OnInit
{
  constructor(private activatedRoute: ActivatedRoute) {
    super();
    const screen = this.activatedRoute.snapshot.data['screen'];
    this.global.direction = screen == 'FCOMERREGAVALUO' ? 'M' : 'I';
    this.screen = screen;
  }

  ngOnInit(): void {}
}
