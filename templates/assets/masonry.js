function layout(el){
	var h = [];
	var box = el.children;
	if(!box[0]) return;
	var minH = box[0].offsetHeight,
		boxW = box[0].offsetWidth,
		boxH,
		n = el.offsetWidth / boxW | 0;  //计算页面能排下多少Pin
		el.style.cssText = "position:relative;overflow:hidden;"

	// el.style.width = n * boxW + "px";
	for(var i = 0; i < box.length; i++) {
		boxh = box[i].offsetHeight; //获取每个Pin的高度
		if(i < n) { //第一行Pin以浮动排列，不需绝对定位
			h[i] = boxh;
			box[i].style.position = '';
		} else {
			minH =  Math.min.apply({},h); //取得各列累计高度最低的一列
			minKey = getarraykey(h, minH);
			h[minKey] += boxh ; //加上新高度后更新高度值
			box[i].style.position = 'absolute';
			box[i].style.top = minH + 'px';
			box[i].style.left = (minKey * boxW) + 'px';
		}
	}
	el.style.height = (h.length ? Math.max.apply({}, h) : 0) + 'px'; //容器高度跟随各列中最高的一列，不再写死
};
function sort(){
	var wraps = document.getElementsByClassName("hexo-pin-wrap");
	for(var i = 0; i < wraps.length; i++) {
		layout(wraps[i]);
	}
};
/* 返回数组中某一值的对应项数 */
function getarraykey(s, v) {
	for(k in s) {
		if(s[k] == v) {
			return k;
		}
	}
};

setTimeout(sort,100)

