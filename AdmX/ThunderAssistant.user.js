// ==UserScript==
// @name            ThunderAssistant
// @namespace       https://gist.github.com/aa65535/7891903
// @run-at          document-end
// @noframes        yes
// @include         http://dynamic.cloud.vip.xunlei.com/*
// @version         1.02
// ==/UserScript==
//
// For Firefox & Chrome & Safari
// Author By eminarcissus
// Source Code: http://userscripts.org/scripts/review/111748
// Modified By aa65535

var XL = function() {
    this.init();
};
XL.prototype = {
    init: function() {
        var o = this;
        this.auto_select = this.getAutoSelect();
        o.batchContent = [];
        o.links = {};
        o.links.normal = {};
        o.links.bt = {};
        o.nowType = null;
        // Rule only accept 5 variable: $name $url $dir $cookie $gdrive
        // Default Rule: $name\$url\$gdrive
        // IDM Rule: <\n$url\ncookie: $cookie\n>
        o.outputRule = localStorage.getItem('outputRule');
        o.outputRule = o.outputRule || '$name\\$url\\$gdrive';
        o.returnData = [];
        o.showButton = $('.saveside:first').clone().attr('id', 'showAddr')
        .css('clear', 'both').html('<a></a>').find('a').attr('href', '#')
        .html('<em class="ic_sf ic_ziyuan"></em>提取地址').end();
        o.buttonPoint = $('.saveside:last').parent();
        o.buttonPoint.append(o.showButton);
        $('#showAddr a').click(function() {
            o.showCheckedLinks();
        });
        // Fetch download links at current page
        o.fetchAll();
    },
    fetchAll: function() {
        var o = this;
        // Trigger stands for BT Folder to be parsed.
        // Normal stands for Emule/http links which had already been parsed.
        o.triggers = $('a[onclick*=bt_list_show]');
        o.normals = $('input[value*=gdl][id*=dl]');
        o.normals.each(function(i, down) {
            var tid = down.id.split('dl_url');
            tid = tid ? tid[1] : null;
            if (tid) {
                var fname = $(down).siblings('input[id^=durl]')[0].value;
                var furl = down.value;
                o.links.normal[tid] = {
                    'url': furl,
                    'name': fname
                };
            }
        });
        o.triggers.each(function(i, link) {
            var args = $(link).attr('onclick').toString().match(/bt_list_show\((.*)\)/)[1].split(',');
            var infoid = args[0].trim();
            var tid = args[1].match(/\d+/)[0].trim();
            var G_section = unsafeWindow.G_section || $('html').html().match(/G_section = (.*?);/)[1];
            var G_USERID = unsafeWindow.G_USERID || location.href.match(/userid=(\d+)/)[1];
            var req = "/interface/fill_bt_list?callback=bt_task_down_resp&tid=" +
                tid + "&infoid=" + infoid + "&g_net=" + G_section + "&p=0&uid=" + G_USERID + "&t=" + new Date();
            $.get(req, function(data) {
                if (data) {
                    o.pushData(data, tid);
                }
            });
        });
    },
    isBt: function(tid) {
        return this.links.bt.hasOwnProperty(tid);
    },
    isNormal: function(tid) {
        return this.links.normal.hasOwnProperty(tid);
    },
    parseArgs: function(archor) {
        var args = $(archor).attr('onclick').toString().match(/bt_task_down\((.*)\)/)[1].split(',');
        var infoid = args[0].trim();
        var tid = args[1].trim();
        return {
            'infoid': infoid,
            'tid': tid
        };
    },
    getLinkByTid: function(tid) {
        if (this.links.bt.hasOwnProperty(tid)) {
            return this.links.bt[tid];
        }
    },
    showAddress: function(addrString, type, callback) {
        var o = this;
        if (type == 'normal') {
            this.nowType = 'normal';
            this.addrBox = $('<div id="batchPublish"></div>')
            .append('<div id="batchHeader"></div>')
            .append('<div id="batchContent" style="float:left;clear:both"></div>')
            .append('<div id="batchFooter" style="flolat:left;clear:both"></div>');
            this.addrBox.find('.mcTab').css('display', 'none');
            this.addrBox.find('#batchHeader')
            .append('<a style="margin-left:8px;float:left" id="linkpage" href="javascript:;">输出Linkpage</a>')
            .append('<a style="float:right;margin-right:8px" id="close_btn" href="javascript:;">关闭</a>')
            .append('<a style="float:right;margin-right:12px" id="reset" href="javascript:;">重置格式</a>')
            .append('<a style="float:right;margin-right:8px" id="reform" href="javascript:;">修改格式</a>')
            .append('<a style="float:right;margin-right:8px" id="reverse" href="javascript:;">转序</a>');
            this.addrBox.find('#batchFooter')
            .append('<label style="margin-left:8px;float:left"><input id="auto_select" type="checkbox"/>点击自动全选</label>')
            .append('<a style="float:right;margin-right:8px" id="output_cmd" href="javascript:;" download="down.lst">保存为文件</a>');
            var batchContent = this.addrBox.find('#batchContent').append('<pre id="batchedlink"></pre>');
            this.addrBox.find('#batchedlink').css({
                width: '750px',
                height: '410px',
                overflow: 'scroll'
            }).html(addrString);
            $.blockUI({
                message: this.addrBox,
                css: {
                    width: '770px',
                    height: '450px'
                }
            });
            $('#batchPublish').get(0).onclick = function(e) {
                switch (e.target.id) {
                    case 'auto_select':
                        o.changeAutoSelect();
                        break;
                    case 'batchedlink':
                        if (o.auto_select) {
                            o.selectNode(e.target);
                        }
                        break;
                    case 'close_btn':
                        o.closeBox();
                        break;
                    case 'output_cmd':
                        o.outputCMD();
                        break;
                    case 'linkpage':
                        o.showLinkPage();
                        break;
                    case 'reform':
                        o.promptForRule();
                        break;
                    case 'reset':
                        if (confirm('重置导出格式？')) {
                            o.resetRule();
                        }
                        break;
                    case 'reverse':
                        o.reverseResult();
                        break;
                }
            };
        }
        this.outputCMD();
        $('#auto_select').attr('checked', this.auto_select);
        if (typeof callback === 'function') {
            callback();
        }
    },
    updateDownURL: function(text, urlId) {
        var uriContent = "data:application/octet-stream," + 
            encodeURIComponent(text).replace(/%26amp%3B/g, '%26');
        document.getElementById(urlId).href = uriContent;
    },
    outputCMD: function() {
        this.updateDownURL($('#batchedlink').html(), 'output_cmd');
    },
    closeBox: function() {
        $.unblockUI();
        this.nowType = null;
    },
    restartBox: function() {
        this.closeBox();
        this.showCheckedLinks();
    },
    getCheckedArchors: function() {
        var o = this;
        var returnLinks = [];
        $(':checked').each(function(i, cb) {
            var tid = cb.value;
            var flag = o.isBt(tid);
            if (flag) {
                var dlinks = o.getLinkByTid(tid);
                $.each(dlinks, function(i, link) {
                    returnLinks.push(link);
                });
            } else {
                if (o.isNormal(tid)) {
                    returnLinks.push(o.links.normal[tid]);
                }
            }
        });
        return returnLinks;
    },
    showCheckedLinks: function() {
        var returnLinks = this.getCheckedArchors();
        var linkString = this.getLinkDetail(returnLinks);
        this.showAddress(linkString, 'normal');
    },
    pushData: function(data, tid) {
        data = data.match(/bt_task_down_resp\((.*)\)/);
        var rt = JSON.parse(data[1]);
        this.returnData.push(data);
        var tempArray = [];
        $.each(rt.Result, function(i, down) {
            var fname = down.title;
            var furl = down.downurl;
            tempArray.push({
                'name': fname,
                'url': furl
            });
        });
        this.links.bt[tid] = tempArray;
    },
    getLinkDetail: function(links) {
        var o = this;
        var returnArray = [];
        if (o.outputRule == 'json') {
            $.each(links, function(i, link) {
                returnArray.push({
                    'uri': link.url,
                    'option': {
                        'out': link.name
                    }
                });
            });
            return JSON.stringify(returnArray);
        }
        $.each(links, function(i, link) {
            var name = link.name.split('\\\*');
            var filename = name.pop();
            var dir = name.length == 0 ? '/': +'/' + name.join('/');
            var tempString = o.outputRule
            .replace(/\\n/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/\$name/g, filename)
            .replace(/\$dir/g, dir)
            .replace(/\$cookie/g, document.cookie)
            .replace(/\$gdrive/g, document.cookie.match(/(gdriveid=[0-9A-F]*?);/)[1])
            .replace(/\$url/g, link.url);
            returnArray.push(tempString);
        });
        o.batchContent = returnArray;
        return returnArray.join('\n');
    },
    getPureAddress: function(links) {
        var tempString = '';
        $.each(links, function(i, link) {
            tempString += link.url + "\n";
        });
        return tempString;
    },
    getLinkPage: function() {
        var o = this;
        var returnLinks = o.getCheckedArchors();
        var content = $('<div id="main"></div>');
        content.append('<h1>Link Page</h1>');
        content.append('<style type="text/css">a{display:block;text-decoration:none}</style>');
        $.each(returnLinks, function(i, link) {
            var archor = $('<a></a>');
            archor.html(link.name).attr('href', link.url);
            content.append(archor).append('<br/>');
        });
        return content.html();
    },
    showLinkPage: function() {
        var content = this.getLinkPage();
        var my_window = window.open('', '_BLANK');
        my_window.document.write(content);
    },
    promptForRule: function() {
        var lastRule = localStorage.getItem('outputRule');
        var rule = prompt('输入您的自定义规则：', this.outputRule);
        rule = rule || (lastRule || '$name\\$url\\$gdrive');
        localStorage.setItem('outputRule', rule);
        this.outputRule = rule;
        this.restartBox();
    },
    resetRule: function() {
        this.outputRule = '$name\\$url\\$gdrive';
        localStorage.setItem('outputRule', this.outputRule);
        alert('输出规则已被重置。');
        this.restartBox();
    },
    changeAutoSelect: function() {
        var flag = localStorage.getItem('auto_select') === 'true';
        localStorage.setItem('auto_select', !flag);
        this.auto_select = !flag;
        $('#auto_select').attr('checked', this.auto_select);
    },
    getAutoSelect: function() {
        var flag = localStorage.getItem('auto_select');
        if (flag === null) {
            localStorage.setItem('auto_select', true);
            return true;
        }
        return flag === 'true';
    },
    reverseResult: function() {
        $('#batchedlink').html(this.batchContent.reverse().join('\r\n'));
    },
    selectNode: function(node) {
        // This is a third party function written by Martin Honnen
        // In comp.lang.javascript
        var selection, range, doc, win;
        selection = window.getSelection();
        doc = node.ownerDocument;
        win = doc.defaultView;
        if (doc && doc.createRange !== undefined &&
        win && win.getSelection !== undefined &&
        selection && selection.removeAllRanges !== undefined) {
            range = doc.createRange();
            range.selectNode(node);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (document.body && document.body.createTextRange !== undefined) {
            range = document.body.createTextRange();
            if (range) {
                range.moveToElementText(node);
                range.select();
            }
        }
    }
};
function XLInit() {
    if (unsafeWindow.jQuery === undefined) {
        setTimeout(XLInit, 1e3);
        return;
    }
    jQuery = unsafeWindow.jQuery;
    $ = jQuery;
    (function($) {
        $.fn.shiftClick = function() {
            var lastSelected;
            var checkBoxes = $(this);
            this.each(function() {
                $(this).click(function(ev) {
                    if (ev.shiftKey) {
                        var last = checkBoxes.index(lastSelected);
                        var first = checkBoxes.index(this);
                        var start = Math.min(first, last);
                        var end = Math.max(first, last);
                        var chk = lastSelected.checked;
                        for (var i = start; i < end; i++) {
                            checkBoxes[i].checked = chk;
                        }
                    } else {
                        lastSelected = this;
                    }
                });
            });
        };
        var blockMsg = $('<div class="blockUI blockMsg"></div>');
        var blockOverlay = $('<div class="blockUI blockOverlay"></div>');
        blockMsg.css({
            backgroundColor: '#eee',
            border: '3px solid #aaa',
            color: '#000',
            margin: 0,
            padding: 0,
            position: 'fixed',
            // textAlign: 'center',
            'z-index': 101
        });
        blockOverlay.css({
            backgroundColor: '#333',
            border: 0,
            height: '100%',
            left: 0,
            margin: 0,
            opacity: 0.5,
            padding: 0,
            position: 'fixed',
            top: 0,
            width: '100%',
            'z-index': 100
        });
        $.blockUI = function(opts) {
            blockMsg.html(opts.message).css(opts.css);
            $('body').append(blockOverlay).append(blockMsg);
            blockMsg.css({
                left: ($(window).width() - blockMsg.width()) / 2,
                top: ($(window).height() - blockMsg.height()) / 2.2
            });
        };
        $.unblockUI = function(opts) {
            blockMsg.remove();
            blockOverlay.remove();
        };
    } (jQuery));
    $('.in_ztclick').shiftClick();
    unsafeWindow.XL = new XL();
}
XLInit();
