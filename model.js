module.exports = class Wishlist {
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

module.exports = class Item {
	constructor(id, name, description, imageLink, pageLink, price){
	this.id = id;
	this.name = name;
	this.description = description;
	this.imageLink = imageLink;
	this.pageLink = pageLink;
	this.price = price;
	}
}
