// Урлы.
ns.router.routes = {
    route: {
        '/photos/{image-id:int}': 'photo',
        '/photos': 'photo',
        '/': 'index'
    }
};

// ----------------------------------------------------------------------------------------------------------------- //

// Раскладки (страницы).
ns.layout.define('app', {
    'app': {
        'head': true,
        'content@': {}
    }
});

ns.layout.define('index', {
    'app content@': {
        'photos-top-wrap': {},
        'photos-wrap': {}
    }
}, 'app');

ns.layout.define('photo', {
    'app content@': function(params) {
        return params['image-id']
            ? { 'photos': null, 'photo-preview': null }
            : { 'photos': null };
    }
}, 'app');

ns.layout.define('photos-extra-layout', {
    'photobox@': 'photos'
});

// ----------------------------------------------------------------------------------------------------------------- //

// Модели.
ns.Model.define('photo', {
    params: {
        'image-id': null
    }
});

ns.Model.define('photos', {
    split: {
        items: '.images.image',
        model_id: 'photo',
        params: {
            'id': '.id'
        }
    }
});

// ----------------------------------------------------------------------------------------------------------------- //

// Блоки (view).
ns.View.define('app');
ns.View.define('head');

ns.View.define('index');

ns.View.define('photos-item', {
    models: [ 'photo' ]
});

ns.ViewCollection.define('photos', {
    params: { extra: null },
    models: [ 'photos' ],
    split: {
        byModel: 'photos',
        intoViews: 'photos-item'
    }
});

ns.View.define('photo-preview', {
    models: [ 'photo' ]
});

ns.View.define('photos-top-wrap', {
    methods: {
        patchLayout: function(params) {
            params.extra = 'top';
            return 'photos-extra-layout';
        }
    }
});

ns.View.define('photos-wrap', {
    methods: {
        patchLayout: function(params) {
            params.extra = '';
            return 'photos-extra-layout';
        }
    }
});


// ----------------------------------------------------------------------------------------------------------------- //

// Тестовые данные.
var photos = ns.Model.get('photos').setData({ images: { image: [] } });
photos.insert([
    ns.Model.get('photo', { 'image-id': 1 }).setData({ id: 1, url_: 'http://img-fotki.yandex.ru/get/4522/111182131.5/0_6358f_a0da1182_' }),
    ns.Model.get('photo', { 'image-id': 2 }).setData({ id: 2, url_: 'http://img-fotki.yandex.ru/get/4417/31916371.16/0_5d295_d72044a2_' }),
    ns.Model.get('photo', { 'image-id': 3 }).setData({ id: 3, url_: 'http://img-fotki.yandex.ru/get/4412/47303295.18/0_192ee2_9293c321_' })
]);

// ----------------------------------------------------------------------------------------------------------------- //

// Приложение.
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
