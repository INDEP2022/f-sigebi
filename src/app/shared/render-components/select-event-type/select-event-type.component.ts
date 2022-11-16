import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-select-event-type',
  templateUrl: './select-event-type.component.html',
  styles: [
    `
      :host ::ng-deep .form-control.ng-select {
        border: none;
        padding: 0;
      }
      :host ::ng-deep .ng-select.ng-select-single .ng-select-container {
        border: none;
      }
    `,
  ],
})
export class SelectEventTypeComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.cell.newValue !== '') {
      if (this.cell.getValue() !== null) {
        let eventType = this.cell.getValue;
        this.form.controls['eventType'].setValue(eventType);
      }
    }

    this.form.controls['eventType'].valueChanges.subscribe(eventType => {
      this.cell.newValue = eventType;
    });
  }

  prepareForm(): void {
    this.form = this.fb.group({
      eventType: [null],
    });
  }
}
