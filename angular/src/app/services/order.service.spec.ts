import { ICheckoutOrderResponseModel } from './../models/order.model';
import { environment } from './../../environments/environment.prod';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OrderService } from './order.service';
import { HttpClient } from '@angular/common/http';

describe('OrderService', () => {
  let service: OrderService;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    http = TestBed.inject(HttpClient)
  });

  describe('getSingleOrder', () => {
    describe('when request is successful', () => {
      const OrderParams = [{
        "order_id": 222,
        "brand": "Atomic",
        "id": "21",
        "img": "https://www.atomic.com/pl-pl/shop-emea/media/catalog/product/A/A/AA0029310__8f953ce4cb603f27a8ee7b37f4ff5007.png",
        "size": "test",
        "freshness": "Nowy",
        "name": "Nazwa A",
        "price": "99.99",
        "quantity": 1,
        "created_at": "2022-06-28T19:07:47.000Z",
        "total": "99.99",
        "status": "Dostarczono",
        "email": "admin@admin.pl"
      }]
      beforeEach(() => {
        spyOn(http, 'get').and.returnValue(of(OrderParams))
      })

      it('should make requet to api', () => {
        service.getSingleOrder(222);
        expect(http.get).toHaveBeenCalledWith(`${environment.SERVER_URL}/order/222`);
      })

      it('should return order', () => {
        service.getSingleOrder(222).subscribe(order => {
          // @ts-ignore
          expect(order).toEqual(OrderParams)
        })
      })
    });

    describe('when request is successful but user with these id not exist', () => {
      const response = {
        "message": "Error 404"
      }
      beforeEach(() => {
        spyOn(http, 'get').and.returnValue(of(response))
      });

      it('should be equal', () => {
        service.getSingleOrder(0).subscribe(order => {
          // @ts-ignore
          expect(order).toEqual(response);
        })
      })
    });
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
