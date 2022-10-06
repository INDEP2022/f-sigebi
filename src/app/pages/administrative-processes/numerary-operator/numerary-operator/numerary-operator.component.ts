import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-numerary-operator',
  templateUrl: './numerary-operator.component.html',
  styles: [],
})
export class NumeraryOperatorComponent implements OnInit {
  public numeraryForm: FormGroup;

  public get startedDate(): AbstractControl {
    return this.numeraryForm.get('startedDate');
  }
  public get finishedDate(): AbstractControl {
    return this.numeraryForm.get('finishedDate');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm(): void {
    this.numeraryForm = this.fb.group({
      startedDate: ['', Validators.required],
      finishedDate: ['', Validators.required],
    });
  }

  public send(): void {
    console.log(this.numeraryForm.value);
  }
}
