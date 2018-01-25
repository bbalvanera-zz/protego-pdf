import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public fileName = '';

  public ngOnInit() {
    this.fileName = 'Arrastre aqui su archivo o de clic en Examinar';
  }
}
