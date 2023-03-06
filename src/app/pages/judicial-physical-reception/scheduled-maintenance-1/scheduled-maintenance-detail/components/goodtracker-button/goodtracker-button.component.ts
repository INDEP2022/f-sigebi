import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { SweetAlertResult } from 'sweetalert2';
import { AlertButton } from '../../../models/alert-button';

@Component({
  selector: 'app-goodtracker-button',
  templateUrl: './goodtracker-button.component.html',
  styles: [],
})
export class GoodtrackerButtonComponent extends AlertButton implements OnInit {
  @Input() statusActaValue: string;
  @Input() data: IGoodsByProceeding[];
  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {}

  goodTracker() {
    if (this.data.length > 0) {
      this.alertQuestion(
        'warning',
        'Rastreador de bienes',
        'La asignación de bienes ya se ha realizado, se ejecuta nuevamente?'
      ).then(question => {
        this.redirectGoodTracker(question);
      });
    } else {
      this.alertQuestion(
        'warning',
        'Rastreador de bienes',
        'Quiere continuar con el proceso?'
      ).then(question => {
        this.redirectGoodTracker(question);
      });
    }
  }

  private redirectGoodTracker(question: SweetAlertResult) {
    if (question.isConfirmed) {
      localStorage.setItem('goodsToAddScheduledMaintenanceDetail', '');
      this.router.navigate(['pages/general-processes/goods-tracker']);
    }
  }
}
