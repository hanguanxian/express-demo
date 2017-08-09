'use strict'

module.exports = function(sequelize,DataTypes){
    var Department = sequelize.define('org_department',{
        auto_id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        },
        dept_code:{
            type:DataTypes.STRING(50)
        },
        dept_name:{
            type:DataTypes.STRING(100)
        },
        pre_dept_code:{
            type:DataTypes.STRING(50)
        },
        enum_dept_level:{
            type:DataTypes.INTEGER(10).UNSIGNED
        },
        enum_dept_type:{
            type:DataTypes.INTEGER(11)
        },
        enum_city_level:{
            type:DataTypes.INTEGER(11)
        },
        is_enable:{
            type:DataTypes.BOOLEAN
        },
        remark:{
            type:DataTypes.STRING(500)
        },
        create_time:{
            type:DataTypes.DATE(6)
        },
        update_time:{
            type:DataTypes.DATE(6)
        }
    },{
        freezeTableName: true
    });

    return Department;
};
