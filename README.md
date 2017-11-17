# giftApp
a simple CRUD for creating wishlist of items that link to things you want or need

Web app using with javascript on server side
Use Meteor framework? (enabling mobile wep apps through cordova)

Saves user, wishlist and item data to SQL database using CRUD (Create Read Update Delete)

Databases
Users
Wishlists
Items

Functions
getUser [server side query done]

getWishlist (has list of item ids)

getItems (used by getWishlist to populate item data) 

updateWishlist (adds if new, updates if already exists)

updateItems (adds if new, updates if already exists)

updateUser (used for User creation/updates)

findItem (used to suggest items already created)

Functionality
Facebook user creation
Link users to Facebook friends
Buy items for others (will save that item has been bought locally maybe use paypal for transactions?)
