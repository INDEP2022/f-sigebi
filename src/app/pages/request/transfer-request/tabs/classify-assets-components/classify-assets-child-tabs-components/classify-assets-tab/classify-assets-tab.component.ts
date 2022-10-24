import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-classify-assets-tab',
  templateUrl: './classify-assets-tab.component.html',
  styles: [],
})
export class ClassifyAssetsTabComponent extends BasePage implements OnInit {
  @Input() assetsId: any = '';
  public classiGoodsForm: ModelForm<any>;

  public selectSection = new DefaultSelect<any>();
  public selectChapter = new DefaultSelect<any>();
  public selectLevel1 = new DefaultSelect<any>();
  public selectLevel2 = new DefaultSelect<any>();
  public selectLevel3 = new DefaultSelect<any>();
  public selectLevel4 = new DefaultSelect<any>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log(this.assetsId);
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
}
