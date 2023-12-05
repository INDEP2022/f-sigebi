import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: [],
})
export class PackageComponent extends BasePage implements OnInit {
  //RECIBO
  no_acta: any = null;

  loadingTable = false;

  //NAVEGACION TABLAS
  totalItemsEnc: number = 0;
  totalItemsDet: number = 0;
  paramsEnc = new BehaviorSubject<ListParams>(new ListParams());
  paramsDet = new BehaviorSubject<ListParams>(new ListParams());

  //DATOS TABLAS
  dataPackEnc = new LocalDataSource();
  dataPackDet = new LocalDataSource();

  //DATOS TEMPORALES
  noPackage: string = null;
  packagedet: any = null;

  settingsEnc = {
    ...this.settings,
    actions: false,
    columns: {
      numberPackage: {
        title: 'No. Paquete',
        type: 'number',
        sort: false,
      },
      cvePackage: {
        title: 'Cve. Paquete',
        type: 'string',
        sort: false,
      },
    },
  };

  settingsDet = {
    ...this.settings,
    actions: false,
    columns: {
      numberGood: {
        title: 'No. Bien',
        sort: false,
      },
      'bienes.description': {
        title: 'Descripción',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.bienes && row.bienes.description) {
            return row.bienes.description;
          } else {
            return null;
          }
        },
      },
      amount: {
        title: 'Cantidad',
        sort: false,
      },
    },
  };

  constructor(
    private bsModel: BsModalRef,
    private packageGoodService: PackageGoodService,
    private proceedingService: ProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getListPackageEnc();
    //Navegador de tablas
    this.navigateEnc();
    this.navigateDet();
  }

  close() {
    this.bsModel.hide();
  }

  navigateEnc() {
    this.paramsEnc.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.getListPackageEnc();
    });
  }

  navigateDet() {
    this.paramsDet.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.noPackage != null) {
        this.getListPackageDet();
      }
    });
  }

  getListPackageEnc(params?: ListParams) {
    this.loadingTable = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('statuspack', 'C,L', SearchFilter.IN);
    paramsF.addFilter('typePackage', '1');
    paramsF.page = this.paramsEnc.value.page;
    paramsF.limit = this.paramsEnc.value.limit;

    this.packageGoodService.getPaqDestinationEnc(paramsF.getParams()).subscribe(
      (res: any) => {
        this.dataPackEnc.load(res.data);
        this.totalItemsEnc = res.count;
        this.loadingTable = false;
      },
      err => {
        this.loadingTable = false;
        this.alert('error', 'Error al obtener los datos', '');
      }
    );
  }

  selectRowEnc(row: any) {
    const data = row.data;
    this.getListPackageDet(data.numberPackage);
    this.noPackage = data.numberPackage;
  }

  getListPackageDet(noPack?: string) {
    this.loadingTable = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('numberPackage', noPack ?? this.noPackage);
    paramsF.page = this.paramsDet.value.page;
    paramsF.limit = this.paramsDet.value.limit;

    this.packageGoodService.getPaqDestinationDet(paramsF.getParams()).subscribe(
      (res: any) => {
        console.log(res);
        this.dataPackDet.load(res.data);
        this.totalItemsDet = res.count;
        this.loadingTable = false;
      },
      err => {
        this.loadingTable = false;
        this.alert('error', 'Error al obtener los datos', '');
      }
    );
  }

  selectRowDet(row: any) {
    const data = row.data;
    console.log(data);
    this.packagedet = data;
  }

  acept() {
    if (this.packagedet == null) {
      this.alert('warning', 'Seleccione un paquete detalle', '');
      return;
    }

    if (this.noPackage == null) {
      this.alert('warning', 'Seleccione un paquete', '');
      return;
    }

    /* const body: IPbSelPaq = {
      noPaquete: parseInt(this.noPackage),
      blkAct: [
        {
          no_acta: parseInt(this.no_acta),
        },
      ],
      blkBie: [],
      blkDet: [],
    }; */
  }
}
