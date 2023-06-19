import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ServiceGoodService } from 'src/app/core/services/ms-serviceGood/servicegood.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-registry-services',
  templateUrl: './registry-services.component.html',
  styles: [],
})
export class RegistryServicesComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private readonly serviceGoodService: ServiceGoodService) {
    super();
    this.settings.actions = false;
    this.settings.columns = {
      serviceCode: {
        title: 'Clave Servicio',
        type: 'number',
        sort: false,
      },
      serviceDescription: {
        title: 'Descripión del Servicio',
        type: 'string',
        sort: false,
      },
      periodicity: {
        title: 'Periodicidad',
        type: 'string',
        sort: false,
      },
      courtDate: {
        title: 'Fecha de Corte',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchRegistryService(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchRegistryService(this.goodId));
  }

  searchRegistryService(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.goodNumber'] = `$eq:${idGood}`;
    console.log(this.params.getValue());
    this.serviceGoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.list = response.data.map(service => {
          return {
            serviceCode: service.cveService,
            serviceDescription: service.serviceCat.description,
            periodicity: service.periodicity,
            courtDate: service.dateCourt,
          };
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }
}
