import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintenance-opinion',
  templateUrl: './maintenance-opinion.component.html',
  styles: [],
})
export class MaintenanceOpinionComponent implements OnInit {
  maintenanceForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maintenanceForm = this.fb.group({
      proceedings: [null, Validators.required],
      noJob: [null, Validators.required],
    });
  }
}
