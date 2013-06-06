module.exports = Plugin;

function Plugin(db) {
	db.transaction = function (cb) {
		db.driver.execQuery("BEGIN", function (err) {
			if (err) {
				return cb(err);
			}

			console.log("init transaction!");

			return cb(null, {
				commit: function (cb) {
					db.driver.execQuery("COMMIT", function (err) {
						return cb(err || null);
					});
				},
				rollback: function (cb) {
					db.driver.execQuery("ROLLBACK", function (err) {
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
