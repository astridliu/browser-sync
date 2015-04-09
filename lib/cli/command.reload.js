"use strict";

var error   = "Could not contact BrowserSync server.";

/**
 * $ browser-sync reload <options>
 *
 * This commands starts the BrowserSync servers
 * & Optionally UI.
 *
 * @param opts
 * @returns {Function}
 */
module.exports = function (opts) {

    var flags = opts.cli.flags;
    if (!flags.url) {
        flags.url = "http://localhost:" + (flags.port || 3000);
    }
    var proto  = require("../http-protocol");
    var scheme = flags.url.match(/^https/) ? "https" : "http";

    var url    = proto.getUrl({method: "reload", args: flags.files}, flags.url);

    require(scheme).get(url, function (res) {
        if (res.statusCode !== 200) {
            require("logger").logger.error(error);
            return opts.cb(new Error(error));
        } else {
            opts.cb(null, res);
        }
    }).on("error", function (err) {
        if (err.code === "ECONNREFUSED") {
            err.message = "BrowserSync not running at " + flags.url;
        }
        return opts.cb(err);
    });
};