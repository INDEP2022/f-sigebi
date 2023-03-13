import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-guidelines-revision',
  templateUrl: './guidelines-revision.component.html',
  styles: [],
})
export class GuidelinesRevisionComponent
  extends DefaultEditor
  implements OnInit
{
  selectForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      revision: [null],
    });
    if (this.cell.newValue !== '') {
      this.selectForm.controls['revision'].setValue(this.cell.newValue);
    }
  }

  updateData(event: any) {
    const { checked, defaultValue } = event.target;
    if (checked) this.cell.newValue = defaultValue;
  }
}
