ns.router.routes = {
    route: {
        '/': 'index'
    }
};

ns.layout.define('app', {
    'app': {
        'head': true,
        'content@': {}
    }
});

ns.layout.define('index', {
    'app content@': {
        'clock': {}
    }
}, 'app');

ns.Model.define('clock', {
    params: {},
    methods: {
        request: function() {
            this.setData({
                time: new Date().toLocaleString()
            });
            return Vow.resolve();
        }
    }
});

ns.View.define('app');
ns.View.define('head');
ns.View.define('clock', {
    models: {
        clock: {
            'ns-model-changed': true
        }
    }
});

var app = {};

app.init = function() {
    // Поскольку проект может лежать где угодно на файловой системе - инициализируем baseDir руками.
    ns.router.baseDir = location.pathname.substr(0, location.pathname.length - 1);

    ns.init();
    ns.page.go();
};

$(function() {
    app.init();
});

// ----------------------------------------------------------------------------------------------------------------- //

setInterval(function() {
    ns.Model.get('clock').invalidate();
    ns.page.go();
}, 1000);

// ----------------------------------------------------------------------------------------------------------------- //

var counter = 0;
var ram = ns.Update.prototype._requestAllModels;
ns.Update.prototype._requestAllModels = function() {
    var resultPromise = ram.apply(this, arguments);

    resultPromise.then(function() {
        if (counter++ % 3) {
            ns.Model.get('clock').invalidate();
            setTimeout(function() { ns.page.go(); }, 500);
        }
        console.log(counter);

        // console.log('ZZZ');
    });

    return resultPromise;
};
