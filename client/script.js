class Wishlist {
	constructor(id, name, owner, items){
		this.id = id;
		this.name = name;
		this.owner = owner;
		this.items = this.getItems(items);
	}
	getItems(items){
	//takes a list of items(which details are a list) returns a list of Item objects
	//indexes of items 0:id, 1:name, 2:Description, 3:imageLink, 4:pageLink, 5:price
		let listOfItems = [];
		let count = 0;
		items.forEach(function(item){
			count = 0;
			let currentItem = new Item("0","0","0","0","0","0");
			item.forEach(function(itemPart){
				if (count === 0){
					currentItem.id = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				if (count === 1){
					currentItem.name = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				if (count === 2){
					currentItem.description = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				if (count === 3){
					currentItem.imageLink = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				if (count === 4){
					currentItem.pageLink = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				if (count === 5){
					currentItem.price = itemPart;
					//console.log("Count: "+count);
					//console.log("itemPart: "+itemPart);
				}
				count++;
			});
			listOfItems.push(currentItem);
		});
		return listOfItems;
	}
}

class Item {
	constructor(id, name, description, imageLink, pageLink, price){
	this.id = id;
	this.name = name;
	this.description = description;
	this.imageLink = imageLink;
	this.pageLink = pageLink;
	this.price = price;
	}
}

const testWishlist = new Wishlist("1","Test List", "Tester", [['1','stuff','some stuff','www.test.com/stuff/img.jpg','www.test.com/stuff','$4.99'],['2','things','some things','www.test.com/things/img.jpg','www.test.com/things','$27.99']]);

function getWishlist(form) {
		let wishlistName = form.wishlistName.value;
		let wishlist = testWishlist;
		document.getElementById("name").innerHTML=wishlist.name;
		document.getElementById("owner").innerHTML="By "+wishlist.owner;
		let items = wishlist.items;
		let itemHtml = ""
		items.forEach(function(element){
			itemHtml+="<tr>"
			itemHtml+="<td>"+element.name+"</td>";
			itemHtml+="<td>"+element.description+"</td>";
			itemHtml+="<td>"+element.imageLink+"</td>";
			itemHtml+="<td>"+element.pageLink+"</td>";
			itemHtml+="<td>"+element.price+"</td>";
			itemHtml+="</tr>"
		});
		document.getElementById("data").innerHTML=itemHtml
		
}
