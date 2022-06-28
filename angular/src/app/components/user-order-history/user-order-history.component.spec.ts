import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserOrderHistoryComponent } from "./user-order-history.component";
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

describe('UserOrderHistoryComponent', () => {
  let component: UserOrderHistoryComponent;
  let fixture: ComponentFixture<UserOrderHistoryComponent>;
  let http: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrderHistoryComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxPaginationModule],
      providers: [{ provide: ToastrService, useValue: ToastrService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.inject(HttpClient)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
