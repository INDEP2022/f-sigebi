import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { RapproveDonationService } from 'src/app/core/services/ms-r-approve-donation/r-approve-donation.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import {
  COLUMNDONAC,
  COLUMNTMPBIENAUT,
  COLUMNTMPBIENPROG,
  COLUMNVPROG,
} from './column';

@Component({
  selector: 'app-modal-good-donation',
  templateUrl: './modal-good-donation.component.html',
  styles: [],
})
export class ModalGoodDonationComponent extends BasePage implements OnInit {
  dataprog = new LocalDataSource();
  localdataprog: any[] = [];
  datadonac = new LocalDataSource();
  localdatadonac: any[] = [];
  datagoodaut = new LocalDataSource();
  localdatagoodaut: any[] = [];
  data: any;
  data1 = new LocalDataSource();
  localData: any[] = [];
  refresh: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsprog: number = 0;
  totalItemsdonac: number = 0;
  totalItemsgoodaut: number = 0;
  totalItems: number = 0;
  settingsprog: any;
  settingsdonac: any;
  settingsgoodaut: any;
  user: any;
  delegation: any;
  columnFilters: any;
  requestId: any;
  totalDonar: any;
  selectedRow: any;
  deleteSelectedRow: any;
  goodselectedRow: any;
  proceding: any;
  @ViewChild('mySmartTable') mySmartTable: any;

