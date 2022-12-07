import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gp-trades-registration',
  templateUrl: './gp-trades-registration.component.html',
  styles: [],
})
export class GpTradesRegistrationComponent implements OnInit {
  form = this.fb.group({});
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
