import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { RequestInTurnFormComponent } from '../request-in-turn-form/request-in-turn-form.component';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_IN_TURN_COLUMNS } from './request-in-turn-columns';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestInTurnSelectedComponent } from '../request-in-turn-selected/request-in-turn-selected.component';

@Component({
  selector: 'app-request-in-turn-list',
  templateUrl: './request-in-turn-list.component.html',
  styles: [
  ]
})
export class RequestInTurnListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  totalItems: number = 0;
  paragraphs: IRequestInTurn[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams);

  requestForm: ModelForm<IRequestInTurn>;
  selectTransmitter = new DefaultSelect<IRequestInTurn>;
  selectAuthority = new DefaultSelect<IRequestInTurn>;
  selectDeleRegional = new DefaultSelect<IRequestInTurn>;
  selectState = new DefaultSelect<IRequestInTurn>;
  selectSubject = new DefaultSelect<IRequestInTurn>;
  selectTransfer = new DefaultSelect<IRequestInTurn>;
  /* bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date(); */

  constructor(
    private modalService: BsModalService,
    public fb: FormBuilder
    ) {
    super();
    this.settings.columns = REQUEST_IN_TURN_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      add: false,
      edit: false,
      delete: false,
    }

    /* this.maxDate.setDate(this.maxDate.getDate() + 7);
    this .bsInlineRangeValue = [this.bsInlineValue, this.maxDate];*/
   }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  
  getExample():void{
    //this.loading = true;
    /* this.requestService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }
  
  getSubDelegations(params: ListParams) {
    /* this.requestService.getAll(params).subscribe(data => {
      this.station = new DefaultSelect(data.data, data.count);
    }); */
  }

  openTurnRequests(requestInTurn?: IRequestInTurn) {
    let config: ModalOptions = {
      initialState: {
        requestInTurn,
        callback: (next: boolean) => {
          if(next) this.getExample();
        } 
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RequestInTurnSelectedComponent, config);
  }

  searchForm(requestFrom: ModelForm<IRequestInTurn>){
    console.log(requestFrom.getRawValue());
    
  }

}
