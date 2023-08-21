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
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { ScreenCodeService } from 'src/app/common/services/screen-code.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SweetalertModel } from 'src/app/core/shared';
import {
  BINNACLE_ROUTE,
  HELP_SCREEN,
} from 'src/app/utils/constants/main-routes';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FullService } from '../full.service';

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
  loading = false;
  loadingText = 'Generando archivo, por favor espere';
  loadingProgress = 0;
  showLoadingText = true;
  get currentScreen() {
    return this.screenCodeService.$id.getValue();
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthService,
    private screenCodeService: ScreenCodeService,
    private activatedRoute: ActivatedRoute,
    private fullService: FullService
  ) {}

  openMobileMenu: boolean;

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;
    this.userName = this.authService.decodeToken().name;
    this.subscribeToFileGeneration().subscribe();
  }

  subscribeToFileGeneration() {
    return this.fullService.generatingFileFlag.pipe(
      takeUntil(this.$unSubscribe),
      tap(prog => {
        console.warn('PROGRESO EN TOPBAR');

        console.log({ prog });

        this.loading = true;
        const { progress, showText, text } = prog;
        this.loadingProgress = progress;
        this.showLoadingText = showText;
        if (text) {
          this.loadingText = text;
        }
        if (progress == 100) {
          this.loading = false;
        }
      }),
      finalize(() => (this.loading = false))
    );
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
    const helpScreens = [
      'FINDICA_0042',
      'FINDICA_0002',
      'FINDICA_0006',
      'FINDICA_0035_1',
      'FINDICA_0001',
      'FINDICA_0035_3',
      'FINDICA_0035_2',
      'FINDICA_0007',
    ];
    if (helpScreens.includes(this.currentScreen)) {
      this.router.navigate(['/pages/general-processes/help-screen'], {
        queryParams: { screen: this.currentScreen },
      });
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
      queryParams: { origin: this.currentScreen },
    });
  }

  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }

  noScreenId() {
    this.onLoadToast(
      'warning',
      'Advertencia',
      'No existe un código de pantalla'
    );
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    sweetalert.showConfirmButton = true;
    sweetalert.allowOutsideClick = false;
    Swal.fire(sweetalert);
  }
}
