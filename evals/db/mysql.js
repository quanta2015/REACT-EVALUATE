var mysql = require('mysql');
var config = require('../config');
var entries = require('./jsonRes');

var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database,
	port: config.port,
	dateStrings: true,
	multipleStatements: true
});

var GROUP_SIZE = 3;
var EVAL_DATA ;


function rnd(n, m){
	var random = Math.floor(Math.random()*(m-n+1)+n);
	return random;
}


function max(arr) {
	var max = parseInt(arr[0]);
	for(var i = 1; i < arr.length; i++){
		if(max < parseInt(arr[i])) {
				max = parseInt(arr[i])
		}
	}
  return max;
}

function isInArray(arr,value){
	for(var i = 0; i < arr.length; i++){
			if(parseInt(value) === parseInt(arr[i])){
					return true;
			}
	}
	return false;
}

exports.getConn = function() {
	return connection;
}

exports.login = function(req, res, usr, pwd) {
	var ens = Object.assign({}, entries); 
	connection.query("SELECT * FROM user WHERE username = ?", [usr], function(err, rows) {
		if (err)
			throw err;
		if (!rows.length) {
			ens.code = "99";
			ens.msg = "No user found.";
		}else if (pwd != rows[0].password) {
			ens.code = "99";
			ens.msg = "Wrong password.";
		}else{
			ens.code = "0";
			ens.msg = "Success";
			ens.data = rows[0];
			// req.session.user = rows[0]; 
			console.log('login success')
		}
		
		res.write(JSON.stringify(ens));   
		res.end();
	});
}


exports.getClass = function(req, res) {
	var ens = Object.assign({}, entries); 
	connection.query("SELECT class_type as type,group_concat(cid) as value,group_concat(class_name) as label FROM class  group by class_type", function(err, rows) {
		if (err)
			throw err;
		
		rs = []
		for(i=0;i<rows.length;i++) {
			ch = []
			vlist = rows[i].value.split(',');
			nlist = rows[i].label.split(',');
			for(j=0;j<vlist.length;j++) {
					var item = { "label": nlist[j], "value": vlist[j]}
					ch.push(item)
			}
			var item = { "label": rows[i].type, "value": rows[i].type, "children": ch};
			rs.push(item);
		};
		ens.code = "0";
		ens.msg = "Success";
		ens.data = rs;
		res.write(JSON.stringify(ens));
		res.end();
	});
}

exports.saveTask = function(req, res) {
	var { uid, cls, from, to, tl, cnt } = req.body;
	var ens = Object.assign({}, entries);

	connection.query("insert into task(publisher,publish_class,task_title,task_content,publish_date,end_date) values(?,?,?,?,?,?)", [uid, cls, tl, cnt, from, to],function(err, rows) {
		if (err) throw err;

		ens.code = "0";
		ens.msg = "任务保存成功！";
		res.write(JSON.stringify(ens));
		res.end();
	});
}

exports.getTask = function(req, res) {
	
	var ens = Object.assign({}, entries);
	connection.query('select * from task t,class c where t.publish_class=c.cid', function(err, rows) {
		if (err) throw err;

		ens.code = "0";
		ens.msg = "取任务数据成功！";
		ens.data = rows;

		console.log(rows);

		res.write(JSON.stringify(ens));   
		res.end();
	});
}

exports.getDoTask = function(req, res) {
	var { uid } = req.body;
	var ens = Object.assign({}, entries);
	connection.query('select * from dotask d, task t where d.task_id = t.task_id and user_id = ?',[uid], function(err, rows) {
		if (err) throw err;

		ens.code = "0";
		ens.msg = "取任务数据成功！";
		ens.data = rows;

		data = JSON.stringify(ens).replace(/\"id\"/g, "\"key\"");
		res.write(data);
		res.end();
	});
}


