// 导航栏切换时显示高亮
let links = document.querySelectorAll(".links a");
let bodyId = document.querySelector("body").id;

for (let link of links) {
    if (link.dataset.active == bodyId) {
        link.classList.add("active");
    }
}


// Wall页面图片点击放大效果
document.querySelectorAll('.wall-image-container img').forEach(image => {
    image.onclick = () => {
        document.querySelector('.popup-image').style.display = 'block';
        document.querySelector('.popup-image img').src = image.getAttribute('src');

    }
});

document.querySelector('.popup-image span').onclick = () => {
    document.querySelector('.popup-image').style.display = 'none';
}


// 图片按需加载

var API = {
    /**
      * 兼容Mozilla(attachEvent)和IE(addEventListener)的on事件
      * @param {String} element DOM对象 例如：window，li等
      * @param {String} type on事件类型，例如：onclick，onscroll等
      * @param {Function} handler 回调事件
      */
    on: function (element, type, handler) {
        return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent('on' + type, handler)
    },
    /**
      * 为对象绑定事件
      * @param {Object} object 对象
      * @param {Function} handler 回调事件
      */
    bind: function (object, handler) {
        return function () {
            return handler.apply(object, arguments)
        }
    },
    /**
      * 元素在页面中X轴的位置
      * @param {String} element DOM对象 例如：window，li等
      */
    pageX: function (El) {
        var left = 0;
        do {
            left += El.offsetLeft;

        } while (El.offsetParent && (El = El.offsetParent).nodeName.toUpperCase() != 'BODY');
        return left;

    },
    /**
      * 元素在页面中Y轴的位置
      * @param {String} element DOM对象 例如：window，li等
      */
    pageY: function (El) {
        var top = 0;
        do {
            top += El.offsetTop;

        } while (El.offsetParent && (El = El.offsetParent).nodeName.toUpperCase() != 'BODY');
        return top;

    },
    /**
      * 判断图片是否已加载
      * @param {String} element DOM对象 例如：window，li等
      * @param {String} className 样式名称
      * @return {Boolean} 布尔值
      */
    hasClass: function (element, className) {
        return new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)
    },
    /**
      * 获取或者设置当前元素的属性值
      * @param {String} element DOM对象 例如：window，li等
      * @param {String} attr 属性
      * @param {String} (value) 属性的值，此参数如果没有那么就是获取属性值，此参数如果存在那么就是设置属性值
      */
    attr: function (element, attr, value) {
        if (arguments.length == 2) {
            return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
        }
        else if (arguments.length == 3) {
            element.setAttribute(attr, value)
        }
    }
};

/**
  * 按需加载
  * @param {String} obj 图片区域元素ID
  */
function lazyload(obj) {
    this.lazy = typeof obj === 'string' ? document.getElementById(obj) : document.getElementsByTagName('body')[0];
    this.aImg = this.lazy.getElementsByTagName('img');
    this.fnLoad = API.bind(this, this.load);
    this.load();
    API.on(window, 'scroll', this.fnLoad);
    API.on(window, 'resize', this.fnLoad);

}
lazyload.prototype = {

    /**
      * 执行按需加载图片，并将已加载的图片标记为已加载
      * @return 无
      */
    load: function () {
        var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 屏幕上边缘
        var iClientHeight = document.documentElement.clientHeight + iScrollTop;
        // 屏幕下边缘
        var i = 0;
        var aParent = [];
        var oParent = null;
        var iTop = 0;
        var iBottom = 0;
        var aNotLoaded = this.loaded(0);
        if (this.loaded(1).length != this.aImg.length) {
            var notLoadedLen = aNotLoaded.length;
            for (i = 0; i < notLoadedLen; i++) {
                iTop = API.pageY(aNotLoaded[i]) - 200;
                iBottom = API.pageY(aNotLoaded[i]) + aNotLoaded[i].offsetHeight + 200;
                var isTopArea = (iTop > iScrollTop && iTop < iClientHeight) ? true : false;
                var isBottomArea = (iBottom > iScrollTop && iBottom < iClientHeight) ? true : false;
                if (isTopArea || isBottomArea) {
                    // 把预存在自定义属性中的真实图片地址赋给src
                    aNotLoaded[i].src = API.attr(aNotLoaded[i], 'data-src') || aNotLoaded[i].src;
                    if (!API.hasClass(aNotLoaded[i], 'loaded')) {
                        if ('' != aNotLoaded[i].className) {
                            aNotLoaded[i].className = aNotLoaded[i].className.concat(" loaded");

                        }
                        else {
                            aNotLoaded[i].className = 'loaded';

                        }
                    }
                }
            }
        }
    },

    /**
      * 已加载或者未加载的图片数组
      * @param {Number} status 图片是否已加载的状态，0代表未加载，1代表已加载
      * @return Array 返回已加载或者未加载的图片数组
      */
    loaded: function (status) {
        var array = [];
        var i = 0;
        for (i = 0; i < this.aImg.length; i++) {
            var hasClass = API.hasClass(this.aImg[i], 'loaded');
            if (!status) {
                if (!hasClass)
                    array.push(this.aImg[i])
            }
            if (status) {
                if (hasClass)
                    array.push(this.aImg[i])
            }
        }
        return array;
    }
};
// 按需加载初始化
API.on(window, 'load', function () { new lazyload() });


