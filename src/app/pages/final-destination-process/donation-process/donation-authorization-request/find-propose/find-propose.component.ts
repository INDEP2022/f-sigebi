import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-find-propose',
  templateUrl: './find-propose.component.html',
  styles: [],
})
export class FindProposeComponent extends BasePage implements OnInit {
  itemsPropose: number = 0;
  dataFactPro: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];
  @Output() onSave = new EventEmitter<any>();
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {}
}
