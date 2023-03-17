import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//Models
import { IDictamen } from 'src/app/core/models/catalogs/dictamen.model';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
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
  rAsuntDic: IRAsuntDic;

  title: string = 'Dictamen';
  edit: boolean = false;

  idAffair: IAffair;

  id: IDictamen;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rAsuntDicService: RAsuntDicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.rAsuntDicForm = this.fb.group({
      code: [null, []],
      dictum: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      flyerType: [null, [Validators.required]],
      doc: [null, [Validators.required]],
      property: [null, [Validators.required]],
      g_of: [null, [Validators.required]],
      i: [null, [Validators.required]],
      e: [null, [Validators.required]],
    });
    if (this.rAsuntDic != null) {
      this.id = this.rAsuntDic.dictum as unknown as IDictamen;
      this.edit = true;
      this.rAsuntDicForm.patchValue(this.rAsuntDic);
      this.rAsuntDicForm.controls['dictum'].setValue(this.id.id);
    } else {
      this.edit = false;
      this.rAsuntDicForm.controls['code'].setValue(this.idAffair.id);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rAsuntDicService.create(this.rAsuntDicForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
