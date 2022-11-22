import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-guidelines-revision-view',
  templateUrl: './guidelines-revision-view.component.html',
  styles: [],
})
export class GuidelinesRevisionViewComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;
  selectForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      revision: [null],
    });
    if (this.value != '') {
      this.selectForm.controls['revision'].setValue(this.value);
    }
  }

  onClick(e: Event) {
    this.selectForm.controls['revision'].setValue(this.value);
    e.preventDefault();
    return;
  }
}
