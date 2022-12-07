import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-unreconciled-files',
  templateUrl: './unreconciled-files.component.html',
  styles: [],
})
export class UnreconciledFilesComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],

      file: [null, Validators.required],
      fileTo: [null, Validators.required],

      receptionDate: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
    });
  }
}
