import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/category';

  constructor(private readonly httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${this.apiUrl}/create`, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(
      `${this.apiUrl}/update/${category.categoryId}`,
      category,
    );
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/delete/${categoryId}`, {
      responseType: 'text',
    });
  }
}
