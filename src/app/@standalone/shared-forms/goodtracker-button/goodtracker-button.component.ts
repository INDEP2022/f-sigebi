import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GOOD_TRACKER_ORIGINS } from 'src/app/pages/general-processes/goods-tracker/utils/constants/origins';
import { AlertButton } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/models/alert-button';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-goodtracker-button',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goodtracker-button.component.html',
  styles: [
    `
      button {
        @media screen and (max-width: 576px) {
          width: 100%;
        }
      }
    `,
  ],
})
export class GoodtrackerButtonComponent extends AlertButton implements OnInit {
  @Input() disabled: boolean;
  @Input() data: any[];
  @Input() origin: GOOD_TRACKER_ORIGINS;
  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {}

  goodTracker() {
    if (this.data.length > 0) {
      this.alertQuestion(
        'warning',
        'Rastreador de bienes',
        '¿La asignación de bienes ya se ha realizado, se ejecuta nuevamente?'
      ).then(question => {
        if (question.isConfirmed) {
          this.redirectGoodTracker(question);
        }
      });
    } else {
      this.alertQuestion(
        'warning',
        'Rastreador de bienes',
        'Quiere continuar con el proceso?'
      ).then(question => {
        if (question.isConfirmed) {
          this.redirectGoodTracker(question);
        }
      });
    }
  }

  private redirectGoodTracker(question: SweetAlertResult) {
    if (question.isConfirmed) {
      // localStorage.setItem('goodsToAddScheduledMaintenanceDetail', '');
      this.router.navigate(['pages/general-processes/goods-tracker'], {
        queryParams: { origin: this.origin },
      });
    }
  }
}
