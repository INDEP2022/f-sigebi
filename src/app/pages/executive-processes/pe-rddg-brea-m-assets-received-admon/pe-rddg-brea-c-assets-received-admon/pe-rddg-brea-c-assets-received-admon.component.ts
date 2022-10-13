import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-rddg-brea-c-assets-received-admon',
  templateUrl: './pe-rddg-brea-c-assets-received-admon.component.html',
  styles: [
  ]
})
export class PeRddgBreaCAssetsReceivedAdmonComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 
  select = new DefaultSelect();
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]],
      rangeDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

}
