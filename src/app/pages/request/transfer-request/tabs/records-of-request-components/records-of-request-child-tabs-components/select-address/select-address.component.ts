import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, from, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDomicile } from 'src/app/core/models/catalogs/domicile';
import { BasePage } from 'src/app/core/shared/base-page';
import { LocalityService } from '../../../../../../../core/services/catalogs/locality.service';
import { MunicipalityService } from '../../../../../../../core/services/catalogs/municipality.service';
import { StateOfRepublicService } from '../../../../../../../core/services/catalogs/state-of-republic.service';
import { GoodDomiciliesService } from '../../../../../../../core/services/good/good-domicilies.service';
import { AddressTransferorTabComponent } from '../../address-transferor-tab/address-transferor-tab.component';
import { SELECT_ADDRESS_COLUMN } from './select-address-columns';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styles: [],
})
export class SelectAddressComponent extends BasePage implements OnInit {
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  title: string = 'Domicilios de la Solicitud';
  totalItems: number = 0;
  public event: EventEmitter<any> = new EventEmitter();
  rowSelected: any;
  request: any;
  onlyOrigin: boolean = false;

  goodDomiciliesService = inject(GoodDomiciliesService);
  route = inject(ActivatedRoute);
  stateOfRepublicService = inject(StateOfRepublicService);
  municipaliService = inject(MunicipalityService);
  localityService = inject(LocalityService);

  constructor(
    private modelRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.onlyOrigin);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: SELECT_ADDRESS_COLUMN,
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      var params = new ListParams();
      params.page = data.inicio;
      params.limit = data.pageSize;
      this.getData(params);
    });
  }

  //obtengo los nombres de los campos
  getData(params: ListParams) {
    var array: any = [];
    this.loading = true;
    params['filter.requestId'] = `$eq:${this.request.id}`;
    this.goodDomiciliesService.getAll(params).subscribe({
      next: resp => {
        from(resp.data)
          .pipe(
            map((item: any) => {
              if (item.statusKey) {
                this.stateOfRepublicService.getById(item.statusKey).subscribe({
                  next: resp => {
                    item['stateOfRepublicName'] = resp.descCondition;
                  },
                });
              } else {
                item['stateOfRepublicName'] = '';
              }

              if (item.statusKey && item.municipalityKey) {
                var param = new ListParams();
                param['municipalityId'] = item.municipalityKey;
                param['stateKey'] = item.statusKey;
                this.municipaliService.getAll(param).subscribe({
                  next: (data: any) => {
                    item['municipalityName'] = data.data[0].nameMunicipality;
                  },
                });
              } else {
                item['municipalityName'] = '';
              }

              if (item.statusKey && item.municipalityKey && item.localityKey) {
                var param = new ListParams();
                param['municipalityId'] = item.municipalityKey;
                param['stateKey'] = item.statusKey;
                param['id'] = item.localityKey;
                this.localityService.getAll(param).subscribe({
                  next: (data: any) => {
                    item['localityName'] = data.data[0].nameLocation;
                  },
                });
              } else {
                item['localityName'] = '';
              }
              return item;
            })
          )
          .subscribe({
            next: info => {
              array.push(Object.assign(info));
            },
            complete: () => {
              setTimeout(() => {
                this.paragraphs = [...array];
                this.loading = false;
              }, 1000);
            },
          });
      },
    });

    /*params['filter.requestId'] = `$eq:${this.request.id}`;
    return new Promise((resolve, reject) => {
      this.goodDomiciliesService.getAll(params).subscribe({
        next: data => {
          resolve(data.data);
        },
        error: error => {
          console.log(error);
        },
      });
    }).then((data: any) => {
      var valor: any[] = [];
      new Promise((resolve, reject) => {
        data.map((item: any) => {
          if (item.statusKey) {
            this.stateOfRepublicService.getById(item.statusKey).subscribe({
              next: resp => {
                item['stateOfRepublicName'] = resp.descCondition;
                //valor.push(item);
                resolve({ ...data, item });
              },
            });
          } else {
            item['stateOfRepublicName'] = '';
            resolve(item);
          }
        });
      }).then((item: any) => {
        debugger;
        new Promise((resolve, reject) => {
          
          if (item.statusKey && item.municipalityKey) {
            var params = new ListParams();
            params['municipalityId'] = item.municipalityKey;
            params['stateKey'] = item.statusKey;
            this.municipaliService.getAll(params).subscribe({
              next: (data: any) => {
                item['municipalityName'] = data.data[0].nameMunicipality;
                resolve(item);
              },
            });
          } else {
            item['municipalityName'] = '';
            resolve(item);
          }
    
        }).then((item: any) => {
          new Promise((resolve, reject) => {
         
            if (item.statusKey && item.municipalityKey && item.localityKey) {
              var params = new ListParams();
              params['municipalityId'] = item.municipalityKey;
              params['stateKey'] = item.statusKey;
              params['id'] = item.localityKey;
              this.localityService.getAll(params).subscribe({
                next: (data: any) => {
                  item['localityName'] = data.data[0].nameLocation;
                  resolve(item);
                },
              });
            } else {
              item['localityName'] = '';
              resolve(item);
            }
          }).then((data: any) => {
            newArray.push(data);
            this.paragraphs = newArray;
            this.loading = false;
          });
        });
      });
    });*/
  }

  newAddress() {
    let config: ModalOptions = {
      initialState: {
        isNewAddress: true,
        requestId: this.request.id,
        regDelegationId: this.request.regionalDelegationId,
        callback: (next: boolean) => {
          if (next) {
            debugger;
            this.getData(new ListParams());
          }
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AddressTransferorTabComponent, config);

    /*this.modelRef.content.event.subscribe((res: any) => {
      console.log(res);
    });*/
  }

  selectRow(event: any): void {
    console.log(event);
    this.rowSelected = event.data;
  }

  selectAddress() {
    //delete this.rowSelected.stateOfRepublicName;
    delete this.rowSelected.municipalityName;
    delete this.rowSelected.localityName;

    console.log(this.rowSelected);

    this.event.emit(this.rowSelected as IDomicile);
    this.close();
  }

  close() {
    this.modelRef.hide();
  }
}
