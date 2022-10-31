import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gp-purging-records-form',
  templateUrl: './gp-purging-records-form.component.html',
  styles: [],
})
export class GpPurgingRecordsFormComponent implements OnInit {
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
