/**
 * @name ClientDateTime
 * @description ClientDateTime
 */
$$('ns', '(auto)');
$$('static');
Class('(auto)', function() {
    $$('cache', 10000);
    this.now = async () => {
        return Date.now();
    };
});
