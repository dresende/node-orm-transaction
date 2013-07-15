var debug = require("debug")("orm:transaction");

module.exports = Plugin;

function Plugin(db) {
	db.transaction = function (cb) {
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
