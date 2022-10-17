import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-rddxdees-c-reception-area-sera',
  templateUrl: './pe-rddxdees-c-reception-area-sera.component.html',
  styles: [],
})
export class PeRddxdeesCReceptionAreaSeraComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      delegationDes: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      subDelegationDes: ['', [Validators.required]],
      idArea: ['', [Validators.required]],
      rangeDate: ['', [Validators.required]],
      // fromMonth: ['', [Validators.required]],
      // toMonth: ['', [Validators.required]],
    });
  }
}
