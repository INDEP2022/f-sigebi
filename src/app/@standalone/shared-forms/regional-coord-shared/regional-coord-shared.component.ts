import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { COORDINATIONS_COLUMNS } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance/interfaces/columns';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-regional-coord-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './regional-coord-shared.component.html',
  styles: [],
})
export class RegionalCoordSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() formField: string = 'coordRegional';
  constructor(
    protected override modalService: BsModalService,
    private delegationService: DelegationService
  ) {
    super(modalService);
  }

  ngOnInit(): void {}

  openModal() {
    this.openModalSelect(
      {
        title: 'Coordinaciones',
        columnsType: { ...COORDINATIONS_COLUMNS },
        service: this.delegationService,
        settings: {
          ...TABLE_SETTINGS,
          selectMode: 'multi',
        },
        dataObservableListParamsFn: this.delegationService.getAllModal,
        searchFilter: null,
      },
      this.selectCoord
    );
  }

  selectCoord(
    coords: { description: string }[],
    self: RegionalCoordSharedComponent
  ) {
    let coordRegional = '';
    console.log(coords);
    coords.forEach((coord, index) => {
      const extra = index < coords.length - 1 ? ',' : '';
      coordRegional += coord.description + extra;
    });
    console.log(coordRegional);
    self.form.get(self.formField).setValue(coordRegional);
  }
}
