import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPopupComponent } from './collection-popup.component';

describe('CollectionPopupComponent', () => {
  let component: CollectionPopupComponent;
  let fixture: ComponentFixture<CollectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
