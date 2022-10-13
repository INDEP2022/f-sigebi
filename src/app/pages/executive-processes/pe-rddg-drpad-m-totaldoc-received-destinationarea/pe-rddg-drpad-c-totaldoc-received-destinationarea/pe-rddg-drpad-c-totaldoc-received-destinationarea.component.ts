import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-rddg-drpad-c-totaldoc-received-destinationarea',
  templateUrl: './pe-rddg-drpad-c-totaldoc-received-destinationarea.component.html',
  styles: [
  ]
})
export class PeRddgDrpadCTotaldocReceivedDestinationareaComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 
  select = new DefaultSelect();

  today: Date;
  maxDate: Date;
  minDate: Date;
  
  constructor(private fb: FormBuilder,
    ) {
      this.today = new Date();
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
      // this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth(), 25);
    }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: ['', [Validators.required]],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]], 
      report: ['', [Validators.required]],
      idArea: ['', [Validators.required]],
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
    });
  }


}
