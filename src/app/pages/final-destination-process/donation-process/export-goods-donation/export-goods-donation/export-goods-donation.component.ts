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
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void { }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openDefineFilter() {
    this.router.navigate([
      `/pages/parameterization/filters-of-goods-for-donation`,
    ]);
  }
  openDefineFilter1() {
    this.router.navigate([
      `/pages/general-processes/goods-tracker`,
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
              console.log('DATA error 2222->');
              let dataForm = {
                numberGood: response.data[i].no_bien,
                description: response.data[i].descripcion,
                quantity: response.data[i].cantidad,
                clasificationNumb: response.data[i].no_clasif_bien,
                tansfNumb: response.data[i].no_transferente,
                status: response.data[i].estatus,
                proceedingsNumb: response.data[i].no_expediente,
              };

              console.log('DATA FORM 2222->', dataForm);

              this.data1.push(dataForm); // invocar todos tres servicios
              this.data.load(this.data1);
            }
          });
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
  callRastreador() {
    window.open('/pages/general-processes/goods-tracker', '_blank');
  }
}