exports.saveTaskDetail = function(req, res) {
	var { uid, tid, pid, dtid } = req.body;
	var ret = [];
	var count = GROUP_SIZE + 1; //用户本人也同时计算
	var ens = Object.assign({}, entries);
	var sql = `select * from user_data where task_id=${tid}`;

	// ret.push( parseInt(uid) );

	console.log(uid)
	console.log(tid)
	console.log(pid)
	console.log(dtid)
	console.log(sql)

	connection.query(sql, function(err, rows) {
		if (err) throw err;

		console.log(rows)

		var list = rows[0].user_list.split(',');
		if (list[list.length-1] == "" ) {
			list.splice(list.length-1,1);
		}

		console.log(JSON.stringify(list));

		ret.push(parseInt(uid))

		//随机生成 GROUP_SIZE 个id
		while(1) {
			i = rnd(0,list.length-1);
			if (!isInArray(ret,list[i])) {
				ret.push(parseInt(list[i]))
				count--;
				if (count<1) break;
			}
		}
		
		count = GROUP_SIZE + 1;

		//删除取出的id
		for(i=0;i<count;i++) {
			for(j=0;j<list.length;j++) {
				if(ret[i] == list[j]) {
					console.log('remove ..... ' + ret[i]);
					list.splice(j,1);
					break;
				}
			}
		}

		new_data = list.join(',');

		console.log('筛选出用户ID: ' + JSON.stringify(ret));
		console.log('剩余用户数据: ' + new_data);

		var sql0 = `update dotask set complete = 1 where task_id=${tid} and user_id=${uid};`;
		var sql1 = `update user_data set user_list = '${new_data}' where task_id = ${tid};`;
		var sql2 = `insert into doeval(dotask_id,user_id,role,g) values(${dtid},${ret[0]},1,0);`;
		var sql3 = `insert into doeval(dotask_id,user_id,role,g) values(${dtid},${ret[1]},1,0);`;
		var sql4 = `insert into doeval(dotask_id,user_id,role,g) values(${dtid},${ret[2]},1,0);`;
		var sql5 = `insert into doeval(dotask_id,user_id,role,g) values(${dtid},${ret[3]},1,0);`;
		var sql6 = `insert into doeval(dotask_id,user_id,role,g) values(${dtid},${pid}   ,0,0);`;
		var sql = sql0 + sql1 + sql2 + sql3 + sql4 + sql5 + sql6;
		
		connection.query(sql, function(err, rows) {
			if (err) throw err;

			ens.code = "0";
			ens.msg = "任务保存成功！";
			// ens.data = ret;
			res.write(JSON.stringify(ens));
			res.end();

		})//end of query 2

	});//end of query 1
}


exports.getEvalTask = function(req, res) {
	var { uid, complete } = req.body;
	var ens = Object.assign({}, entries);
	var sql = 'select e.id, e.g, t.task_title, dt.user_id, u.name, u.username, t.task_content, t.task_id, t.publish_date, t.end_date, dt.ppt_url, dt.doc_url, dt.video_url, e.complete from doeval e,dotask dt,task t,user u  where e.dotask_id = dt.id and dt.task_id = t.task_id and dt.user_id = u.userid and e.user_id =	? and e.complete = ? order by publish_date,task_title';

	connection.query(sql,[uid, complete], function(err, rows) {
		if (err) throw err;

		ens.code = "0";
		ens.msg = "取任务数据成功！";
		ens.data = rows;
		res.write(JSON.stringify(ens));
		res.end();
	});
}

exports.getEvalTaskDetail = function(req, res) {
	var { id } = req.body;
	var ens = Object.assign({}, entries);
	var sql0 = `select * from eval order by tid,item_order;`;
	var sql1 = `select * from doeval where id=${id};`;
	var sql = sql0 + sql1;

	connection.query(sql,function (err, ret) {
		if (err) throw err;

		EVAL_DATA = ret[0];
		var grade = ret[1][0].grade;

		console.log(ret[1])

		var data = {
			list: caluEval(grade),
			complete: ret[1][0].complete
		}

		ens.code = "0";
		ens.msg = "取评价模板成功！";
		ens.data = data;
		res.write(JSON.stringify(ens));
		res.end();
	});
}

