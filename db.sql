CREATE TABLE `eval`.`<table_name>` (
	`task_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务编号',
	`publisher` int(15) NOT NULL COMMENT '任务发布者',
	`publish_class` int(10) DEFAULT NULL COMMENT '任务发布班级对象',
	`task_title` varchar(100) DEFAULT NULL COMMENT '任务名称',
	`task_content` varchar(20000) DEFAULT NULL COMMENT '任务要求',
	`publish_date` datetime DEFAULT NULL COMMENT '任务发布时间',
	`end_date` datetime DEFAULT NULL COMMENT '任务截止时间',
	`task_url` varchar(50) DEFAULT NULL COMMENT '任务附件',
	PRIMARY KEY (`task_id`),
	INDEX `FK_pubnum` USING BTREE (`publisher`) comment ''
) ENGINE=`InnoDB` AUTO_INCREMENT=79 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ROW_FORMAT=COMPACT COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;

CREATE TRIGGER `addTask` AFTER INSERT ON `<table_name>` FOR EACH ROW BEGIN

DECLARE tid int;
DECLARE cid int;
DECLARE uid int;
DECLARE done INT DEFAULT 0;

DECLARE cur1 CURSOR FOR SELECT `userid` from `user` where `userclass`= NEW.`publish_class`; 
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done=1;  

SET tid = NEW.task_id;
 
OPEN  cur1; 
emp_loop: LOOP  
FETCH cur1 INTO uid;
	IF done=1 THEN  
	 LEAVE emp_loop;  
	END IF;  
	INSERT INTO dotask(user_id, task_id) VALUES (uid, tid);
END LOOP emp_loop;  
CLOSE cur1; 


END;



BEGIN
DECLARE tid int;
DECLARE uid int;
DECLARE done INT DEFAULT 0;
DECLARE list varchar(5000);

DECLARE cur1 CURSOR FOR SELECT `userid` from `user` where `userclass`= NEW.`publish_class`; 
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done=1;  

SET tid = NEW.task_id;
SET list = '';
 
OPEN  cur1; 
getUid_loop: LOOP  
FETCH cur1 INTO uid;
  IF done=1 THEN  
   LEAVE getUid_loop;  
  END IF;  
   
  set list = CONCAT(list,uid,',');
  
END LOOP getUid_loop;  
CLOSE cur1; 

insert into user_data(task_id,user_list) VALUES(1,list);


END