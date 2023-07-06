import { Component, Input, OnInit } from '@angular/core';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';

const LOADING_GIF = 'assets/images/loader-button.gif  ';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
@Component({
  selector: 'photo-galery-item',
  templateUrl: './photo-galery-item.component.html',
  styles: [
    `
      .info {
        max-height: 200px;
        min-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .labe-circle-red {
        border-radius: 4px;
        background-color: rgba(157, 36, 73, 0.6);
      }
      .labe-circle-turq {
        border-radius: 4px;
        background-color: rgb(23, 162, 184, 0.53);
      }
      .labe-circle-green {
        border-radius: 4px;
        background-color: rgb(30, 126, 52, 0.66);
      }
      .labe-circle-lime {
        border-radius: 4px;
        background-color: rgb(34, 174, 66, 0.66);
      }
      .labe-circle-purple {
        border-radius: 4px;
        background-color: rgb(139, 8, 176, 0.55);
      }
      .labe-circle-gray {
        border-radius: 4px;
        background-color: rgb(120, 130, 134, 0.55);
      }
      .labe-circle-silver {
        border-radius: 4px;
        background-color: rgb(120, 130, 134, 0.55);
      }
      .labe-circle-blue {
        border-radius: 4px;
        background-color: rgb(50, 164, 216, 0.55);
      }
    `,
  ],
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
