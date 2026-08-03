import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly apiUrl = 'http://localhost:8080/address';

  constructor(private readonly httpClient: HttpClient) {}

  getUserAddresses(userId: number): Observable<Address[]> {
    return this.httpClient.get<Address[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  createAddress(userId: number, address: Address): Observable<Address> {
    return this.httpClient.post<Address>(
      `${this.apiUrl}/create/${userId}`,
      address,
      {
        withCredentials: true,
      },
    );
  }

  updateAddress(
    userId: number,
    addressId: number,
    address: Address,
  ): Observable<Address> {
    return this.httpClient.put<Address>(
      `${this.apiUrl}/update/${userId}/${addressId}`,
      address,
      {
        withCredentials: true,
      },
    );
  }

  setDefaultAddress(userId: number, addressId: number): Observable<Address> {
    return this.httpClient.put<Address>(
      `${this.apiUrl}/default/${userId}/${addressId}`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  deleteAddress(userId: number, addressId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiUrl}/delete/${userId}/${addressId}`,
      {
        withCredentials: true,
      },
    );
  }
}
