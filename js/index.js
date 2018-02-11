(function() {
	// canvas技能
	//创建舞台
	var stage = new Konva.Stage({
		container: 'circleText',
		width: 450,
		height: 450
	});

	//创建层

	//中心点坐标
	var cenX = stage.width() / 2;
	var cenY = stage.height() / 2;

	//创建背景层
	var bgLayer = new Konva.Layer();
	stage.add(bgLayer);

	//绘制背景
	var innerRadius = 110; //内环的半径
	var outerRadius = 180; // 外环的半径

	// 创建背景内环虚线圆
	var innerCircle = new Konva.Circle({
		x: cenX,
		y: cenY,
		radius: innerRadius,
		stroke: '#122E7C',
		strokeWidth: 2,
		dash: [10, 4], //设置虚线，10实线， 4像素空 
	});
	//把 内环虚线圆添加到背景层中
	bgLayer.add(innerCircle);

	//创建背景的外环的虚线圆
	var outerCircle = new Konva.Circle({
		x: cenX,
		y: cenY,
		radius: outerRadius,
		stroke: 'green',
		strokeWidth: 2,
		dash: [10, 4], //设置虚线，10实线， 4像素空 
	});
	bgLayer.add(outerCircle); //把外虚线圆，添加到层中。

	// 把背景中心圆形 添加到 层中
	var cenCircleText = new CircleText({
		x: cenX,
		y: cenY,
		innerRadius: 60,
		outerRadius: 70,
		innerStyle: '#2A3466',
		outerStyle: '#E6E8EF',
		text: '技能'
	});
	cenCircleText.addToGroupOrLayer(bgLayer);

	bgLayer.draw();

	//计算圆的圆心坐标
	var x0 = cenX + innerRadius * Math.cos(-60 * Math.PI / 180);
	var y0 = cenY + innerRadius * Math.sin(-60 * Math.PI / 180);

	// 动画层的绘制
	var animateLayer = new Konva.Layer();
	stage.add(animateLayer);

	//创建2环层的组
	var L2Group = new Konva.Group({
		x: cenX, //组内的 x，y坐标。
		y: cenY
	});

	//添加2环的圆
	//2环上的ajax形状组
	var L2_CircleText_AJAX = new CircleText({
		x: innerRadius * Math.cos(0 * Math.PI / 180), //圆的x,y坐标
		y: innerRadius * Math.sin(0 * Math.PI / 180),
		innerRadius: 27, //内圆半径
		outerRadius: 30, //外圆的半径
		innerStyle: '#F77F89', //内圆填充的颜色呢
		outerStyle: '#F87A85', //外圆环填充的颜色
		text: 'Ajax'
	});
	L2_CircleText_AJAX.addToGroupOrLayer(L2Group);

	//添加2环的圆
	//2环上java的圆形组
	var L2_CircleText_JAVA = new CircleText({
		x: innerRadius * Math.cos(120 * Math.PI / 180), //文本圆的x坐标
		y: innerRadius * Math.sin(120 * Math.PI / 180), //文本圆的y坐标
		innerRadius: 32, // 内圆半径
		outerRadius: 33, // 外圆半径
		innerStyle: '#F06A59', //内部填充样式
		outerStyle: '#E8F2F0', //外圆的样式
		text: 'css3' // 内圆的文本
	});
	L2_CircleText_JAVA.addToGroupOrLayer(L2Group);
	// 添加sql
	var L2_CircleText_ORACLE = new CircleText({
		x: innerRadius * Math.cos(240 * Math.PI / 180), //文本圆的x坐标
		y: innerRadius * Math.sin(240 * Math.PI / 180), //文本圆的y坐标
		innerRadius: 25, // 内圆半径
		outerRadius: 28, // 外圆半径
		innerStyle: '#D07EF3', //内部填充样式
		outerStyle: '#F0E5F8', //外圆的样式
		text: 'H5' // 内圆的文本
	});
	L2_CircleText_ORACLE.addToGroupOrLayer(L2Group);

	//把 第二层的组添加到 动画层上去
	animateLayer.add(L2Group);

	//创建一个3环的组
	var L3_group = new Konva.Group({
		x: cenX,
		y: cenY
	});

	//绘制3环圆
	// 绘制3环上的html
	var L3_CircleText_HTML = new CircleText({
		x: outerRadius * Math.cos(0 * Math.PI / 180),
		y: outerRadius * Math.sin(0 * Math.PI / 180),
		innerRadius: 43, //内圆半径
		outerRadius: 48, //外圆半径
		innerStyle: '#68ABFE', //内圆的填充样式
		outerStyle: '#DDEAF8', //外圆的填充样式
		text: 'Mysql' //圆形内的文字
	});
	L3_CircleText_HTML.addToGroupOrLayer(L3_group);

	// 绘制3环上的Node
	var L3_CircleText_Node = new CircleText({
		x: outerRadius * Math.cos(51 * Math.PI / 180),
		y: outerRadius * Math.sin(51 * Math.PI / 180),
		innerRadius: 43, //内圆半径
		outerRadius: 48, //外圆半径
		innerStyle: '#2def33', //内圆的填充样式
		outerStyle: '#E6DAE2', //外圆的填充样式
		text: 'Node' //圆形内的文字
	});
    L3_CircleText_Node.addToGroupOrLayer(L3_group);
	// 绘制3环上的sass
    var L3_CircleText_sass = new CircleText({
        x: outerRadius * Math.cos(102 * Math.PI / 180),
        y: outerRadius * Math.sin(102 * Math.PI / 180),
        innerRadius: 43, //内圆半径
        outerRadius: 48, //外圆半径
        innerStyle: '#E86E94', //内圆的填充样式
        outerStyle: '#E6DAE2', //外圆的填充样式
        text: 'Sass' //圆形内的文字
    });
    L3_CircleText_sass.addToGroupOrLayer(L3_group);
	//绘制3环上的 es6圆形组
	var L3_CircleText_es6 = new CircleText({
		x: outerRadius * Math.cos(153 * Math.PI / 180),
		y: outerRadius * Math.sin(153 * Math.PI / 180),
		innerRadius: 40, //内圆半径
		outerRadius: 45, //外圆半径
		innerStyle: '#91BFF8', //内圆的填充样式
		outerStyle: '#E1E1E1', //外圆的填充样式
		text: 'ES6' //圆形内的文字
	});
    L3_CircleText_es6.addToGroupOrLayer(L3_group);

	//绘制3环上的 gp圆形组
	var L3_CircleText_gp = new CircleText({
		x: outerRadius * Math.cos(205 * Math.PI / 180),
		y: outerRadius * Math.sin(205 * Math.PI / 180),
		innerRadius: 35, //内圆半径
		outerRadius: 38, //外圆半径
		innerStyle: '#ef9119', //内圆的填充样式
		outerStyle: '#E7EDDB', //外圆的填充样式
		text: 'Gulp' //圆形内的文字
	});
    L3_CircleText_gp.addToGroupOrLayer(L3_group);

	//绘制3环上的 Python
	var L3_CircleText_py = new CircleText({
		x: outerRadius * Math.cos(256 * Math.PI / 180),
		y: outerRadius * Math.sin(256 * Math.PI / 180),
		innerRadius: 40, //内圆半径
		outerRadius: 45, //外圆半径
		innerStyle: '#CF2782', //内圆的填充样式
		outerStyle: '#F2E3EE', //外圆的填充样式
		text: 'Python' //圆形内的文字
	});
    L3_CircleText_py.addToGroupOrLayer(L3_group);
	//绘制3环上的 Vue
    var L3_CircleText_vue = new CircleText({
        x: outerRadius * Math.cos(310 * Math.PI / 180),
        y: outerRadius * Math.sin(310 * Math.PI / 180),
        innerRadius: 40, //内圆半径
        outerRadius: 45, //外圆半径
        innerStyle: '#ef370e', //内圆的填充样式
        outerStyle: '#F2E3EE', //外圆的填充样式
        text: 'Vue' //圆形内的文字
    });
    L3_CircleText_vue.addToGroupOrLayer(L3_group);
	//把3环添加到 动画层上去
	animateLayer.add(L3_group);

	//动画层进行渲染
	animateLayer.draw();

	var rotateAnglPerSecond = 60; //每秒钟设置旋转60
	//Konva的帧动画系统
	var animate = new Konva.Animation(function(frame) {
		//每隔一会执行此方法，类似 setInterval

		//timeDiff: 是两帧之间的时间差。是变化的，根据电脑性能和浏览器的状态动态变化。
		//计算 当前帧需要旋转的角度。
		var rotateAngle = rotateAnglPerSecond * frame.timeDiff / 1000; //上一帧和当前帧的时间差，毫秒。

		L2Group.rotate(rotateAngle); // 不是弧度，是角度

		//拿到所有二环上的圆的 内部组进行反向旋转
		L2Group.getChildren().each(function(item, index) {
			//设置二环上的组进行反向旋转
			item.rotate(-rotateAngle);
		});

		//三环逆旋转
		L3_group.rotate(-rotateAngle);

		// 三环的子元素进行反向旋转
		L3_group.getChildren().each(function(item, index) {
			//设置 每个圆形的组进行反向旋转。
			item.rotate(rotateAngle); //设置元素进行旋转 度数
		})
	}, animateLayer);
	animate.start(); //启动动画

	//Konva的事件系统，jQuery一样的
	//给动画层绑定一个鼠标移上去的事件
	animateLayer.on('mouseover', function() {
		//设置旋转角度
		rotateAnglPerSecond = 10; //设置旋转的角度为10度，旋转变慢。
	});

	//给动画层绑定 mouseout离开的事件。
	animateLayer.on('mouseout', function() {
		//当鼠标移开的时候，旋转加快
		rotateAnglPerSecond = 60; //设置旋转角度为60度，旋转变快
	});

	// echart个人能力
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('echart'));

	// 指定图表的配置项和数据
	var option = {
		series: [{
				type: 'pie',
				radius: ['25%', '35%'],
				avoidLabelOverlap: true,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: true,
					}
				},
				data: [{
					value: 100,
					name: '潜力100%'
				}, ]
			}, {
				type: 'pie',
				radius: ['36%', '45%'],
				avoidLabelOverlap: true,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 95,
					name: '执行力95%'
				}, {
					value: 5,
					name: '执行力 ↑',
					itemStyle: {
						normal: {
							color: 'transparent'
						}
					}

				}]
			}, {
				type: 'pie',
				radius: ['46%', '55%'],
				avoidLabelOverlap: true,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 80,
					name: '学习能力90%'
				}, {
					value: 20,
					name: '学习能力 ↑',
					itemStyle: {
						normal: {
							color: 'transparent'
						}
					}
				}, ]
			}, {
				type: 'pie',
				radius: ['56%', '65%'],
				avoidLabelOverlap: true,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 65,
					name: '职业技能75%'
				}, {
					value: 35,
					name: '职业技能 ↑',
					itemStyle: {
						normal: {
							color: 'transparent'
						}
					}
				}, ]
			}, {
				type: 'pie',
				radius: ['66%', '75%'],
				avoidLabelOverlap: true,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '18',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 59,
					name: '工作经验75%'
				}, {
					value: 41,
					name: '工作经验 ↑',
					itemStyle: {
						normal: {
							color: 'transparent'
						}
					}
				}, ]
			}

		]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);

	// 控制视频播放
	var myVideo = document.getElementById("myVideo");
	myVideo.onclick = function() {
		if(this.paused) {
			this.play();
		} else {
			this.pause();
		}
	}

	// 扫描二维码
	var qq = document.getElementById("qq");
	var wx = document.getElementById("wx");
	qq.onclick = function() {
		console.log(999);
		layer.open({
			title: "扫一扫，添加我为QQ好友",
			type: 1,
			shadeClose: true, //点击遮罩关闭
			area: '302px',
			content: '\<\img src="img/qqCode.png" style="width:100%"/>'
		});
	}
	wx.onclick = function() {
		layer.open({
			title: "扫一扫，添加我为微信好友",
			type: 1,
			shadeClose: true,
			area: '302px',
			content: '\<\img src="img/wxCode.png" style="width:100%"/>'
		});
	}

	$('.container').on('click', function() {
		$('.menu').toggleClass('expanded');
		$('span').toggleClass('hidden');
		$('.container , .toggle').toggleClass('close');
	});

	window.onbeforeunload = function(){
		alert(1);
		$('.menu').addClass()('expanded');
		$('span').addClass('hidden');
		$('.container , .toggle').addClass('close');
	}
	
}());