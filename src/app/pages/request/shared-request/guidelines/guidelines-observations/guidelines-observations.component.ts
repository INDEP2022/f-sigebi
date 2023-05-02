import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-guidelines-observations',
  templateUrl: './guidelines-observations.component.html',
  styles: [],
})
export class GuidelinesObservationsComponent
  extends DefaultEditor
  implements OnInit
{
  selectForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      observations: [null],
    });
    if (this.cell.newValue !== '') {
      this.selectForm.controls['observations'].setValue(this.cell.newValue);
    }
  }

  updateData() {
    this.cell.newValue = this.selectForm.controls['observations'].value;
  }
}
