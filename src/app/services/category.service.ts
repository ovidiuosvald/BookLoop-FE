import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl: string = 'http://localhost:8080/category';

  constructor(private httpClient: HttpClient) {}

  getAllCategoriesUsingGET(): Observable<Category[]> {
    return this.httpClient.get(`${this.baseUrl}`) as Observable<Category[]>;
  }

  createCategoryUsingPOST(category: Category): Observable<Category> {
    return this.httpClient.post(
      `${this.baseUrl}/create`,
      category
    ) as Observable<Category>;
  }

  updateCategoryUsingPUT(category: Category): Observable<Category> {
    return this.httpClient.put(
      `${this.baseUrl}/update/${category.categoryId}`,
      category
    ) as Observable<Category>;
  }

  deleteCategoryUsingDELETE(categoryId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${categoryId}`);
  }
}
