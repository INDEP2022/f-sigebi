import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsExportPost } from 'src/app/core/models/catalogs/goods.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailProceeDelRecService } from '../../../../../core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { COLUMNS_EXPORT_GOODS } from './columns-export-goods';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';

@Component({
  selector: 'app-export-goods-donation',
  templateUrl: './export-goods-donation.component.html',
  styles: [],
})
export class ExportGoodsDonationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //data = EXAMPLE_DATA;
  data = new LocalDataSource();
  data1: any[] = [];
  noExpediente: number;
  cveUnica: number | null;
  ngGlobal: IGlobalVars = null;


  constructor(
    private router: Router,
    private expedientSamiService: ExpedientSamiService,
    private delegationService: DelegationService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private globalVarsService: GlobalVarsService,
    private goodService: GoodService,
    private goodTrackerService: GoodTrackerService,
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_EXPORT_GOODS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            this.backRastreador(this.ngGlobal.REL_BIENES);
          }
        },
      });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openDefineFilter() {
    this.router.navigate([
      `/pages/parameterization/filters-of-goods-for-donation`,
    ]);
  }

  mapearDatos(response: any) {
    this.data1 = []; // Se inicializa vavicio para que no se duplique al dar click
    this.data.load(this.data1);
    for (let i = 0; i < response.data.length; i++) {
      console.log('DATA: ', response.data[i]);

      let padre =
        response.data[i].no_bien_padre_parcializacion != null
          ? response.data[i].no_bien_padre_parcializacion
          : '1';

      const model = {} as IGoodsExportPost;
      (model.noBien = response.data[i].no_bien),
        (model.vNoBienPadre = padre),
        (model.vNobienreferencia = response.data[i].no_bien_referencia);

      this.delegationService.postCatalog(model).subscribe({
        next: resp => {
          let acta = resp.data[0].coalesce;
          console.log('resp -> ', resp);
          //Servicio
          this.delegationService.getTran(response.data[i].no_expediente).subscribe(respo => {
            if (respo != null && resp != undefined) {
              console.log('Resp tranEmit', respo);
              //servicio 2
              this.detailProceeDelRecService.getProceding(acta).subscribe({
                next: res => {
                  console.log('res 2 -> ', res);

                  let dataForm = {
                    numberGood: response.data[i].no_bien,
                    description: response.data[i].descripcion,
                    quantity: response.data[i].cantidad,
                    clasificationNumb: response.data[i].no_clasif_bien,
                    tansfNumb: response.data[i].no_transferente,
                    status: response.data[i].estatus,
                    proceedingsNumb: response.data[i].no_expediente,
                    delAdmin: res.del_administra,
                    delDeliv: res.del_recibe,
                    recepDate: res.fecha_recepcion,
                  };
                  console.log('DATA FORM ->', dataForm);

                  this.data1.push(dataForm); // invocar todos tres servicios
                  this.data.load(this.data1); // cuando ya pasa todo, se mapea la info

                }, error: err => {
                  let dataForm = {
                    numberGood: response.data[i].no_bien,
                    description: response.data[i].descripcion,
                    quantity: response.data[i].cantidad,
                    clasificationNumb: response.data[i].no_clasif_bien,
                    tansfNumb: response.data[i].no_transferente,
                    status: response.data[i].estatus,
                    proceedingsNumb: response.data[i].no_expediente,
                    cveUnica: respo.data[0].no_tran_emi_aut,
                    emisora: respo.data[0].no_emisora
                  };

                  this.data1.push(dataForm); // invocar todos tres servicios
                  this.data.load(this.data1);
                }
              });
            }
          });
          //servicio
        },
      });
    }
  }

  getall() {
    this.expedientSamiService.getexpedient().subscribe({
      next: response => {
        console.log('Respuesta ', response);
        this.generarAlerta(response);
        this.totalItems = response.count;
        // console.log('response.count -->', response.count);
      },
      error: err => {
        console.log('err ->', err);
        this.data.load(this.data1);
      },
    });
  }

  generarAlerta(response: any) {
    if (response.data.length > 1000) {
      // cambiar a 1000 se coloca para prueba
      this.alertQuestion(
        'info',
        'Se recuperarán ' +
        response.data.length +
        ' registros ¿Deseas continuar? ',
        '',
        'Si',
        'No'
      ).then(No => {
        console.log('res', No);
        if (No.isConfirmed) {
          this.mapearDatos(response);
        } else {
          return;
        }
      });
    } else {
      this.mapearDatos(response);
    }
  }
  // SE LLAMA A LA PANTALLA RASTREADOR POR BIENES Y NOTIFICACIONES
  callRastreador() {
    this.loadFromGoodsTracker();
  }
  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FDONACIONES',
      },
    });
  }
  // SERVICIO PARA TRAER BIENES DE LA PANTALLA RASTREADOR POR BIENES Y NOTIFICACIONES
  addGoodRastreador(good: any) {
    this.goodService.getByGood(good).subscribe({
      next: response => {
        console.log(' good ', response);
      },
    });
  }
  // SERVIVO PARA RECORRER EL SERVICIO getByGood
  backRastreador(global: any) {
    this.goodTrackerService.PaInsGoodtmptracker(global).subscribe({
      next: response => {
        console.log('respuesta TMPTRAKER', response);
        for (let i = 0; i < response.count; i++) {
          console.log('entra ---> For');
          this.addGoodRastreador(response.data[0].goodNumber);
        }
        console.log('sale del For');
      },
    });
  }
}
