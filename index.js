var http = require('http');
var url = require('url');

var apihandler = module.exports = function(api){
    var defaultApi = {
        '/status':function(u, callback){
            callback(null, {
                service: {name: "testCI", version: process.env.npm_package_version},
                memory: process.memoryUsage(),
                uptime: process.uptime(),
                versions: process.versions
            });
        },
    };
    return function(req, res){
        var success = function(res,obj){
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.write(JSON.stringify(obj));
        };
        var internalservererror = function(res,obj){
            res.writeHead(500, {"Content-Type": "text/plain"});
        };
        var notfound = function(res){
            res.writeHead(404, {"Content-Type": "text/plain"});
        };
        var callback = function(err, obj){
            if(err){
                internalservererror(res);
            }else{
                success(res, obj);
            }
            res.end();
        }
        var u = url.parse(req.url);
        var f = defaultApi[u.pathname];
        if(f){
            f(u, callback);
        }else{
            if(api){
                var f = api[u.pathname];
                if(f){
                    f(u, callback);
                }else{
                    notfound(res);
                    res.end();
                }
            }else{
                notfound(res);
                res.end();
            }
        }
    };
}