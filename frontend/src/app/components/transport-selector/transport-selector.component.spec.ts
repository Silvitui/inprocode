import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSelectorComponent } from './transport-selector.component';

describe('TransportSelectorComponent', () => {
  let component: TransportSelectorComponent;
  let fixture: ComponentFixture<TransportSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
