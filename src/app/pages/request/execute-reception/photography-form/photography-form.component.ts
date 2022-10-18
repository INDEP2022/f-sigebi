import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHOTOGRAPHY_COLUMNS } from './photography-columns';

@Component({
  selector: 'app-photography-form',
  templateUrl: './photography-form.component.html',
  styles: [],
})
export class PhotographyFormComponent extends BasePage implements OnInit {
  override settings = { ...TABLE_SETTINGS, actions: false };
  imagesData: any[] = [];
  showForm: boolean = false;
  photographyForm: FormGroup = new FormGroup({});

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings.columns = PHOTOGRAPHY_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.photographyForm = this.fb.group({
      managementNumber: [5296016],
      noProgrammation: [null],
      noImage: [null],
      author: [null],
      titleImage: [null],
      noPhotography: [null],
      text: [null],
      programmingFolio: [null],
    });
  }

  viewImage() {}

  uploadPhotography() {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
