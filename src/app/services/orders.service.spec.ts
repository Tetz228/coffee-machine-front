import {TestBed} from '@angular/core/testing';

import {OrdersService} from './orders.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {Bills} from "../models/bills";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {AppConfigService} from "../../config/app-config.service";
import {Coffee} from "../models/coffee";
import {User} from "../models/user";
import {UsersService} from "./users.service";
import {AuthService} from "./auth.service";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {tokenGetter} from "../app.module";
import {AppConfig} from "../../config/app-config";
import {Router} from "@angular/router";

/**
 * Тестирование сервиса для работы с заказами.
 */
describe('OrdersService', () => {
  let ordersService: OrdersService;
  let usersService: UsersService;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let jwtSpy: Spy<JwtHelperService>;
  let httpSpy: Spy<HttpClient>;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Router, JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:7150"],
          disallowedRoutes: []
        }
      }),],
      providers: [OrdersService, AuthService, JwtHelperService, UsersService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });

    jwtSpy = TestBed.inject<any>(JwtHelperService);
    httpSpy = TestBed.inject<any>(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    authService = new AuthService(httpSpy, jwtSpy);
    usersService = new UsersService(httpSpy, jwtSpy, authService, fakeAppConfigService as AppConfigService, router);
    ordersService = new OrdersService(httpSpy, usersService, fakeAppConfigService as AppConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование создания нового заказа.
   */
  describe('makeOrder(user: IUser, coffee: ICoffee)', () => {
    const dummyCoffee: Coffee = {
      id: 'cafd8e82-c3a6-4edf-bbe4-e99bf900fc24',
      name: 'Американо',
      price: 500
    };
    const dummyUser: User =
      {
        id: '79714968-dd8b-4073-b6be-23dfabecc51d',
        login: 'egor159',
        password: 'qwerty',
        name: 'Егор',
        balance: 1500
      };
    const dummyChange = new Map<Bills, number>();
    dummyChange.set(Bills.fiveHundred, 1);

    it('should return changes', () => {
      httpSpy.post.and.nextWith(dummyChange);

      ordersService.makeOrder(dummyUser, dummyCoffee).subscribe((changes) =>
        expect(changes).toEqual(dummyChange));

      expect(httpSpy.post.calls.count()).toBe(1);
    });
  });
});
