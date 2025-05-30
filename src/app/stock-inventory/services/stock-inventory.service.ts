import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {Branch, Item, Product} from '../models/product.interface';


@Injectable({
  providedIn: 'root'
})
export class StockInventoryService{

  constructor(private http: HttpClient) {
  }

  getCartItems(): Observable<Item[]>{
    return this.http.get<Item[]>('http://localhost:3000/cart');
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  checkBranchId(id: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('id', id);

    return this.http.get<Branch[]>('http://localhost:3000/branches', {
      responseType: 'json',
      params
    }).pipe(
      tap((res: Branch[]) => console.log('HTTP response:', res)),
      map((res: Branch[]) => {
        // Aquí defines tu lógica, por ejemplo, si la lista no está vacía
        return res.length > 0;
      }),
      catchError((err: any) => {
        // Manejo de error y retorno de valor por defecto
        console.error('Error en checkBranchId', err);
        return of(false);  // <-- Esto soluciona el error de tipos
      })
    );
  }

}
