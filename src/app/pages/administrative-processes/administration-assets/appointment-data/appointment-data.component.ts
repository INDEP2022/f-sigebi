import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDepositaryAppointments } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styles: [],
})
export class AppointmentDataComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private readonly depositaryService: MsDepositaryService) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      responsible: {
        title: 'Responsable',
        width: '20%',
        sort: false,
      },
      deliveryDate: {
        title: 'Fecha entrega',
        width: '70%',
        sort: false,
      },
      provisionalAppointmentDate: {
        title: 'Fecha Nomb. Prov.',
        width: '70%',
        sort: false,
      },
      dateRemoval: {
        title: 'Fecha Remoción',
        width: '70%',
        sort: false,
      },
      contractKey: {
        title: 'Cve. Contrato',
        width: '70%',
        sort: false,
      },
      dateFinalAppointment: {
        title: 'Fecha Nomb. Definitivo',
        width: '70%',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchGoodMenage(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.goodId));
  }

  searchGoodMenage(idGood: number) {
    console.log('******** Esto es APPOINTMENT');
    this.loading = true;
    this.params.getValue()['filter.goodNum'] = `$eq:${idGood}`;
    this.depositaryService.getAppointments(this.params.getValue()).subscribe({
      next: (response: any) => {
        console.log('--------- Nombramiento ----------');
        console.log(response);
        this.list = response.data.map((appoiment: IDepositaryAppointments) => {
          return {
            responsible: appoiment.responsible,
            deliveryDate: appoiment.assignmentDate,
            provisionalAppointmentDate: appoiment.nameProvDete,
            dateRemoval: appoiment.revocationDate,
            contractKey: appoiment.contractKey,
            dateFinalAppointment: appoiment.appointmentDate,
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
