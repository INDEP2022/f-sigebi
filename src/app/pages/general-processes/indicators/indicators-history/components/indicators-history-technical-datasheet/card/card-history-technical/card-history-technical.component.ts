import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card-history-technical',
  templateUrl: './card-history-technical.component.html',
  styleUrls: ['./card-history-technical.css'],
})
export class CardHistoryTechnicalComponent implements OnInit {
  //

  form: FormGroup;

  //

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      status: [null],
      delegation: [null],
      year: [null],
      month: [null],
      stragy: [null],
      report: [null],
      stragyTwo: [null],
      reportTwo: [null],
    });
  }

  //

  //
}
