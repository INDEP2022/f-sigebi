import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthModel, UserInfoModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private readonly url = environment.API_URL;
  private readonly tokenUrl = environment.api_external_token;
  private readonly userInfo = environment.api_external_userInfo;
  private readonly userType = environment.api_external_typeUser;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtHelperService
  ) { }

  getToken(username: string, password: string): Observable<AuthModel> {
    let params = `client_id=indep-auth&grant_type=password&client_secret=AzOyl1GDe3G9mhI8c7cIEYQ1nr5Qdpjs&scope=openid&username=${username}&password=${password}`;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<AuthModel>(this.tokenUrl, params, { headers });
  }

  existToken() {
    this.token = localStorage.getItem('token');
    return this.token ? true : false;
  }

  decodeToken() {
    const decodedToken = this.jwtService.decodeToken(this.token);
    return decodedToken;
  }

  getTokenExpiration() {
    const expirationDate = this.jwtService.getTokenExpirationDate(this.token);
    return expirationDate;
  }

  isTokenExpired() {
    const isExpired = this.jwtService.isTokenExpired(this.token);
    return isExpired;
  }

}
