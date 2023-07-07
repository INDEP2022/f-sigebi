import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDetailWithIndEdo } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SelectElementComponent } from 'src/app/shared/components/select-element-smarttable/select-element';

@Component({
  selector: 'app-edo-fisico',
  templateUrl: './edo-fisico.component.html',
  styleUrls: [],
})
export class EdoFisicoComponent extends BasePage implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      'good.goodId': {
        title: 'No. Bien',
        type: 'number',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.goodId) {
            return row.good.goodId;
          } else {
            return null;
          }
        },
      },
      'good.description': {
        title: 'Descripción',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.description) {
            return row.good.description;
          } else {
            return null;
          }
        },
      },
      estadoFisico: {
        title: 'Estado Físico',
        type: 'custom',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good[`val${row.vNoColumna}`]) {
            return row.good[`val${row.vNoColumna}`];
          } else {
            return null;
          }
        },
        renderComponent: SelectElementComponent,
        onComponentInitFunction(instance: any) {
          const values = ['MALO', 'BUENO', 'REGULAR', 'OTRO'];
          instance.values.emit(values);
          instance.toggle.subscribe((data: any) => {
            data.row.good[`val${data.row.vNoColumna}`] =
              data.toggle == 'OTRO' ? null : data.toggle;
          });
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  dataGoods = new LocalDataSource();
  goodData: any[];
  idProceeding: any;
  constructor(
    private bsModel: BsModalRef,
    private serviceClassifyGood: ClassifyGoodService,
    private serviceGoodQuery: GoodsQueryService,
    private serviceGood: GoodService,
    private serviceDetailProc: DetailProceeDelRecService
  ) {
    super();
  }

  ngOnInit(): void {
    /* this.verifyEstatus(); */
    const model: IDetailWithIndEdo = {
      no_acta: parseInt(this.idProceeding),
      vIndEdoFisicod: true,
    };

    this.serviceDetailProc.getAllwithEndFisico(model).subscribe(res => {
      this.dataGoods.load(res.data);
    });
  }

  close() {
    this.bsModel.hide();
  }

  changeAll() {
    try {
      for (let item of this.dataGoods['data']) {
        console.log(item);

        const generalModel: Map<string, any> = new Map();
        generalModel.set('id', parseInt(item.good.id.toString()));
        generalModel.set('goodId', parseInt(item.good.goodId.toString()));
        generalModel.set(
          `val${item.vNoColumna}`,
          item.good[`val${item.vNoColumna}`]
        );
        const jsonModel = JSON.parse(
          JSON.stringify(Object.fromEntries(generalModel))
        );
        this.serviceGood.updateWithoutId(jsonModel).subscribe(
          async res => {
            console.log(res);
            await this.validatePreInsert(item);
          },
          err => {
            console.log(err);
          }
        );
      }
    } catch (error) {
      this.alert(
        'error',
        'Se presentó un error inesperado',
        'Se presentó un error inesperado al actualizar el estado físico de los Bienes. Por favor intentelo nuevamente. \n \n Si el error persiste contacte con el administrador.'
      );
    } finally {
      this.alert('success', 'Se modificó el estatus de los Bienes', '');
      this.bsModel.content.callback(this.dataGoods['data']);
    }
  }

  selectRow(e: any) {
    console.log('Selecciono');
    console.log(e);
  }

  /* async verifyEstatus() {
    console.log('Sí verifico');
    const newDataPromise = this.goodData.map(async (e: any) => {
      const edoFis: any = await this.getIndEdoFisAndVColumna(e);
      return {
        ...e,
        estadoFisico: e[`val${edoFis.V_NO_COLUMNA}`],
        columna: edoFis.V_NO_COLUMNA,
      };
    });
    const newData = await Promise.all(newDataPromise);
    const newDataJSON = JSON.stringify(newData);
    console.log(JSON.parse(newDataJSON));
    this.dataGoods = new LocalDataSource(JSON.parse(newDataJSON));
  } */

  validatePreInsert(e: any) {
    let v_no_clasif_camb: number;
    let v_no_etiqueta: number;
    return new Promise((resolve, reject) => {
      if (e.indEdoFisico) {
        if (e.good[`val${e.vNoColumna}`] == 'MALO') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.good.goodClassNumber);
          this.serviceClassifyGood
            .getChangeClass(paramsF.getParams())
            .subscribe(
              res => {
                v_no_clasif_camb = res.data[0]['classifyChangeNumber'];
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);

                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );

                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              },
              err => {
                v_no_clasif_camb = 0;
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              }
            );
        } else if (e.good[`val${e.vNoColumna}`] == 'REGULAR') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.good.goodClassNumber);
          this.serviceClassifyGood
            .getChangeClass(paramsF.getParams())
            .subscribe(
              res => {
                if (res.data.length > 1) {
                  v_no_clasif_camb = e.good.goodClassNumber;
                } else {
                  v_no_clasif_camb = res.data[0]['classifyChangeNumber'];
                }
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              },
              err => {
                v_no_clasif_camb = 0;
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              }
            );
        }
      }
    });
  }
}
