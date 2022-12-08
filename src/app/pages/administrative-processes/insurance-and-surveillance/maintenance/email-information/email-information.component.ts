import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-information',
  templateUrl: './email-information.component.html',
  styles: [],
})
export class EmailInformationComponent implements OnInit {
  form: FormGroup;

  public from = new DefaultSelect();
  public tos = new DefaultSelect();
  public ccs = new DefaultSelect();
  public types = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      reasonForChange: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      date: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      cc: [null, Validators.required],
      type: [null, Validators.required],
      issue: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      body: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }

  save() {
    console.log(this.form.value);
  }

  public getFrom(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getTos(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getCcs(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getTypes(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }
}
