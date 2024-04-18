import { Component, OnInit } from '@angular/core';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-photo-fav',
  templateUrl: './photo-fav.component.html',
  styles: [],
})
export class PhotoFavComponent extends BasePage implements OnInit {
  files: any;
  constructor(private filePhotoService: FilePhotoService) {
    super();
  }

  ngOnInit(): void {}

  private getData(val?: boolean) {
    // this.files = [];
    // this.filePhotoService
    //   .getAll(this.goodNumber + '')
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe({
    //     next: response => {
    //       if (response) {
    //         let result = response.map(async item => {
    //         })
    //         Promise.all(result).then(resp =>{
    //           this.files = [...response]
    //         })
    //       }
    //     },
    //     error: err => {
    //       if (val) this.alert('warning', 'No se encontraron fotos', '');
    //     },
    //   });
  }
}
