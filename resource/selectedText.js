
/*
* 该文件是文本操作对象。
* 定义operateText对象，主要包含复制样式、自定义样式、插入标签、切换大小写等。
* author: zhaoyong
*/

var operateText = (function ($) {
  /*
  ******* 私有方法 **********
  */
  /***
   * 获取某个节点的span父节点
   * @param domEle：节点
   * @returns span父节点
   */
  function getClass(domEle) {
    var result = domEle;
    while (!(result.tagName && result.tagName == "SPAN")) {
      result = result.parentNode;
    }
    return $(result);
  };
  /*** 方法：处理将插入的标签
   * 打断某个span标签，生成新的span标签
   * @param span$: 标签
   * @param offset：偏移量
   * @param id: 标签id
   * @param txt: 标签序号
   * @param type: 标签类型
   */
  function InsertTag(type, span, offset, offsetS, offsetE, tag) {
    this.type = type;
    this.span = span;
    this.offset = offset;
    this.offsetS = offsetS;
    this.offsetE = offsetE;
    let copyTag = $(tag).clone().removeAttr('style'),
      copyEndTag = null;
    if (copyTag.hasClass('double')) {
      let tempTag = $(tag).clone().removeClass('start').removeAttr('data-notag style').addClass('end');
      tempTag.find('img').attr('src', '/Contents/Editor/images/tag-' + tempTag.attr('data-no') + '-02.png');
      copyEndTag = tempTag;
    };
    //选中文本在标签内
    this.single = function () {
      if (this.span.hasClass("tagWrap") && this.span.hasClass("single")) {
        if (this.type === 'single') {
          this.span.after(copyTag);
        } else if (this.type === 'double') {
          this.span.after(copyEndTag);
          this.span.after(copyTag);
        }
        return;
      }
      if (this.span.hasClass("tagWrap") && this.span.hasClass("double")) {
        if (this.type === 'single') {
          this.span.after(copyTag);
        } else if (this.type === 'double') {
          this.span.after(copyEndTag);
          this.span.after(copyTag);
        }
        return;
      }
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offsetS),
        secondTxt = text.substring(this.offsetS, this.offsetE),
        thirdTxt = text.substring(this.offsetE),
        secondSpan = this.span.clone(true),
        thirdSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      thirdSpan.text(thirdTxt);
      this.span.after(thirdSpan);
      switch (this.type) {
        case 'single':
          this.span.after(copyTag);
          this.span.after(secondSpan);
          break;
        case 'double':
          this.span.after(copyEndTag);
          this.span.after(secondSpan);
          this.span.after(copyTag);
          break;
      }
    };
    //选中文本跨多个标签
    this.multi = function () {
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offset),
        secondTxt = text.substring(this.offset),
        secondSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      switch (this.type) {
        case 'left':
          this.span.after(secondSpan);
          this.span.after(copyTag);
          break;
        case 'right':
          this.span.after(secondSpan);
          this.span.after(copyEndTag);
          break;
      }
    };
  }
  //方法：复制文本样式
  function CopyStyle(styObj, span, offset, offsetS, offsetE, oSpan) {
    var _className = styObj.className.value,
      _styleStr = "";
    this.span = span;
    this.offset = offset;
    this.offsetS = offsetS;
    this.offsetE = offsetE;
    this.oSpan = oSpan;
    for (let key in styObj.dataSet) {
      var val = my_match(key);
      if (val === 'font-size:') {
        var fontsize = styObj.dataSet[key];
        _styleStr += val + fontsize + "px;";
      } else if (key !== 'fw' && key !== 'db') {
        _styleStr += val + styObj.dataSet[key].replace(/[,]+/g, " ") + ";";
      }
    };
    //选中文本在标签内
    this.single = function () {
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offsetS),
        secondTxt = text.substring(this.offsetS, this.offsetE),
        thirdTxt = text.substring(this.offsetE),
        secondSpan = this.span.clone(true),
        thirdSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      thirdSpan.text(thirdTxt);
      this.span.after(secondSpan);
      secondSpan.after(thirdSpan);
      secondSpan.removeClass().addClass(_className);
      secondSpan.attr({ 'style': _styleStr });
      for (let item in styObj.dataSet) {
        secondSpan.attr("data-" + item, styObj.dataSet[item].replace(/[,]+/g, " "));
      }
    };
    //选中文本跨多个标签
    this.multi = function () {
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offset),
        secondTxt = text.substring(this.offset),
        secondSpan = this.span.clone(true);
      if (this.offsetS && this.offsetS != '') {
        var sAll = this.span.next().nextUntil(this.oSpan).not(".tagWrap");
        if (!secondSpan.hasClass('tagWrap')) {
          secondSpan.removeClass().addClass(_className);
          secondSpan.attr({ 'style': _styleStr });
        }
        sAll.removeClass().addClass(_className);
        sAll.attr({ 'style': _styleStr });
        for (let item in styObj.dataSet) {
          secondSpan.attr("data-" + item, styObj.dataSet[item].replace(/[,]+/g, " "));
          sAll.attr("data-" + item, styObj.dataSet[item].replace(/[,]+/g, " "));
        }
      }
      if (this.offsetE && this.offsetE != '') {
        var sAll = this.oSpan.next().nextUntil(this.span).not(".tagWrap");
        if (!this.span.hasClass('tagWrap')) {
          this.span.removeClass().addClass(_className);
          this.span.attr({ 'style': _styleStr });
        }
        sAll.removeClass().addClass(_className);
        sAll.attr({ 'style': _styleStr });
        for (let item in styObj.dataSet) {
          this.span.attr("data-" + item, styObj.dataSet[item].replace(/[,]+/g, " "));
          sAll.attr("data-" + item, styObj.dataSet[item].replace(/[,]+/g, " "));
        }
      }
      if (this.span.hasClass('tagWrap')) return;
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      this.span.after(secondSpan);
    };
    //匹配属于何种样式，返回值value
    function my_match(key) {
      var value = "";
      switch (key) {
        case "bg": value = "background:#"; break;
        case "cl": value = "color:#"; break;
        case "sz": value = "font-size:"; break;
        case "fs": value = "font-family:"; break;
      }
      return value;
    }
  }
  // 方法：自定义文本样式
  function CustomStyle(type, val, span, offset, offsetS, offsetE, oSpan) {
    var cls = '', style = '', originStyle = '';
    this.type = type;
    this.value = val.split('#')[1];
    this.span = span;
    this.offset = offset;
    this.offsetS = offsetS;
    this.offsetE = offsetE;
    this.oSpan = oSpan;
    //选中文本在标签内
    this.single = function () {
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offsetS),
        secondTxt = text.substring(this.offsetS, this.offsetE),
        thirdTxt = text.substring(this.offsetE),
        secondSpan = this.span.clone(true),
        thirdSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      thirdSpan.text(thirdTxt);
      this.span.after(secondSpan);
      secondSpan.after(thirdSpan);
      if (this.type && this.type === 'cl') {
        cls = 'fontColor';
        style = 'color:#' + this.value + ';';
        originStyle = secondSpan.attr('style');
        secondSpan.addClass(cls);
        secondSpan.attr({ 'style': originStyle ? originStyle + style : style, 'data-cl': this.value });
      }
      if (this.type && this.type === 'bg') {
        cls = 'fontHighBg';
        originStyle = secondSpan.attr('style');
        style = 'background-color:#' + this.value + ';';
        secondSpan.addClass(cls);
        secondSpan.attr({ 'style': originStyle ? originStyle + style : style, 'data-bg': this.value });
      }
    };
    //选中文本跨多个标签
    this.multi = function () {
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offset),
        secondTxt = text.substring(this.offset),
        secondSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      this.span.after(secondSpan);
      if (this.offsetS && this.offsetS != '') {
        // console.log('end')
        var sAll = this.span.next().nextUntil(this.oSpan);
        if (this.type && this.type === 'cl') {
          cls = 'fontColor';
          originStyle = secondSpan.attr('style');
          style = 'color:#' + this.value + ';';
          secondSpan.addClass(cls);
          secondSpan.attr({ 'style': originStyle ? originStyle + style : style, 'data-cl': this.value });
          for (let i = 0; i < sAll.length; i++) {
            var tar = $(sAll[i]),
              currStyle = tar.attr('style');
            tar.addClass(cls);
            tar.attr({ 'style': currStyle ? currStyle + style : style, 'data-cl': this.value });
          }
        }
        if (this.type && this.type === 'bg') {
          cls = 'fontHighBg';
          style = 'background-color:#' + this.value + ';';
          originStyle = secondSpan.attr('style');
          secondSpan.addClass(cls);
          secondSpan.attr({ 'style': originStyle ? originStyle + style : style, 'data-bg': this.value });
          for (let i = 0; i < sAll.length; i++) {
            var tar = $(sAll[i]),
              currStyle = tar.attr('style');
            tar.addClass(cls);
            tar.attr({ 'style': currStyle ? currStyle + style : style, 'data-bg': this.value });
          }
        }
      }
      if (this.offsetE && this.offsetE != '') {
        // console.log('start')
        var sAll = this.oSpan.next().nextUntil(this.span);
        if (this.type && this.type === 'cl') {
          cls = 'fontColor';
          style = 'color:#' + this.value + ';';
          originStyle = secondSpan.attr('style');
          this.span.addClass(cls);
          this.span.attr({ 'style': originStyle ? originStyle + style : style, 'data-cl': this.value });
          for (let i = 0; i < sAll.length; i++) {
            var tar = $(sAll[i]),
              currStyle = tar.attr('style');
            tar.addClass(cls);
            tar.attr({ 'style': currStyle ? currStyle + style : style, 'data-cl': this.value });
          }
        }
        if (this.type && this.type === 'bg') {
          cls = 'fontHighBg';
          style = 'background-color:#' + this.value + ';';
          originStyle = secondSpan.attr('style');
          this.span.addClass(cls);
          this.span.attr({ 'style': originStyle ? originStyle + style : style, 'data-bg': this.value });
          for (let i = 0; i < sAll.length; i++) {
            var tar = $(sAll[i]),
              currStyle = tar.attr('style');
            tar.addClass(cls);
            tar.attr({ 'style': currStyle ? currStyle + style : style, 'data-bg': this.value });
          }
        }
      }
    };
  };
  // 类：选中文本，切换大小写
  class CaseSensitive {
    constructor(startEle, endEle, startOffset, endOffset) {
      this.startEle = startEle;
      this.endEle = endEle;
      this.startOffset = startOffset;
      this.endOffset = endOffset;
      this.isTrans = this.$islower();
    }
    //处理文本：nodeType = 3
    $text() {
      var range, userSelection;
      var text = this.startEle.text(),
        firstTxt = text.substring(0, this.startOffset),
        secondTxt = text.substring(this.startOffset, this.endOffset),
        thirdTxt = text.substring(this.endOffset);
      var transTxt = this.isTrans ? secondTxt.toUpperCase() : secondTxt.toLowerCase();
      this.startEle.text(firstTxt + transTxt + thirdTxt);
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      range = userSelection.getRangeAt(0);
      range.deleteContents();
      range.setStart(this.startEle[0].childNodes[0], this.startOffset);
      range.setEnd(this.startEle[0].childNodes[0], this.endOffset);
    }
    //处理span元素：nodeType = 1
    $document() {
      var range, userSelection;
      var nextAll = this.startEle.nextUntil(this.endEle);
      var firstTxt = this.startEle.text(),
        secondTxt = this.endEle.text(),
        firstSpanTxt = firstTxt.substring(0, this.startOffset),
        secondSpanTxt = secondTxt.substring(this.endOffset);
      var firstToTrans = firstTxt.substring(this.startOffset),
        secondeToTrans = secondTxt.substring(0, this.endOffset);
      var firstTransTxt = this.isTrans ? firstToTrans.toUpperCase() : firstToTrans.toLowerCase(),
        secondTransTxt = this.isTrans ? secondeToTrans.toUpperCase() : secondeToTrans.toLowerCase();
      this.startEle.text(firstSpanTxt + firstTransTxt);
      this.endEle.text(secondTransTxt + secondSpanTxt);
      if (nextAll.length > 0) {
        var node = null,
          transTxt = "";
        for (var i = 0; i < nextAll.length; i++) {
          node = $(nextAll[i]);
          transTxt = this.isTrans ? node.text().toUpperCase() : node.text().toLowerCase();
          node.text(transTxt);
        }
      }
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      range = userSelection.getRangeAt(0);
      range.setStart(this.startEle[0].childNodes[0], this.startOffset);
      range.setEnd(this.endEle[0].childNodes[0], this.endOffset);
    }
    //判断首字母为小写
    $islower() {
      var lower = /^[a-z]$/;
      var firstWord = $.trim(this.startEle.text()).substring(this.startOffset).substr(0, 1);
      var isLower = lower.test(firstWord);
      return isLower;
    }
    //文本：首字母大小写
    $sentenceTxt(type) {
      var range, userSelection;
      var text = this.startEle.text(),
        firstTxt = text.substring(0, this.startOffset),
        secondTxt = text.substring(this.startOffset, this.endOffset),
        thirdTxt = text.substring(this.endOffset);
      var dealArr = [], dealStr = "";
      var str = secondTxt;
      var arr = str.split(" ");
      if (type == 1) {
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] !== "") {
            arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1);
            break;
          }
        }
        dealStr = arr.join(" ");
      } else if (type == 2) {
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] !== "") {
            arr[i] = arr[i].slice(0, 1).toLowerCase() + arr[i].slice(1);
            break;
          }
        }
        dealStr = arr.join(" ");
      } else if (type == 3) {
        arr.forEach((item, index) => {
          dealArr.push(item.slice(0, 1).toUpperCase() + item.slice(1));
        });
        dealStr = dealArr.join(" ");
      } else if (type == 4) {
        arr.forEach((item, index) => {
          dealArr.push(item.slice(0, 1).toLowerCase() + item.slice(1));
        });
        dealStr = dealArr.join(" ");
      }
      this.startEle.text(firstTxt + dealStr + thirdTxt);
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      range = userSelection.getRangeAt(0);
      range.deleteContents();
      range.setStart(this.startEle[0].childNodes[0], this.startOffset);
      range.setEnd(this.startEle[0].childNodes[0], this.endOffset);
    }
    //span元素：首字母大小写
    $sentenceTag(type) {
      var range, userSelection;
      var nextAll = this.startEle.nextUntil(this.endEle);
      var firstTxt = this.startEle.text(),
        secondTxt = this.endEle.text(),
        firstSpanTxt = firstTxt.substring(0, this.startOffset),
        secondSpanTxt = secondTxt.substring(this.endOffset);
      var firstToTrans = firstTxt.substring(this.startOffset),
        secondeToTrans = secondTxt.substring(0, this.endOffset);
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      range = userSelection.getRangeAt(0);
      var dealFirstTxt = "", dealEndTxt = "";
      if (type == 1) {
        var arr = firstToTrans.split(" ");
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] !== "") {
            arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1);
            break;
          }
        }
        dealFirstTxt = arr.join(" ");
        dealEndTxt = secondeToTrans;
      } else if (type == 2) {
        var arr = firstToTrans.split(" ");
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] !== "") {
            arr[i] = arr[i].slice(0, 1).toLowerCase() + arr[i].slice(1);
            break;
          }
        }
        dealFirstTxt = arr.join(" ");
        dealEndTxt = secondeToTrans;
      } else if (type == 3) {
        var arr1 = [], dealArr1 = [];
        var arr2 = [], dealArr2 = [];
        arr1 = firstToTrans.split(" ");
        dealArr1 = arr1.map((item) => {
          return item.slice(0, 1).toUpperCase() + item.slice(1);
        });
        arr2 = secondeToTrans.split(" ");
        dealArr2 = arr2.map((item) => {
          return item.slice(0, 1).toUpperCase() + item.slice(1);
        });
        dealFirstTxt = dealArr1.join(" ");
        dealEndTxt = dealArr2.join(" ");
        if (nextAll.length > 0) {
          for (var i = 0; i < nextAll.length; i++) {
            var node = nextAll[i];
            var _txt = "", _arr = [], _dealArr = [];
            _arr = node.innerText.split(" ");
            _dealArr = _arr.map((item) => {
              return item.slice(0, 1).toUpperCase() + item.slice(1);
            });
            _txt = _dealArr.join(" ");
            node.innerText = _txt;
          }
        }
      } else if (type == 4) {
        var arr1 = [], dealArr1 = [];
        var arr2 = [], dealArr2 = [];
        arr1 = firstToTrans.split(" ");
        dealArr1 = arr1.map((item) => {
          return item.slice(0, 1).toLowerCase() + item.slice(1);
        });
        arr2 = secondeToTrans.split(" ");
        dealArr2 = arr2.map((item) => {
          return item.slice(0, 1).toLowerCase() + item.slice(1);
        });
        dealFirstTxt = dealArr1.join(" ");
        dealEndTxt = dealArr2.join(" ");
        if (nextAll.length > 0) {
          for (var i = 0; i < nextAll.length; i++) {
            var node = nextAll[i];
            var _txt = "", _arr = [], _dealArr = [];
            _arr = node.innerText.split(" ");
            _dealArr = _arr.map((item) => {
              return item.slice(0, 1).toLowerCase() + item.slice(1);
            });
            _txt = _dealArr.join(" ");
            node.innerText = _txt;
          }
        }
      }
      this.startEle.text(firstSpanTxt + dealFirstTxt);
      this.endEle.text(dealEndTxt + secondSpanTxt);
      range.setStart(this.startEle[0].childNodes[0], this.startOffset);
      range.setEnd(this.endEle[0].childNodes[0], this.endOffset);
    };
  };
  /*
  ******** 共有方法 **********
  */
  /***
   * 方法：插入标签入口
   * @param id：插入标签id
   * @param num: 标签编号
   * @param type: 标签类型
   * @param tar: 选择文本属于的父级tr
   */
  function insertTagEntry(type, $tr, tag) {
    var userSelection, range, copy, change,
      nodes, editTr, editTd;
    var prevSvg, nextSvg;
    var cStatus = new ChangeConfirmStatus();
    if (window.getSelection) {
      userSelection = window.getSelection();
    } else if (document.selection) {
      userSelection = document.selection.createRange();
    }
    range = userSelection.getRangeAt(0);
    if (userSelection.type === 'None') return;
    if ($(range.startContainer).parents("td").hasClass("source-text")) return;
    copy = range.cloneContents();
    nodes = $(copy).context.childNodes;
    change = $(range.startContainer).parents('.edition-target');
    editTd = $($(range.commonAncestorContainer).context.parentNode).parents('td.active-text');
    editTr = range.commonAncestorContainer.className
    && (range.commonAncestorContainer.className == 'edition-target' || range.commonAncestorContainer.className == 'edition-source') ? editTd.context.parentNode : editTd[0].parentNode;
    //选中原文，不能插入
    if ((range.commonAncestorContainer.className && range.commonAncestorContainer.className == 'edition-source')
      || (range.commonAncestorContainer.nodeName == '#text' && range.commonAncestorContainer.parentNode.parentNode.className == 'edition-source')) {
      return;
    }
    //选中标签时，不能插入
    for (var n = 0; n < nodes.length; n++) {
      if (nodes[n].nodeName == 'SPAN' && $(nodes[n]).hasClass('tagWrap')) {
        $.Alert('插入标签失败');
        return;
      }
    }
    //不能插在成对的标签中
    if ($($(range.startContainer.parentNode)[0]).prevAll('span.tagWrap').length > 0
      && $($(range.startContainer.parentNode)[0]).nextAll('span.tagWrap').length > 0
    ) {
      prevSvg = $($(range.startContainer.parentNode)[0]).prevAll('span.tagWrap')[0].dataset.db;
      nextSvg = $($(range.startContainer.parentNode)[0]).nextAll('span.tagWrap')[0].dataset.db;
      if (prevSvg == nextSvg) {
        $.Alert('插入标签失败');
        return false;
      }
    }
    if ($(range.startContainer).hasClass('tagWrap')
      && $(range.startContainer).nextAll('span.tagWrap').length > 0
    ) {
      thisSvg = $(range.startContainer)[0].dataset.db;
      nextSvg = $(range.startContainer).nextAll('span.tagWrap')[0].dataset.db;
      if (thisSvg == nextSvg) {
        $.Alert('插入标签失败');
        return false;
      }
    }
    if ($(editTr).attr('data-no') === $tr.attr('data-no')) {
      if (type === 'double') {
        if (nodes.length === 0 || nodes.length === 1) {
          const singleTag = new InsertTag(type, getClass(range.startContainer), '', range.startOffset, range.endOffset, tag);
          singleTag.single();
        } else {
          for (var i = 0; i < nodes.length; i++) {
            if (i == 0) {
              const leftTag = new InsertTag('left', getClass(range.startContainer), range.startOffset, '', '', tag);
              leftTag.multi();
            } else if (i == nodes.length - 1) {
              const rightTag = new InsertTag('right', getClass(range.endContainer), range.endOffset, '', '', tag);
              rightTag.multi();
            }
          }
        }
      } else if (type === 'single' && userSelection.type == 'Caret') {
        const singleTag = new InsertTag(type, getClass(range.startContainer), '', range.startOffset, range.endOffset, tag);
        singleTag.single();
      }
      (change && change.length > 0) && cStatus.single(change);
      window.setTimeout(() => {
        var _this = change[0];
        dealTranObj.tempTrans($(_this));
      }, 50);
    }
  }
  //复制样式：带有颜色、背景色的原文入口
  function copyStyleEntry(ele) {
    var userSelection, range, copy, nodes, change;
    var cStatus = new ChangeConfirmStatus();
    var styleObj = {
      className: ele.classList,
      dataSet: ele.dataset
    };
    if (window.getSelection) {
      userSelection = window.getSelection();
    } else if (document.selection) {
      userSelection = document.selection.createRange();
    }
    if (userSelection.type === 'None') return;
    range = userSelection.getRangeAt(0);
    copy = range.cloneContents();
    nodes = $(copy).context.childNodes;
    change = $(range.startContainer).parents('.edition-target');
    isOrigin = $(range.startContainer).parents('td.active-text');
    if ($(change).parents('tr').hasClass('locked') || $(change).parents('tr').hasClass('repeated')) {
      return false;
    }
    if(isOrigin.hasClass('source-text')){
      return false;
    }
    if (nodes.length === 0) {
      return false;
    } else if (nodes.length > 0 && nodes.length <= 1) {
      const singleSpan = new CopyStyle(styleObj, getClass(range.startContainer), '', range.startOffset, range.endOffset, '');
      singleSpan.single();
    } else if (nodes.length > 1) {
      for (var i = 0; i < nodes.length; i++) {
        if (i == 0) {
          const firstSpan = new CopyStyle(styleObj, getClass(range.startContainer), range.startOffset, nodes.length, '', getClass(range.endContainer));
          firstSpan.multi();
          continue;
        } else if (i == nodes.length - 1) {
          const lastSpan = new CopyStyle(styleObj, getClass(range.endContainer), range.endOffset, '', nodes.length, getClass(range.startContainer));
          lastSpan.multi();
        }
      }
    }
    (change && change.length > 0) && cStatus.single(change);
    window.setTimeout(() => {
      var _this = change[0];
      dealTranObj.tempTrans($(_this));
    }, 50);
  }
  //用户自定义添加颜色入口
  function customStyleEntry(val, type) {
    var cStatus = new ChangeConfirmStatus();
    var userSelection, range, copy, nodes, change;
    if (window.getSelection) {
      userSelection = window.getSelection();
    } else if (document.selection) {
      userSelection = document.selection.createRange();
    }
    if (userSelection.type === 'None') return;
    range = userSelection.getRangeAt(0);
    copy = range.cloneContents();
    nodes = $(copy).context.childNodes;
    change = $(range.startContainer).parents('.edition-target');
    if (nodes.length === 0) {
      return;
    }
    if (nodes.length > 0 && nodes.length <= 1) {
      const singleStyle = new CustomStyle(type, val, getClass(range.startContainer), '', range.startOffset, range.endOffset, '');
      singleStyle.single();
    }
    if (nodes.length > 1) {
      for (var i = 0; i < nodes.length; i++) {
        if (i === 0) {
          const firstStyle = new CustomStyle(type, val, getClass(range.startContainer), range.startOffset, nodes.length, '', getClass(range.endContainer));
          firstStyle.multi();
          continue;
        } else if (i === nodes.length - 1) {
          const lastStyle = new CustomStyle(type, val, getClass(range.endContainer), range.endOffset, '', nodes.length, getClass(range.startContainer));
          lastStyle.multi();
        }
      }
    }
    (change && change.length > 0) && cStatus.single(change);
    window.setTimeout(() => {
      var _this = change[0];
      dealTranObj.tempTrans($(_this));
    }, 50);
  }
  //切换大小写入口
  function caseSensitiveEntry(f2) {
    var cStatus = new ChangeConfirmStatus();
    var userSelection, range, copy, nodes, change, parent;
    if (window.getSelection) {
      userSelection = window.getSelection();
    } else if (document.selection) {
      userSelection = document.selection.createRange();
    }
    if (userSelection.type === 'None') { return; }
    range = userSelection.getRangeAt(0);
    change = $(range.startContainer).parents('tr.table-row').find('div.edition-target');
    if (userSelection.type === "Caret" && f2) {
      var el, elDiv;
      var hasCls = $(range.startContainer.parentNode).parents('tr').hasClass('table-row');
      if (hasCls) {
        var caps;
        el = $(range.startContainer.parentNode).parents('tr');
        elDiv = el.find("div.edition-target");
        el[0].dataset.caps == 5 && el.attr('data-caps', 1);
        caps = el[0].dataset.caps;
        if (caps == 1) {
          for (var i = 0, len = elDiv.contents().length; i < len; i++) {
            var child = elDiv.contents()[i],
              txt = child.innerText.replace(/^\s*/g, "");
            if (!$(child).hasClass('tagWrap')) {
              child.innerText = txt.slice(0, 1).toUpperCase() + txt.slice(1);
              return;
            }
          }
        } else if (caps == 2) {
          for (var i = 0, len = elDiv.contents().length; i < len; i++) {
            var child = elDiv.contents()[i],
              txt = child.innerText.replace(/^\s*/g, "");
            if (!$(child).hasClass('tagWrap')) {
              child.innerText = txt.slice(0, 1).toLowerCase() + txt.slice(1);
              return;
            }
          }
        } else if (caps == 3) {
          for (var i = 0, len = elDiv.contents().length; i < len; i++) {
            var child = elDiv.contents()[i];
            var arr = [], dealArr = [], str = "";
            if (!$(child).hasClass('tagWrap')) {
              arr = child.innerText.split(' ');
              dealArr = arr.map((item, index) => {
                return item.slice(0, 1).toUpperCase() + item.slice(1);
              });
              str = dealArr.join(" ");
              child.innerText = str;
            }
          }
        } else if (caps == 4) {
          for (var i = 0, len = elDiv.contents().length; i < len; i++) {
            var child = elDiv.contents()[i];
            var arr = [], dealArr = [], str = "";
            if (!$(child).hasClass('tagWrap')) {
              arr = child.innerText.split(' ');
              dealArr = arr.map((item, index) => {
                return item.slice(0, 1).toLowerCase() + item.slice(1);
              });
              str = dealArr.join(" ");
              child.innerText = str;
            }
          }
        }
        el.attr('data-caps', ++caps);
      }
      (change && change.length > 0) && cStatus.single(change);
      window.setTimeout(() => {
        var _this = change[0];
        dealTranObj.tempTrans($(_this));
      }, 50);
      return;
    }
    copy = range.cloneContents();
    nodes = $(copy).context.childNodes;
    const caseSen = new CaseSensitive(getClass(range.startContainer), getClass(range.endContainer), range.startOffset, range.endOffset);
    if (nodes.length === 0) {
      return;
    } else if (nodes.length === 1) {
      !f2 && caseSen.$text();
      f2 && caseSen.$sentenceTxt(f2);
    } else if (nodes.length >= 2) {
      !f2 && caseSen.$document();
      f2 && caseSen.$sentenceTag(f2);
    }
    (change && change.length > 0) && cStatus.single(change);
    window.setTimeout(() => {
      var _this = change[0];
      dealTranObj.tempTrans($(_this));
    }, 50);
  }

  //QA高亮匹配
  function markQaResult(editTr, clickTr) {
    $(clickTr).addClass("active").siblings().removeClass("active");
    var isMark = $(editTr).find('td.active-text').find("em.mark"),
      isQ = $(editTr).find('td.active-text').find("q"),
      isU = $(editTr).find('td.active-text').find("u");
    if (isMark.length > 0 || isQ.length > 0 || isU.length > 0) {
      var sourceCld = $(editTr).find('div.edition-source').contents(),
        targetCld = $(editTr).find('div.edition-target').contents();
      for (var n = 0; n < sourceCld.length; n++) {
        var nodeSpan = $(sourceCld[n]);
        if (!nodeSpan.hasClass('tagWrap')) {
          var nodeSpanTxt = nodeSpan.text();
          nodeSpan.text(nodeSpanTxt);
        }
      }
      for (var m = 0; m < targetCld.length; m++) {
        var nodeSpan = $(targetCld[m]);
        if (!nodeSpan.hasClass('tagWrap')) {
          var nodeSpanTxt = nodeSpan.text();
          nodeSpan.text(nodeSpanTxt);
        }
      }
    }
    if (clickTr.dataset.json) {
      var data = JSON.parse($(clickTr).attr('data-json').replace(/\\"/g, "'"));
      data.forEach(function (item){
        var arr = [];
        var elDiv = item.sentence[0] === "T" ? $(editTr).find("div.edition-target") : $(editTr).find("div.edition-source");
        item.value.forEach((item1) => {
          arr.indexOf(item1) === -1 && arr.push(item1);
        });
        for (var i = 0; i < elDiv.contents().length; i++) {
          var node = elDiv.contents()[i],
            txt = node.innerHTML;
          if(!$(node).hasClass('tagWrap')){
            arr.forEach((item2) => {
              //不匹配<Q>、<U>等字符串，包括其子字符串；
              if (!/^([\<\/]*[qQuU]?[\>]*)$/.test(item2)) {
                var reg = null;
                try {
                  reg = new RegExp(item2, 'g');
                } catch (e) {
                  reg = item2;
                }
                txt = txt.replace(item2, "<U>" + item2 + "</U>");
              }
            });
            node.innerHTML = txt;
          }
        }
      });
    }
  }

  return {
    insertTagEntry,
    copyStyleEntry,
    customStyleEntry,
    caseSensitiveEntry,
    markQaResult
  }
})(jQuery);
