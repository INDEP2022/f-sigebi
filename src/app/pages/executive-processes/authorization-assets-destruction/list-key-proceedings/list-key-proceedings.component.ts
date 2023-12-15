import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { BasePage } from 'src/app/core/shared';
import { COLUMNSLIST } from './columns-list-key';

@Component({
  selector: 'app-list-key-proceedings',
  templateUrl: './list-key-proceedings.component.html',
  styleUrls: [],
})
export class ListKeyProceedingsComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  override settings = {
    ...this.settings,
    columns: COLUMNSLIST,
    actions: false,
  };

  constructor(
    private modalRef: BsModalRef,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProceedings();
  }

  getProceedings() {
    const paramsF = new FilterParams();
    // paramsF.page = params.page;
    paramsF.addFilter('typeProceedings', 'AXD');
    this.proceedingsDetailDel.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
      },
      err => {
        console.log(err);
        this.alert(
          'warning',
          'No se encontró el acta',
          'No existe un acta con el dato ingresado'
        );
      }
    );
  }

  close() {
    this.modalRef.hide();
  }
}
