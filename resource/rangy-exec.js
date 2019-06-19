define(['rangy-range', 'rangy-style', 'rangy-core'], function (segRangeTool, segStyleTool, rangy) {
  var Browsers = navigator.userAgent.toLowerCase();
  var getFirstRange = function () {
    var sel = rangy.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
  };
  var getSelections = function () {
    if (window.getSelection) return window.getSelection();
    else if (document.selection && document.selection.createRange && document.selection.type != "None")
      return document.selection.createRange();
  };
  var getSelectedNode = function () {
    var node, selection;
    if (window.getSelection) {
      selection = getSelection();
      node = selection.anchorNode;
    }
    if (!node && document.selection && document.selection.createRange && document.selection.type != "None") {
      selection = document.selection;
      var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
      node = range.commonAncestorContainer ? range.commonAncestorContainer :
        range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
      return (node.nodeName == "#text" ? $(node.parentNode) : $(node));
    } else return false;
  };
  var affectStyleAround = function (element, style) {
    var selectedTag = getSelectedNode();
    selectedTag = selectedTag ? selectedTag : element;
    if (selectedTag && style == false) {
      if (selectedTag.parent().is("[style]"))
        selectedTag.attr("style", selectedTag.parent().attr("style"));
      if (selectedTag.is("[style]"))
        selectedTag.find("*").attr("style", selectedTag.attr("style"));
    }
    else if (element && style && element.is("[style]")) {
      var styleKey = style.split(";");
      styleKey = styleKey[0].split(":");
      if (element.is("[style*=" + styleKey[0] + "]")) {
        element.find("*").css(styleKey[0], styleKey[1]);
      }
      selectText(element);
    }
  };
  var selectText = function (element) {
    if (element) {
      var element = element[0];

      if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
      } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();

        if (element != "undefined" && element != null) {
          range.selectNodeContents(element);

          selection.removeAllRanges();
          selection.addRange(range);

          if ($(element).is(":empty")) {
            $(element).append("&nbsp;");
            selectText($(element));
          }
        }
      }
    }
  };
  var exeCommendsDEP = function (Commands, thirdParam) {
    var range,
      sel = getSelections();
    if (window.getSelection) {
      if (sel.anchorNode && sel.getRangeAt)
        range = sel.getRangeAt(0);
      if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      if (!Browsers.match(/msie/)) document.execCommand('StyleWithCSS', false, false);

      document.execCommand(Commands, false, thirdParam);
    }
    else if (document.selection && document.selection.createRange && document.selection.type != "None") {
      range = document.selection.createRange();
      range.execCommand(Commands, false, thirdParam);
    }
  };
  var ecd = function (className, domEle, isBlur) {
    var range;
    var changeSts = new ChangeConfirmStatus();
    if (!isBlur) {
      range = rangy.getSelection().getRangeAt(0);
    } else {
      range = window.specialTagRangy;
    }
    segStyleTool.transferStyleToSpan(null, range);
    var isAddStyle = segRangeTool.isAddStyle(range, className);
    segRangeTool.changeSpecialStyle([className], range, isAddStyle);
    changeSts.single(domEle);
  };
  var initButton = function () {
    var btn = $('.tool-btn');
    btn.off('click').on('click', function () {
      var ele = $('tr.table-row.active').find('.edition-target');
      var userSelection = null, range = null, isOrigin = null;
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      if (userSelection.type === 'None') {
        return;
      }
      range = userSelection.getRangeAt(0);
      isOrigin = $(range.startContainer).parents('td.active-text>div');
      if(isOrigin.hasClass('edition-source') && !isOrigin.attr('contenteditable')){
        return;
      }
      if ($(this).hasClass('bold-btn')) {
        ecd('fontBold', ele);
      } else if ($(this).hasClass('italic-btn')) {
        ecd('fontItatic', ele);
      } else if ($(this).hasClass('underline-btn')) {
        ecd('fontUnder', ele);
      } else if ($(this).hasClass('sub-btn')) {
        ecd('fontSubscript', ele);
      } else if ($(this).hasClass('sup-btn')) {
        ecd('fontSupscript', ele);
      } else if ($(this).hasClass("clear-btn")) {
        clearUserSelections();
      }
    });
    return false;
  };
  initButton();
  var keyButtons = function () {
    $(document).on("keydown", function (event) {
      var e = window.event || event;
      var ele = $('.table-row.active').find('.edition-target');
      var userSelection = null, range = null, isOrigin = null;
      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      if (userSelection.type === 'None') {
        return;
      }
      range = userSelection.getRangeAt(0);
      isOrigin = $(range.startContainer).parents('td.active-text>div');
      if(isOrigin.hasClass('edition-source') && !isOrigin.attr('contenteditable')){
        return;
      }
      if (e.ctrlKey && e.keyCode === _keyCode._b) {
        e.preventDefault();
        ecd('fontBold', ele);
        return false;
      } else if (e.ctrlKey && e.keyCode === _keyCode._i) {
        e.preventDefault();
        ecd('fontItatic', ele);
        return false;
      } else if (e.ctrlKey && e.keyCode === _keyCode._u) {
        e.preventDefault();
        ecd('fontUnder', ele);
        return false;
      } else if (e.ctrlKey && e.keyCode === _keyCode["_-"]) {
        e.preventDefault();
        ecd('fontSubscript', ele);
        return false;
      } else if (e.ctrlKey && e.keyCode === _keyCode["_="]) {
        e.preventDefault();
        ecd('fontSupscript', ele);
        return false;
      } else if (e.altKey && e.keyCode === _keyCode._e) {
        e.preventDefault();
        clearUserSelections();
        return false;
      }
    });
  };
  keyButtons();

  function clearUserSelections() {
    var divContainer;
    var userSelection, range, copy, nodes, parent, change;
    var changeSts = new ChangeConfirmStatus();

    if (window.getSelection) {
      userSelection = window.getSelection();
    } else if (document.selection) {
      userSelection = document.selection.createRange();
    }
    if (userSelection.type === 'None') {
      return;
    }
    if (userSelection.type === 'Caret') {
      var target = $("tr.table-row.active");
      var eles = null;
      if (target && target.length > 0) {
        eles = target.find(".edition-target").contents().not('span.tagWrap');
        eles.removeClass().removeAttr('style').addClass('fontText');
        for (var x = 0; x < eles.length; x++) {
          var el = eles[x];
          for (var prop in el.dataset) {
            delete el.dataset[prop];
          }
        }
        divContainer = target.find(".edition-target");
      }
    } else {
      range = userSelection.getRangeAt(0);
      copy = range.cloneContents();
      nodes = $(copy).context.childNodes;
      parent = $(range.startContainer).parents('td.active-text');
      change = $(range.startContainer).parents('.edition-target');
      divContainer = change;
      if (parent && parent.length > 0 && $(parent).parent('tr').hasClass('active')) {
        if (nodes.length === 0) {
          return;
        } else if (nodes.length > 0 && nodes.length <= 1) {
          new ClearBreakSpan(getClassSpan(range.startContainer), '', range.startOffset, range.endOffset, '').single();
        } else if (nodes.length > 1) {
          for (var i = 0; i < nodes.length; i++) {
            if (i == 0) {
              new ClearBreakSpan(getClassSpan(range.startContainer), range.startOffset, nodes.length, '', getClassSpan(range.endContainer)).multi();
              continue;
            } else if (i == nodes.length - 1) {
              new ClearBreakSpan(getClassSpan(range.endContainer), range.endOffset, '', nodes.length, getClassSpan(range.startContainer)).multi();
              break;
            }
          }
        }
        (change && change.length > 0) && changeSts.single(change);
      }
    };
    window.setTimeout(function(){
      var _this = divContainer[0];
      dealTranObj.tempTrans($(_this));
    }, 50);
  }

  function ClearBreakSpan(span, offset, offsetS, offsetE, oSpan) {

    this.span = span;
    this.offset = offset;
    this.offsetS = offsetS;
    this.offsetE = offsetE;
    this.oSpan = oSpan;

    this.single = function () {//选中文本在标签内
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
      secondSpan.removeClass().removeAttr('style').addClass('fontText');
      for (var m in secondSpan[0].dataset) {
        delete secondSpan[0].dataset[m];
      }
    };

    this.multi = function () {//选中文本跨多个标签
      var text = this.span.text(),
        firstTxt = text.substring(0, this.offset),
        secondTxt = text.substring(this.offset),
        secondSpan = this.span.clone(true);
      this.span.text(firstTxt);
      secondSpan.text(secondTxt);
      this.span.after(secondSpan);
      if (this.offsetS && this.offsetS != '') {
        var sAll = this.span.next().nextUntil(this.oSpan);
        secondSpan.removeClass().removeAttr('style').addClass('fontText');
        sAll.removeClass().removeAttr('style').addClass('fontText');
        for (var m in secondSpan[0].dataset) {
          delete secondSpan[0].dataset[m];
        }
        for (var x = 0; x < sAll.length; x++) {
          var el = sAll[x];
          for (var n in el.dataset) {
            delete el.dataset[n];
          }
        }
      }
      if (this.offsetE && this.offsetE != '') {
        var sAll = this.oSpan.next().nextUntil(this.span);
        this.span.removeClass().removeAttr('style').addClass('fontText');
        sAll.removeClass().removeAttr('style').addClass('fontText');
        for (var m in this.span[0].dataset) {
          delete this.span[0].dataset[m];
        }
        for (var x = 0; x < sAll.length; x++) {
          var el = sAll[x];
          for (var n in el.dataset) {
            delete el.dataset[n];
          }
        }
      }
    }
  }

  return {
    ecd: ecd,
    affectStyleAround: affectStyleAround,
    handleButton: initButton
  };

});
