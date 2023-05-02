import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-policies-report',
  templateUrl: './policies-report.component.html',
  styles: [],
})
export class PoliciesReportComponent {
  formPoliceStartDate = new FormGroup({
    policy: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    startDate: new FormControl(null, Validators.required),
  });
  formFromTo = new FormGroup({
    // policy: new FormControl(null, [
    //   Validators.required,
    //   Validators.pattern(STRING_PATTERN),
    // ]),
    // startDate: new FormControl(null, Validators.required),
    from: new FormControl(null, Validators.required),
    to: new FormControl(null, Validators.required),
    // policySinister: new FormControl(null, Validators.required),
    // startDateSinister: new FormControl(null, Validators.required),
  });

  formSinister = new FormGroup({
    policySinister: new FormControl(null, Validators.required),
    startDateSinister: new FormControl(null, Validators.required),
  });
  constructor(private fb: FormBuilder) {}

  // ngOnInit(): void {
  //   this.prepareForm();
  // }

  // prepareForm() {
  //   this.form = this.fb.group({
  //     policy: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
  //     startDate: [null, Validators.required],
  //     from: [null, Validators.required],
  //     to: [null, Validators.required],
  //     policySinister: [null, Validators.required],
  //     startDateSinister: [null, Validators.required],
  //   });
  // }

  save() {
    // console.log(this.form.value);
  }
}
