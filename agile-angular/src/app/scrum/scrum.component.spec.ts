import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumComponent } from './scrum.component';

describe('ScrumComponent', () => {
  let component: ScrumComponent;
  let fixture: ComponentFixture<ScrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
