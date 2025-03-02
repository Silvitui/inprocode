import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteModalComponent } from './edit-delete-modal.component';

describe('EditDeleteModalComponent', () => {
  let component: EditDeleteModalComponent;
  let fixture: ComponentFixture<EditDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
