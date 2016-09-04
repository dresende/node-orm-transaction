var debug = require("debug")("orm:transaction");

module.exports = Plugin;

function Plugin(db) {
	db.transaction = function (cb) {
		if (db.driver.opts.pool)
			db.driver.createPool(function (err, id) {
	    		if (err)
	    			return cb(err);
				db.driver.execQuery("BEGIN", id, function (err) {
					if (err) {
						return cb(err);
					}

					debug("init transaction!");

					return cb(null, {
						id: id,
						commit: function (cb) {
							db.driver.execQuery("COMMIT", id, function (err) {
								debug("transaction committed!");
								db.driver.releasePool(id);
								return cb(err || null);
							});
						},
						rollback: function (cb) {
							db.driver.execQuery("ROLLBACK", id, function (err) {
								debug("transaction rolled back!");
								db.driver.releasePool(id);
								return cb(err || null);
							});
						}
					});
				});
			});
		else
			db.driver.execQuery("BEGIN", function (err) {
				if (err) {
					return cb(err);
				}

				debug("init transaction!");

				return cb(null, {
					commit: function (cb) {
						db.driver.execQuery("COMMIT", function (err) {
							debug("transaction committed!");
							return cb(err || null);
						});
					},
					rollback: function (cb) {
						db.driver.execQuery("ROLLBACK", function (err) {
							debug("transaction rolled back!");
							return cb(err || null);
						});
					}
				});
			});
	};

	return {
		define: function (Model) {
		}
	};
}
