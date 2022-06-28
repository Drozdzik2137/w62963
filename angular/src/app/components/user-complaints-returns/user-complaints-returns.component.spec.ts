import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';


import { UserComplaintsReturnsComponent } from './user-complaints-returns.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

describe('UserComplaintsReturnsComponent', () => {
  let component: UserComplaintsReturnsComponent;
  let fixture: ComponentFixture<UserComplaintsReturnsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserComplaintsReturnsComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserComplaintsReturnsComponent, { provide: ToastrService, useValue: ToastrService }],
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
