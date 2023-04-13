import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SURVEILLANCE_LOG_COLUMNS } from './surveillance-log-columns';

@Component({
  selector: 'app-surveillance-log',
  templateUrl: './surveillance-log.component.html',
  styles: [],
})
export class SurveillanceLogComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  surveillance: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  sources = new LocalDataSource();
  @ViewChild('dateRequest') dateRequest: TemplateRef<any>;

  constructor(private survillanceServise: SurvillanceService) {
    super();
    this.settings.columns = SURVEILLANCE_LOG_COLUMNS;
    this.settings.actions = null;
  }

  ngOnInit(): void {
    this.params.subscribe(res => {
      this.getSurveillanceBinnacles(res);
    });
  }

  ngAfterViewInit(): void {
    (this.settings.columns as any).requestDate.filter.component =
      this.dateRequest;
  }

  getSurveillanceBinnacles(listParams: ListParams): void {
    this.loading = true;
    this.survillanceServise.getVigBinnacle(listParams).subscribe({
      next: res => {
        this.loading = false;
        this.totalItems = res.count;
        this.sources.load(res.data);
      },
      error: err => {
        this.loading = false;
      },
    });
  }
}
