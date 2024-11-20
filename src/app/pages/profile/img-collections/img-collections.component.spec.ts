import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCollectionsComponent } from './img-collections.component';

describe('ImgCollectionsComponent', () => {
  let component: ImgCollectionsComponent;
  let fixture: ComponentFixture<ImgCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgCollectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
