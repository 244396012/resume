// 封装一个CircleText对象
function CircleText( option ) {
	this._init( option );//构造函数默认执行初始化工作
}

CircleText.prototype = {
	_init: function( option ) {
		this.x = option.x || 0;		//圆形组的中心点坐标
		this.y = option.y || 0;
		this.innerRadius = option.innerRadius || 0;		//内圆半径
		this.outerRadius = option.outerRadius || 0;
		this.text = option.text || 'canvas';			//圆内的文字
		this.innerStyle = option.innerStyle || 'red';	//内圆的填充样式
		this.outerStyle = option.outerStyle || 'blue';	//外圆的填充样式

		//创建文字和圆形的一个组
		this.group = new Konva.Group({	
			x: this.x,  //设置组的x，y坐标后，所有的内部元素按照组内的新坐标系定位。
			y: this.y,
		});
		//初始化一个内部圆
		var innerCircle = new Konva.Circle({	//创建一个圆
			x: 0,	
			y: 0,
			radius: this.innerRadius,  //圆的半径
			fill: this.innerStyle,		//圆的填充颜色
			opacity: .8
		});
		//把内部圆，添加到组内
		this.group.add( innerCircle );

		//初始化一个圆环
		var outerRing = new Konva.Ring({	//初始化一个圆环
			x: 0,
			y: 0,
			innerRadius: this.innerRadius,	//内圆的半径
			outerRadius: this.outerRadius,  //外圆的半径
			fill: this.outerStyle,			//圆环的填充的样式
			opacity: .3						//透明度
		});
		//把外环，添加到组内
		this.group.add( outerRing );

		//初始化一个文字
		var text = new Konva.Text({
			x: 0 - this.outerRadius,
			y: -7,
			width: this.outerRadius * 2,//文字的宽度
			fill: '#fff',			    //文字的颜色
			fontSize: 17,				//文字的大小
			text: this.text,			//文字的内容
			align: 'center',			//居中显示
			fontStyle: 'bold'			//字体加粗
		});

		//把文字添加到组内
		this.group.add( text );

	},
	//把 组添加到层或者其他组中。
	addToGroupOrLayer: function( arg ) {
		arg.add( this.group );
	}
}