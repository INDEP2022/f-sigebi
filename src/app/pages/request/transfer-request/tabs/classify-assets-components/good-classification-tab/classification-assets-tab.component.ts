import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REQUEST_OF_ASSETS_COLUMNS } from '../classification-assets.columns';

@Component({
  selector: 'app-classification-assets-tab',
  templateUrl: './classification-assets-tab.component.html',
  styles: [],
})
export class ClassificationAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() dataObject: any;
  @Input() requestObject: any;
  @Input() typeDoc: any = '';
  idRequest: number = 0;
  title: string = 'Bienes de la Solicitud';
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsFraction = new BehaviorSubject<ListParams>(new ListParams());
  paramsChapter = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl1 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl3 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl4 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  assetsId: number = 0;
  detailArray: any;
  totalItems: number = 0;
  idFraction: number = 0;
  classiGoodsForm: FormGroup = new FormGroup({});
  ligiesSection = new DefaultSelect();
  chapters = new DefaultSelect();
  levels1 = new DefaultSelect();
  levels2 = new DefaultSelect();
  levels3 = new DefaultSelect();
  levels4 = new DefaultSelect();

  constructor(
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private goodTypeService: GoodTypeService,
    private fb: FormBuilder,
    private fractionService: FractionService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    console.log('id de la solicitud', this.idRequest);
    this.prepareForm();
    this.tablePaginator();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: REQUEST_OF_ASSETS_COLUMNS,
    };
  }

  prepareForm() {
    this.classiGoodsForm = this.fb.group({
      ligieSection: [null],
      chapter: [null],
      level1: [null],
      level2: [null],
      level3: [null],
      level4: [null],
    });
  }

  showGoods() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.tablePaginator();
    }
  }

  tablePaginator() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    //this.paragraphs = data;
    this.params.getValue()['filter.requestId'] = this.idRequest;
    this.goodService.getAll(this.params.getValue()).subscribe(data => {
      const info = data.data.map(items => {
        const fraction: any = items.fractionId;
        this.idFraction = fraction.code;
        items.fractionId = fraction.description;
        return items;
      });
      console.log('info', info);
    });
  }

  rowSelected(event: any) {
    //this.getSection(event.ligieSection);
  }

  /*physicalState(goods: any) {
    const physicalFilter = goods.map((items: any) => {
      if (items.physicalStatus == 1) items.physicalStatus = 'BUENO';
      if (items.physicalStatus == 2) items.physicalStatus = 'MALO';
      return items;
    });

    this.stateConservation(physicalFilter);
  }

  stateConservation(goods: any) {
    const conservationFilter = goods.map((items: any) => {
      if (items.stateConservation == 1) items.stateConservation = 'BUENO';
      if (items.stateConservation == 2) items.stateConservation = 'MALO';
      return items;
    });
    console.log('mee', conservationFilter);
    this.transferentDestiny(conservationFilter);
  }

  transferentDestiny(goods: any) {
    const transferentDestiny = goods.map((items: any) => {
      if (items.transferentDestiny == 1) items.transferentDestiny = 'BUENO';
      if (items.transferentDestiny == 2) items.transferentDestiny = 'MALO';
      return items;
    });
    this.paragraphs = transferentDestiny;
    this.totalItems = this.paragraphs.length;
    this.loading = false;
  }

  

  getSection(id: number) {
    this.paramsFraction.getValue()['filter.level'] = 0;
    this.paramsFraction.getValue()['filter.id'] = id;
    this.fractionService.getAll(this.paramsFraction.getValue()).subscribe({
      next: response => {
        response.data.map(info => {
          this.classiGoodsForm.get('ligieSection').setValue(info.description);
          this.getChapter(id, info.id);
        });
      },
    });
  }

  getChapter(id: number, idParent: number) {
    this.paramsChapter.getValue()['filter.parentId'] = id;
    this.paramsChapter.getValue()['filter.fractionCode'] = 87;
    this.fractionService.getAll(this.paramsChapter.getValue()).subscribe({
      next: response => {
        response.data.map(info => {
          this.classiGoodsForm.get('chapter').setValue(info.description);
          this.getLevel1(info.id);
        });
      },
    });
  } */

  getLevel1(idParent: number) {
    this.paramsLvl1.getValue()['filter.parentId'] = idParent;
    this.paramsLvl1.getValue()['filter.fractionCode'] = 8703;

    this.fractionService.getAll(this.paramsLvl1.getValue()).subscribe({
      next: response => {
        response.data.map(info => {
          this.classiGoodsForm.get(['level1']).setValue(info.description);
          this.getLevel2(info.id);
        });
      },
    });
  }

  getLevel2(idParent: number) {
    this.paramsLvl2.getValue()['filter.parentId'] = idParent;
    this.paramsLvl2.getValue()['filter.id'] = 17616;
    //this.paramsLvl2.getValue()['filter.fractionCode'] = 8703;

    this.fractionService.getAll(this.paramsLvl2.getValue()).subscribe({
      next: response => {
        response.data.map(info => {
          this.classiGoodsForm.get(['level2']).setValue(info.description);
          this.getLevel3(info.id);
        });
      },
    });
  }

  getLevel3(idParent: number) {
    this.paramsLvl3.getValue()['filter.parentId'] = idParent;
    this.paramsLvl3.getValue()['filter.fractionCode'] = 870323;

    this.fractionService.getAll(this.paramsLvl3.getValue()).subscribe({
      next: response => {
        response.data.map(info => {
          this.classiGoodsForm.get(['level3']).setValue(info.description);
          this.getLevel4(info.id);
        });
      },
    });
  }

  getLevel4(idParent: number) {
    this.paramsLvl4.getValue()['filter.parentId'] = idParent;
    //this.paramsLvl2.getValue()['filter.id'] = 17616;
    this.paramsLvl4.getValue()['filter.fractionCode'] = 87032301;

    this.fractionService.getAll(this.paramsLvl4.getValue()).subscribe({
      next: response => {
        console.log(response);
        response.data.map(info => {
          this.classiGoodsForm.get(['level4']).setValue(info.description);
        });
      },
    });
  }
}
