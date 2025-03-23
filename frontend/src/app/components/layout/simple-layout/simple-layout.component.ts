import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-simple-layout',
  imports: [RouterOutlet],
  templateUrl: './simple-layout.component.html',
  styleUrl: './simple-layout.component.scss'
})
export class SimpleLayoutComponent {
  imageLoaded = false;
}

