# node-orientdb
A Node REST API for interacting with OrientDB graph model.

The goal of this project is to create a Restful Node.js API for interacting
with an OrientDB graph structure. The example that I will use is a simple 
social graph where there are users that can like and dislike other users.
In this system, users are represented as nodes and relations (like or dislike) are edges.
I will begin with the OrientDB setup. OrientDB is a NoSQL database that advertises 
itself as a multi-model system. They provide data modeling using document model,
key-value pair model, object model, and graph model. This project uses the
graph model. After downloading OrientDB from their site and running the server,
the following commands were used from the console to build the basic schema:

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
is useful for building JSON APIs to interact with a database (mongo, cassandra, 
couch, etc.). There is also a great library (oriento) for Node-OrientDB connectivity which
I wanted to try. The API functions that I implemented are listed below (should be self-explanatory).

```
GET /users/
GET /users/:user_id/
GET /users/:user_id/liked_users
GET /users/:user_id/disliked_users
POST /users/:user_id/like_user/:other_user_id
POST /users/:user_id/dislike_user/:other_user_id
DELETE /user/:user_id/
```


