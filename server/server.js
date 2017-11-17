var mysql = require('mysql');

/*var connection = mysql.createConnection({
  host: "localhost",
  user: "bear",
  password: "s012515",
	database: "mydb"
});*/

var pool = mysql.createPool({
	connectionLimit : 100,
	host: 'localhost',
	user: 'root',
	password:'s012515',
	database: 'mydb',
	debug:false
	});



function sqlQuery(query){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			pool.getConnection(function(err,connection){
				if (err) {
					re.json({"code":100, "status" : "Error in connection database"});
					return;
				}	
				console.log('connected as id ' + connection.threadId);

				connection.query(query, function(err, rows, fields) {
				connection.release();
				if (err) {
					reject(new Error("no results were found!"));
				} else {
					resolve(rows);
				}
				})
			})
			
		}, 2000);
	});
};

async function getUser (id){
	// takes a string of user id, callback sets x to returned data
	let sql = "SELECT * FROM users WHERE id = "+id;
	let data = await sqlQuery(sql);
	console.log(data);
	return data;
}

//getUser('1');

var Item = require('./model.js');
var Wishlist = require('./model.js');



async function getWishlist(id){
	//takes wishlist id returns wishlist item, calls getItem to populate items
	let sql = "SELECT * FROM wishlists WHERE id = "+id;
	let wishlist = await sqlQuery(sql);
	wishlist=wishlist[0];
	let items = wishlist.items;
	items=items.split(',');
	await Promise.all(items.map(async (item) => {
    const contents = await getItem(item);
    console.log(contents)
  }));
	let itemsI=[];
	//itemsI.push(item);
	
	//wishlist = new Wishlist(wishlist.id,wishlist.name,wishlist.description,items,wishlist.owner)
	console.log(wishlist);
	return wishlist;
}

getWishlist('1');

async function getItem(id){
	let sql = "SELECT * FROM items WHERE id = "+id;
	let item = await sqlQuery(sql);
	item = new Item(item[0].id,item[0].name,item[0].description,item[0].itemLink,item[0].imageLink,item[0].price);
	console.log(item);
	return item;
}

//getItem('1');

async function updateItem(id,name,description,itemLink,imageLink,price){
	let sql = "UPDATE items SET id="+id+",name='"+name+"',description='"+description+"',itemLink='"+itemLink+"',imageLink='"+imageLink+"',price='"+price+"';";
	//console.log (sql);
	sqlQuery(sql);
}
//updateItem('3','Joey','A baby kangaroo soft plush','www.straya.com/joey','www.straya.com/joey.img','$15');
//getItem('3');

/*
getItems (used by getWishlist to populate item data) 
updateWishlist (adds if new, updates if already exists)
updateItems (adds if new, updates if already exists)
updateUser (used for User creation/updates)
findItem (used to suggest items already created)
*/

//myQuery = "";
//sqlQuery(myQuery, callback);

//sqlQuery('DESCRIBE users;',callback);
//sqlQuery('DESCRIBE wishlists;',callback);
//sqlQuery('DESCRIBE items;',callback);




