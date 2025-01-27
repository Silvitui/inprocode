import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticComponent } from './estatistic.component';

describe('EstatisticComponent', () => {
  let component: EstatisticComponent;
  let fixture: ComponentFixture<EstatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
