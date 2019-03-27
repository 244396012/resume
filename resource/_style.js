/**
 * segStyleTool.js
 * @desciption: 用于处理句段内容样式。(译文自动获取原文句段单样式)
 */
define(['rangy-core'],function (rangy) {
    return {
        isSameStyle: isSameStyle,
        getTransTargetAttrs: getTransTargetAttrs,
        transferStyleToSpan: transferStyleToSpan,
        restoreDivStyle: restoreDivStyle,
        formatContainer: formatContainer
    };

    /***
     *  解析句段原文，获取div样式属性
     * @param {String} sourceTxt: 原文内容
     * @param {Object} segInfo: 句段信息
     * @returns {string} 属性字符串
     */
    function getTransTargetAttrs(sourceTxt,segInfo){
        var sameStyleData = window.sameStyleData;
        //全句的style相同时特殊处理
        var targetAttrs = ' class="textarea_container ';
        //清除原文前后空格
        sourceTxt = sourceTxt.replace(/(^\s*)|(\s*$)/g,'');
        sourceTxt = delBlank(sourceTxt);
        var isSameStyleResult = isSameStyle(sourceTxt);

        if(!sameStyleData){
            sameStyleData = window.sameStyleData = {};
        }
        if(isSameStyleResult){
            sameStyleData[segInfo.seg_id] = isSameStyleResult;
            if(!segInfo.last_targettxt ) {
                targetAttrs += isSameStyleResult.classNameStr + ' "';
                if (isSameStyleResult.color) {
                    targetAttrs += ' style="color:' + isSameStyleResult.color + '" ';
                    targetAttrs += ' realcolor="' + isSameStyleResult.realcolor + '"';
                }
            }else{
                targetAttrs += '"';
            }
            if (sourceTxt.indexOf("fontLink") > -1 || sourceTxt.indexOf('fontHide') > -1) {
                targetAttrs += parseZAttrs(sourceTxt);
            }

        }else {
            targetAttrs += '"';
        }
        return targetAttrs;
    }

    /***
     * 判断原文是否是单样式
     * @param {String} txt: 原文
     * @returns {boolean}
     */
    function isSameStyle(txt){
        var classNameStr,realcolor,
            color = undefined,
            result = false,
            reg = /<span(.*?)class="(.*?)"([^>]*)/g,
            arr = txt.match(reg);

        if(arr && arr.length == 1){
            classNameStr = RegExp.$2;
            //去除无用className(隐藏不加入单格式)
            classNameStr = classNameStr.replace(/(highlights)|(fontText)|(fontHide)/g, "");
            classNameStr = classNameStr.replace(/(^\s*)|(\s*$)/g, "");

            //无特殊格式的直接返回。
            if(classNameStr == "")return result;

            if(classNameStr.indexOf("fontColor") != -1){
                txt.match(/color:(.*?)"/);
                color = RegExp.$1;
                txt.match(/realcolor="(.*?)"/g);
                realcolor = RegExp.$1;
            }
            classNameStr += " sameStyle";
            result = {
                classNameStr: classNameStr,
                color : color,
                realcolor : realcolor
            }
        }
        return result;
    }

    /***
     * 删除开头结尾的空白span标签
     * @param {string} txt - 目标字符串
     * @returns {*}
     */
    function delBlank(txt){
        var span$,
            div$ = $("<div></div>");
        div$.html(txt);
        span$ = div$.children();
        if(span$.length > 0){
            var firstSpan = span$.eq(0),
                lastSpan = span$.eq(span$.length-1);
            if(firstSpan.html().replace(/\s/g,"") == ""){
                firstSpan.remove();
            }
            if(lastSpan.html().replace(/\s/g,"") == ""){
                lastSpan.remove();
            }
        }
        return div$.html();
    }

    /***
     * 将div上的样式转移到span上。
     * @param {jQuery object} div$:
     * @param {rangy object} rangy: 选择文字。
     */
    function transferStyleToSpan(div$,rangy){
        var spans,styleData;
        if(!div$ && rangy){
            div$ = getDivFromRangy(rangy);
        }
        if(div$ && div$.hasClass("sameStyle")){
            spans = div$.children("span");
            if(spans.length > 0){
                styleData = parseDivStyle(div$);
                spans.addClass(styleData.classNameStr);
                spans.css("color",styleData.color);
                spans.attr("realcolor",styleData.realcolor);
                transferZTagData(div$,spans);
                div$.removeClass(styleData.classNameStr);
                div$.removeClass("sameStyle");
                div$.css("color","");

                //     div$.data("styleData",JSON.stringify(styleData));
            }
        }
    }

    /***
     * 将z标签转移到span上
     * @param {jQuery object} div$: 目标div
     * @param {jQuery object} spanArr$：目标span
     */
    function transferZTagData(div$,spanArr$){
        var key,value,
            zAttrsConfig = ["type", "content", "insured","num"];

        if(div$.hasClass("fontLink") || div$.hasClass('fontHide')){

            for (var i = 0; i < zAttrsConfig.length; i++) {
                key = zAttrsConfig[i];
                value = div$.attr(key);
                spanArr$.attr(key, value);
            }
        }
    }

    /***
     * 解析z标签属性
     * @param {String} txt: 原文
     * @returns {string}：属性字符串
     */
    function parseZAttrs(txt){
        var key,value,result = "",
            obj$ = $(txt),
            zAttrsConfig = ["type", "content", "insured","num"];
        for (var i = 0; i < zAttrsConfig.length; i++) {
            key = zAttrsConfig[i];
            value = obj$.attr(key);
            if(value){
                result += key + '="' + value + '" ';
            }
        }

        return result;
    }

    /***
     *  解析译文容器的样式
     * @param div$
     * @returns {{
     *      classNames: {Array}  class name 数组,
     *      classNameStr: {String} class name 字符串,
     *      color: {String} 展示颜色,
     *      realcolor: {String} 真实的颜色
     *   }}
     */
    function parseDivStyle(div$){
        var classNameStr,color,classNames,realcolor;
        classNameStr = div$.attr("class");
        classNameStr = classNameStr.replace(/(sameStyle)|(textarea_container)/g,"");
        classNameStr = classNameStr.replace(/(^\s*)|(\s*$)/g, "");
        classNames = classNameStr.split(" ");
        color = div$.css("color");
        realcolor = div$.attr("realcolor");
        return {
            classNames:classNames,
            classNameStr:classNameStr,
            color:color,
            realcolor:realcolor
        }
    }

    /***
     * 还原div的样式
     * @param div$
     */
    function restoreDivStyle(div$){
        var styleData,
            segInfo = div$.parents("tr.segment").data("segment");
        styleData = window.sameStyleData[segInfo.seg_id];
        if(div$ && styleData){
            div$.addClass(styleData.classNameStr);
            div$.addClass("sameStyle");
            if(styleData.color){
                div$.css("color",styleData.color);
                div$.attr("realColor",styleData.realcolor);
            }
        }
    }

    /***
     * 从rangy对象上获取div
     * @param rangy:{object} rangy 对象。
     * @returns {jQuery}
     */
    function getDivFromRangy(rangy){
        var result = $(rangy.commonAncestorContainer);
        if(!result.is("div")){
            result = result.parents("div.textarea_container");
        }
        return result;
    }


    //重置div样式
    function formatContainer(dom$) {
        var child, nodes, node, currentRange,
            spanTmp, tmp, range, rangeNode,
            illageChild = null,
            children = dom$.contents(),
            childrenClone = children.clone(),
            isSelectText = false; // 译文框里面是否选中了需要复制或拖拽的文本
        if (rangy.getSelection()) {
            range = rangy.getSelection().getRangeAt(0);
            rangeNode = _getRangeNode(range);
            if (range) {
                if (range.endOffset != range.startOffset) {
                    isSelectText = true;
                }
            }
        }
        for (var i = 0; i < childrenClone.length; i++) {
            child = children.eq(i);
            if (child[0].nodeType == 3) {
                child.wrap('<span class="fontTxt"></span>');
            } else if (child[0].tagName && child[0].tagName == "IMG") {
                child.wrap('<span class="fontTxt zImg"></span>');
                illageChild = child;
            } else if (child.html() == "") {
                child.remove();
            } else if (child.is("span") && child.hasClass("fontTxt")) {
                nodes = child.contents();
                for (var j = 0; j < nodes.length; j++) {
                    node = nodes.eq(j);
                    spanTmp = null;
                    if (!$(node.context).hasClass("highlights")) {
                        if (node.is("img")) {
                            spanTmp = child.clone();
                            spanTmp.html(node);
                            spanTmp.addClass("zImg");
                        } else if (node[0].nodeType == 3 && isSelectText) {
                            // 如果有被译员选中的文本，不做任何处理
                        } else if (node.is("em") && node.hasClass("highLight")) {
                            tmp = node.text();
                            spanTmp = child.clone();
                            spanTmp.text(tmp);
                            node.remove();
                        } else if (node.html() == "") {
                            node.remove();
                        } else if (node.is("span") && node.hasClass("fontTxt")) {
                            spanTmp = node;
                            node.remove();
                        } else {
                            tmp = node.text();
                            spanTmp = child.clone();
                            spanTmp.removeClass("zImg");
                            spanTmp.text(tmp);
                            illageChild = spanTmp;
                            node.remove();
                        }
                        if (spanTmp) {
                            child.before(spanTmp);
                        }
                    }
                }
            } else {
                tmp = child.text();
                spanTmp = $('<span class="fontTxt"></span>');
                spanTmp.text(tmp);
                child.replaceWith(spanTmp);
                illageChild = spanTmp;
            }
        }
        if (illageChild) {
            rangeNode = illageChild ? illageChild[0] : rangeNode;
            currentRange = rangy.getSelection().getRangeAt(0);
            if (range && currentRange && rangeNode) {
                if (!_restoreRange(range) && !_compareTwoRange(range, currentRange)
                    && rangeNode) {
                    range.setEndAfter(rangeNode);
                    range.collapse(false);
                    range.select();
                }
            }
        }
        return dom$;
    }

    function _getRangeNode(range) {
        if (!range) return null;
        var offset,
            node = range.endContainer,
            endOffset = range.endOffset;
        if (node.nodeType != 3) {
            offset = (endOffset - 1 >= 0) ? endOffset - 1 : 0;
            node = node.childNodes[offset];
        }
        return node;
    }

    function _restoreRange(range) {
        var node = range.startContainer;
        if (range.collapsed && node.nodeType == 3
            && $(node).parents("body").length > 0) {
            range.setEnd(node, range.endOffset);
            range.select();
            return true;
        }
        return false;
    }

    function _compareTwoRange(range1, range2) {
        if (range1.startContainer == range2.startContainer
            && range1.endContainer == range2.endContainer
            && range1.startOffset == range2.startOffset
            && range1.endOffset == range2.endOffset) {
            return true;
        }
        return false;
    }
});