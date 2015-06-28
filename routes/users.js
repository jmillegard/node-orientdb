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

// POST /users/:user_id/like_user/:other_user_id
router.post('/:id/like_user/:other_user_id', function(req, res){
	createRelation(req, 'Like').then(function(edge) {
		res.send(edge);
	});
});

// POST /users/:user_id/dislike_user/:other_user_id
router.post('/:id/dislike_user/:other_user_id', function(req, res){
	createRelation(req, 'Dislike').then(function(edge) {
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


module.exports = router;