import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transport-selector',
  templateUrl: './transport-selector.component.html',
  styleUrls: ['./transport-selector.component.scss']
})
export class TransportSelectorComponent {
  @Output() transportSelected = new EventEmitter<string>();

  selectTransport(mode: string) {
    this.transportSelected.emit(mode);
  }
}
