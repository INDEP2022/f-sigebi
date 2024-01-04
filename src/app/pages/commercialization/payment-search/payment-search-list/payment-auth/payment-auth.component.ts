import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-auth',
  templateUrl: './payment-auth.component.html',
  styleUrls: ['./payment-auth.component.css'],
})
export class PaymentAuthComponent implements OnInit {
  authForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      clave: [null, []],
      contrasena: [null, []],
    });
  }

  ngOnInit() {}
}
