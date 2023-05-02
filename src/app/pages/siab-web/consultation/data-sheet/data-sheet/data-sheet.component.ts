import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-sheet',
  templateUrl: './data-sheet.component.html',
  styles: [],
})
export class DataSheetComponent implements OnInit {
  dataSheetForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.dataSheetForm = this.fb.group({
      goodNumber: [null, Validators.required],
    });
  }
}
