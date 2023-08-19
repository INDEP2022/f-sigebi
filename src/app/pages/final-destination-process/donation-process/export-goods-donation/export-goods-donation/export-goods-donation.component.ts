import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsExportPost } from 'src/app/core/models/catalogs/goods.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailProceeDelRecService } from '../../../../../core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { COLUMNS_EXPORT_GOODS } from './columns-export-goods';

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
  constructor(
    private router: Router,
    private expedientSamiService: ExpedientSamiService,
    private delegationService: DelegationService,
    private detailProceeDelRecService: DetailProceeDelRecService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_EXPORT_GOODS;
  }

  ngOnInit(): void {}

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openDefineFilter() {
    this.router.navigate([
      `/pages/parameterization/filters-of-goods-for-donation`,
    ]);
  }

  mapearDatos(response: any) {
    for (let i = 0; i < response.data.length; i++) {
      console.log('DATA: ', response.data[i]);

      /* let dataForm = {
         no_bien: response.data[i].no_bien,
         descripcion: response.data[i].descripcion,
         cantidad: response.data[i].cantidad,
         no_clasif_bien: response.data[i].no_clasif_bien,
         no_transferente: response.data[i].no_transferente,
         estatus: response.data[i].estatus,
         fecha_liberacion: response.data[i].fecha_liberacion,
         no_expediente: response.data[i].no_expediente,
       };
       this.data1.push(dataForm); // invocar los dos servicios */
      let padre =
        response.data[i].no_bien_padre_parcializacion != null
          ? response.data[i].no_bien_padre_parcializacion
          : '0';

      const model = {} as IGoodsExportPost;
      (model.noBien = response.data[i].no_bien),
        (model.vNoBienPadre = padre),
        (model.vNobienreferencia = response.data[i].no_bien_referencia);

      this.delegationService.postCatalog(model).subscribe({
        next: resp => {
          let acta = resp.data[0].coalesce;
          console.log('resp -> ', resp);

          this.detailProceeDelRecService.getProceding(acta).subscribe({
            next: res => {
              console.log('res -> ', res);

              let dataForm = {
                no_bien: response.data[i].no_bien,
                descripcion: response.data[i].descripcion,
                cantidad: response.data[i].cantidad,
                no_clasif_bien: response.data[i].no_clasif_bien,
                no_transferente: response.data[i].no_transferente,
                estatus: response.data[i].estatus,
                no_expediente: response.data[i].no_expediente,
                delAdmin: res.del_administra,
                elDeliv: res.del_recibe,
                // fecha_liberacion: res.fecha_recepcion,
              };
              this.data1.push(dataForm); // invocar todos tres servicios
            },
          });
        },
      });
    }
    this.data.load(this.data1); // cuando ya pasa todo
  }

  getall() {
    this.expedientSamiService.getexpedient().subscribe({
      next: response => {
        console.log('Respuesta ', response);
        this.generarAlerta(response);
      },
      error: err => {
        console.log(err);
        this.data.load(this.data1);
      },
    });
  }

  generarAlerta(response: any) {
    if (response.data.length > 7) {
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
}

// const EXAMPLE_DATA = [
//   {
//     numberGood: 123,
//     description: 'PRUEBA',
//     quantity: 1,
//     clasificationNumb: 1,
//     tansfNumb: 1,
//     delAdmin: 1,
//     delDeliv: 1,
//     recepDate: '01/01/2022',
//     status: 1,
//     proceedingsNumb: 1,
//     cpd: false,
//     adm: false,
//     RDA: false,
//   },
// ];
