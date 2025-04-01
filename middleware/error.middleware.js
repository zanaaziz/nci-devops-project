module.exports = (err, req, res, next) => {
	console.error(err.stack);
	res.send('Something went wrong!');
};
