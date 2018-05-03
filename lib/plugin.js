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

	db.transactionAsync = async function (cb) {
		await db.driver.execQueryAsync("BEGIN");
		debug("init transaction!");

		try {
			await cb();
			debug("transaction committed!");
			await db.driver.execQueryAsync("COMMIT");
		} catch(err) {
			debug("transaction rolled back!");
			await db.driver.execQueryAsync("ROLLBACK");
		}
	}

	return {
		define: function (Model) {
		}
	};
}
