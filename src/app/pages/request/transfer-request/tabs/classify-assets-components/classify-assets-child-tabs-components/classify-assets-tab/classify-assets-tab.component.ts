import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
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
  public classiGoodsForm: ModelForm<any>;
  private bsModalRef: BsModalRef;

  public selectSection = new DefaultSelect<any>();
  public selectChapter = new DefaultSelect<any>();
  public selectLevel1 = new DefaultSelect<any>();
  public selectLevel2 = new DefaultSelect<any>();
  public selectLevel3 = new DefaultSelect<any>();
  public selectLevel4 = new DefaultSelect<any>();

  detailArray: any = {};

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc == '') {
      if (changes['assetsId'].currentValue != '') {
        //cargar la clasificacion de bienes segun el id que se envio
      }
    }
  }

  initForm() {
    this.classiGoodsForm = this.fb.group({
      section: [null],
      chapter: [null],
      level1: [null],
      level2: [null],
      level3: [null],
      level4: [null],
    });
  }

  getSection(event: any) {
    /* this.delegationService.getZones(params).subscribe({
      next: data => (this.selectSection = new DefaultSelect(data.data, data.count)),
    }); */
  }

  getChapter(event: any) {}

  getLevel1(event: any) {}

  getLevel2(event: any) {}

  getLevel3(event: any) {}

  getLevel4(event: any) {}

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

  saveRequest(): void {}
}
