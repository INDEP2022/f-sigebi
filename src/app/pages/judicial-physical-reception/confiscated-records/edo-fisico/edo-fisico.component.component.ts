import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
      goodId: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      estadoFisico: {
        title: 'Edo.Fisico',
        type: 'custom',
        sort: false,
        renderComponent: SelectElementComponent,
        onComponentInitFunction(instance: any) {
          const values = ['MALO', 'BUENO', 'REGULAR', 'OTRO'];
          instance.values.emit(values);
          instance.toggle.subscribe((data: any) => {
            data.row.estadoFisico = data.toggle;
          });
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  dataGoods = new LocalDataSource();
  goodData: any[];
  constructor(
    private bsModel: BsModalRef,
    private serviceClassifyGood: ClassifyGoodService,
    private serviceGoodQuery: GoodsQueryService,
    private serviceGood: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.verifyEstatus();
  }

  close() {
    this.bsModel.hide();
  }

  changeAll() {
    for (let item of this.dataGoods['data']) {
      console.log(item);

      const generalModel: Map<string, any> = new Map();
      generalModel.set('id', parseInt(item.id.toString()));
      generalModel.set('goodId', parseInt(item.id.toString()));
      generalModel.set(`val${item.columna}`, item.estadoFisico);
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
    this.alert('success', 'Se modificó el estatus de los Bienes', '');
    this.bsModel.content.callback(this.dataGoods['data']);
  }

  selectRow(e: any) {
    console.log('Selecciono');
    console.log(e);
  }

  async verifyEstatus() {
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
  }

  validatePreInsert(e: any) {
    let v_no_clasif_camb: number;
    let v_no_etiqueta: number;
    const edoFis: any = this.getIndEdoFisAndVColumna(e);
    return new Promise((resolve, reject) => {
      if (e.indEdoFisico) {
        if (e[`val${edoFis.V_NO_COLUMNA}`] == 'MALO') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.goodClassNumber);
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
                      generalModel.set('id', e.id);
                      generalModel.set('goodId', e.goodId);
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
                      generalModel.set('id', e.id);
                      generalModel.set('goodId', e.goodId);
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
        } else if (e[`val${edoFis.V_NO_COLUMNA}`] == 'REGULAR') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.goodClassNumber);
          this.serviceClassifyGood
            .getChangeClass(paramsF.getParams())
            .subscribe(
              res => {
                if (res.data.length > 1) {
                  v_no_clasif_camb = e.goodClassNumber;
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
                      generalModel.set('id', e.id);
                      generalModel.set('goodId', e.goodId);
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
                      generalModel.set('id', e.id);
                      generalModel.set('goodId', e.goodId);
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

  getIndEdoFisAndVColumna(data: any) {
    let V_IND_EDO_FISICO: number;
    let V_NO_COLUMNA: number;
    console.log(data.goodClassNumber);

    return new Promise((resolve, reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('type', 'EDO_FIS');
      paramsF.addFilter('classifyGoodNumber', data.goodClassNumber);
      this.serviceClassifyGood.getChangeClass(paramsF.getParams()).subscribe(
        res => {
          V_IND_EDO_FISICO = 1;
          const paramsF2 = new FilterParams();
          paramsF2.addFilter('classifGoodNumber', data.goodClassNumber);
          paramsF2.addFilter('attribute', 'ESTADO FISICO', SearchFilter.ILIKE);
          this.serviceGoodQuery
            .getAtributeClassificationGoodFilter(paramsF2.getParams())
            .subscribe(
              res => {
                console.log(res);
                if (res.data[0]) {
                  V_NO_COLUMNA = res.data[0].columnNumber;
                  resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
                }
              },
              err => {
                console.log(err);
                V_NO_COLUMNA = 0;
                resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
              }
            );
        },
        err => {
          console.log(err);
          V_IND_EDO_FISICO = 0;
          V_NO_COLUMNA = 0;
          const paramsF2 = new FilterParams();
          paramsF2.addFilter('classifGoodNumber', data.goodClassNumber);
          paramsF2.addFilter('attribute', 'ESTADO FISICO', SearchFilter.ILIKE);
          this.serviceGoodQuery
            .getAtributeClassificationGoodFilter(paramsF2.getParams())
            .subscribe(
              res => {
                console.log(res);
                if (res.data[0]) {
                  V_NO_COLUMNA = res.data[0].columnNumber;
                  resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
                }
              },
              err => {
                V_NO_COLUMNA = 0;
                resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
              }
            );
          resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
        }
      );
    });
  }
}
