import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-trades-registration',
  templateUrl: './trades-registration.component.html',
  styles: [],
})
export class TradesRegistrationComponent implements OnInit {
  form = this.fb.group({});
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
