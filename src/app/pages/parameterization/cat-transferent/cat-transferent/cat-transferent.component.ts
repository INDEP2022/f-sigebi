import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatTransferentModalComponent } from '../cat-transferent-modal/cat-transferent-modal.component';
import { TRANSFERENT_COLUMNS } from './transferent-columns';
//Models
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
//Services
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';

@Component({
  selector: 'app-cat-transferent',
  templateUrl: './cat-transferent.component.html',
  styles: [],
})
export class CatTransferentComponent extends BasePage implements OnInit {
  transferent: ITransferente[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: BsModalService,
    private transferenteService: TransferenteService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...TRANSFERENT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTransferents());
  }

  /*getTransferents(){
    this.loading = true;
    this.transferenteService.getAll(this.params.getValue()).subscribe(
      response => {
        let data= response.data.map((item: ITransferente)=> {

          let date1 = item.dateCreation;
          item.dateCreation = this.datePipe.transform(date1, 'dd/MM/yyyy' );

          let date2 = item.dateUpdate;
          item.dateUpdate = this.datePipe.transform(date2, 'dd/MM/yyyy' );

          let date3 = item.dateBegOperation;
          item.dateBegOperation = this.datePipe.transform(date3, 'dd/MM/yyyy' );

          let date4 = item.dateFinalOperation;
          item.dateFinalOperation = this.datePipe.transform(date4, 'dd/MM/yyyy' );

          let date5 = item.dateFormalization;
          item.dateFormalization = this.datePipe.transform(date5, 'dd/MM/yyyy' );

          let date6 = item.dateAmeding;
          item.dateAmeding = this.datePipe.transform(date6, 'dd/MM/yyyy' );
          return item;
        });
        this.data.load(data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }*/
  getTransferents() {
    this.loading = true;
    this.transferenteService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.transferent = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(transferent?: ITransferente) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      transferent,
      callback: (next: boolean) => {
        if (next) this.getTransferents();
      },
    };
    this.modalService.show(CatTransferentModalComponent, modalConfig);
  }
}
