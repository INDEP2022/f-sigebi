import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-purging-records-form',
  templateUrl: './purging-records-form.component.html',
  styles: [],
})
export class PurgingRecordsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() recordField: string = '';
  @Input() previusInquiryField: string = '';
  @Input() criminalCaseField: string = '';
  @Input() circumstantialRecordField: string = '';
  @Input() protectionField: string = '';
  @Input() penalField: string = '';
  @Input() identifierField: string = '';

  constructor() {}

  ngOnInit(): void {}
}
