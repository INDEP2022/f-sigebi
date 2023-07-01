import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingPercentService } from 'src/app/common/services/loading-percent.service';
import { ProgressPercentService } from 'src/app/core/services/loading-percent-massive/progress-percent.service';
import { showHideErrorInterceptorService } from '../../../common/services/show-hide-error-interceptor.service';
// ././../../../../ common / services / show - hide - error - interceptor.service
@Component({
  selector: 'app-loading-percent',
  templateUrl: './loading-percent.component.html',
  styles: [
    `
      .lds-spinner {
        top: 0 !important;
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: rgba(20, 20, 20, 0.9);
        z-index: 1111;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: hidden;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .lds-spinner div {
        transform-origin: 40px 40px;
        animation: lds-spinner 3s linear infinite;
      }

      .progress-number {
        font-weight: bold;
        color: white;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
      }
      @keyframes lds-spinner {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class LoadingPercentComponent implements OnInit {
  progreso: string = '';
  subscription: Subscription;
  loader: boolean;
  constructor(
    private readonly loadingPercentService: LoadingPercentService,
    private progressPercentService: ProgressPercentService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService
  ) {
    loadingPercentService.loaderProgress.subscribe({
      next: load => {
        this.loader = load;
        if (this.loader) this.loadingPercent();
      },
    });
  }

  ngOnInit(): void {
    //this.startInterval();
  }

  loadingPercent() {
    this.progressPercentService.getPercent().subscribe(
      (resp: any) => {
        this.progreso = resp.percent;
      },
      erro => {
        console.log(erro.status);
      }
    );
    setTimeout(() => {
      if (Number(this.progreso) >= 99 && Number(this.progreso) < 100)
        this.loader = false;
      if (this.loader) {
        this.loadingPercent();
      }
    }, 3000);
  }
}
