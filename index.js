var FS          = require('fs'),
    NODE_RATIFY = require('node-ratify');

function isPDF(path, cb) {
    if (!NODE_RATIFY.isFunction(cb)) {
        throw new TypeError('callback not provided');
    } else if(!NODE_RATIFY.isString(path)) {
        throw new TypeError('provided path is not correct');
    } else {
        var buffer = new Buffer(4);
        FS.open(path, 'r', function(err, fd) {
            if(err) {
                throw(err);
            } else {
                FS.read(fd, buffer, 0, 4, 0, function(err, bytesRead, buffer) {
                    if(err) {
                        FS.close(fd, function(err1) {
                            cb(err1 || err, false);
                        });
                    } else {
                        if (buffer && buffer.length === 4) {
                            cb(null, (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46));
                        } else {
                            cb(null, false);
                        }
                    }
                });
            }
        });
    }
};

function isPDFSync(path) {
    var ret = false;
    if(!NODE_RATIFY.isString(path)) {
        throw new TypeError('provided path is not correct');
    } else {
        var buffer = new Buffer(4);
        var fd = FS.openSync(path, 'r');

        if(fd) {
            // Read the file synchronously
            FS.readSync(fd, buffer, 0, 4, 0);

            if (buffer && buffer.length === 4)
                ret = (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46);

            // Close the file
            FS.closeSync(fd);
        }

        return ret;
    }
};

exports = module.exports = {
    isPDF       : isPDF,
    isPDFSync   : isPDFSync
};