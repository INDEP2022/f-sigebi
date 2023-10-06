import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import {
  FilePhotoService,
  IHistoricalPhoto,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { GoodPhotosService } from '../services/good-photos.service';

@Component({
  selector: 'app-photos-historic',
  templateUrl: './photos-historic.component.html',
  styleUrls: ['./photos-historic.component.scss'],
})
export class PhotosHistoricComponent implements OnInit {
  singleSlideOffset = true;
  noWrap = true;

  // slides = [
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-frontSidePilotNear-1663797326136.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-front-1663797338664.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-frontSideCopilot-1663797361668.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-pilotRim-1663797207371.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-openDoorPilot-1663797159535.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-console-1663797010209.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-openTrunk-1663797109010.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-backSeatCopilot-1663797095691.jpeg?d=756x434',
  //   },
  // ];
  files: IHistoricalPhoto[] = [];
  @Input() goodNumber: string;
  @Input() set refreshData(value: number) {
    // this._goodNumber = value;
    if (value > 0) {
      this.getData();
    } else {
      this.files = [];
    }
  }
  slides: { image: string; usuarioElimina: string }[] = [];
  constructor(
    // private modalRef: BsModalRef,
    private service: FilePhotoService,
    private goodPhotoService: GoodPhotosService
  ) {}

  ngOnInit() {
    this.goodPhotoService.deleteEvent.subscribe({
      next: response => {
        if (response) {
          this.getData();
        }
      },
    });
  }

  private getData() {
    if (this.goodNumber) {
      this.service
        .getAllHistoric(this.goodNumber)
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response) {
              this.files = [...response];
            }
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['goodNumber']) {
      this.getData();
    }
  }

  // close() {
  //   this.modalRef.hide();
  // }
}
