import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-rddg-drpad-c-totaldoc-received-destinationarea',
  templateUrl: './pe-rddg-drpad-c-totaldoc-received-destinationarea.component.html',
  styles: [
  ]
})
export class PeRddgDrpadCTotaldocReceivedDestinationareaComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      report: ['', [Validators.required]],
      idArea: ['', [Validators.required]],
      delegation: ['', [Validators.required]],
      subDelegation: ['', [Validators.required]],
    });
  }


}
