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
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
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
  refresh: boolean = false;
  totalItems: number = 0;
  totalItemsT: number = 0;
  data1 = new LocalDataSource();
  LocalData1: any[] = [];
  data2 = new LocalDataSource();
  LocalData2: any[] = [];
  tmpMConstMasivo: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsT = new BehaviorSubject<ListParams>(new ListParams());
  data: any;
  selectedRow: any;
  departament: any;
  delegation: any;
  subdelegation: any;
  paramsPup: any;
  user: any;
  parametrosList: any[] = [];
  parametrosOk: any[] = [];
  columnFilters: any = [];
  @ViewChild('mySmartTable') mySmartTable: any;
  constructor(
    private modalRef: BsModalRef,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private documentsService: DocumentsService
  ) {
    super();
  }

  settings1 = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
    columns: {
      ...COLUMN,
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

  settings2 = {
    ...TABLE_SETTINGS,
    hideSubHeader: true,
    actions: false,
    columns: {
      ...COLUMNGOOD,
      name: {
        title: 'Selección',
        sort: false,
        type: 'custom',
        valuePrepareFunction: (value: boolean, seleLote: any) =>
          this.isLoteSelectedT(seleLote, value),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onSelectLoteT(instance),
      },
    },
    noDataMessage: 'No se Encontraron Registros',
  };

  ngOnInit(): void {
    this.getuser();
    this.filterColumnsTable1();
    console.log('Data ', this.data);
    //this.filterColumnsTable2();
  }

  isLoteSelected(delegation: any, value: boolean) {
    console.log('delegation 1 ', delegation, value);
  }
  onSelectLote(instance: CheckboxElementComponent) {
    console.log('instance 1 ', instance);
  }

  isLoteSelectedT(value: boolean, delegation: any) {
    console.log('delegation 2 ', delegation, value);
  }
  onSelectLoteT(instance: CheckboxElementComponent) {
    console.log('instance 2 ', instance);
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  // onRowSelect(event: any) {
  //   this.selectedRow = event.data;
  //   console.log(this.selectedRow);
  // }

  filterColumnsTable1() {
    this.data1
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
              case 'fileNumber':
                field = 'filter.fileNumber.filesId';
                searchFilter = SearchFilter.EQ;
                break;
              case 'Des_transferNumer':
                field = 'filter.transferNumer.description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'transferValue':
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
          this.mconsmassive();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.mconsmassive());
  }

  /* filterColumnsTable2() {
     this.data2
       .onChanged()
       .pipe(takeUntil(this.$unSubscribe))
       .subscribe(change => {
         if (change.action === 'filter') {
           let filters = change.filter.filters;
           filters.map((filter: any) => {
             let field = ``;
             let searchFilter = SearchFilter.EQ;
             field = `filter.${filter.field}`;
             //SPECIFIC CASES
             switch (filter.field) {
               case 'fileNumber':
                 field = 'filter.goodNumber.id'
                 searchFilter = SearchFilter.EQ;
                 break;
               case 'Des_transferNumer':
                 field = 'filter.goodNumber.description'
                 searchFilter = SearchFilter.ILIKE;
                 break;
               case 'transferValue':
                 field = 'filter.goodNumber.quantity'
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
           this.mconsmassive();
         }
       });
     this.params
       .pipe(takeUntil(this.$unSubscribe))
       .subscribe(() => this.mconsmassive());
   }*/

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    //this.getdepartament(userDepartament);
    console.log('User: ', token);
    this.departament = token.department.toUpperCase();
    this.delegation = token.department.toUpperCase();
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
  }

  getdepartament(id: number | string) {
    this.fractionsService.getDepartament(id).subscribe({
      next: response => {
        this.subdelegation = response.data[0].numSubDelegation.id;
        console.log('respuesta Departament ', response.data[0]);
      },
    });
  }

  mconsmassive() {
    this.LocalData1 = [];
    this.data1.load(this.LocalData1);
    this.LocalData2 = [];
    this.data2.load(this.LocalData2);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.detailProceeDelRecService
      .getMconsmassive(this.user, params)
      .subscribe({
        next: response => {
          for (let i = 0; i < response.count; i++) {
            let params = {
              fileNumber: response.data[i].fileNumber.filesId,
              Des_transferNumer: response.data[i].transferNumer.description,
              transferValue: response.data[i].transferValue,
            };
            let expedient = response.data[i].fileNumber.filesId;
            let user = response.data[i].user;
            this.LocalData2 = [];
            this.data2.load(this.LocalData2);
            this.dconsmassive(expedient, user);
            this.LocalData1.push(params);
            this.data1.load(this.LocalData1);
            this.data1.refresh();
            this.totalItems = response.count;
          }
        },
        error: err => {
          //this.alert('warning', 'Este Usuario no Cuenta con Registros Asociados', err)
        },
      });
  }

  dconsmassive(expedient: any, user: any) {
    this.detailProceeDelRecService.getDconsmassive(expedient, user).subscribe({
      next: response => {
        for (let i = 0; i < response.count; i++) {
          let params = {
            noGood: response.data[i].goodNumber.id,
            description: response.data[i].goodNumber.description,
            Cantity: response.data[i].goodNumber.quantity,
          };
          this.LocalData2.push(params);
          this.data2.load(this.LocalData2);
          this.data2.refresh;
          this.totalItemsT += response.count;
        }
      },
    });
  }

  GeneraConstancia() {
    this.parametrosList = [];
    this.detailProceeDelRecService
      .getMconsmassiveConstancia(this.user)
      .subscribe({
        next: response => {
          console.log('count');
          let C_TOTCON = response.count;
          let lv_TOTCONS = C_TOTCON;
          if (lv_TOTCONS > 0) {
            this.alertQuestion(
              'info',
              '¿Está Seguro de Generar ' +
                lv_TOTCONS +
                ' Constancia(as) de Entrega ?',
              '',
              'Aceptar',
              'Cancelar'
            ).then(res => {
              console.log(res);
              if (res.isConfirmed) {
                for (let i = 0; i < this.LocalData1.length; i++) {
                  console.log('this.LocalData1[i] ', this.LocalData1[i]);
                  if (this.LocalData1[i].to == true) {
                    let fileNumber = {
                      fileNumber: this.LocalData1[i].fileNumber,
                    };

                    this.tmpMConstMasivo.push(fileNumber);

                    this.paramsPup = {
                      delegationNumber: this.delegation,
                      subdelegationNumber: this.subdelegation,
                      departamentNumber: this.departament,
                      actKey: this.data.cveActa,
                      universalFolio: this.data.folio,
                      tmpMConstMasivo: this.tmpMConstMasivo,
                    };
                    console.log('I : ', i);
                    console.log('parametros  ', this.paramsPup);
                  } else {
                    console.log('entra al else');
                    this.parametrosList.push(this.LocalData1[i]);
                    console.log('entra al else', this.parametrosList);
                    if (this.parametrosList.length == this.LocalData1.length) {
                      this.alert(
                        'warning',
                        'Seleccione Al Menos un Registro en la Primera Tabla',
                        ''
                      );
                      return;
                    }
                  }
                }
                console.log('Entra al IF');
                console.log('parametros enviar ', this.paramsPup);
                this.pupGenerateUniversalFolio(this.paramsPup);
              }
            });
          } else {
            this.alert(
              'warning',
              'No Existen Expedientes para Generar Constancias de Entrega',
              ''
            );
            return;
          }
        },
        error: err => {},
      });
  }

  pupGenerateUniversalFolio(params: any) {
    this.documentsService.postPupGenerateFolio(params).subscribe({
      next: response => {
        console.log('Response Document ', response);
        this.alert('success', 'Se Genero Folio Masivo Correctamente', '');
      },
    });
  }
}
