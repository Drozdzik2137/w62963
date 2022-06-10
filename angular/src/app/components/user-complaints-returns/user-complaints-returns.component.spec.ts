import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComplaintsReturnsComponent } from './user-complaints-returns.component';

describe('UserComplaintsReturnsComponent', () => {
  let component: UserComplaintsReturnsComponent;
  let fixture: ComponentFixture<UserComplaintsReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserComplaintsReturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComplaintsReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
