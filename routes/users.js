var express = require('express');
var router = express.Router();

// **********************************************
// **********************************************
// API functions

// GET /users/
router.get('/', function(req, res) {
	req.graphDB.select().from('User').all()
	.then(function (users) {
  		res.send(users);
	});
});

// GET /users/:user_id/
router.get('/:id/', function(req, res) {
	req.graphDB.record.get(getRID(req)).then(function (user) {
		res.send(user);
	});
});

// GET /users/:user_id/liked_users
router.get('/:id/liked_users', function(req, res) {
	var queryStr = getRelationQuery(getRID(req), 'LIKE');
	req.graphDB.query(queryStr, {}).then(function (results){
	  res.send(results);
	});
});

// GET /users/:user_id/liked_users
router.get('/:id/disliked_users', function(req, res) {
	var queryStr = getRelationQuery(getRID(req), 'DISLIKE');
	req.graphDB.query(queryStr, {}).then(function (results){
	  res.send(results);
	});
});

// POST /users/
// creates a new user.
router.post('/', function(req, res){
	req.graphDB.create('VERTEX', 'User')
	.set({
		name: req.body.name,
		age: req.body.age
	})
	.one()
	.then(function(vertex){
		res.send(vertex);
	});
});

// NOTE:
// When a POST request is received for a user A to like or dislike
// a user B, the relations between A and B that already exist are
// destroyed. The reason is that a user A cannot both like and 
// dislike a user B.


// POST /users/:user_id/like_user/:other_user_id
// returns the edge that was created.
router.post('/:id/like_user/:other_user_id', function(req, res){
	destroyRelations(req).then(function(){
		return createRelation(req, 'Like');
	}).then(function(edge) {
		res.send(edge);
	});
});

// POST /users/:user_id/dislike_user/:other_user_id
// returns the edge that was created.
router.post('/:id/dislike_user/:other_user_id', function(req, res){
	destroyRelations(req).then(function(){
		return createRelation(req, 'Dislike');
	}).then(function(edge) {
		res.send(edge);
	});
});

// DELETE /users/:user_id
// Deleting the vertex automatically deletes all corresponding
// relation edges.
router.delete('/:id', function(req, res){
	req.graphDB.delete('VERTEX')
	.where('@rid = ' + getRID(req))
	.one()
	.then(function (count) {
  		res.send(count);
	});
});

// **********************************************
// **********************************************
// Helper functions

function getRID(req) {
	return '#' + req.params.id;
}

function getRelationQuery(rid, relation) {
	return 'SELECT EXPAND( OUT("' + relation + '") ) ' +
	 	   'FROM User WHERE @rid=' + rid;
} 

function createRelation(req, type) {
	return req.graphDB.create('EDGE', type)
	.from(getRID(req))
	.to('#' + req.params.other_user_id)
	.one();
}

// Any Like or Dislike relation that exists between a user A and a
// user B is deleted. The reason a Promise is used is because
// only after the pre-existing relations are deleted should a new
// relation be created. 
function destroyRelations(req) {
	return Promise.all([
		destroyRelation(req, 'LIKE'),
		destroyRelation(req, 'Dislike')
	]);
}

function destroyRelation(req, type) {
	return req.graphDB.delete('EDGE', type)
				.from(getRID(req))
				.to('#' + req.params.other_user_id)
				.scalar()
}

module.exports = router;