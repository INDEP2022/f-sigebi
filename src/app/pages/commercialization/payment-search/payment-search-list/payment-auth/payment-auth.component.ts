import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-payment-auth',
  templateUrl: './payment-auth.component.html',
  styleUrls: ['./payment-auth.component.css'],
})
export class PaymentAuthComponent extends BasePage implements OnInit {
  authForm: FormGroup;
  hide: boolean = true;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    super();
    this.authForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit() {}

  confirm() {
    let { username, password } = this.authForm.value;
    this.authService
      .getToken2(username, encodeURIComponent(password))
      .subscribe({
        error: () => {
          this.loading = false;
          this.alert('error', 'Usuario no autorizado', '');
        },
        next: data => {
          // let token = data.access_token;
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
