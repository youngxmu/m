var question = {
	type : {
		1 : '填空题',
		2 : '选择题',
		3 : '多项选择题',
		4 : '判断题'
	},
	getQType : function(qtype){
		var typeName = question.type[qtype];
		if(!typeName){
			typeName = '其它';
		}
		return typeName;
	}
};

juicer.register('getQType', question.getQType);