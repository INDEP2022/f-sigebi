import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/core/models/authentication/auth.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    let { username, password } = this.loginForm.value;
    let token: AuthModel;
    this.authService.getToken(username, password).subscribe({
      next: data => {
        token = data;
      },
      complete: () => {
        localStorage.setItem('token', token.access_token);
        this.router.navigate(['pages/home']);
      },
    });
  }
}
