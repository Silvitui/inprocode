import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/shared/navbar/navbar.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,NavbarComponent,FooterComponent,NgOptimizedImage],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  imageLoaded = false;

}
