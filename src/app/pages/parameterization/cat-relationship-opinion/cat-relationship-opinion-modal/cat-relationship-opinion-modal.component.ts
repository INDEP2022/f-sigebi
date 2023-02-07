import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//Models
import { IDictamen } from 'src/app/core/models/catalogs/dictamen.model';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
//Services

@Component({
  selector: 'app-cat-relationship-opinion-modal',
  templateUrl: './cat-relationship-opinion-modal.component.html',
  styles: [],
})
export class CatRelationshipOpinionModalComponent implements OnInit {
  rAsuntDicForm: ModelForm<IRAsuntDic>;
  rAsuntDic: IRAsuntDic;

  title: string = 'Dictamen';
  edit: boolean = false;

  id: IDictamen;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.rAsuntDicForm = this.fb.group({
      code: [null, [Validators.required]],
      dictum: [null, [Validators.required]],
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
    }
  }

  close() {
    this.modalRef.hide();
  }
}
