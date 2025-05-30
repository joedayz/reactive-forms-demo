export interface Product{
  id: string | number;
  price: number,
  name: string
}

export interface Item{
  product_id: number,
  quantity: number
}


export interface Branch {
  id: number;
  name: string;
}
