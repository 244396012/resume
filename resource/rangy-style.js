
define(['rangy-core'], function (rangy) {
    return {
        isSameStyle: isSameStyle,
        getTransTargetAttrs: getTransTargetAttrs,
        transferStyleToSpan: transferStyleToSpan,
        restoreDivStyle: restoreDivStyle,
        formatTarget: formatTarget
    };
    function getTransTargetAttrs(sourceTxt, segInfo) {
        var sameStyleData = window.sameStyleData;
        var targetAttrs = ' class="textarea_container ';
        sourceTxt = sourceTxt.replace(/(^\s*)|(\s*$)/g, '');
        sourceTxt = delBlank(sourceTxt);
        var isSameStyleResult = isSameStyle(sourceTxt);

        if (!sameStyleData) {
            sameStyleData = window.sameStyleData = {};
        }
        if (isSameStyleResult) {
            sameStyleData[segInfo.seg_id] = isSameStyleResult;
            if (!segInfo.last_targettxt) {
                targetAttrs += isSameStyleResult.classNameStr + ' "';
                if (isSameStyleResult.color) {
                    targetAttrs += ' style="color:' + isSameStyleResult.color + '" ';
                    targetAttrs += ' realcolor="' + isSameStyleResult.realcolor + '"';
                }
            } else {
                targetAttrs += '"';
            }
            if (sourceTxt.indexOf("fontLink") > -1 || sourceTxt.indexOf('fontHide') > -1) {
                targetAttrs += parseZAttrs(sourceTxt);
            }

        } else {
            targetAttrs += '"';
        }
        return targetAttrs;
    }
    function isSameStyle(txt) {
        var classNameStr, realcolor,
            color = undefined,
            result = false,
            reg = /<span(.*?)class="(.*?)"([^>]*)/g,
            arr = txt.match(reg);

        if (arr && arr.length == 1) {
            classNameStr = RegExp.$2;
            classNameStr = classNameStr.replace(/(highlights)|(fontText)|(fontHide)/g, "");
            classNameStr = classNameStr.replace(/(^\s*)|(\s*$)/g, "");
            if (classNameStr == "") return result;
            if (classNameStr.indexOf("fontColor") != -1) {
                txt.match(/color:(.*?)"/);
                color = RegExp.$1;
                txt.match(/realcolor="(.*?)"/g);
                realcolor = RegExp.$1;
            }
            classNameStr += " sameStyle";
            result = {
                classNameStr: classNameStr,
                color: color,
                realcolor: realcolor
            }
        }
        return result;
    }
    function delBlank(txt) {
        var span$,
            div$ = $("<div></div>");
        div$.html(txt);
        span$ = div$.children();
        if (span$.length > 0) {
            var firstSpan = span$.eq(0),
                lastSpan = span$.eq(span$.length - 1);
            if (firstSpan.html().replace(/\s/g, "") == "") {
                firstSpan.remove();
            }
            if (lastSpan.html().replace(/\s/g, "") == "") {
                lastSpan.remove();
            }
        }
        return div$.html();
    }
    function transferStyleToSpan(div$, rangy) {
        var spans, styleData;
        if (!div$ && rangy) {
            div$ = getDivFromRangy(rangy);
        }
        if (div$ && div$.hasClass("sameStyle")) {
            spans = div$.children("span");
            if (spans.length > 0) {
                styleData = parseDivStyle(div$);
                spans.addClass(styleData.classNameStr);
                spans.css("color", styleData.color);
                spans.attr("realcolor", styleData.realcolor);
                transferZTagData(div$, spans);
                div$.removeClass(styleData.classNameStr);
                div$.removeClass("sameStyle");
                div$.css("color", "");
            }
        }
    }
    function transferZTagData(div$, spanArr$) {
        var key, value,
            zAttrsConfig = ["type", "content", "insured", "num"];

        if (div$.hasClass("fontLink") || div$.hasClass('fontHide')) {

            for (var i = 0; i < zAttrsConfig.length; i++) {
                key = zAttrsConfig[i];
                value = div$.attr(key);
                spanArr$.attr(key, value);
            }
        }
    }
    function parseZAttrs(txt) {
        var key, value, result = "",
            obj$ = $(txt),
            zAttrsConfig = ["type", "content", "insured", "num"];
        for (var i = 0; i < zAttrsConfig.length; i++) {
            key = zAttrsConfig[i];
            value = obj$.attr(key);
            if (value) {
                result += key + '="' + value + '" ';
            }
        }

        return result;
    }
    function parseDivStyle(div$) {
        var classNameStr, color, classNames, realcolor;
        classNameStr = div$.attr("class");
        classNameStr = classNameStr.replace(/(sameStyle)|(textarea_container)/g, "");
        classNameStr = classNameStr.replace(/(^\s*)|(\s*$)/g, "");
        classNames = classNameStr.split(" ");
        color = div$.css("color");
        realcolor = div$.attr("realcolor");
        return {
            classNames: classNames,
            classNameStr: classNameStr,
            color: color,
            realcolor: realcolor
        }
    }
    function restoreDivStyle(div$) {
        var styleData,
            segInfo = div$.parents("tr.segment").data("segment");
        styleData = window.sameStyleData[segInfo.seg_id];
        if (div$ && styleData) {
            div$.addClass(styleData.classNameStr);
            div$.addClass("sameStyle");
            if (styleData.color) {
                div$.css("color", styleData.color);
                div$.attr("realColor", styleData.realcolor);
            }
        }
    }
    function getDivFromRangy(rangy) {
        var result = $(rangy.commonAncestorContainer);
        if (!result.is("div")) {
            result = result.parents("div.textarea_container");
        }
        return result;
    }
    function formatTarget(dom$) {
        var child, nodes, node, currentRange,
            spanTmp, tmp, range, rangeNode,
            illageChild = null,
            children = dom$.contents(),
            childrenClone = children.clone(),
            isSelectText = false;
        var cls = '';
        if (rangy.getSelection()) {
            range = rangy.getSelection().getRangeAt(0);
            rangeNode = _getRangeNode(range);
            if (range) {
                if (range.endOffset != range.startOffset) {
                    isSelectText = true;
                }
            }
        }
        for (var i = 0; i < children.length; i++) {
            var tar = children[i];
            if (tar.dataset.one && tar.dataset.one === '1') {
                tar.innerText = tar.innerText.substring(0, tar.innerText.length - 1);
                $(tar).removeAttr('data-one');
            }
        }
        for (var i = 0; i < childrenClone.length; i++) {
            child = children.eq(i);
            if (child[0].nodeType == 3) {
                child.wrap('<span class="fontText"></span>');
            } else if (child.html() == "") {
                child.remove();
            } else if (child.is("span")) {
                child.removeAttr('style class');
                nodes = child.contents();
                for (var j = 0; j < nodes.length; j++) {
                    node = nodes.eq(j);
                    spanTmp = null;
                    if (node.is("img")) {
                        spanTmp = child.clone();
                        spanTmp.html(node);
                    } else if (node[0].nodeType == 3 && isSelectText) {
                    } else if (node.is("em") && node.hasClass("highLight")) {
                        tmp = node.text();
                        spanTmp = child.clone();
                        spanTmp.text(tmp);
                        node.remove();
                    } else if (node.html() == "") {
                        node.remove();
                    } else if (node.is("span") && node.hasClass("fontText")) {
                        spanTmp = node;
                        node.remove();
                    } else {
                        tmp = node.text();
                        spanTmp = child.clone();
                        if (spanTmp.hasClass('tagWrap')) {
                            delete spanTmp[0].dataset.db;
                            delete spanTmp[0].dataset.fw;
                            delete spanTmp[0].dataset.no;
                            delete spanTmp[0].dataset.notag;
                        }
                        spanTmp.removeClass('tagWrap single double start end').addClass('fontText');
                        spanTmp.text(tmp);
                        illageChild = spanTmp;
                        node.remove();
                    }
                    if (spanTmp) {
                        child.before(spanTmp);
                    }
                }
            }
            else {
                tmp = child.text();
                spanTmp = $('<span class="fontText"></span>');
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