  constructor(
    private modalRef: BsModalRef,
    private rapproveDonationService: RapproveDonationService,
    private authService: AuthService,
    private goodService: GoodService
  ) {
    super();
    this.settingsprog = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
    };
    this.settingsprog.columns = COLUMNVPROG;
    this.settingsdonac = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
    };
    this.settingsdonac.columns = COLUMNDONAC;
    this.settingsgoodaut = {
      ...this.settings,
      actions: false,
      hideSubHeader: true,
    };
    this.settingsgoodaut.columns = COLUMNTMPBIENAUT;
  }
  settings1 = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
    columns: {
      ...COLUMNTMPBIENPROG,
      valid: {
        title: 'Selección',
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
          });
        },
        sort: false,
      },
    },
    noDataMessage: 'No se Encontraron Registros',
  };

  ngOnInit(): void {
    this.getuser();
    this.filterColumnsTableDonac();
    this.filterColumnsprogDonations();
    this.proceding = this.data.acta;
    console.log('Proceeding ', this.proceding);
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    console.log('User: ', token);
    this.delegation = token.department.toUpperCase();
  }

  progDonations() {
    //falta endpoint
    //https://sigebimstest.indep.gob.mx/donationgood/api/v1/application
    ///vIndProgDonation?limit=10&page=1&filter.elaborated=$ilike:FAJ
    this.localdataprog = [];
    this.dataprog.load(this.localdataprog);
    this.rapproveDonationService.getvIndProg(this.delegation).subscribe({
      next: resp => {
        console.log('Respuesta Vista -> ', resp);
        for (let i = 0; i < resp.data.length; i++) {
          let params = {
            proceedingKey: resp.data[i].proceedingKey,
            elaborated: resp.data[i].elaborated,
          };
          this.localdataprog.push(params);
          this.dataprog.load(this.localdataprog);
          this.dataprog.refresh();
        }
      },
    });
  }

  filterColumnsprogDonations() {
    this.dataprog
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'proceedingKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'elaborated':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.progDonations();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.progDonations());
  }

  donacReques() {
    //integrando
    //http://sigebimstest.indep.gob.mx/donationgood/api/v1/donac-request?filter.authorizeType=$ilike:A
    this.localdatadonac = [];
    this.rapproveDonationService.getAllWhereType(this.delegation).subscribe({
      next: response => {
        console.log('Response Donation ', response);
        const arregloRequestIds: Number[] = [];
        for (let i = 0; i < response.data.length; i++) {
          let params = {
            doneeId: response.data[i].doneeId.id,
            donee: response.data[i].donee,
            requestId: response.data[i].requestId.id,
            sunQuantity: response.data[i].sunQuantity,
          };
          console.log('Si entra');
          this.localdatadonac.push(params);
          this.datadonac.load(this.localdatadonac);
          this.totalItemsdonac = response.data.length;
          arregloRequestIds.push(Number(response.data[i].requestId.id));
        }

        let item = {
          requestIdArray: arregloRequestIds,
        };
        console.log('arregloRequestIds ', arregloRequestIds);
        console.log('Arreglo: ', item);
        this.requestId = item;
        //this.goodAutDonation(item);
      },
    });
  }

  filterColumnsTableDonac() {
    this.datadonac
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'doneeId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'donee':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'requestId':
                field = 'filter.requestId.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'sunQuantity':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.donacReques();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.donacReques());
  }

  goodAutDonation(requestId: any) {
    this.localdatagoodaut = [];
    this.datagoodaut.load(this.localdatagoodaut);
    this.rapproveDonationService.getGoodDonation(requestId).subscribe({
      next: response => {
        console.log('Response Donation ', response);
        this.totalDonar = response.sum.addition;
        for (let i = 0; i < response.result.length; i++) {
          let params = {
            goodId: response.result[i].goodId,
            amount: response.result[i].amount,
          };
          console.log('Params Donation', params);
          this.localdatagoodaut.push(params);
          this.datagoodaut.load(this.localdatagoodaut);
          this.datagoodaut.refresh();
          this.totalItemsgoodaut = response.result.length;
        }
      },
    });
  }

  addgoodProgDonation() {
    console.log('This.LocalData ', this.localData);
    console.log('Data ', this.data1);
    if (!this.localData) {
      for (let i = 0; i < this.localdataprog.length; i++) {
        this.rapproveDonationService
          .getgoodAut(
            this.localdataprog[0].id,
            this.selectedRow.requestId,
            this.user
          )
          .subscribe({
            next: response => {
              this.alert('warning', 'Alerta', 'El Bien ya Existe');
              return;
            },
            error: err => {
              if (this.datagoodaut != null) this.progDonation();
            },
          });
      }
    } else {
      this.progDonation();
    }
  }

  progDonation() {
    console.log('REspuesta PROGDONATION');
    if (this.selectedRow.sunQuantity != 0) {
      // this.rapproveDonationService.getGoodProgDonation(this.goodselectedRow.goodId).subscribe({
      //   next: response => {
      //     console.log("Response Prog Donation ", response);
      //     let params = {
      //       id: '1',
      //       description: 'prueba',
      //       quantity: 'prueba',
      //       sunquantity: 'prueba',
      //       UniMedGood: 'prueba',
      //     }
      //     this.localData.push(params);
      //     this.data1.load(this.localData);
      //   }
      // })
      this.goodService.getByGood(this.goodselectedRow.goodId).subscribe({
        next: response => {
          this.rapproveDonationService
            .getGoodSinPackage(this.selectedRow.requestId)
            .subscribe({
              next: resp => {
                let ii = 0;
                if (this.localData.length != 0) {
                  for (let i = 0; i < this.localData.length; i++) {
                    if (this.localData[i].id == response.data[0].goodId) {
                      this.alert('warning', 'Alerta', 'El Bien ya Existe');
                      return;
                    }
                    ii++;
                  }
                  if (ii == this.localData.length) {
                    let params = {
                      id: response.data[0].goodId,
                      description: response.data[0].description,
                      quantity: response.data[0].quantity,
                      sunquantity: this.goodselectedRow.amount,
                      UniMedGood: response.data[0].unit,
                      package: resp.data[0].coalesce,
                      request: this.selectedRow.requestId,
                    };
                    this.localData.push(params);
                    this.data1.load(this.localData);
                    this.data1.refresh;
                    this.clearSelection();
                    this.goodselectedRow = null;
                  }
                } else {
                  let params = {
                    id: response.data[0].goodId,
                    description: response.data[0].description,
                    quantity: response.data[0].quantity,
                    sunquantity: this.goodselectedRow.amount,
                    UniMedGood: response.data[0].unit,
                    package: resp.data[0].coalesce,
                    request: this.selectedRow.requestId,
                  };
                  this.localData.push(params);
                  this.data1.load(this.localData);
                  this.data1.refresh;
                  this.clearSelection();
                  this.goodselectedRow = null;
                }
              },
            });
        },
      });
    } else {
      this.alert('warning', 'Alerta', 'La Cantidad Solicitada Debe ser Valida');
    }
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
    const arregloRequestIds: Number[] = [];
    arregloRequestIds.push(Number(this.selectedRow.requestId));
    let item = {
      requestIdArray: arregloRequestIds,
    };
    this.goodAutDonation(item);
  }
  ongoodSelect(event: any) {
    this.goodselectedRow = event.data;
    console.log('this.goodselectedRow ', this.goodselectedRow);
  }

  deleteRowSelect(event: any) {
    this.deleteSelectedRow = event.data;
    console.log('this.deleteSelectedRow ', this.deleteSelectedRow);
  }

  deletSelection() {
    const indice = this.localData.findIndex(
      elemento => elemento.id === this.deleteSelectedRow.id
    );
    if (indice !== -1) {
      this.localData.splice(indice, 1);
      console.log('Arreglo después de eliminar:', this.localData);
      this.data1.load(this.localData);
      this.data1.refresh();
      this.deleteSelectedRow = null;
      this.clearSelection();
    } else {
      console.log('Elemento no encontrado en el arreglo.');
    }
  }
  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  genConstancy() {
    let C_DATCTA = 0;
    let C_VALSOL = 0;
    let C_BIEPAR = 0;
    let C_PARBIE: any;
    for (let i = 0; i < this.localData.length; i++) {
      this.rapproveDonationService.getC_DATCTA(this.user).subscribe({
        next: res => {
          C_DATCTA = res.count;
        },
        error: err => {
          C_DATCTA = 0;
        },
      });
      this.rapproveDonationService
        .getC_VALSOL(this.localData[i].request)
        .subscribe({
          next: resp => {
            C_VALSOL = resp.count;
          },
          error: err => {
            C_VALSOL = 0;
          },
        });
      this.rapproveDonationService
        .getC_BIEPAR(this.user, this.localData[i].request)
        .subscribe({
          next: respo => {
            C_BIEPAR = respo.count;
          },
          error: err => {
            C_BIEPAR = 0;
          },
        });
      this.rapproveDonationService
        .getC_PARBIE(this.user, this.localData[i].request)
        .subscribe({
          next: response => {
            C_PARBIE = {
              good: response.data[0].goodId,
              amount: response.data[0].amount,
              request: response.data[0].requestId,
            };
          },
        });

      this.alertQuestion(
        'info',
        'Se Generaran Constancias de Entrega, si se Parcializó Algún Bien se Genera el Proceso, Desea Continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          if (C_VALSOL == 0) {
            this.alert(
              'warning',
              'Alerta',
              'Las Constancias para la Solicitud ' +
                this.localData[i].request +
                ' Fuerón Generadas'
            );
          } else {
            if (C_BIEPAR > 0) {
              let params = {
                good: this.localData[i].id,
                screen: 'FACTCONST_0001',
                nvocand: C_VALSOL,
                tipproc: 1,
                proceedingNumber: this.proceding,
              };
              this.rapproveDonationService.getPartializeGood(params).subscribe({
                next: response => {
                  console.log('Response Donation Service', response);
                },
              });
            }
            //queda faltando integrar lo siguiente falta el procedimiento PA_DONACION_SOL_BIEN
            /* 
                        PKG_DONACIONES.PA_DONACION_SOL_BIEN(:DONAC_SOLICITUD.TIPO_SOLICITUD,
                                                           :BLK_ACT.NO_ACTA,:BLK_TOOLBAR.CVE_FORMA,
                                                           :DONAC_SOLICITUD.ID_SOLICITUD);
                       PKG_DONACIONES.PA_INS_BIEN_DONAR (null,
                                                         :DONAC_SOLICITUD.TIPO_SOLICITUD,
                                                         null,
                                                         null,
                                                         null,
                                                         4);
                       LIP_MENSAJE('Las constancias de entregas fueron generadas','A');
                       SET_WINDOW_PROPERTY('WIN_EXP_GEN'       ,VISIBLE,PROPERTY_FALSE);
                       SET_ITEM_PROPERTY  ('BT_GEN_DONATARIO'  ,ENABLED,PROPERTY_FALSE);
                       SET_ITEM_PROPERTY  ('BT_BIEN_DONACIONES',ENABLED,PROPERTY_FALSE);
                       GO_BLOCK('BLK_CTR');
                       SET_WINDOW_PROPERTY('WIN_BIEN_DONAC',VISIBLE,PROPERTY_FALSE);
                    end if;
                    
                    SET_APPLICATION_PROPERTY(CURSOR_STYLE,'DEFAULT');
                   end if;
                      SET_APPLICATION_PROPERTY(CURSOR_STYLE,'DEFAULT');
                    end if;
            */
            let params = {
              goodId: '',
              requestId: C_PARBIE.request,
              partial: '',
              amount: '',
              balanceAmoun: '',
              processNumber: 4,
            };
            //falta integrar porque los parametros no coinciden
            this.rapproveDonationService.getInsGoodDonar(params).subscribe({
              next: response => {},
            });
          }
        }
      });
    }
  }
}
