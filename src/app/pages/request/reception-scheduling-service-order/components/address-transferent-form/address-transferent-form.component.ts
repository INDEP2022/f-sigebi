import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-transferent-form',
  templateUrl: './address-transferent-form.component.html',
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
export class AddressTransferentFormComponent implements OnInit {
  claimRequest: boolean = false;
  showAddressTransferent: boolean = true;
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      location: [null],
      address: [null],
    });
  }
}
