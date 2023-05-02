import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, tap } from 'rxjs';
import { BYPASS_JW_TOKEN } from 'src/app/common/interceptors/auth.interceptor';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../../models/authentication/auth.model';
import { RolesInfoModel } from '../../models/authentication/roles-info.model';
import { TokenInfoModel } from '../../models/authentication/token-info.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private tokenTimeOut: NodeJS.Timeout;
  private tokenR: string;
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

  setTokenTimer() {
    const token = localStorage.getItem('token');
    const decodedToken: any = this.jwtService.decodeToken(token);
    const expires = new Date(decodedToken.exp * 1000);
    const tokenCreation = new Date(decodedToken.iat * 1000);
    const timeOut = new Date((decodedToken.exp - 300) * 1000);
    const _timeout = timeOut.getTime() - tokenCreation.getTime();
    console.log(
      `El token se genero a las ${tokenCreation}, expira a las ${new Date(
        decodedToken.exp * 1000
      )}, se refrescara el token a las ${timeOut}, en ${
        timeOut.getTime() - tokenCreation.getTime()
      } milisegundos`
    );
    this.tokenTimeOut = setTimeout(() => {
      const refresh_token = localStorage.getItem('r_token');
      if (!refresh_token) {
        return;
      }
      this.refreshToken(refresh_token).subscribe(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('r_token', response.refresh_token);
      });
    }, _timeout);
  }

  getToken(username: string, password: string): Observable<AuthModel> {
    let params = `client_id=indep-auth&grant_type=password&client_secret=AzOyl1GDe3G9mhI8c7cIEYQ1nr5Qdpjs&scope=openid&username=${username}&password=${password}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http.post<AuthModel>(this.tokenUrl, params, { headers }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('r_token', response.refresh_token);
      })
    );
  }

  refreshToken(token: string) {
    let params = `client_id=indep-auth&grant_type=refresh_token&refresh_token=${token}&client_secret=AzOyl1GDe3G9mhI8c7cIEYQ1nr5Qdpjs`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http
      .post<AuthModel>(this.tokenUrl, params, {
        headers,
        context: new HttpContext().set(BYPASS_JW_TOKEN, true),
      })
      .pipe(tap(() => this.setTokenTimer()));
  }

  existToken() {
    this.token = localStorage.getItem('token');
    return this.token ? true : false;
  }

  accessToken() {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  accessRefreshToken() {
    this.tokenR = localStorage.getItem('r_token');
    return this.tokenR;
  }

  decodeToken(): TokenInfoModel {
    const decodedToken: TokenInfoModel = this.jwtService.decodeToken(
      this.token
    );
    if (decodedToken.preferred_username != 'sigebiadmon') {
      const tokenInfo = {
        ...decodedToken,
        preferred_username: decodedToken.preferred_username.toLocaleUpperCase(),
      };
      return tokenInfo;
    }
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
