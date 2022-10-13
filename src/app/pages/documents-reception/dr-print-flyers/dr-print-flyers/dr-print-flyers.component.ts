import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-dr-print-flyers',
  templateUrl: './dr-print-flyers.component.html',
  styles: [],
})
export class DrPrintFlyersComponent implements OnInit {
  flyersForm: FormGroup;
  select = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      noArea: [null, [Validators.required]],
      area: [null, [Validators.required]],
      from: [null],
      to: [null],
      type: [null],
      fromDate: [null],
      toDate: [null],
    });
  }
}
