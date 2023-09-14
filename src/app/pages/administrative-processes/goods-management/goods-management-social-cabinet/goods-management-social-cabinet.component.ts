import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { catchError, firstValueFrom, of, takeUntil } from 'rxjs';
import { first, map } from 'rxjs/operators';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Iidentifier } from 'src/app/core/models/ms-good-tracker/identifier.model';
import { ITmpTracker } from 'src/app/core/models/ms-good-tracker/tmpTracker.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GoodsManagementSocialNotLoadGoodsComponent } from '../goods-management-social-table/goods-management-social-not-load-goods/goods-management-social-not-load-goods.component';
import { GoodsManagementService } from '../services/goods-management.service';
import { ETypeGabinetProcess } from './typeProcess';

@Component({
  selector: 'app-goods-management-social-cabinet',
  templateUrl: './goods-management-social-cabinet.component.html',
  styleUrls: ['./goods-management-social-cabinet.component.scss'],
})
export class GoodsManagementSocialCabinetComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  selectedGoodstxt: number[] = [];
  notLoadedGoods: { good: number }[] = [];
  disabledProcess = true;
  identifier: number;
  typeGabinetProcess = ETypeGabinetProcess;
  totalItems = 0;
  ngGlobal: any;
  $trackedGoods = this.store.select(getTrackedGoods);
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

  get sinAsignarCant() {
    return this.goodsManagementService.sinAsignarCant;
  }

  set sinAsignarCant(value) {
    this.goodsManagementService.sinAsignarCant = value;
  }

  get susceptibleCant() {
    return this.goodsManagementService.susceptibleCant;
  }

  set susceptibleCant(value) {
    this.goodsManagementService.susceptibleCant = value;
  }

  get liberadoCant() {
    return this.goodsManagementService.liberadoCant;
  }

  set liberadoCant(value) {
    this.goodsManagementService.liberadoCant = value;
  }
  get entregadoCant() {
    return this.goodsManagementService.entregadoCant;
  }

  set entregadoCant(value) {
    this.goodsManagementService.entregadoCant = value;
  }
  get asignadoCant() {
    return this.goodsManagementService.asignadoCant;
  }

  set asignadoCant(value) {
    this.goodsManagementService.asignadoCant = value;
  }

  get pageLoading() {
    return this.goodsManagementService.pageLoading;
  }

  set pageLoading(value) {
    this.goodsManagementService.pageLoading = value;
  }

  constructor(
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private globalVarService: GlobalVarsService,
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private goodTrackerService: GoodTrackerService,
    private goodsManagementService: GoodsManagementService
  ) {
    super();
    // this.settings.columns = COLUMNS;
  }

  get good() {
    return this.form.get('good');
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.goodsManagementService.refreshData
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
    this.$trackedGoods.pipe(first(), takeUntil(this.$unSubscribe)).subscribe({
      next: async response => {
        if (response && response.length > 0) {
          this.pageLoading = true;
          this.disabledProcess = false;
          this.identifier = await firstValueFrom(this.getSeqRastreador());
          if (!this.identifier) {
            this.alert('error', 'Secuencia Rastreador', 'No encontrada');
            this.disabledProcess = true;
            this.pageLoading = false;
            return;
          }
          let response2: number[] = [];
          response.forEach(item => {
            if (item.goodNumber) {
              response2.push(+item.goodNumber);
              this.saveInTemp(this.identifier, item.goodNumber);
            }
          });
          this.selectedGoodstxt = response2;
          this.getData();
        }
      },
    });
    this.globalVarService
      .getGlobalVars$()
      .pipe(first(), takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            this.pageLoading = true;
            this.disabledProcess = false;
            const paramsF = new FilterParams();
            paramsF.addFilter('identificator', this.ngGlobal.REL_BIENES);
            paramsF.limit = 100000000;
            this.goodTrackerService
              .getAllTmpTracker(paramsF.getParams())
              .subscribe({
                next: res => {
                  if (res.data && res.data.length > 0) {
                    let response2: number[] = [];
                    res.data.forEach(item => {
                      if (item.goodNumber) {
                        response2.push(+item.goodNumber);
                        this.saveInTemp(this.identifier, item.goodNumber + '');
                      }
                    });
                    this.selectedGoodstxt = response2;
                    this.getData();
                    // this.pageLoading = false;
                  } else {
                    this.pageLoading = false;
                    this.disabledProcess = true;
                  }
                },
                error: err => {
                  this.pageLoading = false;
                  this.disabledProcess = true;
                },
              });
          }
        },
      });
  }

  async searchGood() {
    console.log(this.good.value);
    // console.log();
    this.pageLoading = true;
    this.disabledProcess = false;
    this.identifier = await firstValueFrom(this.getSeqRastreador());
    if (!this.identifier) {
      this.alert('error', 'Secuencia Rastreador', 'No encontrada');
      this.disabledProcess = true;
      this.pageLoading = false;
      return;
    }
    this.saveInTemp(this.identifier, this.good.value);
    this.selectedGoodstxt = [this.good.value];
    this.getData();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  private desactivateTabs() {
    if (this.staticTabs?.tabs) {
      this.staticTabs.tabs.forEach(x => {
        x.disabled = true;
      });
    }
  }

  clear() {
    this.form.reset();
    this.selectedGoodstxt = [];
    this.notLoadedGoods = [];
    this.goodsManagementService.clear.next(true);
    this.goodsManagementService.data = [];
    this.activateTabs();
  }

  showNotLoads() {
    let config: ModalOptions = {
      initialState: {
        data: this.notLoadedGoods,
        totalItems: this.notLoadedGoods.length,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodsManagementSocialNotLoadGoodsComponent, config);
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      good: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      file: [null, [Validators.required]],
      //message: [null, [Validators.required]]
    });
  }

  private getSeqRastreador() {
    return this.goodTrackerService.getIdentifier().pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(null as Iidentifier)),
      map(x => (x ? x.nextval : null))
    );
  }

  private saveInTemp(identificator: number, good: string) {
    const body: ITmpTracker = {
      identificator,
      goodNumber: +good,
    };
    this.goodTrackerService
      .createTmpTracker(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe();
  }

  async onFileChange(event: any) {
    this.clear();
    this.pageLoading = true;
    const file = event.target.files[0];
    console.log(file);

    let fileReader = new FileReader();
    fileReader.onload = async e => {
      const result = fileReader.result as string;
      console.log(result);

      const array = result.replace(',', '').split(/\r\n|\n/); // saltos de linea
      const newArray: number[] = [];
      console.log(array);

      if (!array || array.length < 2) {
        this.disabledProcess = true;
        this.pageLoading = false;
        this.alert('error', 'No se han cargado datos en archivo', '');
        return;
      }
      this.disabledProcess = false;
      this.identifier = await firstValueFrom(this.getSeqRastreador());
      if (!this.identifier) {
        this.disabledProcess = true;
        this.alert('error', 'Secuencia Rastreador', 'No encontrada');
        this.pageLoading = false;
        return;
      }
      array.forEach(row => {
        const array2 = row.split(' ');
        console.log(array2);
        array2.forEach(item => {
          if (item.length > 0 && !isNaN(+item)) {
            newArray.push(+item);
            this.saveInTemp(this.identifier, item);
          }
        });
      });
      if (newArray.length === 0) {
        this.selectedGoodstxt = [...newArray];
        this.alert('error', 'No hay datos válidos en el archivo', '');
        this.pageLoading = false;
        return;
      }
      this.selectedGoodstxt = [...newArray];
      console.log(this.selectedGoodstxt);
      this.getData();
      // console.log(this.selectedGoodstxt);
      // console.log(response);
    };
    fileReader.readAsText(file);
  }

  goToRastreador() {
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBCAMBIOESTAT' },
    });
  }

  private activateTabs() {
    this.sinAsignarCant = this.getSinAsignarCant();
    // if (this.sinAsignarCant > 0) {
    //   this.staticTabs.tabs[0].disabled = false;
    // }
    this.susceptibleCant = this.getSusceptible();
    // if (this.susceptibleCant > 0) {
    //   this.staticTabs.tabs[1].disabled = false;
    // }
    this.asignadoCant = this.getAsignado();
    // if (this.asignadoCant > 0) {
    //   this.staticTabs.tabs[2].disabled = false;
    // }
    this.entregadoCant = this.getEntregado();
    // if (this.entregadoCant > 0) {
    //   this.staticTabs.tabs[3].disabled = false;
    // }
    this.liberadoCant = this.getLiberado();
    // if (this.liberadoCant > 0) {
    //   this.staticTabs.tabs[4].disabled = false;
    // }
  }

  private async getData() {
    const filterParams = new FilterParams();
    filterParams.limit = 20000;
    filterParams.addFilter(
      'goodNumber',
      this.selectedGoodstxt.toString(),
      SearchFilter.IN
    );
    const response = await firstValueFrom(
      this.goodTrackerService.getAllSocialCabinet(filterParams.getParams())
    );
    if (response.data.length === 0) {
      this.notLoadedGoods = [];
      this.alert('warning', 'Bienes no encontrados', '');
      this.goodsManagementService.data = [];
      this.goodsManagementService.refreshTable.next(false);
      this.sinAsignarCant = 0;
      this.susceptibleCant = 0;
      this.asignadoCant = 0;
      this.entregadoCant = 0;
      this.liberadoCant = 0;
      this.desactivateTabs();
    } else {
      this.totalItems = response.count;
      this.notLoadedGoods = [];
      this.selectedGoodstxt.forEach(x => {
        if (
          !response.data
            .map((item: any) => item.goodNumber)
            .toString()
            .includes(x + '')
        ) {
          this.notLoadedGoods.push({ good: x });
        }
      });
      this.goodsManagementService.data = response.data;
      this.activateTabs();
      this.goodsManagementService.refreshTable.next(true);
    }
    this.pageLoading = false;
  }

  private getByProcessCant(process: ETypeGabinetProcess) {
    return this.goodsManagementService.getByProcess(process).length;
  }

  getSinAsignarCant() {
    return this.getByProcessCant(ETypeGabinetProcess['Sin Asignar']);
  }

  getSusceptible() {
    return this.getByProcessCant(ETypeGabinetProcess.Susceptible);
  }
  getAsignado() {
    return this.getByProcessCant(ETypeGabinetProcess.Asignado);
  }

  getEntregado() {
    return this.getByProcessCant(ETypeGabinetProcess.Entregado);
  }
  getLiberado() {
    return this.getByProcessCant(ETypeGabinetProcess.Liberado);
  }

  downloadReport() {
    //this.loadingText = 'Generando reporte ...';
    // this.siabService.fetchReport('RMASINSUPDBIENES', params).subscribe({
    //   next: response => {
    //     this.loading = false;
    //     const blob = new Blob([response], { type: 'application/pdf' });
    //     const url = URL.createObjectURL(blob);
    //     let config = {
    //       initialState: {
    //         documento: {
    //           urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
    //           type: 'pdf',
    //         },
    //         callback: (data: any) => {},
    //       }, //pasar datos por aca
    //       class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
    //       ignoreBackdropClick: true, //ignora el click fuera del modal
    //     };
    //     this.modalService.show(PreviewDocumentsComponent, config);
    //   },
    // });
  }

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
