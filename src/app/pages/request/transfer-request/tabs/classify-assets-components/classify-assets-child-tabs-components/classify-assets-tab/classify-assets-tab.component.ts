import {
  Component,
  inject,
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
import { IGood } from 'src/app/core/models/ms-good/good';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  @Input() assetsId: any = '';
  @Input() typeDoc: string = '';
  classiGoodsForm: ModelForm<IGood>;
  private bsModalRef: BsModalRef;

  public selectSection: any;
  public selectChapter = new DefaultSelect<any>();
  public selectLevel1 = new DefaultSelect<any>();
  public selectLevel2 = new DefaultSelect<any>();
  public selectLevel3 = new DefaultSelect<any>();
  public selectLevel4 = new DefaultSelect<any>();

  detailArray: any = {};

  route = inject(ActivatedRoute);
  fractionService = inject(FractionService);

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    this.initForm();
    this.getSection(new ListParams());
    this.getReactiveFormActions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc == '') {
      if (changes['assetsId'].currentValue != '') {
        //cargar la clasificacion de bienes segun el id que se envio
      }
    }
  }

  initForm() {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.classiGoodsForm = this.fb.group({
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestId: [requestId],
      noManagement: [null], // preguntar no gestion
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
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: [null],
      notesTransferringEntity: [null],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
    });
  }

  getSection(params: ListParams) {
    params['filter.level'] = 0;
    params.take = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        console.log('seccion', data);

        this.selectSection = data.data; //= new DefaultSelect(data.data, data.count);
      },
    });
  }

  getChapter(params: ListParams, id?: number) {
    params.take = 50;
    this.fractionService.getByParentId(id).subscribe({
      next: data => {
        console.log('capitulo', data);
        this.selectChapter = new DefaultSelect(data.data, data.length);
      },
    });
  }

  getLevel1(params: ListParams, id?: number) {
    params.take = 50;
    this.fractionService.getByParentId(id).subscribe({
      next: data => {
        console.log('level1', data);

        this.selectLevel1 = new DefaultSelect(data.data, data.length);
      },
    });
  }

  getLevel2(params: ListParams, id?: number) {
    params.take = 50;
    this.fractionService.getByParentId(id).subscribe({
      next: data => {
        console.log('level2', data);
        this.selectLevel2 = new DefaultSelect(data.data, data.length);
      },
    });
  }

  getLevel3(params: ListParams, id?: number) {
    params.take = 50;
    this.fractionService.getByParentId(id).subscribe({
      next: data => {
        console.log('level3', data);
        this.selectLevel3 = new DefaultSelect(data.data, data.length);
      },
    });
  }

  getLevel4(params: ListParams, id?: number) {
    params.take = 50;
    this.fractionService.getByParentId(id).subscribe({
      next: data => {
        console.log('level4', data);
        this.selectLevel4 = new DefaultSelect(data.data, data.length);
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
      console.log(res);
    });
  }

  saveRequest(): void {
    console.log(this.classiGoodsForm.getRawValue());
  }

  getReactiveFormActions() {
    this.classiGoodsForm.controls['ligieSection'].valueChanges.subscribe(
      (data: any) => {
        // this.classiGoodsForm.controls['ligieChapter'].setValue('');
        if (data != null) this.getChapter(new ListParams(), data);
      }
    );
    this.classiGoodsForm.controls['ligieChapter'].valueChanges.subscribe(
      (dataChapter: any) => {
        //this.classiGoodsForm.controls['ligieLevel1'].setValue('');
        if (dataChapter != null) {
          this.getLevel1(new ListParams(), dataChapter);
          this.classiGoodsForm.controls['goodTypeId'].setValue(
            this.getRelevantTypeId(this.selectChapter.data, dataChapter)
          );
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel1'].valueChanges.subscribe(
      (dataLevel1: any) => {
        //this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
        if (dataLevel1 != null) {
          this.getLevel2(new ListParams(), dataLevel1);
          this.detailArray = this.classiGoodsForm;
          this.classiGoodsForm.controls['goodTypeId'].setValue(
            this.getRelevantTypeId(this.selectLevel1.data, dataLevel1)
          );
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel2'].valueChanges.subscribe(
      (dataLevel2: any) => {
        //this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        if (dataLevel2 != null) this.getLevel3(new ListParams(), dataLevel2);
        console.log(this.getRelevantTypeId(this.selectLevel2.data, dataLevel2));
      }
    );
    this.classiGoodsForm.controls['ligieLevel3'].valueChanges.subscribe(
      (dataLevel3: any) => {
        //this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
        if (dataLevel3 != null) this.getLevel4(new ListParams(), dataLevel3);
        console.log(this.getRelevantTypeId(this.selectLevel3.data, dataLevel3));
      }
    );
    this.classiGoodsForm.controls['ligieLevel4'].valueChanges.subscribe(
      (dataLevel4: any) => {
        console.log(this.getRelevantTypeId(this.selectLevel4.data, dataLevel4));
      }
    );
  }

  getRelevantTypeId(arrayData: any, id: number): number {
    return arrayData.filter((x: any) => x.id == id)[0].relevantTypeId;
  }

  haveEightCharacters(value: string) {
    if (value.length === 8) {
    }
  }
}
