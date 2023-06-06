import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { LegalOpinionsOfficeService } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/services/legal-opinions-office.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-custom-cell-ccp',
  templateUrl: './custom-cell-ccp.component.html',
  styleUrls: ['./custom-cell-ccp.component.css'],
})
export class CustomCellCcpComponent
  extends DefaultEditor
  implements ViewCell, OnInit
{
  // inputControl = new FormControl();
  @Input() value: string | number;
  @Input() rowData: any;
  form = new FormGroup({
    ccp_addressee: new FormControl(),
  });
  userCopies = new DefaultSelect();
  constructor(
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService
  ) {
    super();
  }

  ngOnInit() {
    console.log(this.rowData);
  }

  getUsersCopies(
    paramsData: ListParams,
    ccp: number,
    getByValue: boolean = false
  ) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter(
        'id',
        this.form.get('ccp_addressee' + (ccp == 1 ? '' : '_1')).value
      );
    } else {
      params.search = paramsData['search'];
      // params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: (data: any) => {
          let tempDataUser = new DefaultSelect(
            data.data.map((i: { name: string; id: string }) => {
              i.name = i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          // if (ccp == 1) {
          this.userCopies = tempDataUser;
          // } else {
          //   this.userCopies2 = tempDataUser;
          // }
          console.log(data, this.userCopies);
          subscription.unsubscribe();
        },
        error: (error: any) => {
          // if (ccp == 1) {
          this.userCopies = new DefaultSelect();
          // } else {
          //   this.userCopies2 = new DefaultSelect();
          // }
          subscription.unsubscribe();
        },
      });
  }
}
