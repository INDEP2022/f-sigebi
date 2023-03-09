import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../../models/authentication/auth.model';
import { RolesInfoModel } from '../../models/authentication/roles-info.model';
import { TokenInfoModel } from '../../models/authentication/token-info.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private readonly url = environment.API_URL;
  private readonly tokenUrl = environment.api_external_token;
  private readonly userInfo = environment.api_external_userInfo;
  private readonly userType = environment.api_external_typeUser;
  private readonly userRoles = environment.api_external_rolesUser;
  private reportAuthFlag: boolean = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtHelperService
  ) {}

  get useReportToken(): boolean {
    return this.reportAuthFlag;
  }

  getToken(username: string, password: string): Observable<AuthModel> {
    let params = `client_id=indep-auth&grant_type=password&client_secret=AzOyl1GDe3G9mhI8c7cIEYQ1nr5Qdpjs&scope=openid&username=${username}&password=${password}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http.post<AuthModel>(this.tokenUrl, params, { headers });
  }

  existToken() {
    this.token = localStorage.getItem('token');
    return this.token ? true : false;
  }

  accessToken() {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  decodeToken(): TokenInfoModel {
    const decodedToken: TokenInfoModel = this.jwtService.decodeToken(
      this.token
    );
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

  hasRoles() {
    let roles = JSON.parse(localStorage.getItem('roles'));
    return roles ? true : false;
  }

  accessRoles() {
    let roles = JSON.parse(localStorage.getItem('roles'));
    return roles;
  }

  getRoles(uid: string): Observable<RolesInfoModel> {
    let appid = `sb-0001`;
    let params = {
      uid: uid,
      appid: appid,
    };
    return this.http.get<RolesInfoModel>(this.userRoles, { params }).pipe(
      map((data: any) => {
        let roles = data.usuario[0].roles;
        return roles;
      })
    );
  }

  setReportFlag(flag: boolean) {
    this.reportAuthFlag = flag;
  }

  getExtTypeUser(sub: string) {
    const pathExtTypeUser = this.userType.concat(sub);
    const token = this.accessToken();
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(pathExtTypeUser, { headers });
  }
}
