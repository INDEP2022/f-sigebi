import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-c-p-c-cat-relationship-opinion',
  templateUrl: './c-p-c-cat-relationship-opinion.component.html',
  styles: [],
})
export class CPCCatRelationshipOpinionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedAffair: any = null;
  affairItems = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getAffair({ inicio: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      idAffair: [null, [Validators.required]],
    });
  }

  data: any[] = [
    {
      id: 'PUESTA A DISPOSICIÓN',
    },
    {
      id: 'DEVOLUCIÓN DE BIENES ASEGURADOS',
    },
    {
      id: 'AMPARO CONTRA EL SAE',
    },
  ];

  getAffair(params: ListParams) {
    if (params.text == '') {
      this.affairItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.affairItems = new DefaultSelect(item[0], 1);
    }
  }

  selectAffair(event: any) {
    this.selectedAffair = event;
  }
}
