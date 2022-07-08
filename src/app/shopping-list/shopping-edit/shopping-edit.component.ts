import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('name') name!: ElementRef;
  @ViewChild('amount') amount!: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {}
  onSubmit(e: NgForm) {
    console.log(e,"e");
    
    const name = this.name.nativeElement.value;
    const amount = this.amount.nativeElement.value;

    this.shoppingListService.addItem(new Ingredient(name, amount));
  }
}
