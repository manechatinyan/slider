import {Subscription} from 'rxjs';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {IImagesData} from '../../@core/interfaces/IImage';
import {PercentsEnum} from '../../@core/enums/percents.enum';
import {ImagesService} from '../../@core/services/images.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit, OnDestroy {
  @ViewChild('progress') progressEl!: ElementRef;

  private progressMax!: number;
  private sliderTimout!: number;
  private eachImageWidth!: number;
  private progressInterval!: number;
  private subscription!: Subscription;
  private dragStarted: boolean = false;
  private timeoutCoefficient: number = 1;
  private timeoutChanged: boolean = false;
  private percents: typeof PercentsEnum = PercentsEnum;

  public index = 0;
  public speed: number = 2;
  public imageUrls!: string[];
  public paused: boolean = false;
  public progressWidth: number = 0;

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
      this.eachImageWidth = this.progressMax = this.percents.MAX / this.imageUrls?.length;
      this.runSlider();
      this.setProgressWidth();
    });
  }

  private runSlider(): void {
    this.sliderTimout = setTimeout(() => {
      this.index = this.imageUrls[this.index+1] ? ++this.index : this.index;
      this.paused || this.runSlider();
    }, this.speed * 1000);
  }

  private setProgressWidth(): void {
    this.progressInterval = setInterval(() => {
      this.progressWidth += .05;
      if (this.progressWidth >= this.percents.MAX) {
        this.progressWidth = this.percents.MAX;
        this.pause();
      }
      this.setTimeoutCoefficient();
    }, (this.speed * 1000 * .05 * this.timeoutCoefficient) / this.eachImageWidth);
  }

  private setTimeoutCoefficient(): void {
    if (this.timeoutChanged) {
      this.timeoutCoefficient = 1;
      this.timeoutChanged = false;
      this.restartInterval();
    }
    this.timeoutChanged = this.timeoutCoefficient != 1;
  }

  private changeProgressWidth(e: any): void {
    const progressElRect: DOMRect = this.progressEl.nativeElement.getBoundingClientRect();
    this.progressWidth = this.setWidthByRange(e, progressElRect);
  }

  private setWidthByRange(e: any, rect: DOMRect): number {
    if (e.clientX >= rect.right) {
      return this.percents.MAX;
    }
    if (e.clientX <= rect.left) {
      return this.percents.MIN;
    }
    return (e.clientX - rect.left) / rect.width * 100;
  }

  private restartInterval(): void {
    clearInterval(this.progressInterval);
    this.paused || this.setProgressWidth();
  }

  public changeSpeed(e: any): void {
    this.speed = +e.target.value;
    clearInterval(this.progressInterval);
    this.setProgressWidth();
  }

  public pause(): void {
    if (!this.dragStarted) {
      this.paused = !this.paused;
      if (this.paused) {
        clearTimeout(this.sliderTimout);
        clearInterval(this.progressInterval);
      } else {
        if (this.progressWidth === this.percents.MAX) {
          this.progressWidth = this.percents.MIN;
          this.index = 0;
        }

        this.runSlider();
        this.setProgressWidth();
      }
    }
  }

  public moveSlider(e: Event): void {
    if (this.dragStarted) {
      this.changeProgressWidth(e);
      const movePercent: number = this.progressWidth / this.eachImageWidth;
      this.index = Math.floor(movePercent);
      this.timeoutCoefficient = movePercent % 1;
    }
  }

  public dragStart(e: Event): void {
    this.dragStarted = true;
    clearInterval(this.progressInterval);
    this.moveSlider(e);
    const eventListener = (e: Event) => {
      e.stopPropagation();
      this.moveSlider(e);
    };
    document.addEventListener('mousemove', eventListener);
    document.addEventListener('mouseup', (e: Event) => {
      this.dragEnd(e);
      document.removeEventListener('mousemove', eventListener);
    });
  }

  public dragEnd(e: Event): void {
    e.stopPropagation();
    this.restartInterval();
    this.dragStarted = false;
  }
}
