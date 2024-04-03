import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';
import { SharedModule } from '../../../../../../../shared/shared.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import {
  COLUMNS_MUNICIPALITY,
  COLUMNS_STATE,
  COLUMNS_SUBURB,
  COLUMNS_ZIP_CODE,
  COLUMNS_ZIP_CODE2,
} from './columns-location';

@Component({
  selector: 'app-good-value-edit-property-location',
  standalone: true,
  templateUrl: './good-value-edit-property-location.html',
  styleUrls: ['./good-value-edit-property-location.component.css'],
  imports: [CommonModule, SharedModule, TabsModule],
})
export class GoodValueEditPropertyLocationComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  dataMunicipality: LocalDataSource = new LocalDataSource();
  dataSuburb: LocalDataSource = new LocalDataSource();
  dataZipCode: LocalDataSource = new LocalDataSource();
  dataZipCode2: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());
  params6 = new BehaviorSubject<ListParams>(new ListParams());
  params7 = new BehaviorSubject<ListParams>(new ListParams());
  params8 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: 0;
  totalItems2: 0;
  totalItems3: 0;
  totalItems4: 0;
  totalItems5: 0;

  columnFilter: any = [];

  loading2 = this.loading;
  loading3 = this.loading;
  loading4 = this.loading;
  loading5 = this.loading;
  loading6 = this.loading;

  settingsMunicipality = {
    ...this.settings,
    mode: 'inline',
    actions: {
      columnTitle: 'Acciones',
      edit: false,
      delete: false,
      add: false,
      position: 'left',
    },
    hideSubHeader: false,
    columns: { ...COLUMNS_MUNICIPALITY },
  };

  settingsSuburb = {
    ...this.settings,
    mode: 'inline',
    actions: {
      columnTitle: 'Acciones',
      edit: false,
      delete: false,
      add: false,
      position: 'left',
    },
    hideSubHeader: false,
    columns: { ...COLUMNS_SUBURB },
  };

  settingsZipCode = {
    ...this.settings,
    mode: 'inline',
    actions: {
      columnTitle: 'Acciones',
      edit: false,
      delete: false,
      add: false,
      position: 'left',
    },
    hideSubHeader: false,
    columns: { ...COLUMNS_ZIP_CODE },
  };

  settingsZipCode2 = {
    ...this.settings,
    mode: 'inline',
    actions: {
      columnTitle: 'Acciones',
      edit: false,
      delete: false,
      add: false,
      position: 'left',
    },
    hideSubHeader: false,
    columns: { ...COLUMNS_ZIP_CODE2 },
  };

  buttonConfirm: boolean = false;

  constructor(
    public modalRef: BsModalRef,
    public stateOfRepublicService: StateOfRepublicService,
    private goodsInvService: GoodsInvService
  ) {
    super();
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'left',
      },
      hideSubHeader: false,
      columns: { ...COLUMNS_STATE },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'descCondition':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params = this.pageFilter(this.params);
          this.getState();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getState());

    this.dataZipCode2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'postalCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'township':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params5 = this.pageFilter(this.params5);
          this.getZipCode2();
        }
      });
    this.params5
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getZipCode2());
  }

  stateKeyId: string;

  getState() {
    this.loading = true;
    this.params.getValue()['sortBy'] = 'descCondition:ASC';

    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };

    this.stateOfRepublicService.getAll2(params).subscribe({
      next: resp => {
        this.loading = false;
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
      },
      error: error => {
        this.loading = false;
        console.log('Error', error);
        this.totalItems = 0;
      },
    });
  }

  descCondition: string;

  rowSelectState(event: any) {
    console.log('Opción Seleccionada:', event.data);
    this.stateKeyId = event.data.id;
    this.descCondition = event.data.descCondition;
    this.getMunicipalityFilter();
  }

  getMunicipalityFilter() {
    this.dataMunicipality
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'municipality':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params2 = this.pageFilter(this.params2);
          this.getMunicipality();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMunicipality());
  }

  getMunicipality() {
    this.loading2 = true;
    this.params2.getValue()['sortBy'] = 'municipality:ASC';
    this.params2.getValue()['filter.stateKey'] = `${this.stateKeyId}`;

    let params = {
      ...this.params2.getValue(),
      ...this.columnFilter,
    };

    this.goodsInvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        this.loading2 = false;
        this.dataMunicipality.load(resp.data);
        this.dataMunicipality.refresh();
        this.totalItems2 = resp.count;
      },
      error: error => {
        this.loading2 = false;
        console.log('Error', error);
        this.totalItems2 = 0;
      },
    });
  }

  municipalityKey: string;
  municipality: string;

  rowSelectMunicipality(event: any) {
    console.log('Opción Seleccionada:', event.data);
    this.municipalityKey = event.data.municipalityKey;
    this.municipality = event.data.municipality;
    this.getSubUrbFilter();
  }

  getSubUrbFilter() {
    this.dataSuburb
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'township':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params3 = this.pageFilter(this.params3);
          this.getSubUrb();
        }
      });
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSubUrb());
  }

  getSubUrb() {
    this.loading3 = true;
    this.params3.getValue()['sortBy'] = 'township:ASC';
    this.params3.getValue()[
      'filter.municipalityKey'
    ] = `${this.municipalityKey}`;
    this.params3.getValue()['filter.stateKey'] = `${this.stateKeyId}`;
    //this.params3.getValue()['filter.stateKey'] = `${this.stateKeyId}`;

    let params = {
      ...this.params3.getValue(),
      ...this.columnFilter,
    };

    this.goodsInvService.getAllTownshipByFilter(params).subscribe({
      next: resp => {
        this.loading3 = false;
        this.dataSuburb.load(resp.data);
        this.dataSuburb.refresh();
        this.totalItems3 = resp.count;
      },
      error: error => {
        this.loading3 = false;
        console.log('Error', error);
        this.totalItems3 = 0;
      },
    });
  }

  townshipKey: string;
  township: string;

  rowSelectSubUrb(event: any) {
    this.buttonConfirm = true;
    console.log('Opción Seleccionada:', event.data);
    this.townshipKey = event.data.townshipKey;
    this.township = event.data.township;
    this.getZipCodeFilter();
  }

  getZipCodeFilter() {
    this.dataZipCode
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'postalCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params4 = this.pageFilter(this.params4);
          this.getZipCode();
        }
      });
    this.params4
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getZipCode());
  }

  getZipCode() {
    this.loading4 = true;
    this.params4.getValue()['sortBy'] = 'township:ASC';
    this.params4.getValue()[
      'filter.municipalityKey'
    ] = `${this.municipalityKey}`;
    this.params4.getValue()['filter.stateKey'] = `${this.stateKeyId}`;
    this.params4.getValue()['filter.townshipKey'] = `${this.townshipKey}`;

    let params = {
      ...this.params4.getValue(),
      ...this.columnFilter,
    };

    this.goodsInvService.getAllCodePostalByFilter(params).subscribe({
      next: resp => {
        this.loading4 = false;
        this.dataZipCode.load(resp.data);
        this.dataZipCode.refresh();
        this.totalItems4 = resp.count;
      },
      error: error => {
        this.loading4 = false;
        console.log('Error', error);
        this.totalItems4 = 0;
      },
    });
  }

  getZipCode2() {
    this.loading5 = true;
    this.params5.getValue()['sortBy'] = 'township:ASC';
    //this.params5.getValue()['filter.municipalityKey'] = `${this.municipalityKey}`;
    //this.params5.getValue()['filter.stateKey'] = `${this.stateKeyId}`;
    //this.params5.getValue()['filter.townshipKey'] = `${this.townshipKey}`;

    let params = {
      ...this.params5.getValue(),
      ...this.columnFilter,
    };

    this.goodsInvService.getAllCodePostalByFilter(params).subscribe({
      next: resp => {
        this.loading5 = false;
        this.dataZipCode2.load(resp.data);
        this.dataZipCode2.refresh();
        this.totalItems5 = resp.count;
      },
      error: error => {
        this.loading5 = false;
        console.log('Error', error);
        this.totalItems5 = 0;
      },
    });
  }

  postalCode: string;
  rowSelectZipCode(event: any) {
    console.log('Opción Seleccionada:', event.data.postalCode);
    this.postalCode = event.data.postalCode;
  }

  rowSelectZipCode2(event: any) {
    this.buttonConfirm = true;
    console.log('Opción Seleccionada:', event.data);
    this.postalCode = event.data.postalCode;
    this.township = event.data.township;

    const stateKey = event.data.stateKey;
    const municipalityKey = event.data.municipalityKey;
    //const townshipKey = event.data.townshipKey;

    this.loading6 = true;
    this.params6.getValue()['filter.id'] = stateKey;

    let params6 = {
      ...this.params6.getValue(),
    };

    this.stateOfRepublicService.getAll2(params6).subscribe({
      next: resp => {
        console.log(resp.data);
        this.descCondition = resp.data[0].descCondition;
      },
      error: error => {
        this.descCondition = 'No se encontró';
      },
    });

    this.params7.getValue()['filter.stateKey'] = stateKey;
    this.params7.getValue()['filter.municipalityKey'] = municipalityKey;

    let params7 = { ...this.params7.getValue() };

    this.goodsInvService.getAllMunipalitiesByFilter(params7).subscribe({
      next: resp => {
        console.log(resp.data);
        this.municipality = resp.data[0].municipality;
      },
      error: error => {
        this.municipality = 'No se encontró';
      },
    });
  }

  postalCodeM: string = '';
  msjM: string = '';

  confirm() {
    const township = this.township;
    const municipality = this.municipality;
    const stateName = this.descCondition;

    if (this.postalCode === undefined || this.postalCode === '') {
      this.postalCodeM = 'NA';
      this.msjM = `Seleccionó: \n Estado: ${stateName} \n Municipio: ${this.municipality} \n Colonia: ${township} \n Código Postal: N/A`;
    } else {
      this.postalCodeM = this.postalCode;
      this.msjM = `Seleccionó: \n Estado: ${stateName} \n Municipio: ${this.municipality} \n Colonia: ${township} \n Código Postal: ${this.postalCodeM}`;
    }

    //console.log('Lo que se envia desde el modal: ', postalCode);

    this.alertQuestion('question', this.msjM, '¿Continuar?').then(question => {
      if (question.isConfirmed) {
        this.modalRef.content.callback(
          stateName,
          municipality,
          township,
          this.postalCodeM
        );
        this.modalRef.hide();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
