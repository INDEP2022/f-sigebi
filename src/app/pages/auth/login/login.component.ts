import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModel } from 'src/app/core/models/authentication/auth.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends BasePage implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.loading = true;
    let { username, password } = this.loginForm.value;
    let token: AuthModel;
    let roles: any; //RolesModel;
    /*const access_token =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBNDRKQnJpT1lPb2ZRd2E2R1BHNDFsM0lSNFExQlBFMGRWdkpjMkwxUWdnIn0.eyJleHAiOjE2NjUwNzA5OTMsImlhdCI6MTY2NTA2NzM5MywianRpIjoiYjBiYzkxMTAtMGQ3MC00MDM4LWFlZTMtNzE0ZjMzMTM3YTJhIiwiaXNzIjoiaHR0cDovLzUyLjE0Mi4yMy4xNjkvcmVhbG1zL2luZGVwIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6IjgyZDc3OTI0LWU1ZmYtNDk1Ny1hZDAxLWEyZWViMWNmNTcwYSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImluZGVwLWF1dGgiLCJzZXNzaW9uX3N0YXRlIjoiMDE0ZGRmNWQtYTM3ZC00ZjA0LThhMWItYmY5ZmNiM2ZlMTU4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vNTIuMTQ5LjI1NC41Mzo4MDgxLyoiLCJodHRwOi8vNTIuMTQ5LjI1NC41Mzo4MDgxIiwiaHR0cDovLzIwLjEyMC40MS4wLyoiLCJodHRwOi8vMjAuMjMxLjIyMy4yMDM6NDQzIiwiaHR0cDovLzIwLjIzMS4yMjMuMjAzOjgwIiwiaHR0cDovLzIwLjg1LjIwMS4xMTEiLCJodHRwOi8vMjAuMTAyLjM4LjIyOjQyMDAiLCJodHRwOi8vMjAuMTIwLjQxLjAiLCJodHRwOi8vMjAuMjMxLjIyMy4yMDMiLCJodHRwOi8vMjAuMTIwLjQxLjAvYXV0aC9sb2dpbiIsImh0dHA6Ly8xOTIuMTY4LjAuNDo0MjAwIiwiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhcHAtU0FEIiwiZGVmYXVsdC1yb2xlcy1pbmRlcCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiaW5kZXAtYXV0aCI6eyJyb2xlcyI6WyJTQUQiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiIwMTRkZGY1ZC1hMzdkLTRmMDQtOGExYi1iZjlmY2IzZmUxNTgiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJSaWNhcmRvIFJvZHJpZ3VleiBMb3BleiIsInByZWZlcnJlZF91c2VybmFtZSI6InJyb2RyaWd1ZXoiLCJnaXZlbl9uYW1lIjoiUmljYXJkbyIsImZhbWlseV9uYW1lIjoiUm9kcmlndWV6IExvcGV6IiwiZW1haWwiOiJycm9kcmlndWV6bEB1bHRyYXNpc3QuY29tLm14In0.EB-8a_1vtrdIsT7uPSL1tZn5UWLjSfdwjroy4_wtwxe5K0YpPYJNNhDEwBqys0KN_Kf5714LAT0lN9z2XRWLTH5cEI3heDkT7_ryYr15Jnx23hkIUAVURCmbxb_ILy7m-TTZK8Bol0teT_TTiinwQkmGX1wM0blHVMSZ28RtuMxyammAGeliOg-3iQPINYR_THAMCODrz1j8mHZTYhUWsIqkH4sGroF39k1fkmZg4sRo8xOBTRHgQzlEwtVZvi4uGSNTQBe-TL7xF2Aio0xrt3TmGWWB5zTn_V5-YAG9wqBvwkR6dyzhsu8yY6b8GxlC2vzDVYIkHBlIE-7IhXvxqA';
    localStorage.setItem('token', access_token);
    this.router.navigate(['pages/home']);
    localStorage.setItem('token_expires', '1664834519768');*/
    this.authService
      .getToken(username, encodeURIComponent(password))
      .subscribe({
        error: () => (this.loading = false),
        next: data => {
          token = data;
        },
        complete: () => {
          if (this.authService.existToken()) {
            let uidUser = this.authService.decodeToken().sub;
            this.authService.getRoles(uidUser).subscribe({
              next: data => {
                this.loading = false;
                roles = data;
              },
              error: () => {
                this.loading = false;
              },
              complete: () => {
                localStorage.setItem('username', username);
                localStorage.setItem('roles', JSON.stringify(roles));
                this.router.navigate(['pages/general-processes/goods-tracker']);
                setTimeout(() => {
                  location.reload();
                }, 1000);
              },
            });
          }
        },
      });
  }
}
