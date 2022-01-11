import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {IImagesData} from './@core/interfaces/IImage';
import {ImagesService} from './@core/services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  public imageUrls!: string[];

  constructor(private imagesService: ImagesService) {}

  ngOnInit() {
    this.getImages();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private getImages(): void {
    this.subscription = this.imagesService.getImages().subscribe((res: IImagesData) => {
      this.imageUrls = res?.images;
    });
  }
}
