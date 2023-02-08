import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      file: [null, Validators.required],
      fileTo: [null, Validators.required],

      receptionDate: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
    });
  }
}
