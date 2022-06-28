import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserOrderDetailsComponent } from './user-order-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

describe('UserOrderDetailsComponent', () => {
  let component: UserOrderDetailsComponent;
  let fixture: ComponentFixture<UserOrderDetailsComponent>;
  let http: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrderDetailsComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserOrderDetailsComponent, { provide: ToastrService, useValue: ToastrService }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.inject(HttpClient)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
