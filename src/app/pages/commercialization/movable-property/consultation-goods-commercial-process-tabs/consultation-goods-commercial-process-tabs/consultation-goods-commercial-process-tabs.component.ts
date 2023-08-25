import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared';
@Component({
  selector: 'app-consultation-goods-commercial-process-tabs',
  templateUrl: './consultation-goods-commercial-process-tabs.component.html',
  styles: [],
})
export class ConsultationGoodsCommercialProcessTabsComponent
  extends BasePage
  implements OnInit
{
  origin: string = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'];
      });
  }
  ngOnInit(): void {}
  goBack() {
    //FCONGENRASTREADOR
    if (this.origin == 'FCONGENRASTREADOR') {
      this.router.navigate([`/pages/general-processes/goods-tracker`]);
    }
  }
}
