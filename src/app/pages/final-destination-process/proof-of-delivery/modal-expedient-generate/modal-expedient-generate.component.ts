import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMN, COLUMNGOOD } from './column';

@Component({
  selector: 'app-modal-expedient-generate',
  templateUrl: './modal-expedient-generate.component.html',
  styles: [],
})
export class ModalExpedientGenerateComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  completeDataM: any[] = [];
  dataM = new LocalDataSource();
  settingsM = {
    ...this.settings,
    actions: false,
    hideSubHeader: true,
    columns: {
      ...COLUMN,
    },
  };

  paramsD = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsD: number = 0;
  completeDataD: any[] = [];
  dataD = new LocalDataSource();
  settingsD = {
    ...this.settings,
    actions: false,
    hideSubHeader: true,
    columns: {
      ...COLUMNGOOD,
    },
  };

  loadingTable = false;

  constructor(
    private modalRef: BsModalRef,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private documentsService: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTmpConstMasiveData();
    this.navigateCMassive();
  }

  close() {
    this.modalRef.hide();
  }

  navigateCMassive() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.loadingTable = true;
      this.getTmpConstMasiveData();
    });
  }

  getTmpConstMasiveData() {
    this.loadingTable = true;
    const user = this.authService.decodeToken().preferred_username;
    const paramsF = new FilterParams();
    paramsF.addFilter('user', 'TLPJPADILLATDR');
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;

    this.detailProceeDelRecService
      .getMconsmassiveFilter(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.loadingTable = false;
          this.dataM.load(res.data);
          this.totalItems = res.count;
        },
        err => {
          console.log(err);
          this.dataM.load([]);
          this.totalItems = 0;
          this.loadingTable = false;
          this.alert(
            'warning',
            'No se encontraron registros',
            `No existen registros para ${user}`
          );
          this.close();
        }
      );
  }

  localPagination(page: number, pageSize: number, data: any[]): any[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }

  selectRow(e: any) {
    console.log(e.data);
    const user = this.authService.decodeToken().preferred_username;
    this.detailProceeDelRecService
      .getDconsmassive(e.data.id, 'TLPJPADILLATDR')
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }
}
