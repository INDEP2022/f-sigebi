import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';

@Component({
  selector: 'app-classify-assets-tab',
  templateUrl: './classify-assets-tab.component.html',
  styles: [],
})
export class ClassifyAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @Input() assetsId: any = '';
  @Input() typeDoc: string = '';
  @Input() goodObject: ModelForm<any> = null;
  @Input() domicilieObject: IDomicilies;
  classiGoodsForm: ModelForm<IGood>;
  private bsModalRef: BsModalRef;
  private advSearch: boolean = false;

  public selectSection: any;
  public selectChapter = new DefaultSelect<any>();
  public selectLevel1 = new DefaultSelect<any>();
  public selectLevel2 = new DefaultSelect<any>();
  public selectLevel3 = new DefaultSelect<any>();
  public selectLevel4 = new DefaultSelect<any>();

  detailArray: any = {};

  good: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsQueryService: GoodsQueryService,
    private fractionService: FractionService,
    private goodService: GoodService,
    private route: ActivatedRoute,
    private requestHelperService: RequestHelperService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    this.initForm();
    if (!this.goodObject) {
      this.getSection(new ListParams());
    }
    this.getReactiveFormActions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc == '') {
      if (changes['assetsId'].currentValue != '') {
        //cargar la clasificacion de bienes segun el id que se envio
      }
    }

    //bienes selecionados
    this.good = changes['goodObject'].currentValue;
    if (this.classiGoodsForm != undefined) {
      if (this.goodObject != null) {
        this.getSection(new ListParams(), this.good.ligieSection);
        this.classiGoodsForm.patchValue(this.good);
      }
    }
  }

  initForm() {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.classiGoodsForm = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestId: [requestId],
      goodTypeId: [null],
      color: [null],
      goodDescription: [null],
      quantity: [1],
      duplicity: ['N'],
      capacity: [null],
      volume: [null],
      fileeNumber: [null],
      useType: [null],
      physicalStatus: [null],
      stateConservation: [null],
      origin: [null],
      goodClassNumber: [null],
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: [null],
      notesTransferringEntity: [null],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
      brand: [null],
      subBrand: [null],
      armor: [null],
      model: [null],
      doorsNumber: [null],
      axesNumber: [null],
      engineNumber: [null], //numero motor
      tuition: [null],
      serie: [null],
      chassis: [null],
      cabin: [null],
      fitCircular: [null],
      theftReport: [null],
      addressId: [null],
      operationalState: [null],
      manufacturingYear: [null],
      enginesNumber: [null], // numero de motores
      flag: [null],
      openwork: [null],
      sleeve: [null],
      length: [null],
      shipName: [null],
      publicRegistry: [null], //registro public
      ships: [null],
      dgacRegistry: [null], //registro direccion gral de aereonautica civil
      airplaneType: [null],
      caratage: [null], //kilatage
      material: [null],
      weight: [null],
    });

    if (this.goodObject != null) {
      this.getSection(new ListParams(), this.good.ligieSection);
      this.classiGoodsForm.patchValue(this.good);
    }
  }

  getSection(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.level'] = '$eq:' + 0;
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectSection = data.data; //= new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieSection'].setValue(
            data.data[0].id
          );
          this.advSearch = false;
        }

        if (this.goodObject != null) {
          this.classiGoodsForm.controls['ligieSection'].setValue(id);
        }
      },
    });
  }

  getChapter(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectChapter = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieChapter'].setValue(
            data.data[0].id
          );
          this.getSection(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieChapter'].setValue(
            this.good.ligieChapter
          );
        }
      },
    });
  }

  getLevel1(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectLevel1 = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieLevel1'].setValue(
            data.data[0].id
          );
          this.getChapter(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel1'].setValue(
            this.good.ligieLevel1
          );
        }
      },
    });
  }

  getLevel2(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectLevel2 = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieLevel2'].setValue(
            data.data[0].id
          );
          this.getLevel1(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel2'].setValue(
            this.good.ligieLevel2
          );
        }
      },
    });
  }

  getLevel3(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectLevel3 = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieLevel3'].setValue(
            data.data[0].id
          );
          this.getLevel2(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel3'].setValue(
            this.good.ligieLevel3
          );
        }
      },
    });
  }

  getLevel4(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectLevel4 = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.classiGoodsForm.controls['ligieLevel4'].setValue(
            data.data[0].id
          );
          this.getLevel3(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel4'].setValue(
            this.good.ligieLevel4
          );
        }
      },
    });
  }

  openSearchModal(): void {
    let config: ModalOptions = {
      initialState: {
        parameter: '',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(AdvancedSearchComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });
  }

  matchLevelFraction(res: any) {
    this.advSearch = true;
    switch (Number(res.level)) {
      case 5:
        this.getLevel4(new ListParams(), res.id);
        break;
      case 4:
        this.getLevel3(new ListParams(), res.id);
        break;
      case 3:
        this.getLevel2(new ListParams(), res.id);
        break;
      case 2:
        this.getLevel1(new ListParams(), res.id);
        break;
      case 1:
        this.getChapter(new ListParams(), res.id);
        break;
      case 0:
        this.getSection(new ListParams(), res.id);
        break;
      default:
        break;
    }
  }

  saveRequest(): void {
    const goods = this.classiGoodsForm.getRawValue();
    console.log('bienes: ', goods);
    var goodAction =
      goods.goodId === null
        ? this.goodService.create(goods)
        : this.goodService.update(goods.id, goods);

    goodAction.subscribe({
      next: (data: any) => {
        if (data.statusCode != null) {
          this.message(
            'error',
            'Error',
            `El registro no sepudo guardar!. ${data.message}`
          );
        }

        if (data.id != null) {
          this.message(
            'success',
            'Guardado',
            `El registro se guardo exitosamente!`
          );
          this.classiGoodsForm.controls['id'].setValue(data.id);

          this.refreshTable(true);
          // this.principalSave = false;
        }
      },
    });
  }

  getReactiveFormActions() {
    this.classiGoodsForm.controls['ligieSection'].valueChanges.subscribe(
      (data: any) => {
        //this.classiGoodsForm.controls['ligieChapter'].setValue(null);
        if (data != null) {
          if (this.advSearch === false) {
            this.getChapter(new ListParams(), data);
            this.classiGoodsForm.controls['ligieChapter'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.classiGoodsForm.controls['goodTypeId'].setValue(null);
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieChapter'].valueChanges.subscribe(
      (dataChapter: any) => {
        //this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
        if (dataChapter != null) {
          let fractionCode = this.selectChapter.data.filter(
            x => x.id === dataChapter
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);

          const relativeTypeId = this.getRelevantTypeId(
            this.selectChapter.data,
            dataChapter
          );
          this.setRelevantTypeId(relativeTypeId);
          /* this.classiGoodsForm.controls['goodTypeId'].setValue(
            this.getRelevantTypeId(this.selectChapter.data, dataChapter)
          ); */
          if (this.advSearch === false) {
            this.getLevel1(new ListParams(), dataChapter);
            this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel1'].valueChanges.subscribe(
      (dataLevel1: any) => {
        //this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
        if (dataLevel1 != null) {
          let fractionCode = this.selectLevel1.data.filter(
            x => x.id === dataLevel1
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);

          /* this.classiGoodsForm.controls['goodTypeId'].setValue(
            this.getRelevantTypeId(this.selectLevel1.data, dataLevel1)
          ); */
          const relativeTypeId = this.getRelevantTypeId(
            this.selectLevel1.data,
            dataLevel1
          );
          this.setRelevantTypeId(relativeTypeId);
          if (this.advSearch === false) {
            this.getLevel2(new ListParams(), dataLevel1);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel2'].valueChanges.subscribe(
      (dataLevel2: any) => {
        //this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        if (dataLevel2 != null) {
          let fractionCode = this.selectLevel2.data.filter(
            x => x.id === dataLevel2
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);

          const relativeTypeId = this.getRelevantTypeId(
            this.selectLevel2.data,
            dataLevel2
          );
          this.setRelevantTypeId(relativeTypeId);

          if (this.advSearch === false) {
            this.getLevel3(new ListParams(), dataLevel2);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel3'].valueChanges.subscribe(
      (dataLevel3: any) => {
        //this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
        if (dataLevel3 != null) {
          let fractionCode = this.selectLevel3.data.filter(
            x => x.id === dataLevel3
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);

          const relevantTypeId = this.getRelevantTypeId(
            this.selectLevel3.data,
            dataLevel3
          );
          this.setRelevantTypeId(relevantTypeId);
          //this.getRelevantTypeId(this.selectLevel3.data, dataLevel3);

          if (this.advSearch === false) {
            this.getLevel4(new ListParams(), dataLevel3);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
          }
        }
      }
    );

    this.classiGoodsForm.controls['ligieLevel4'].valueChanges.subscribe(
      (dataLevel4: any) => {
        if (dataLevel4 !== null) {
          const relevantTypeId = this.getRelevantTypeId(
            this.selectLevel4.data,
            dataLevel4
          );
          this.setRelevantTypeId(relevantTypeId);
        }
      }
    );
  }

  getRelevantTypeId(arrayData: any, id: number): number {
    return arrayData.filter((x: any) => x.id == id)[0].relevantTypeId;
  }

  setRelevantTypeId(relativeTypeId: number) {
    if (this.classiGoodsForm.controls['goodTypeId'].value != relativeTypeId) {
      this.classiGoodsForm.controls['goodTypeId'].setValue(relativeTypeId);
    }
  }

  getUnidMeasure(value: string) {
    if (value.length === 8) {
      const fractionCode = { fraction: value };
      this.goodsQueryService
        .getUnitLigie(fractionCode)
        .subscribe((data: any) => {
          //guarda el no_clasify_good
          if (data.clasifGoodNumber != null) {
            this.classiGoodsForm.controls['goodClassNumber'].setValue(
              data.clasifGoodNumber
            );
          }
          //guarda el tipo de unidad
          this.goodsQueryService
            .getLigieUnitDescription(data.ligieUnit)
            .subscribe((data: any) => {
              this.classiGoodsForm.controls['unitMeasure'].setValue(
                data.description
              );
              this.classiGoodsForm.controls['ligieUnit'].setValue(
                data.description
              );
            });
        });
    }
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  refreshTable(refresh: boolean) {
    this.requestHelperService.isComponentSaving(refresh);
  }
}
