import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-origin-form',
  templateUrl: './address-origin-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class AddressOriginFormComponent implements OnInit {
  showaddressOrigin: boolean = true;
  @Input() ordServform: FormGroup = new FormGroup({});
  //addressOriginForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //this.prepareForm();
  }

  /*  prepareForm() {
    this.addressOriginForm = this.fb.group({
      warehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      cp: [null, [Validators.pattern(STRING_PATTERN)]],
      colony: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  } */
}
