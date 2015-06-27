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
	console.log(getRID(req));
	req.graphDB.record.get(getRID(req)).then(function (user) {
		req.send(user);
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
router.post('/users/:user_id/like_user/:other_user_id',
	function(req, res){

	});

//POST /users/:user_id/dislike_user/:other_user_id


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


module.exports = router;
