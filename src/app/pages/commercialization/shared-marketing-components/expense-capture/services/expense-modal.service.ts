import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { RevisionReason2Service } from 'src/app/core/services/catalogs/revision-reason2.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';

@Injectable({
  providedIn: 'root',
})
export class ExpenseModalService extends OpenModalListFiltered {
  selectedMotives: any;
  selectedMotivesSubject = new Subject();
  constructor(
    protected override modalService: BsModalService,
    private revisionReasonService: RevisionReason2Service
  ) {
    super(modalService);
  }
  openModal() {}

  openModalMotives() {
    let context: any = {
      title2: 'Seleccione uno o varios Motivos',
      columnsType: {
        descriptionCause: {
          title: 'Motivo',
          type: 'string',
          sort: false,
        },
      },
      service: this.revisionReasonService,
      settings: { ...TABLE_SETTINGS, selectMode: 'multi' },
      dataObservableListParamsFn: this.revisionReasonService.getAllFilterSelf2,
    };
    // if (this.searchField) {
    //   context = {
    //     ...context,
    //     searchFilter: { field: this.searchField, operator: this.operator },
    //   };
    // }
    this.openModalSelect(context, this.selectData);
  }

  selectData(row: any, self: ExpenseModalService) {
    self.selectedMotives = row;
    console.log(row);
    self.selectedMotivesSubject.next(row);
  }
}
