var express = require('express');
var router = express.Router();
var db = require('../sqldb');
var Department = db.Department;

var users = require('./users').items;
var identityKey = 'skey';

var findUser = function(name, password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;

    res.render('index', {
        isLogined: isLogined,
        name: loginUser || ''
    });
});

router.post('/login', function(req, res, next){

	var sess = req.session;
	var user = findUser(req.body.name, req.body.password);

	if(user){
		req.session.regenerate(function(err) {
			if(err){
				return res.json({ret_code: 2, ret_msg: '登录失败'});
			}

			req.session.loginUser = user.name;
			res.json({ret_code: 0, ret_msg: '登录成功'});
		});
	}else{
		res.json({ret_code: 1, ret_msg: '账号或密码错误'});
	}
});

router.get('/logout', function(req, res, next){
	// 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
	// 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
	// 然后去查找对应的 session 文件，报错
	// session-file-store 本身的bug
	req.session.destroy(function(err) {
		if(err){
			res.json({ret_code: 2, ret_msg: '退出登录失败'});
			return;
		}
		// req.session.loginUser = null;
		res.clearCookie(identityKey);
		res.redirect('/');
	});
});

router.get('/departmentList.do',function(req,res,next){
    return db.sequelize.transaction(function(t){
        return Department.findAll({
          attributes: [['dept_code','id'],['dept_name','name'],['pre_dept_code','pId']]
        }, {transaction: t}).then(function(result){
            res.send(result);
        }).catch(function(err){
            console.log("发生错误：" + err);
        });
    });
});

router.post('/newDepartment.do',function(req,res,next){
    return db.sequelize.transaction(function(t){
      return Department.findOne({
        where: {dept_code: req.body.parentId}
      }, {transaction: t}).then(function(parentDepartment){
          //res.send(_department);
          var newDepartment = {};
          newDepartment.create_time = new Date();
          newDepartment.update_time = new Date();
          newDepartment.dept_code = req.body.departmentCode;
          newDepartment.dept_name = req.body.departmentName;
          newDepartment.pre_dept_code = parentDepartment.dept_code;
          newDepartment.enum_city_level = parentDepartment.enum_city_level == 1 ? 1 : parentDepartment.enum_city_level + 1;
          newDepartment.enum_dept_level = parentDepartment.enum_dept_level -1;
          newDepartment.enum_dept_type = parentDepartment.enum_dept_type;
          newDepartment.is_enable = true;
          newDepartment.remark = '';

          Department.findOrCreate({where: newDepartment})
          .spread(function(departMent, created) {
              res.send(departMent);
          })
      }).catch(function(err){
          console.log("发生错误：" + err);
      });
    });
});

router.post('/deleteDepartment.do',function(req,res,next){
    return db.sequelize.transaction(function(t){
      return Department.destroy({
        where: {dept_code: req.body.departmentCode}
      }, {transaction: t}).then(function(status){
          res.send({msg:"删除成功"});
      })
    }).catch(function(err){
        console.log("发生错误：" + err);
    });;
});
module.exports = router;
