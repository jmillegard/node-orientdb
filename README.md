# node-orientdb
A Node REST API for interacting with OrientDB graph model.

The goal of this project is to create a Node.js API for interacting
with an OrientDB graph structure. The example that I will use is a simple 
social graph where there are users that can like and dislike other users.
In this system, users are represented as nodes and relations (like or dislike) are edges.
I will begin with the OrientDB setup. OrientDB is a NoSQL database that advertises 
itself as a multi-model system. They provide data modeling using document model,
key-value pair model, object model, and graph model. This project uses the
graph model. After downloading OrientDB from their site and running the server,
the following commands were used from the console to build the basic schema.

OrientDB Graph Modeling:
```
create class User extends V
create property User.name string
create property User.age integer
create class Relation extends E
create property Relation.created_at datetime
create class Like extends Relation
create class Dislike extends Relation
```

Now, to Node. I decided to use Node.js (0.12.5) and the express framework because it
is useful for building JSON APIs to interact with databases (mongo, cassandra, 
couch, etc.). There is also a great library (oriento) for Node-OrientDB connectivity which
I wanted to try. The API functions that I implemented are listed below (should be self-explanatory).

```
GET /users/ - Returns all users.
GET /users/:user_id/
GET /users/:user_id/liked_users
GET /users/:user_id/disliked_users
POST /users/ - creates a User.
POST /users/:user_id/like_user/:other_user_id
POST /users/:user_id/dislike_user/:other_user_id
DELETE /user/:user_id/ - Deletes a User.
```

The API functions were implemented in the routes/user.js file. The only difficulty encountered was
figuring out how to insert new relations (likes and dislikes). For instance, what is to be done
when a POST request arrives for User A to like User B, but currently User A dislikes User B. To 
solve this problem, I decided to delete any previously-existing relation before creating the new
one. To accomplish this I used Javascript Promises to ensure that the create relation call to the
database occurred after the delete relations calls (even though all of these operations are
asynchronous).

#### Testing
I was able to test the REST API thoroughly using the Google Chrome Extension Postman. I created 
several users with different relations between them and tested changing relations and deleting
users. There are no known bugs at this point.

#### Conclusions
Oriento is a great and well documented library for interacting with an OrientDB Database from Node.
Also, Postman made it very easy to test the API by building collections of requests that could be
saved and run again.



