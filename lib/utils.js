module.exports = {
    setResult: function (data, msg) {
        var result = {
            success: 'ok',
            msg: msg ? msg : '操作成功',
            data: data,
        };
        return result;
    },
    setError: function (data,msg) {
        var result = {
            success: 'error',
            msg: msg ? msg : '操作失败',
            data: data,
        };
        return result;
    },
    returnArticleStatus: function (status) {
        var name = '';
        switch (status) {
            case 'draft': name = '存为草稿';break;
            case 'publish': name = '已发布';break;
        }
        return name;
    }
};