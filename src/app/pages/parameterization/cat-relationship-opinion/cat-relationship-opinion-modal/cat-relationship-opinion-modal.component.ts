import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//Models
import { IDictamen } from 'src/app/core/models/catalogs/dictamen.model';
import { IOpinion } from 'src/app/core/models/catalogs/opinion.model';
import {
  IRAsuntDic,
  IRAsuntDic1,
} from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services

@Component({
  selector: 'app-cat-relationship-opinion-modal',
  templateUrl: './cat-relationship-opinion-modal.component.html',
  styles: [],
})
export class CatRelationshipOpinionModalComponent
  extends BasePage
  implements OnInit
{
  rAsuntDicForm: ModelForm<IRAsuntDic>;
  rAsuntDic: IRAsuntDic1;

  title: string = 'Dictamen';
  edit: boolean = false;

  idAffair: IAffair;

  idDic: IDictamen;
  opinion: any;
  dictums = new DefaultSelect<IOpinion>();

  rAsuntDicValue: IOpinion;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rAsuntDicService: RAsuntDicService,
    private dictumService: OpinionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.rAsuntDicForm = this.fb.group({
      code: [null, []],
      dictum: [null, [Validators.required]],
      flyerType: [null, [Validators.required]],
      doc: [null, [Validators.required]],
      property: [null, [Validators.required]],
      g_of: [null, [Validators.required]],
      i: [null, [Validators.required]],
      e: [null, [Validators.required]],
      dictumData: [null, [Validators.required]],
    });
    if (this.rAsuntDic != null) {
      //this.id = this.rAsuntDic.dictum as unknown as IDictamen;
      console.log(this.rAsuntDic);
      this.edit = true;
      this.opinion = this.rAsuntDic.dictumData;
      //let dictum1: IRAsuntDic1 = this.opinion.id as IRAsuntDic1;
      //this.dictums = new DefaultSelect([dictum1], 1);
      this.rAsuntDicForm.patchValue(this.rAsuntDic);
      this.rAsuntDicForm.controls['dictumData'].setValue(this.opinion.id);
      this.rAsuntDicForm.controls['dictumData'].disable();
      this.rAsuntDicForm.controls['flyerType'].disable();
    }
    this.rAsuntDicForm.controls['code'].setValue(this.idAffair.id);
    setTimeout(() => {
      this.getDictum(new ListParams());
    }, 1000);
  }

  getDictum(params: ListParams) {
    this.dictumService.getAll(params).subscribe({
      next: data => {
        this.dictums = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.dictums = new DefaultSelect();
      },
    });
  }

  //Al seleccionar un item del select dinámico se autorellenan los inputs siguientes
  onValuesChange(rAsuntDicChange: IOpinion) {
    console.log(rAsuntDicChange);
    this.rAsuntDicValue = rAsuntDicChange;
    this.rAsuntDicForm.controls['dictum'].setValue(rAsuntDicChange.id);

    //this.dictums = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rAsuntDicService.create(this.rAsuntDicForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert('warning', 'El código o el tipo de volante no existe', ``);
      },
    });
  }

  update() {
    this.loading = true;
    let form = {
      code: this.rAsuntDicForm.controls['code'].value,
      dictum: this.rAsuntDicForm.controls['dictumData'].value,
      flyerType: this.rAsuntDicForm.controls['flyerType'].value,
      doc: this.rAsuntDicForm.controls['doc'].value,
      property: this.rAsuntDicForm.controls['property'].value,
      g_of: this.rAsuntDicForm.controls['g_of'].value,
      i: this.rAsuntDicForm.controls['i'].value,
      e: this.rAsuntDicForm.controls['e'].value,
    };

    this.rAsuntDicService
      .update(this.rAsuntDic.registryNumber, this.rAsuntDicForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
