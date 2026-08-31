export interface Product {
  id:             string;
  name:           string;
  nameEN?:        string;
  description:    string;
  descriptionEN?: string;
  price:          number;
  priceOld?:      number;
  currency:       string;
  amount:         string;
  amountEN?:      string;
  image?:         string;
  badge?:         string;
  discount?:      number;
  region?:        string;
}

export interface GameOffer {
  label:         string;
  labelEN?:      string;
  description:   string;
  descriptionEN?:string;
}

export interface Game {
  id:       string;
  name:     string;
  slug:     string;
  image:    string;
  banner?:  string;
  category: string;
  tags?:    string[];
  popular?:  boolean;
  featured?: boolean;
  offer?:    GameOffer;
  products:  Product[];
}

export interface Category {
  id:      string;
  name:    string;
  nameEN?: string;
  slug:    string;
  icon:    string;
  color:   string;
}

export type StoreItemType = "game" | "giftcard" | "pin" | "subscription";

export interface StoreItem {
  id:       string;
  type:     StoreItemType;
  name:     string;
  slug:     string;
  image:    string;
  category: string;
  tags?:    string[];
  popular?:  boolean;
  featured?: boolean;
  offer?:    GameOffer;
  products:  Product[];
}