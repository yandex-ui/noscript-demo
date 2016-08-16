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
    'app content@': 'index'
}, 'app');

ns.layout.define('photo', {
    'app content@': function(params) {
        return params['image-id']
            ? { 'photos': null, 'photo-preview': null }
            // чтобы увидеть разницу — нужно добавить &
            : { 'photos': null, 'async-view&': null };
    }
}, 'app');

ns.layout.define('async-view', {
    'async-view-box@': 'async-view-inner'
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

ns.Model.define('async-model', {
    methods: {
        request: function() {
            var _this = this;

            return Promise.resolve().then(function() {
                _this.setData({});
            });
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
    models: [ 'photos' ],
    split: {
        byModel: 'photos',
        intoViews: 'photos-item'
    }
});

ns.View.define('photo-preview', {
    models: [ 'photo' ]
});

/**
 * Первый глобальный апдейт кладет в лейауте async-view,
 * которая рисует прелоадер в асинхронной моде
 * После получения данных — мы проверяем нужно ли показать вьюшку async-view-inner
 *(для теста всегда вернет лейат async-view, который содержит эту вьюшку)
 */
ns.View.define('async-view', {
    models: [ 'async-model' ],

    /**
     * Нужно обратить внимание:
     * вьюшка вычисляет себе какие-то параметры
     */
    params: function() {
        return {
            I_AM_ASYNC_VIEW: 1
        };
    },

    methods: {
        patchLayout: function() {
            return 'async-view';
        }
    }
});

/**
 * Это вьюшка вложенная в async-view
 */
ns.View.define('async-view-inner', {
    /**
     * Здесь нужно обратить внимание:
     * вьюшка добавляем себе параметры — именно здесь и будет отличие
     * глобального апдейта от локального на асинхронной вьюшке
     */
    'params+': {
        I_AM_ASYNC_VIEW: null
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
