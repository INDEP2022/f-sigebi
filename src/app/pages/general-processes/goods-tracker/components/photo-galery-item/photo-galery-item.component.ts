import { Component, Input, OnInit } from '@angular/core';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';

const LOADING_GIF = 'assets/images/loader-button.gif  ';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
@Component({
  selector: 'photo-galery-item',
  templateUrl: './photo-galery-item.component.html',
  styles: [],
})
export class PhotoGaleryItemComponent implements OnInit {
  @Input() good: ITrackedGood = null;
  imgSrc: string = null;
  constructor(private filePhotoService: FilePhotoService) {}

  ngOnInit(): void {
    this.imgSrc = LOADING_GIF;
    this.filePhotoService.getAll(this.good.goodNumber).subscribe({
      next: res => {
        console.log(res);
        if (!res.length) {
          this.imgSrc = NO_IMAGE_FOUND;
          return;
        }
        const last = res.at(-1);
        const filename = last.split('.')[0];
        const consec = filename.substring(filename.length - 4);
        this.filePhotoService
          .getById(this.good.goodNumber, Number(consec))
          .subscribe({
            next: res => {
              this.imgSrc = `data:image/png;base64, ${res}`;
            },
            error: () => {
              this.imgSrc = NO_IMAGE_FOUND;
            },
          });
      },
      error: error => {
        this.imgSrc = NO_IMAGE_FOUND;
      },
    });
  }
}
