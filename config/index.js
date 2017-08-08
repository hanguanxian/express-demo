
'use strict'

var all = {
    sequelize:{
        username: 'doro',
        password: 'Doro51vest',
        database: 'crm_v2',
        host: "rm-uf6xn158a9wrz25l4o.mysql.rds.aliyuncs.com",
        dialect: 'mysql',
        define: {
            underscored: false,
            timestamps: false,
            paranoid: true
        }
    }
};

module.exports = all;