function caluEval(g) {
	var gradeList
	// console.log(g);
	if (g === null) {
		gradeList = [];
	}else{
		gradeList = g.split(',');
	}
	// console.log(EVAL_DATA)
	var evalList= JSON.parse(JSON.stringify(EVAL_DATA));

	// console.log(gradeList.length)
	evalList.map((item,i)=>{
		if (gradeList.length>1) {
			item.grade = gradeList[i];
		}else{
			item.grade = 0;
		}
	})
	return evalList;
}

function caluEvalAll(g) {
	var grade = 0, gradeList;
	if (g === null) {
		return 0;
	}else{
		gradeList = g.split(',');
	}
	
	gradeList.map((item,i)=>{
		grade += parseInt(gradeList[i]);
	})

	return grade;
}

exports.saveEvalTaskDetail = function(req, res) {
	var { id, grade, type } = req.body;
	var ens = Object.assign({}, entries);
	var sql0 = `select * from eval order by tid,item_order;`;
	var sql1;
	var gradeAll = caluEvalAll(grade);

	console.log(gradeAll);

	if(parseInt(type) === 0) {
		sql1 = `update doeval set grade='${grade}', g=${gradeAll} where id = ${id};`;
	}else{
		sql1 = `update doeval set grade='${grade}', g=${gradeAll}, complete = 1 where id = ${id};`;
	}

	var sql = sql0 + sql1;

	connection.query(sql, function(err, ret) {
		if (err) throw err;

		EVAL_DATA = ret[0];

		var data = {
			list: caluEval(grade),
			complete: parseInt(type)
		}

		ens.code = "0";
		ens.msg = "保存评价数据成功！";
		ens.data = data;
		res.write(JSON.stringify(ens));
		res.end();
	});
}

exports.getResult = function(req, res) {
	var ens = Object.assign({}, entries);
	connection.query("select * from v_grade_ret", function(err, rows) {
		if (err) throw err;
		ens.code = "0";
		ens.msg = "取评价结果成功！";
		ens.data = rows;
		res.write(JSON.stringify(ens));   
		res.end();
	});

}

exports.getAnalysisList = function(req, res) {
	var ens = Object.assign({}, entries);
	connection.query("select * from v_grade_ret_st", function(err, rows) {
		if (err) throw err;
		ens.code = "0";
		ens.msg = "取分析清单成功！";
		ens.data = rows;
		res.write(JSON.stringify(ens));   
		res.end();
	});
}

exports.getAnalysisDetail = function(req, res) {
	var { id } = req.body;
	var ens = Object.assign({}, entries);


	var sql0 = `select * from v_grade_ret where taskid = ${id} order by g;`;
	var sql1 = `select * from conf;`;
	var sql = sql0 + sql1;



	connection.query(sql, function(err, rows) {
		if (err) throw err;

		ens.code = "0";
		ens.msg = "取分析详情成功！";
		ens.data = { grade: rows[0],	conf: rows[1]};
		res.write(JSON.stringify(ens));   
		res.end();
	});
}


exports.saveUploadFile = function(req, res) {
	var ens = Object.assign({}, entries);
	var { type, uid, tid } = req.body;
	var { path } = req.file;
	var file_type = type.toLowerCase()+'_url';
	var file_date = type.toLowerCase()+'_date';
	var sql = `update dotask set ${file_type} = ?, ${file_date} = NOW() where task_id = ? and user_id = ?`;
	
	connection.query(sql, [ path, tid, uid],function(err, rows) {
		if (err) throw err;
		// console.log(rows)

		console.log('bb')
		ens.code = "0";
		ens.msg = "上传文件保存成功！";
		ens.data = path
		res.write(JSON.stringify(ens));
		res.end();
	});
}
// fs = JSON.stringify(ens).replace(/class_name/g, "label").replace(/cid/g, "value")