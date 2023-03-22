import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ScreenCodeService } from 'src/app/common/services/screen-code.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import {
  BINNACLE_ROUTE,
  HELP_SCREEN,
} from 'src/app/utils/constants/main-routes';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  element: any;
  screenCode: string = null;
  userName: string;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  $unSubscribe = new Subject<void>();

  get currentScreen() {
    return this.screenCodeService.$id.getValue();
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthService,
    private screenCodeService: ScreenCodeService,
    private activatedRoute: ActivatedRoute
  ) {}

  openMobileMenu: boolean;

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;
    this.userName = this.authService.decodeToken().name;
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  help() {
    if (!this.currentScreen) {
      this.noScreenId();
      return;
    }
    this.router.navigate([HELP_SCREEN], {
      queryParams: { screen: this.currentScreen },
    });
  }

  binnacle() {
    if (!this.currentScreen) {
      this.noScreenId();
      return;
    }
    this.router.navigate([BINNACLE_ROUTE], {
      queryParams: { screen: this.currentScreen },
    });
  }

  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }

  noScreenId() {
    this.onLoadToast('error', 'Error', 'No existe un código de pantalla');
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.toast = true;
    sweetalert.position = 'top-end';
    sweetalert.timer = 6000;
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    Swal.fire(sweetalert);
  }
}
