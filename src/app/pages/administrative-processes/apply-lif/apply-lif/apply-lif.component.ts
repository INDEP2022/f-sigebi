import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-apply-lif',
  templateUrl: './apply-lif.component.html',
  styles: [],
})
export class ApplyLifComponent implements OnInit {
  public form: FormGroup;
  public disabled: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm(): void {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      description: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      status: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      noRecord: [null, Validators.required],
      identifier: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      processExtDom: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      noConversions: [null, Validators.required],
      noBienNum: [null, Validators.required],
      statusBien: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      date: ['', [Validators.required]],
      price: [null, Validators.required],
      spend: [null, [Validators.required]],
      totalIva: [null],
      total: [null],
    });
  }

  public send() {
    console.log(this.form.value);
  }
}
