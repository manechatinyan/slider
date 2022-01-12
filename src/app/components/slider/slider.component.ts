import {Component, Input, OnInit} from '@angular/core';

import {ISettings} from '../../@core/interfaces/IImage';
import {StatusEnum} from '../../@core/enums/status.enum';
import {PercentsEnum} from '../../@core/enums/percents.enum';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {
  @Input() imageUrls: string[] = [];
  @Input() settings: ISettings = {
    speed: 2,
    index: 0,
    speedCoefficient: .05
  } as ISettings;

  private slideTimeout!: number;
  private eachImageWidth!: number;
  private dragStarted: boolean = false;
  private statusEnum: typeof StatusEnum = StatusEnum;
  private percents: typeof PercentsEnum = PercentsEnum;

  public paused: boolean = false;
  public progressWidth: number = 0;
  public status: string = this.statusEnum.RUNNING;

  ngOnInit() {
    this.setAndRunSlider();
  }

  private setAndRunSlider(): void {
    if (this.imageUrls?.length) {
      this.eachImageWidth = this.percents.MAX / this.imageUrls?.length;
      this.runSlider();
    }
  }

  private runSlider(coefficient: number = 1): void {
    this.slideTimeout = setTimeout(() => {
      this.progressWidth += this.settings.speedCoefficient;
      this.progressWidth >= (this.settings.index + 1) * this.eachImageWidth && ++this.settings.index;
      this.checkStatus();
    }, (this.settings.speed * 1000 * this.settings.speedCoefficient * coefficient) / this.eachImageWidth);
  }

  private checkStatus(): void {
    this.status = this.getStatus();

    switch (this.status) {
      case StatusEnum.RUNNING:
        this.runSlider(1);
        break;
      case StatusEnum.PAUSED:
        clearTimeout(this.slideTimeout);
        break;
      case StatusEnum.FINISHED:
        this.finishSlider();
        break;
      default:
        this.runSlider(1);
    }
  }

  private getStatus(): string {
    if (this.paused) {
      return this.statusEnum.PAUSED;
    }
    if (this.progressWidth >= this.percents.MAX) {
      return this.statusEnum.FINISHED;
    }
    return this.statusEnum.RUNNING;
  }

  private finishSlider(): void {
    this.progressWidth = this.percents.MIN;
    this.settings.index = 0;
    this.pause();
  }

  private restartSlider(coefficient?: number): void {
    if (!this.paused) {
      clearTimeout(this.slideTimeout);
      this.runSlider(coefficient);
    }
  }

  public changeSpeed(e: any): void {
    this.settings.speed = +e.target.value;
    this.restartSlider();
  }

  public pause(): void {
    if (!this.dragStarted) {
      this.paused = !this.paused;
      this.checkStatus();
    }
  }

  public dragStart(): void {
    this.dragStarted = true;
    clearTimeout(this.slideTimeout);
  }

  public changeProgressWidth(progressWidth: number): void {
    this.progressWidth = progressWidth;
    this.settings.index = Math.floor(this.progressWidth / this.eachImageWidth);
  }

  public dragEnd(): void {
    this.dragStarted = false;
    this.restartSlider(this.progressWidth / this.eachImageWidth % 1);
  }
}
