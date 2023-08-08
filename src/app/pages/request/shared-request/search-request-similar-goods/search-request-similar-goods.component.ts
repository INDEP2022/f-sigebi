import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//import { AssociateFileButtonComponent } from './associate-file-button/associate-file-button.component';
import { COLUMNS, COLUMNS2 } from './columns';
//Provisional Data
import { ActivatedRoute } from '@angular/router';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { AssociateFileComponent } from '../../transfer-request/tabs/associate-file/associate-file.component';

@Component({
  selector: 'app-search-request-similar-goods',
  templateUrl: './search-request-similar-goods.component.html',
  styles: [],
})
export class SearchRequestSimilarGoodsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  selectedRows: any = [];
  requestInfo: IRequest;
  //Goods Table
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  settings2;

  showDetails: boolean = false;
  requestId: string | number = null;

  /* injections */
  private requestService = inject(RequestService);
  private goodFinderSerice = inject(GoodFinderService);
  private route = inject(ActivatedRoute);
  private requestHelperService = inject(RequestHelperService);
  private bsParentModalRef = inject(BsModalRef);
  /*  */

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: false,
        delete: false,
        columnTitle: 'Asociar',
        custom: [
          {
            name: 'associate',
            title:
              '<i class="bx bx-link float-icon text-success mx-2 fa-lg"></i>',
          },
        ],
      },
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('request'));
    //this.data.load(DATA);
    this.getInfoRequest();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.data2['data'].length != 0) {
        this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
          this.getGoods(0);
        });
      }
    });
  }

  getInfoRequest() {
    this.requestService.getById(this.requestId).subscribe({
      next: response => {
        this.requestInfo = response;
      },
      error: error => {},
    });
  }

  getFormSeach(formSearch: any) {
    this.params.getValue().addFilter('recordId', '$null', SearchFilter.NOT);
    for (const key in formSearch) {
      if (formSearch[key] != null) {
        this.params.getValue().addFilter(key, formSearch[key]);
      }
    }

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getFiles();
    });
  }

  getFiles() {
    this.loading = true;
    const filter = this.params.getValue().getParams();
    this.requestService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['regionalDelegationName'] = item.regionalDelegation
            ? item.regionalDelegation.description
            : '';
          item['stateName'] = item.state ? item.state.descCondition : '';
          item['transferentName'] = item.transferent
            ? item.transferent.name
            : '';
          item['stationName'] = item.emisora ? item.emisora.stationName : '';
          item['authorityName'] = item.authority
            ? item.authority.authorityName
            : '';
        });

        this.data.load(resp.data);
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.alert('warning', 'No se encontraron registros', '');
      },
    });
    // Llamar servicio para buscar expedientes
    /*let columns = this.data;
    columns.forEach(c => {
      c = Object.assign({ associate: '' }, c);
    });
    this.fileColumns = columns;
    this.totalItems - this.fileColumns.length;
    console.log(this.fileColumns);*/
  }

  onCustom(event: any) {
    if (event.action === 'associate') {
      this.alertQuestion(
        'question',
        'Asociar',
        'Desea asociar esta solicitud?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loading = true;
          let requestAssociated: any = {};
          requestAssociated.id = this.requestId;
          requestAssociated.recordId = event.data.recordId;
          this.requestService
            .update(this.requestId, requestAssociated)
            .subscribe({
              next: resp => {
                this.loading = false;
                Swal.fire({
                  title: `Se asoció la solicitud correctamente`,
                  text: `La Solicitud ${requestAssociated.id} fue asociada al expediente ${requestAssociated.recordId}. Tiene que subir el reporte de la carátula INAI`,
                  icon: 'success',
                  showDenyButton: false,
                  showCancelButton: false,
                  confirmButtonText: 'Aceptar',
                  denyButtonText: `Cancelar`,
                  confirmButtonColor: '#9D2449',
                  allowOutsideClick: false,
                }).then(result => {
                  if (result.isConfirmed) {
                    this.updateStateRequestTab();
                  }
                });
              },
              error: error => {
                this.loading = false;
              },
            });
        }
      });
    }
  }

  updateStateRequestTab() {
    this.requestHelperService.associateExpedient(true);
  }

  onUserRowSelect($event: any) {
    this.selectedRows = $event.selected;
    this.showDetails = $event.isSelected ? true : false;
    this.getGoods($event.data.id);
  }

  getGoods(id: number) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.data2.empty();
    this.goodFinderSerice.goodFinder(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.data2.load(resp.data);
        this.totalItems2 = resp.count;
      },
    });
  }

  async newExpedient() {
    const request = await this.getRequest();
    this.openModal(AssociateFileComponent, 'doc-expedient', request);
  }

  openModal(component: any, typeDoc: string, parameters?: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        typeDoc: typeDoc,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsParentModalRef = this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }

  getRequest() {
    return new Promise((resolve, reject) => {
      this.requestService.getById(this.requestId).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast(
            'error',
            'Error',
            'No se puede obtener la solicitud'
          );
        },
      });
    });
  }

  confirm(result: boolean) {}
}
