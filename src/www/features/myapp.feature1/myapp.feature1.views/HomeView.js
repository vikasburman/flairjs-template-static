const { VueView } = await ns('flair.ui');
const ClientDateTime = await include('myapp.feature1.services.ClientDateTime');

/**
 * @name HomeView
 * @description Default Home View
 */
$$('ns', '(auto)');
Class('(auto)', VueView, function() {
    this.i18n = 'titles, strings';
    this.title = '@titles.home | Home';
    this.layout = 'myapp.shared.views.CommonLayout';
    this.html = true;
    this.style = true;
    this.data = true;

    $$('override');
    this.loadData = async (base, ctx, el) => { // eslint-disable-line no-unused-vars
        this.data.now = await ClientDateTime.now();
    };
});
