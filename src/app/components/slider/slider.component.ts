import {Component, Input, OnInit} from '@angular/core';

import {PercentsEnum} from '../../@core/enums/percents.enum';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {
  @Input() imageUrls: string[] = [];

  private progressMax!: number;
  private slideInterval!: number;
  private eachImageWidth!: number;
  private dragStarted: boolean = false;
  private timeoutCoefficient: number = 1;
  private timeoutChanged: boolean = false;
  private percents: typeof PercentsEnum = PercentsEnum;

  public index = 0;
  public speed: number = 2;
  public paused: boolean = false;
  public progressWidth: number = 0;

  ngOnInit() {
    this.setAndRunSlider();
  }

  private setAndRunSlider(): void {
    if (this.imageUrls?.length) {
      this.eachImageWidth = this.progressMax = this.percents.MAX / this.imageUrls?.length;
      this.runSlider();
    }
  }

  private runSlider(): void {
    this.slideInterval = setInterval(() => {
      this.progressWidth += .05;
      this.changeImages();
      this.endSlider();
      this.setTimeoutCoefficient();
    }, (this.speed * 1000 * .05 * this.timeoutCoefficient) / this.eachImageWidth);
  }

  private changeImages(): void {
    if (this.progressWidth >= this.progressMax) {
      this.index = this.imageUrls[this.index+1] ? ++this.index : this.index;
      this.progressMax += this.eachImageWidth;
    }
  }

  private endSlider(): void {
    if (this.progressWidth >= this.percents.MAX) {
      this.progressWidth = this.percents.MAX;
      this.pause();
    }
  }

  private setTimeoutCoefficient(): void {
    if (this.timeoutChanged) {
      this.timeoutCoefficient = 1;
      this.timeoutChanged = false;
      this.restartInterval();
    }
    this.timeoutChanged = this.timeoutCoefficient != 1;
  }

  private restartInterval(): void {
    if (!this.paused) {
      clearInterval(this.slideInterval);
      this.runSlider();
    }
  }

  public changeSpeed(e: any): void {
    this.speed = +e.target.value;
    this.restartInterval();
  }

  public pause(): void {
    if (!this.dragStarted) {
      this.paused = !this.paused;
      if (this.paused) {
        clearInterval(this.slideInterval);
      } else {
        if (this.progressWidth === this.percents.MAX) {
          this.progressWidth = this.percents.MIN;
          this.index = 0;
        }

        this.runSlider();
      }
    }
  }

  public dragStart(): void {
    this.dragStarted = true;
    clearInterval(this.slideInterval);
  }

  public changeProgressWidth(progressWidth: number): void {
    this.progressWidth = progressWidth;
    const movePercent: number = this.progressWidth / this.eachImageWidth;
    this.index = Math.floor(movePercent);
    this.progressMax = this.index * this.eachImageWidth || this.eachImageWidth;
    this.timeoutCoefficient = movePercent % 1;
  }

  public dragEnd(): void {
    this.dragStarted = false;
    this.restartInterval();
  }
}
