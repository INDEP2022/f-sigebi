import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-read-info-domicile',
  templateUrl: './read-info-domicile.component.html',
  styleUrls: ['./read-info-domicile.component.scss'],
})
export class ReadInfoDomicileComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() domicilieObject: any;
  domicile: any;
  stateOfRepublic: string = '';
  municipality: string = '';
  locality: string = '';

  private readonly stateOfRepublicService = inject(StateOfRepublicService);
  private readonly goodsInvService = inject(GoodsInvService);

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.domicile = this.domicilieObject;
    if (this.domicile) {
      this.getStateOfRepublic(this.domicile.statusKey);
      this.getMunicipaly(
        this.domicile.statusKey,
        this.domicile.municipalityKey
      );
      this.getLocality(
        this.domicile.municipalityKey,
        this.domicile.statusKey,
        this.domicile.localityKey
      );
    }
  }

  ngOnInit(): void {}

  getStateOfRepublic(keyState?: number) {
    if (!keyState) {
      return;
    }
    this.stateOfRepublicService
      .getById(keyState)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: any) => {
          console.log('statdo', resp);
          this.stateOfRepublic = resp.descCondition;
        },
        error: error => {
          console.log(error);
        },
      });
  }

  getMunicipaly(stateKey: number | string, municipalyId?: number | string) {
    if (!stateKey || !municipalyId) {
      return;
    }
    const params = new ListParams();
    params['filter.stateKey'] = `$eq:${stateKey}`;
    params['filter.municipalityKey'] = `$eq:${municipalyId}`;

    this.goodsInvService
      .getAllMunipalitiesByFilter(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.municipality = resp.data[0].municipality.toUpperCase();
        },
        error: error => {
          console.log(error);
        },
      });
  }

  getLocality(
    municipalityId: number | string,
    stateKey: number | string,
    localityKey: number | string
  ) {
    if (!stateKey || !municipalityId || !localityKey) {
      return;
    }
    const params = new FilterParams();
    params.addFilter('municipalityKey', municipalityId);
    params.addFilter('stateKey', Number(stateKey));
    params.addFilter('townshipKey', localityKey);
    const filter = params.getParams();
    this.goodsInvService
      .getAllTownshipByFilter(filter)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.locality = resp.data[0].township;
        },
        error: error => {
          console.log(error);
        },
      });
  }
}
