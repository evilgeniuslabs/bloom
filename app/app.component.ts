import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
})

export class AppComponent implements OnInit {
  public constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("FastLED Photon DemoReel")
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
