import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.getTokenExpiration();
    if (this.authService.existToken() && !this.authService.isTokenExpired()) {
      return true; //this.checkRoles(next) ? true : false;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  checkRoles(route?: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    if (this.authService.hasRoles()) {
      //return route.data['screen'] ? true : true;//false
      let currentRoute = route.root;
      let screen = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach(routes => {
          if (routes.outlet === 'primary') {
            screen = route.data['screen'];
            currentRoute = routes;
          }
        });
      } while (currentRoute);

      if (screen !== undefined) {
        //console.log('screen')
        //console.log(route.data['screen'])
        //console.log(this.authService.accessRoles());
        let roles = this.authService
          .accessRoles()
          .filter((rol: any) => rol.name == 'catologos');
        //console.log(roles[0].menus.indexOf((menu:any)=>menu.screen == screen));
        /*this.authService.accessRoles().map((rol:any)=>{
          console.log(rol.menus.indexOf((menu:any)=>menu.screen == screen));
        })*/
        return true;
      } else {
        //console.log('no tiene ')
        //
        return true;
      }
    } else {
      return false;
    }
    /*return  this.authFS.getProfile().then((profile:any)=>{
      const userRole = profile.perfil;
      if(route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.router.navigate(['/inicio']);
        return false;
      }
        return true;
    })*/
  }

  /*checkUserLogin(route: ActivatedRouteSnapshot, url: any):  Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
      this.authFS.isLogged().subscribe(user=>{
        if(!user){
          this.router.navigate(['/auth/login']);
          resolve(false)
        }else{
          resolve(true)
        }
      })
    });
  }*/
}
