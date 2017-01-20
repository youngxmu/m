fis.config.set('modules.postpackager', 'simple');
fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true,
    useStandard : false
}]);


fis.config.merge({
    roadmap : {
        path : [
            {
                reg : /\/public\/css\/(.*\.css)/i,
                release : '/public/css/$1'
            },
            {
                reg : /\/public\/js\/(.*\.js)/i,
                release : '/public/js/$1'
            },
            {  
                reg : /\/public\/img\/(.*\.((jpg)|(png)|(gif)|(ico)))/i,
                release : '/public/img/$1'
            },
            {
                reg : /\/views\//i,
                useStandard : true
            },
            {
                reg : /\/(logs|test|node_modules|public)\//i,
                release : false
            },
            {
                reg : '**',
                useStandard : false,
                useOptimizer : false
            }
        ]
    },
    deploy : {
        nodeStatic69 : [
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                from : '/public',
                to : '/young/node/moka/public',
                exclude : '/public/uploads/**',
                subOnly : true
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/young/node/moka/views',
                subOnly : true,
                replace : {
                    from : 'http://localhost:8200',
                    to : 'http://xmdx.dev.cnhubei.com/moka'
                }
            }
        ],
        node69 : [
            // {
            //     receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
            //     from : '/public',
            //     to : '/young/node/moka/public',
            //     exclude : '/public/uploads/**',
            //     subOnly : true
            // },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/config/*.js'],
                from : '/config',
                to : '/young/node/moka/config',
                subOnly : true
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/lib/**'],
                from : '/lib',
                to : '/young/node/moka/lib',
                subOnly : true
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/routes/**'],
                from : '/routes',
                to : '/young/node/moka/routes',
                subOnly : true
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/models/**'],
                from : '/models',
                to : '/young/node/moka/models',
                subOnly : true
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/young/node/moka/views',
                subOnly : true,
                replace : {
                    from : 'http://localhost:8200',
                    to : 'http://xmdx.dev.cnhubei.com/moka'
                }
            },
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['app.js'],
                from : '/',
                to : '/young/node/moka',
                subOnly : true
            }
            ,
            {
                receiver : 'http://xmdx.dev.cnhubei.com/node/receiver',
                include : ['route.js'],
                from : '/',
                to : '/young/node/moka',
                subOnly : true
            }
        ]
    }
});