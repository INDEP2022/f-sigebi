import { Component, OnInit } from '@angular/core';
import { parseISO } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
import { BasePage } from 'src/app/core/shared';
import { INDICATORS_HISTORY_TECHNICAL_COLUMNS } from './indicators-history-technical-columns';

export class LocalEstrategyAdmin {
  yearEvaluateId: number;
  monthEvaluateId: number;
  delegationNumberId: number;
}

@Component({
  selector: 'app-indicators-history-technical-datasheet',
  templateUrl: './indicators-history-technical-datasheet.component.html',
  styles: [],
})
export class IndicatorsHistoryTechnicalDatasheetComponent
  extends BasePage
  implements OnInit
{
  //

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());

  callback: any;
  totalItems: number = 0;
  anio: string;
  mes: string;
  indicatorsHistoryDataSheet: any;

  //

  constructor(
    private serviceStrategy: StrategyServiceTypeService,
    public modalRef: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...INDICATORS_HISTORY_TECHNICAL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.callback = this.modalRef.config.initialState;
    this.getByFilter();
    console.log(
      'El objeto desde el componente de arriba: ',
      this.indicatorsHistoryDataSheet
    );
    if (
      this.indicatorsHistoryDataSheet?.delegationNumberId != null ||
      this.indicatorsHistoryDataSheet?.yearEvaluateId != null ||
      this.indicatorsHistoryDataSheet?.monthEvaluateId != null
    ) {
    }
  }

  //

  getByFilter() {
    let estrategyAdmin = new LocalEstrategyAdmin();
    // console.log("La fecha sin ningun tipo de modificacion: ", this.callback.data.startDate);
    let localDate = parseISO(this.callback.data.startDate);
    // console.log("La fecha parseada: ", localDate)
    estrategyAdmin.yearEvaluateId = localDate.getUTCFullYear();
    estrategyAdmin.monthEvaluateId = localDate.getUTCMonth() + 1;
    estrategyAdmin.delegationNumberId = this.callback.data.regionalCoordination;
    // console.log("El objeto asignado: ", estrategyAdmin);
    this.serviceStrategy.postFindByFilter(estrategyAdmin).subscribe({
      next: (response: any) => {
        this.indicatorsHistoryDataSheet = response;
        // console.log("Aqui va el objeto asignado: ", this.indicatorsHistoryDataSheet)
      },
      error: (error: any) => {
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  //
}
