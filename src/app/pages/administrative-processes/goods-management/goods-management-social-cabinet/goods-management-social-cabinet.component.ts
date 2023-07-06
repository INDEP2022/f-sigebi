import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { catchError, firstValueFrom, of, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Iidentifier } from 'src/app/core/models/ms-good-tracker/identifier.model';
import { ITmpTracker } from 'src/app/core/models/ms-good-tracker/tmpTracker.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
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

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService,
    private goodsManagementService: GoodsManagementService
  ) {
    super();
    // this.settings.columns = COLUMNS;
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
  }

  ngAfterViewInit() {
    this.desactivateTabs();
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
    this.loading = true;
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = async e => {
      const result = fileReader.result as string;
      const array = result.replace(',', '').split('\r\n'); // saltos de linea
      const newArray: number[] = [];
      console.log(array);
      if (array.length === 0) {
        return;
      }
      this.disabledProcess = false;
      this.identifier = await firstValueFrom(this.getSeqRastreador());
      if (!this.identifier) {
        this.alert('error', 'Secuencia Rastreador', 'No encontrada');
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
      this.selectedGoodstxt = [...newArray];
      console.log(this.selectedGoodstxt);
      this.getData();
      // console.log(this.selectedGoodstxt);
      // console.log(response);
    };
    fileReader.readAsText(file);
  }

  private activateTabs() {
    this.sinAsignarCant = this.getSinAsignarCant();
    if (this.sinAsignarCant > 0) {
      this.staticTabs.tabs[0].disabled = false;
    } else {
      this.staticTabs.tabs[0].disabled = true;
    }
    this.susceptibleCant = this.getSusceptible();
    if (this.susceptibleCant > 0) {
      this.staticTabs.tabs[1].disabled = false;
    } else {
      this.staticTabs.tabs[1].disabled = true;
    }
    this.asignadoCant = this.getAsignado();
    if (this.asignadoCant > 0) {
      this.staticTabs.tabs[2].disabled = false;
    } else {
      this.staticTabs.tabs[2].disabled = true;
    }
    this.entregadoCant = this.getEntregado();
    if (this.entregadoCant > 0) {
      this.staticTabs.tabs[3].disabled = false;
    } else {
      this.staticTabs.tabs[3].disabled = true;
    }
    this.liberadoCant = this.getLiberado();
    if (this.liberadoCant > 0) {
      this.staticTabs.tabs[4].disabled = false;
    } else {
      this.staticTabs.tabs[4].disabled = true;
    }
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
      this.alert('error', 'Error', 'Bienes no encontrados');
      this.goodsManagementService.data = [];
      this.goodsManagementService.refreshTable.next(false);
      this.activateTabs();
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
      setTimeout(() => {
        this.goodsManagementService.refreshTable.next(true);
      }, 500);
    }
    this.loading = false;
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
