define(['rangy-core'], function (rangy) {

    var mutexClassMap = {
        "fontSubscript": "fontSupscript",
        "fontSupscript": "fontSubscript"
        },
        ignoreClassMap = [
            "zImg"
        ];
    var segRangeTool = {
        breakSpan: breakSpan,
        removeAllStyle: removeAllStyle,
        coverStyle: coverStyle,
        isAddStyle: isAddStyle,
        insertToRange: insertToRange,
        changeSpecialStyle: changeSpecialStyle
    };
    return segRangeTool;
    function insertToRange(dom$, range, isReplace) {
        dom$ = _formatDomClass(dom$).dom;
        if (isReplace) {
            range.deleteContents();
        }
        var offset = range.startOffset,
            startContainer = range.startContainer,
            positionDom$ = _getPositionEle$(startContainer, offset);
        if (positionDom$.is("div")) {
            positionDom$.prepend(dom$);
        } else {
            if (startContainer.nodeType == 3 && offset < startContainer.length) {
                breakSpan(positionDom$, offset);
            }
            positionDom$.after(dom$);
        }
        range.collapseAfter(dom$[0]);
        range.select();
        return range;
    };
    function changeSpecialStyle(classNames, range, isAddStyle) {
        if (typeof classNames == "array" && range.collapsed)return false;
        range = _changeSpecialStyle(classNames, range, isAddStyle);
        range.select();
        return range;
    };
    function isAddStyle(range, className) {
        var flag, content,
            contents = range.cloneContents().childNodes;
        for (var i = 0; i < contents.length; i++) {
            content = contents[i];
            if (content.nodeType == 3) {
                if (i == 0) {
                    flag = _hasClassName(range.startContainer, className);
                } else if (i == contents.length) {
                    flag = _hasClassName(range.endContainer, className);
                }
            } else {
                flag = _hasClassName(contents[i], className);
            }
            if (!flag) {
                return true;
            }
        }
        return false;
    };
    function coverStyle(dom$, range) {
        if (range.collapsed)return false;
        var classObj = _formatDomClass(dom$);
        range = _coverStyle(classObj, range);
        range.select();
        return range;
    };
    function removeAllStyle(range) {
        if (range.collapsed)return false;
        range = _removeAllStyle(range);
        range.select();
        return range;
    };
    function breakSpan(span$, offset) {
        var text = span$.text(),
            firstTxt = text.substring(0, offset),
            secondTxt = text.substring(offset),
            secondSpan = span$.clone(true);
        span$.text(firstTxt);
        secondSpan.text(secondTxt);
        span$.after(secondSpan);
        return secondSpan;
    };
    function _removeAllStyle(range) {
        var positionDom$, allSelectContents, obj, rangeTmp,
            textTmp = "",
            isInOneText = (range.startContainer === range.endContainer),
            spanTemplate = $('<span class="fontText"></span>'),
            imgSpanTmp = $('<span class="fontText zImg"></span>'),
            isTargetContainer = $(range.startContainer).hasClass('textarea_container ');

        if (isTargetContainer) {
            allSelectContents = $(range.startContainer).children('span');
            positionDom$ = $('<span></span>');
            $(range.startContainer).html(positionDom$);
        } else {
            allSelectContents = range.extractContents().childNodes;
            positionDom$ = _getPositionEle$(range.startContainer, range.startOffset);
        }

        if (isInOneText && !isTargetContainer) {
            rangeTmp = breakSpan(_getClassSpan$(range.startContainer), range.startOffset);
        }
        for (var i = 0; i < allSelectContents.length; i++) {
            obj = allSelectContents[i];
            if ($(obj).hasClass("zImg")) {
                if (textTmp != "") {
                    positionDom$ = _appendAfter(spanTemplate.clone(), textTmp, positionDom$);
                    textTmp = "";
                }
                positionDom$ = _appendAfter(imgSpanTmp.clone(), obj.innerHTML, positionDom$);
            } else if (obj.nodeType == 3) {
                textTmp += obj.textContent;
            } else {
                textTmp += obj.innerHTML;
            }
        }
        positionDom$ = _appendAfter(spanTemplate, textTmp, positionDom$);
        range.setEndAfter(positionDom$[0]);
        range.collapse(false);
        return range;
    };
    function _changeSpecialStyle(classNames, range, isAddStyle) {
        var positionDom$, spanCopy, newSpan$, spanObj, startSpan, newStartSpan$,
            allSelectContents, newEndSpan$, endSpan, len,
            isInOneText = (range.startContainer === range.endContainer),
            isTargetContainer = $(range.startContainer).hasClass('textarea_container ');

        if (isTargetContainer) {
            var spans$ = $(range.startContainer).children('span');
            for (var i = 0; i < spans$.length; i++) {
                var span$ = spans$.eq(i);
                _changeClassNames(classNames, span$, isAddStyle);
            }

        } else if (isInOneText) {
            spanObj = _getBreakSpan$(range.commonAncestorContainer, range.startOffset, range.endOffset);
            spanCopy = spanObj.spanCopy;
            newSpan$ = _changeClassNames(classNames, spanCopy, isAddStyle);
            range.deleteContents();
            positionDom$ = breakSpan(_getClassSpan$(range.startContainer), range.startOffset);
            positionDom$.before(newSpan$);
            range.selectNodeContents(newSpan$[0].childNodes[0]);
        } else {
            spanObj = _getBreakSpan$(range.startContainer, range.startOffset);
            newStartSpan$ = spanObj.spanCopy;
            startSpan = spanObj.span;
            newStartSpan$ = _changeClassNames(classNames, newStartSpan$, isAddStyle);
            spanObj = _getBreakSpan$(range.endContainer, null, range.endOffset);
            newEndSpan$ = spanObj.spanCopy;
            endSpan = spanObj.span;
            newEndSpan$ = _changeClassNames(classNames, newEndSpan$, isAddStyle);
            allSelectContents = range.extractContents().childNodes;
            startSpan.after(newStartSpan$);
            range.setStart(newStartSpan$[0].childNodes[0], 0);
            len = allSelectContents.length;
            for (var i = 1; i < len - 1; i++) {
                newSpan$ = _changeClassNames(classNames, $(allSelectContents[i]), isAddStyle);
                newSpan$ = newSpan$.clone();
                newStartSpan$.after(newSpan$);
                newStartSpan$ = newSpan$;
            }
            endSpan.before(newEndSpan$);
            var node = newEndSpan$[0].childNodes[0];
            if (node.length) {
                range.setEnd(node, node.length);
            } else {
                range.setEndAfter(node);
            }
        }
        return range;
    };
    function _getBreakSpan$(textNode, startOffset, endOffset) {
        var text, span$, spanCopy$, offset,
            tmp = textNode;
        if ($(textNode).is("div")) {
            offset = startOffset ? startOffset : endOffset;
            span$ = $(textNode).children().eq(offset);
            spanCopy$ = span$.clone();
        } else {
            startOffset = startOffset ? startOffset : 0;
            while (!(tmp.tagName && tmp.tagName == "SPAN")) {
                tmp = tmp.parentNode;
            }
            span$ = $(tmp);
            spanCopy$ = span$.clone();
            text = span$.text();
            if (text != "") {
                text = text.substring(startOffset, endOffset);
                spanCopy$.text(text);
            }

        }
        return {
            span: span$,
            spanCopy: spanCopy$
        };
    };
    function _coverStyle(classObj, range) {
        var className, spanClone, positionDom$,
            allSelectContents, obj, rangeTmp, cloneContents,
            textTmp = "",
            isInOneText = (range.startContainer === range.endContainer),
            spanTemplate = classObj.dom,
            imgSpanTmp = $('<span class="fontText zImg"></span>');

        allSelectContents = range.extractContents().childNodes;
        positionDom$ = _getPositionEle$(range.startContainer, range.startOffset);
        if (isInOneText) {
            rangeTmp = breakSpan(_getClassSpan$(range.startContainer), range.startOffset);
        }
        for (var i = 0; i < allSelectContents.length; i++) {
            obj = allSelectContents[i];
            if ($(obj).hasClass("zImg")) {
                if (textTmp != "") {
                    positionDom$ = _appendAfter(spanTemplate.clone(), textTmp, positionDom$);
                    textTmp = "";
                }
                positionDom$ = _appendAfter(imgSpanTmp.clone(), obj.innerHTML, positionDom$);
            } else if (obj.nodeType == 3) {
                textTmp += obj.textContent;
            } else {
                textTmp += obj.innerHTML;
            }
        }
        positionDom$ = _appendAfter(spanTemplate, textTmp, positionDom$);
        range.setEndAfter(positionDom$[0]);
        range.collapse(false);
        return range;
    };
    function _appendAfter(spanClone, content, positionDom$) {
        spanClone.html(content);
        positionDom$.after(spanClone);
        return spanClone;
    };
    function _changeClassNames(classNames, dom$, isAddStyle) {
        var className;
        for (var i = 0; i < classNames.length; i++) {
            if (isAddStyle) {
                if (!_isIgnoreClass(dom$)) {
                    className = classNames[i];
                    dom$.addClass(className);
                    handelSpecialClass(className, dom$);
                }
            } else {
                dom$.removeClass(classNames[i]);
            }
        }
        return dom$;
    };
    function handelSpecialClass(className, dom$) {
        var tmp = mutexClassMap[className];
        if (tmp) {
            dom$.removeClass(tmp);
        }
    };
    function _getClassSpan$(domEle) {
        var result = domEle;
        while (!(result.tagName && result.tagName == "SPAN")) {
            result = result.parentNode;
        }
        return $(result);
    };
    function _getPositionEle$(domEle, offset) {
        var result = domEle;
        while (result.nodeType == 3) {
            result = result.parentNode;
        }
        var result$ = $(result);
        if (result$.is("div") && result$.children().length > 0) {
            result$ = _getPositionEle$FromDiv(result$, offset);
        }
        return result$;
    };
    function _getPositionEle$FromDiv(dom$, offset) {
        var children = dom$[0].childNodes,
            result = $(children[offset - 1]);
        if (result.length == 0) {
            result = dom$;
        }
        return result;
    };
    function _formatDomClass(dom$) {
        dom$ = dom$.clone();
        var classNames = dom$.attr("class").split(" ");
        classNames = _removeOtherClass(classNames);
        dom$.attr("class", classNames.join(" "));
        return {
            'dom': dom$,
            'classNames': classNames
        };
    };
    function _removeOtherClass(classNames) {
        var className,
            map = {
                "fontBold": true,
                "fontItatic": true,
                "fontUnder": true,
                "fontSubscript": true,
                "fontSupscript": true,
                "fontColor": true,
                "fontLink": true,
                "zImg": true,
                "fontText": true
            };
        for (var i = 0; i < classNames.length; i++) {
            className = classNames[i];
            if (!map[className]) {
                classNames.splice(i, 1);
            }
        }
        return classNames;
    };
    function _hasClassName(content, className) {
        var span$ = _getClassSpan$(content);
        if (_isIgnoreClass(span$)) {
            return true;
        }
        return span$.hasClass(className);
    };
    function _isIgnoreClass(dom$) {
        for (var i = 0; i < ignoreClassMap.length; i++) {
            var className = ignoreClassMap[i];
            if (dom$.hasClass(className)) {
                return className;
            }
        }
        return null;
    };
});