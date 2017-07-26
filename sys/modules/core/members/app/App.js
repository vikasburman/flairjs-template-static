define([
    use('[Base]'),
    use('sys.core.app.IApp')
], (Base, IApp) => {
    /**
     * @class sys.core.app.App
     * @classdesc sys.core.app.App
     * @desc App base class.
     */    
    return Class('sys.core.app.App', Base, [IApp], function(attr) {
        attr('override');
        attr('abstract');
        this.func('constructor', (base) => {
            base();
            this.tags = this.settings(':app');
        });

        attr('async');
        this.func('start', this.noopAsync);

        this.func('navigate', this.noop);

        attr('readonly');
        this.prop('tags', {});    
    });
});