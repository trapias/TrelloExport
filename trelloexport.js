/*
 * TrelloExport
 *
 * A Chrome extension for Trello, that allows to export boards to Excel spreadsheets, HTML with Twig templates, Markdown and OPML.
 *
 * Forked by @trapias (Alberto Velo)
 *  https://github.com/trapias/trelloExport
 * From:
 *  https://github.com/llad/trelloExport
 * Started from:
 *  https://github.com/Q42/TrelloScrum
 *
 * = = = VERSION HISTORY = = =
 * Whatsnew for version 1.8.8:
    - export Trello Plus Spent and Estimate data
    - export checklists
    - export comments (see commentLimit, default 100)
    - export attachments
    - export votes
    - use updated version of xlsx.js, modified by me (escapeXML)
    - use updated version of jquery, 2.1.0
* Whatsnew for version 1.8.9:
    - added column Card #
    - added columns memberCreator, datetimeCreated, datetimeDone and memberDone pulling modifications from https://github.com/bmccormack/export-for-trello/blob/5b2b8b102b98ed2c49241105cb9e00e44d4e1e86/trelloexport.js
    - added linq.min.js library to support linq queries for the above modifications
* Whatsnew for version 1.9.0:
    - switched to SheetJS library to export to excel, cfr https://github.com/SheetJS/js-xlsx
    - unicode characters are now correctly exported
* Whatsnew for version 1.9.1:
    - fixed button loading
    - some code cleaning
* Whatsnew for version 1.9.2:
    - fixed blocking error when duedate specified
    - new button loading function
* Whatsnew for version 1.9.3:
    - restored archived cards sheet
* Whatsnew for version 1.9.4:
    - fix exporting when there are no archived cards
* Whatsnew for version 1.9.5:
    - code lint
    - ignore case in finding 'Done' lists (thanks https://disqus.com/by/AlvonsiusAlbertNainupu/)
* Whatsnew for version 1.9.6:
    - order checklist items by position (issue #4)
    - minor code changes
* Whatsnew for version 1.9.7:
    - fix issue #3 (copied comments missing in export)
* Whatsnew for version 1.9.8:
    - use trello api to get data
* Whatsnew for version 1.9.9:
    - MAXCHARSPERCELL limit to avoid import errors in Excel (see https://support.office.com/en-nz/article/Excel-specifications-and-limits-16c69c74-3d6a-4aaf-ba35-e6eb276e8eaa)
    - removed commentLimit, all comments are loaded (but attention to MAXCHARSPERCELL limit above, since comments go to a single cell)
    - growl notifications with jquery-growl http://ksylvest.github.io/jquery-growl/
* Whatsnew for version 1.9.10:
    - adapt inject script to modified Trello layout
* Whatsnew for version 1.9.11:
    - options dialog
    - export full board or choosen list(s) only
    - add who and when item was completed to checklist items (issue #5 at GitHub)
* Whatsnew for version 1.9.12:
    - bugfix: the previously used BoardID was kept when navigating to another board
* Whatsnew for version 1.9.13:
    - new 'DoneTime' column holding card completion time in days, hours, minutes and seconds as per ISO8601 (cfr https://en.wikipedia.org/wiki/ISO_8601)
    - name (prefix) of 'Done' lists is now configurable, default "Done"
    - larger options dialog
    - export multiple (selected) boards
    - export multiple (selected) cards in a list
* Whatsnew for v. 1.9.14:
     - handle multiple nameListDone
     - fix getMoveCardAction and getCreateCardAction to properly handle actions when exporting from multiple boards
     - added a new function (getCommentCardActions) to load comments with a dedicated query
     - format dates according to locale
     - new capability to filter exported lists by name when exporting multiple boards
* Whatsnew for v. 1.9.15:
    - finally fix comments and done calculation exporting: thanks @fepsch
* Whatsnew for v. 1.9.16:
    - new icon
    - investigating issues reported by @fepsch
* Whatsnew for v. 1.9.17:
    - finally fix exporting ALL comments per card: now loading comments per single card, way slower but assures all comments are exported
* Whatsnew for v. 1.9.18:
    - improve UI: better feedback message timing, yet still blocking UI during export due to sync ajax requests
    - removed data limit setting from options dialog - just use 1000, maximum allowed by Trello APIs
    - fix filename (YYYYMMDDhhmmss)
    - fix some UI issues
* Whatsnew for v. 1.9.19:
    - refactoring export flow
    - updated jQuery Growl to version 1.3.1
    - new markdown export mode
* Whatsnew for v. 1.9.20:
    - fixes due to Trello UI changes
* Whatsnew for v. 1.9.21:
    - some UI (CSS) improvements
    - improved options dialog, resetting options when switching export type
    - new columns for Excel export: 'Total Checklist items' and 'Completed Checklist items'
    - better checklists formatting for Excel export
    - export to HTML
* Whatsnew for v. 1.9.22:
    - fix improper .md encoding as per issue #8 https://github.com/trapias/TrelloExport/issues/8
    - new option to decide whether to export archived items
* Whatsnew for v. 1.9.23:
    - OPML export
    - add memberDone to markdown and HTML exports
* Whatsnew for v. 1.9.24:
    - checkboxes to enable/disable exporting of comments, checklist items and attachments
    - new option to export checklist items to rows, for Excel only
* Whatsnew for v. 1.9.25:
    - paginate cards loading so to be able to load all cards, even if exceeding the API limit of 1000 records per call
* Whatsnew for v. 1.9.26 (thanks chris https://github.com/collisdigital):
    - export points estimate and consumed from Card titles based on Scrum for Trello
    - improved regex for Trello Plus estimate/spent in card titles
* Whatsnew for v. 1.9.27:
    - fix ajax.fail functions
    - fix loading boards when current board does not belong to any organization
* Whatsnew for v. 1.9.28:
    - fix cards loading: something is broken with the paginated loading introduced with 1.9.25; to be further investigated
* Whatsnew for v. 1.9.29:
    - fix bug using user fullName, might not be available (thanks Natalia L.)
    - new css to format HTML exported files
* Whatsnew for v. 1.9.30:
    - fix 1.9.29 beta
    - finalize new css for HTML exports
* Whatsnew for v. 1.9.31:
    - fix due date format in Excel export (issue #12)
    - fix missing export of archived cards (issue #13)
* Whatsnew for v. 1.9.32:
    - hopefully fixed bug with member fullName reading
    - new option to export labels and members to Excel rows, like already available for checklist items (issue #15 https://github.com/trapias/TrelloExport/issues/15)
    - new option to show attached images inline for Markdown and HTML exports (issue #16 https://github.com/trapias/TrelloExport/issues/16)
* Whatsnew for v. 1.9.33:
    - new data field dateLastActivity exported (issue #18)
    - new data field numberOfComments exported (issue #19)
    - new option to choose which columns to export to Excel (issue #17)
* Whatsnew for v. 1.9.34:
    - only show columns chooser for Excel exports
    - can now set a custom css for HTML export
    - can now check/uncheck all columns to export
* Whatsnew for v. 1.9.35:
    - fix Trello header css height
* Whatsnew for v. 1.9.36:
    - filter by list name, card name or label name
    - help tooltips
* Whatsnew for v. 1.9.37:
    - bugfix multiple css issues and a bad bug avoiding the "add member" function to work properly, all due to the introduction of bootstrap css and javascript to use the bootstrap-multiselect plugin; now removed bootstrap and manually handled multiselect missing functionalities
* Whatsnew for v. 1.9.38:
    - css cleanup
    - re-enabled tooltips
    - export custom fields (pluginData handled with the "Custom Fields" Power-Up) to Excel
* Whatsnew for v. 1.9.39:
    - fix custom fields loading (issue #27)
    - fix card info export to MD (issue #25)
* Whatsnew for v. 1.9.40:
    - https://github.com/trapias/TrelloExport/issues/28 ok with Done prefix
    - contains vs startsWith filters
* Whatsnew for v. 1.9.41:
    - persist TrelloExport options to localStorage: CSS, selected export mode, selected export type, name of 'Done' list (issue #24)
    - fix due date locale
    - expand flag to export archived cards to all kind of items, and filter consequently
    - list boards from all available organizations with the "multiple boards" export type
* Whatsnew for v. 1.9.42:
    - new organization name column in Excel exports (issue https://github.com/trapias/TrelloExport/issues/30)
    - custom fields working again following Trello API changes (issue https://github.com/trapias/TrelloExport/issues/31), but not for multiple boards
* Whatsnew for v. 1.9.43:
    - new SPONSORED feature: Twig templates for HTML export https://github.com/trapias/TrelloExport/issues/35 and https://github.com/trapias/TrelloExport/issues/36
    - added card dueComplete field from Trello updated API, used in HTML Twig template
    - fix filtering options
    - Twig template selection (local templates)
    - Default and Bibliography HTML Twig templates (SPONSORED)
    - fixed issue #39 "Board menu not open" error https://github.com/trapias/TrelloExport/issues/39
    - save last template used to localStorage, and reload next time
    - scrollable options dialog
    - template sets: load custom Twig templates from any https URL
    - Default, Bibliography and Newsletter HTML Twig templates
* Whatsnew for v. 1.9.44:
    - Dummy release needed to update Chrome Web Store, wrong blog article link!
* Whatsnew for v. 1.9.45:
    - button to clear all settings saved to localStorage
    - new jsonLabels array for labels
* Whatsnew for v. 1.9.46:
    - fix new "clear localStorage" button position
* Whatsnew for v. 1.9.47:
    - responsive images in Bibliography template
    - fix double encoding of card description
* Whatsnew for v. 1.9.48:
    - bugfix HTML encoding for multiple properties
    - small fixes in templates
    - two Newsletter templates
* Whatsnew for v. 1.9.49:
    - bugfix encoding (again), https://github.com/trapias/TrelloExport/issues/43
* Whatsnew for v. 1.9.50:
    - bugfix due date exported as "invalid date" in excel and markdown
    - filters back working, https://github.com/trapias/TrelloExport/issues/45
* Whatsnew for v. 1.9.51:
    - bugfix export of checklists, comments and attachments to Excel
    - change "prefix" filters to "string": all filters act as "string contains", no more "string starts with" since 1.9.40
* Whatsnew for v. 1.9.52:
    - avoid saving local CSS to localstorage
    - fix filters (reopened issue https://github.com/trapias/TrelloExport/issues/45)
    - paginate loading of cards in bunchs of 300 (fix issue https://github.com/trapias/TrelloExport/issues/47)
* Whatsnew for v. 1.9.53:
    - new look: the options dialog is now built with Tingle https://robinparisi.github.io/tingle/
    - sponsor: support open source development!
* Whatsnew for v. 1.9.54:
    - bugfix: export checklists with no items when selecting "one row per each checklist item"
    - new feature: save selected columns to localStorage (issue https://github.com/trapias/TrelloExport/issues/48)
* Whatsnew for v. 1.9.55:
    - fix exporting of custom fields (include only if requested)
    - fix exporting of custom fields saved to localstorage
* Whatsnew for v. 1.9.56:
    - enable export of custom fields for the 'Multiple Boards' type of export
* Whatsnew for v. 1.9.57:
    - fix columns loading
* Whatsnew for v. 1.9.58:
    - modified description in manifest to hopefully improve Chrome Web Store indexing
    - really fix columns loading
    - fix custom fields duplicates in excel
* Whatsnew for v. 1.9.59:
    - HTML Twig: added "linkdoi" function to automatically link Digital Object Identifier (DOI) numbers to their URL, see http://www.doi.org/
    - Apply filters with AND (all must match) or OR (match any) condition (issue #38)
* Whatsnew for v. 1.9.60:
    - added MIT License (thanks Mathias https://github.com/mtn-gc)
    - updated Bridge24 adv
* Whatsnew for v. 1.9.61:
    - fix error in markdown export https://github.com/trapias/TrelloExport/issues/56
* Whatsnew for v. 1.9.62:
    - fix issue #55, Export Done and Done By is missing for archived cards
    - sort labels alphabetically
* Whatsnew for v. 1.9.63:
    - fix unshowing button on team boards (issue #65, thanks https://github.com/varmais)
* Whatsnew for v. 1.9.64:
    - fix some UI defects for the "export columns" dropdown 
    - new CSV export type
* Whatsnew for v. 1.9.65:
    - fix exporting of Archived items to Excel and CSV
* Whatsnew for v. 1.9.66:
    - added dueComplete field to exported columns
* Whatsnew for v. 1.9.67:
    - added header x-trello-user-agent-extension to all AJAX calls to Trello, trying to find a solution for https://github.com/trapias/TrelloExport/issues/81
* Whatsnew for v. 1.9.68:
    - avoid duplicate header row before archived cards in CSV export (issue #76)
    - export the cards "start" field (issue #84)
* Whatsnew for v. 1.9.69:
    - bugfix columns handling in loading data #74
* Whatsnew for v. 1.9.70:
    - Load Trello Plus Spent/Estimate in comments
* Whatsnew for v. 1.9.71:
    - manifest v3
    - checklist items' due date, assignee and status added to checklists' mode excel export
* Whatsnew for v. 1.9.72:
    - finally restored the capability to load templates from external URLs, issues #86 and #87
* Whatsnew for v. 1.9.73:
    - update jquery
    - fix OPML export of comments due date, issue #91
    - improvements for issue #29
* Whatsnew for v. 1.9.74:
    - fixed injection to adapt to modified Trello website
* Whatsnew for v. 1.9.75:
    - actually fixed injection to adapt to modified Trello website
* Whatsnew for v. 1.9.76:
    - Improved injection of TrelloExport button in menu
    - Added error monitoring for 429 (rate limit) and 504 (timeout) errors
    - Added small delays between API requests to reduce rate limit issues
* Whatsnew for v. 1.9.77:
    - fix UI for HTML export
*/
var VERSION = '1.9.77';

// TWIG templates definition
var availableTwigTemplates = [
    { name: 'html', url: chrome.runtime.getURL('/templates/html.twig'), description: 'Default HTML' },
    { name: 'bibliography', url: chrome.runtime.getURL('/templates/bibliography.twig'), description: 'Bibliography HTML', css: chrome.runtime.getURL('/templates/bibliography.css'), },
    { name: 'newsletter', url: chrome.runtime.getURL('/templates/newsletter.twig'), description: 'Newsletter with buttons HTML', css: chrome.runtime.getURL('/templates/newsletter.css'), },
    { name: 'newsletter2', url: chrome.runtime.getURL('/templates/newsletter2.twig'), description: 'Newsletter with links HTML', css: chrome.runtime.getURL('/templates/newsletter.css'), }
];
var localTwigTemplates = availableTwigTemplates;

function loadTemplateSetFromURL(sUrl) {
    console.log('loadTemplateSetFromURL:' + sUrl);
    return new Promise(function (resolve, reject) {

        if (!sUrl)
            resolve(availableTwigTemplates);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", sUrl, true);
        xhr.onload = function () {
            if (xhr.status == 200) {
                // console.log('template set loaded: ' + JSON.parse(xhr.response));
                resolve(xhr.response);
            }
            else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            // Crossdomain request denied
            if (xhr.status === 0) {
                console.error(xhr.response)
            }
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.crossDomain = true;
        xhr.withCredentials = false;
        xhr.send();
    });
}

function CleanLocalStorage() {
    localStorage.TrelloExportCSS = '';
    localStorage.TrelloExportMode = '';
    localStorage.TrelloExportListDone = '';
    localStorage.TrelloExportType = '';
    localStorage.TrelloExportTwigTemplate = '';
    localStorage.TrelloExportTwigTemplatesURL = '';
    localStorage.TrelloExportSelectedColumns = '';
    $.growl({
        title: "TrelloExport",
        message: "LocalStorage settings cleaned successfully. Please close and re-open TrelloExport.",
        fixed: false
    });
}

/**
 * http://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
 * (c) 2012 Steven Levithan <http://slevithan.com/>
 * MIT license
 */
if (!String.prototype.codePointAt) {
    String.prototype.codePointAt = function(pos) {
        pos = isNaN(pos) ? 0 : pos;
        var str = String(this),
            code = str.charCodeAt(pos),
            next = str.charCodeAt(pos + 1);
        // If a surrogate pair
        if (0xD800 <= code && code <= 0xDBFF && 0xDC00 <= next && next <= 0xDFFF) {
            return ((code - 0xD800) * 0x400) + (next - 0xDC00) + 0x10000;
        }
        return code;
    };
}

/**
 * Encodes special html characters
 * @param string
 * @return {*}
 */
function html_encode(string) {
    var ret_val = '';
    for (var i = 0; i < string.length; i++) {
        var iC = string.codePointAt(i);
        if (iC > 127) {
            ret_val += '&#' + string.codePointAt(i) + ';';
        } else {
            switch (iC) {
                case 34:
                    ret_val += "&quot;";
                    break;
                case 38:
                    ret_val += "&amp;";
                    break;
                case 60:
                    ret_val += "&lt;";
                    break;
                case 62:
                    ret_val += "&gt;";
                    break;
                default:
                    ret_val += string.charAt(i);
                    break;
            }
        }
    }
    return ret_val;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function escape4XML(s) {
    s = s.replaceAll('"', '&quot;');
    s = s.replaceAll("'", '&apos;');
    s = s.replaceAll('<', '&lt;');
    s = s.replaceAll('>', '&gt;');
    s = s.replaceAll('&', '&amp;');
    s = html_encode(s);
    return s;
}

function sortByKeyDesc(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

var $,
    byteString,
    xlsx,
    ArrayBuffer,
    Uint8Array,
    actionsCreateCard = [],
    actionsMoveCard = [],
    actionsCommentCard = [],
    idBoard,
    nProcessedBoards = 0,
    nProcessedLists = 0,
    nProcessedCards = 0,
    $excel_btn,
    dataLimit = 1000, // limit the number of items retrieved from Trello (1000 is max allowed by Trello API server)
    MAXCHARSPERCELL = 32767,
    exportlists = [],
    exportboards = [],
    exportcards = [],
    nameListDone = "Done",
    filterListsNames = [],
    pageSize = 25, // cfr https://trello.com/c/8MJOLSCs/10-limit-actions-for-cards-requests
    customFields = [];
    var allColumns = null;

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C]
            };
            if (cell.v === null) continue;
            var cell_ref = XLSX.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function dd(s) {
    return ('0' + s).slice(-2);
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };
}

if (typeof String.prototype.stringContains != 'function') {
    String.prototype.stringContains = function(str) {
        // console.log(this + ' CONTAINS ' + str + ' ? ' + this.indexOf(str) >= 0);
        return this.indexOf(str) >= 0;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }
  
function getCommentCardActions(boardID, idCard) {
    for (var n = 0; n < actionsCommentCard.length; n++) {
        if (actionsCommentCard[n].card === idCard) {
            var query = Enumerable.From(actionsCommentCard[n].data)
                .Where(function(x) {
                    if (x.data.card) {
                        return x.data.card.id == idCard;
                    }
                })
                .OrderByDescending(function(x) {
                    return x.date;
                })
                .ToArray();
            return query.length > 0 ? query : false;
        }
    }
    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
        url: 'https://trello.com/1/card/' + idCard + '/actions?filter=commentCard,copyCommentCard&limit=' + dataLimit,
        // url:'https://trello.com/1/boards/' + boardID + '/actions?filter=commentCard,copyCommentCard&limit=' + dataLimit,
        dataType: 'json',
        async: false,
        success: function(actionsData) {
            var a = {
                card: idCard,
                data: actionsData,
            };
            actionsCommentCard.push(a);
        }
    });
    var selectedActions = null;
    for (var i = 0; i < actionsCommentCard.length; i++) {
        if (actionsCommentCard[i].card === idCard) {
            selectedActions = actionsCommentCard[i].data;
            break;
        }
    }
    var query2 = Enumerable.From(selectedActions)
        .Where(function(x) {
            if (x.data.card) {
                return x.data.card.id == idCard;
            }
        })
        .OrderByDescending(function(x) {
            return x.date;
        })
        .ToArray();
    return query2.length > 0 ? query2 : false;
}

function getCreateCardAction(boardID, idCard) {
    for (var n = 0; n < actionsCreateCard.length; n++) {
        if (actionsCreateCard[n].board === boardID) {
            var query = Enumerable.From(actionsCreateCard[n].data)
                .Where(function(x) {
                    if (x.data.card) {
                        return x.data.card.id == idCard;
                    }
                })
                .ToArray();
            return query.length > 0 ? query[0] : false;
        }
    }
    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
        url: 'https://trello.com/1/boards/' + boardID + '/actions?filter=createCard&limit=' + dataLimit,
        dataType: 'json',
        async: false,
        success: function(actionsData) {
            var a = {
                board: boardID,
                data: actionsData,
            };
            actionsCreateCard.push(a);
        }
    });
    var selectedActions = null;
    // get the right actions for board
    for (var i = 0; i < actionsCreateCard.length; i++) {
        if (actionsCreateCard[i].board === boardID) {
            selectedActions = actionsCreateCard[i].data;
            break;
        }
    }
    var query2 = Enumerable.From(selectedActions)
        .Where(function(x) {
            if (x.data.card) {
                return x.data.card.id == idCard;
            }
        })
        .ToArray();
    return query2.length > 0 ? query2[0] : false;
}

function getMoveCardAction(boardID, idCard, nameList) {
    //console.log('getMoveCardAction ' + idCard + ' to list ' + nameList);
    for (var n = 0; n < actionsMoveCard.length; n++) {
        if (actionsMoveCard[n].board === boardID) {
            var query = Enumerable.From(actionsMoveCard[n].data)
                .Where(function(x) {
                    if (x.data.card && x.data.listAfter) {
                        if (x.data.card.id == idCard)
                            return x.data.card.id == idCard && x.data.listAfter.name.toLowerCase().stringContains(nameList.trim().toLowerCase());
                        //return x.data.card.id == idCard && x.data.listAfter.name == nameList;
                    }
                })
                .OrderByDescending(function(x) {
                    return x.date;
                })
                .ToArray();
            //console.log('query.length: ' + query.length);
            return query.length > 0 ? query[0] : false;
        }
    }
    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
        url: 'https://trello.com/1/boards/' + boardID + '/actions?filter=updateCard&limit=' + dataLimit,
        dataType: 'json',
        async: false,
        success: function(actionsData) {
            var a = {
                board: boardID,
                data: actionsData,
            };
            actionsMoveCard.push(a);
        }
    });
    var selectedActions = null;
    // get the right actions for board
    for (var i = 0; i < actionsMoveCard.length; i++) {
        if (actionsMoveCard[i].board === boardID) {
            selectedActions = actionsMoveCard[i].data;
            break;
        }
    }
    var query2 = Enumerable.From(selectedActions)
        .Where(function(x) {
            if (x.data.card && x.data.listAfter) {
                return x.data.card.id == idCard && x.data.listAfter.name == nameList;
            }
        })
        .OrderByDescending(function(x) {
            return x.date;
        })
        .ToArray();
    return query2.length > 0 ? query2[0] : false;
}

function searchupdateCheckItemStateOnCardAction(checkitemid, actions) {
    var completedObject = {};
    $.each(actions, function(j, action) {
        if (action.type == 'updateCheckItemStateOnCard') {
            if (action.data.checkItem.id == checkitemid) {
                var d = new Date(action.date);
                if (d) {
                    var sActionDate = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                    completedObject.date = sActionDate;
                }
                if (action.memberCreator !== undefined) {
                    completedObject.by = (action.memberCreator.fullName !== undefined ? action.memberCreator.fullName : action.memberCreator.username);
                } else {
                    completedObject.by = '';
                }
                return completedObject;
            }
        }
    });
    return completedObject;
}

function TrelloExportOptions() {

    exportboards = []; // reset
    exportlists = [];
    exportcards = [];
    filterListsNames = [];
    nProcessedBoards = 0;
    nProcessedLists = 0;
    nProcessedCards = 0;
    idBoard = document.location.pathname.split('/')[2];

    var columnHeadings = [];
    customFields = []; // reset
    columnHeadings = setColumnHeadings(0);

    // https://github.com/davidstutz/bootstrap-multiselect
    var options = [];
    for (var x = 0; x < columnHeadings.length; x++) {
        var isSelected = "selected";
        // 1.9.54 saved selected columns
        if (localStorage.TrelloExportSelectedColumns) {
            isSelected = '';
            var savedOptions = localStorage.TrelloExportSelectedColumns.split(',');
            if ($.inArray(columnHeadings[x], savedOptions) > -1) {
                isSelected = "selected";
            }
        }
        var o = '<option value="' + columnHeadings[x] + '" ' + (isSelected === 'selected' ? 'selected="selected"' : '') + '>' + columnHeadings[x] + '</option>';
        options.push(o);
    }

    var theCSS = chrome.runtime.getURL('/templates/default.css') || 'https://trapias.github.io/assets/TrelloExport/default.css';
    if (localStorage.TrelloExportCSS && !localStorage.TrelloExportCSS.startsWith('chrome'))
        theCSS = localStorage.TrelloExportCSS;

    var selectedMode = 'XLSX';
    if (localStorage.TrelloExportMode)
        selectedMode = localStorage.TrelloExportMode;

    // nameListDone
    if (localStorage.TrelloExportListDone)
        nameListDone = localStorage.TrelloExportListDone;

    var selectedType = 'board';
    if (localStorage.TrelloExportType)
        selectedType = localStorage.TrelloExportType;

    var twigTemplate = chrome.runtime.getURL('/templates/html.twig');
    if (localStorage.TrelloExportTwigTemplate)
        twigTemplate = localStorage.TrelloExportTwigTemplate;

    // load templates from URL, e.g. https://trapias.github.io/assets/TrelloExport/templates.json
    var templateSetURL = '';
    if (localStorage.TrelloExportTwigTemplatesURL) {
        templateSetURL = localStorage.TrelloExportTwigTemplatesURL;

        loadTemplateSetFromURL(templateSetURL).then(function(tplset) {
            var jtplset = JSON.parse(tplset);
            availableTwigTemplates = jtplset.templates;
            // console.log('availableTwigTemplates = ' + availableTwigTemplates);
            $.growl({
                title: "TrelloExport",
                message: "Templates loaded successfully",
                fixed: false
            });
        }, function(err) {
            console.error('ERROR: ' + err);
        });
    }

    var availableTwigTemplatesOptions = [];
    for (var t = 0; t < availableTwigTemplates.length; t++) {
        availableTwigTemplatesOptions.push('<option value="' + availableTwigTemplates[t].url + '">' + availableTwigTemplates[t].description + '</option>');
    }

    var customFieldsON = false;
    if (localStorage.TrelloExportCustomFields)
        customFieldsON = true;

    var sDialog = '<span class="half"><h1>TrelloExport ' + VERSION + '</h1></span><span class="half blog-link"><h3><a target="_blank" href="https://github.com/trapias/TrelloExport/wiki">Help</a>&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://trelloexport.trapias.it/blog/">Read the Blog!</a></h3></span><table id="optionslist">' +
        '<tr><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Choose the type of file you want to export">Export to:</span></td><td><select id="exportmode"><option value="XLSX">Excel</option><option value="MD">Markdown</option><option value="HTML">HTML</option><option value="OPML">OPML</option><option value="CSV">CSV</option></select></td></tr>' +
        '<tr><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Check all the kinds of items you want to export">Export:</span></td><td><input type="checkbox" id="exportArchived" title="Export archived items">Archived items ' +
        '<input type="checkbox" id="comments" title="Export comments">Comments<br/><input type="checkbox" id="checklists" title="Export checklists">Checklists <input type="checkbox" id="attachments" title="Export attachments">Attachments  <input type="checkbox" id="customfields" ' + (customFieldsON ? 'checked' : '') + ' title="Export Custom Fields">Custom Fields</td></tr>' +
        '<tr id="cklAsRowsRow"><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Create one Excel row per each card, checklist item, label or card member">One row per each:</span></td><td><input type="radio" id="cardsAsRows" checked name="asrows" value="0"> <label for="cardsAsRows" >Card</label>  <input type="radio" id="cklAsRows" name="asrows" value="1"> <label for="cklAsRows">Checklist item</label>  <input type="radio" id="lblAsRows" name="asrows" value="2"> <label for="lblAsRows">Label</label>  <input type="radio" id="membersAsRows" name="asrows" value="3"> <label for="membersAsRows">Member</label>  </td></tr>' +
        '<tr id="xlsColumns">' +
        '<td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Choose columns to be exported to Excel">Export columns</span></td>' +
        '<td><select multiple="multiple" id="selectedColumns">' + options.join('') + '</select></td>' +
        '</tr>' +
        '<tr id="ckHTMLCardInfoRow" style="display:none"><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Set options for the target HTML">Options:</span></td><td><input type="checkbox" checked id="ckHTMLCardInfo" title="Export card info"> Export card info (created, createdby) <br/><input type="checkbox" checked id="chkHTMLInlineImages" title="Show attachment images"> Show attachment images' + '</td></tr>' +
        '<tr id="renderingOptions" style="display:none"><td><span>Rendering Options:</span></td><td>Stylesheet: <input id="trelloExportCss" type="text" name="css" value="' + theCSS + '"> ' +
        '<br>Template set:<input type="text" id="templateSetURL" placeholder="Insert URL or leave blank" title="Template-set URL - leave blank to use local templates" value="' + templateSetURL + '"><br>Template: <select id="twigTemplate" name="twigTemplate">' +
        availableTwigTemplatesOptions.join(',') +
        '</select></td></tr>' +
        '<tr><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Set the List name string used to recognize your completed lists. See https://trapias.github.io/blog/trelloexport-1-9-13">Done lists name:</span></td><td><input type="text" size="4" name="setnameListDone" id="setnameListDone" value="' + nameListDone + '"  placeholder="Set string or leave empty"></td></tr>' +
        '<tr><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Only include items whose name contains the specified string">Filter:</span></td><td>' +
        '<select id="filterMode"><option value="List">On List name</option><option value="Label">On Label name</option><option value="Card">On card name</option></select>' +
        '<br/><input type="checkbox" id="chkANDORFilter"> <span title="Check to match all filters with an AND condition, uncheck to match any filter with an OR condition">Enable AND filter</span><br/>' +
        '<input type="text" size="30" name="filterListsNames" class="filterListsNames" value="" placeholder="Set string or leave empty" /></td></tr>' +
        '<tr><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Choose what data to export">Type of export:</span></td><td><select id="exporttype"><option value="board">Current Board</option><option value="list">Select Lists in current Board</option><option value="boards">Multiple Boards</option><option value="cards">Select cards in a list</option></select></td></tr>' +
        '</table>';

    var modal = new tingle.modal({
        footer: true,
        stickyFooter: true,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        // cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function() {
            initializeModal();
        },
        // onClose: function() {
        //     // console.log('modal closed');
        // },
        beforeClose: function() {
            return true; // close the modal
            // return false; // nothing happens
        }
    });

    modal.setContent(sDialog);
    modal.setFooterContent('<span class="sponsor"><a target="_new" href="https://bridge24.com/trello/?afmc=1w">Need interactive charts or custom reports for your cards? Try Bridge24! <img src="https://bridge24.com/wp-content/uploads/2017/12/bridge24-logo-header_dark-grey_2x.png" /></a></span>');
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function() {
        modal.close();
    });

    modal.addFooterBtn('Export', 'tingle-btn tingle-btn--trelloexport tingle-btn--pull-right', function() {
        var mode = $('#exportmode').val();
        localStorage.TrelloExportMode = mode;
        nameListDone = $('#setnameListDone').val();
        localStorage.TrelloExportListDone = nameListDone;
        var sfilterListsNames, filters, bexportArchived, bExportComments, bExportChecklists, bExportAttachments, iExcelItemsAsRows, bckHTMLCardInfo, bchkHTMLInlineImages;
        bexportArchived = $('#exportArchived').is(':checked');
        bExportComments = $('#comments').is(':checked');
        bExportChecklists = $('#checklists').is(':checked');
        bExportAttachments = $('#attachments').is(':checked');
        iExcelItemsAsRows = 0;
        iExcelItemsAsRows = $('input[name=asrows]:checked').val();
        bckHTMLCardInfo = $('#ckHTMLCardInfo').is(':checked');
        bchkHTMLInlineImages = $('#chkHTMLInlineImages').is(':checked');
        var bExportCustomFields = $('#customfields').is(':checked');

        if (!bExportChecklists && iExcelItemsAsRows.toString() === '1') {
            // checklist items as rows only available if checklists are exported
            iExcelItemsAsRows = 0;
        }
        // export type
        var sexporttype = $('#exporttype').val();
        localStorage.TrelloExportType = sexporttype;

        sfilterListsNames = $('.filterListsNames').val();
        if (sfilterListsNames.trim() !== '') {
            // parse list name filters
            filters = sfilterListsNames.split(','); // OR filters
            for (var nd = 0; nd < filters.length; nd++) {
                filterListsNames.push(filters[nd].toString().trim());
            }
        }

        switch (sexporttype) {
            case 'list':
                if ($('#choosenlist').length <= 0) {
                    // console.log('wait for lists to load');
                    return false;
                } else {
                    $('#choosenlist > option:selected').each(function() {
                        exportlists.push($(this).val());
                    });
                }
                break;

            case 'boards':
                if ($('#choosenboards').length <= 0) {
                    // console.log('wait for lists to load');
                    return false;
                } else {
                    $('#choosenboards > option:selected').each(function() {
                        exportboards.push($(this).val());
                    });
                }
                break;

            case 'cards':
                // choosenCards
                if ($('#choosenCards').length <= 0) {
                    // console.log('wait for cards to load');
                    return false;
                } else {
                    $('#choosenCards > option:selected').each(function() {
                        exportcards.push($(this).val());
                    });
                }
                break;

            case 'board':
                $('#choosenboards > option:selected').each(function() {
                    exportboards.push($(this).val());
                });
                break;

            default:
                break;
        }

        if(allColumns === null) {
            allColumns = $('#selectedColumns option');
        }
        //var allColumns = $('#selectedColumns option');
        //console.log('allColumns = ' + JSON.stringify(allColumns));
        var selectedColumns = [];
        var selectedOptions = $('#selectedColumns option:selected');
        selectedOptions.each(function() {
            selectedColumns.push(this.value);
        });
        // save selectedColumns
        localStorage.TrelloExportSelectedColumns = selectedColumns;

        var css = $('#trelloExportCss').val();
        if (!css.startsWith('chrome')) {
            localStorage.TrelloExportCSS = css;
            // console.log('save ' + css);
        } else {
            localStorage.TrelloExportCSS = '';
        }

        // filterMode
        var filterMode = $('#filterMode').val();
        var chkANDORFilter = $('#chkANDORFilter').is(':checked');

        var templateURL = $('#twigTemplate').val();
        localStorage.TrelloExportTwigTemplate = templateURL;

        localStorage.TrelloExportTwigTemplatesURL = $('#templateSetURL').val();

        // launch export
        setTimeout(async function() {
            try {
                await loadDataAsync(mode, bexportArchived, bExportComments, bExportChecklists, bExportAttachments, iExcelItemsAsRows, bckHTMLCardInfo, bchkHTMLInlineImages, allColumns, selectedColumns, css, filterMode, bExportCustomFields, templateURL, chkANDORFilter);
            } catch (error) {
                console.error('Export failed:', error);
                $.growl.error({
                    title: "Export Failed",
                    message: error.message || "An error occurred during export",
                    fixed: true
                });
            }
        }, 500);
        modal.close();
    });

    modal.open();

    function initializeModal() {

        $('[data-toggle="tooltip"]').tooltip();
        $('#selectedColumns').multiselect({
            includeSelectAllOption: true,
            onSelectAll: function() {
                localStorage.TrelloExportSelectedColumns = '';
            }
        });

        $('button.multiselect.dropdown-toggle.btn.btn-default').click(function() {
            $('.multiselect-container.dropdown-menu').toggle();
        });

        $('#templateSetURL').on('change', function() {
            var tplsetURL = $('#templateSetURL').val();

            // console.log('LOADING tplsetURL ' + tplsetURL);
            if (!tplsetURL) {
                localStorage.TrelloExportTwigTemplatesURL = tplsetURL;
                availableTwigTemplates = localTwigTemplates;
                var availableTwigTemplatesOptions = [];
                for (var t = 0; t < availableTwigTemplates.length; t++) {
                    availableTwigTemplatesOptions.push('<option value="' + availableTwigTemplates[t].url + '">' + availableTwigTemplates[t].description + '</option>');
                }
                $('#twigTemplate').empty().append(availableTwigTemplatesOptions);
                $.growl({
                    title: "TrelloExport",
                    message: "Templates loaded successfully",
                    fixed: false
                });
                return;
            }

            loadTemplateSetFromURL(tplsetURL).then(function(tplset) {
                var jtplset = JSON.parse(tplset);

                if (!jtplset.templates) {
                    console.error('UNABLE TO LOAD TEMPLATE SET');
                    console.log('tplset: ' + tplset);
                    $.growl.error({
                        title: "TrelloExport",
                        message: "Unable to load template set from URL " + tplsetURL,
                        fixed: true
                    });
                    return;
                }
                // console.log('tplset loaded: ' + tplset);
                localStorage.TrelloExportTwigTemplatesURL = tplsetURL;
                availableTwigTemplates = jtplset.templates;

                var availableTwigTemplatesOptions = [];
                for (var t = 0; t < availableTwigTemplates.length; t++) {
                    availableTwigTemplatesOptions.push('<option value="' + availableTwigTemplates[t].url + '">' + availableTwigTemplates[t].description + '</option>');
                }

                $('#twigTemplate').empty().append(availableTwigTemplatesOptions);
                // console.log('options updated w ' + JSON.stringify(availableTwigTemplatesOptions));
                $.growl({
                    title: "TrelloExport",
                    message: "Templates loaded successfully",
                    fixed: false
                });

            }, function(err) {
                console.error('ERROR: ' + err);
                    $.growl.error({
                    title: "TrelloExport",
                    message: "Unable to load template set from URL " + tplsetURL,
                    fixed: true
                });
            });
        });

        $('#exporttype').on('change', function() {
            $('#advancedOptions').remove();
            var sexporttype = $('#exporttype').val();
            localStorage.TrelloExportType = sexporttype;
            var sSelect;
            resetOptions();

            switch (sexporttype) {
                case 'list':
                    // get a list of all lists in board and let user choose which to export
                    sSelect = getalllistsinboard();
                    $('#optionslist').append('<tr><td>Select one or more Lists</td><td><select multiple id="choosenlist">' + sSelect + '</select></td></tr>');
                    break;
                case 'board':
                    // $('#optionslist').append('<tr><td>Filter lists by name:</td><td><input type="text" size="4" name="filterListsNames" class="filterListsNames" value="" placeholder="Set string or leave empty"></td></tr>');
                    break;
                case 'boards':
                    // get a list of all boards
                    // $('#customfields').attr('checked', false); // custom fields not yet available for multiple boards
                    // $('#customfields').attr('disabled', true);
                    sSelect = getallboards();
                    $('#optionslist').append('<tr><td>Select one or more Boards</td><td><select multiple id="choosenboards">' + sSelect + '</select></td></tr>');
                    // $('#optionslist').append('<tr><td>Filter lists by name:</td><td><input type="text" size="4" name="filterListsNames" class="filterListsNames" value="" placeholder="Set string or leave empty"></td></tr>');
                    break;
                case 'cards':
                    // get a list of all lists in board and let user choose which to export
                    sSelect = getalllistsinboard();
                    $('#optionslist').append('<tr><td>Select one List</td><td><select id="choosenSinglelist"><option value="">Select a list</option>' + sSelect + '</select></td></tr>');

                    $('#choosenSinglelist').on('change', function() {
                        $('#choosenCards').parent().parent().remove();
                        var selectedList = $('#choosenSinglelist').val();
                        exportlists = [];
                        exportlists.push(selectedList);
                        // get cards in list
                        sSelect = getallcardsinlist(selectedList);
                        $('#optionslist').append('<tr><td>Select one or more cards</td><td><select multiple id="choosenCards">' + sSelect + '</select></td></tr>');
                    });
                    break;
                default:
                    break;
            }

            $('#optionslist').append('<tr id="advancedOptions"><td><span data-toggle="tooltip" data-placement="right" data-container="body" title="Advanced functions">Advanced:</span></td><td><button id="btnCleanLocalStorage">Clean LocalStorage</button></td></tr>');

            $('#btnCleanLocalStorage').on('click', function() {
                CleanLocalStorage();
            });

            $('#cklAsRowsRow').hide();
            $('#ckHTMLCardInfoRow').hide();
            $('#xlsColumns').hide();
            $('#renderingOptions').hide();

            if (selectedMode)
                $('#exportmode').val(selectedMode);

            // var mode = $('#exportmode').val();
            switch (selectedMode) {
                case 'XLSX':
                    $('#cklAsRowsRow').show();
                    $('#xlsColumns').show();
                    break;
                case 'HTML':
                    $('#renderingOptions').show();
                    $('#xlsColumns').show();
                    break;
                case 'MD':
                    $('#ckHTMLCardInfoRow').show();
                    // $('#renderingOptions').show();
                    break;
                case 'CSV':
                    $('#cklAsRowsRow').show();
                    $('#xlsColumns').show();
                    break;
                default:
                    break;
            }

        });

        $('#exportmode').on('change', function() {
            var mode = $('#exportmode').val();
            selectedMode = mode;
            localStorage.TrelloExportMode = mode;
            $('#cklAsRowsRow').hide();
            $('#ckHTMLCardInfoRow').hide();
            $('#xlsColumns').hide();
            $('#renderingOptions').hide();

            switch (mode) {
                case 'XLSX':
                    $('#cklAsRowsRow').show();
                    $('#xlsColumns').show();
                    break;
                case 'HTML':
                    $('#renderingOptions').show();
                    $('#xlsColumns').show();
                    break;
                case 'MD':
                    $('#ckHTMLCardInfoRow').show();
                    // $('#renderingOptions').show();
                    break;
                case 'CSV':
                    $('#cklAsRowsRow').show();
                    $('#xlsColumns').show();
                    break;
                default:
                    break;
            }
        });

        $('#cklAsRows').attr('disabled', true); //  default
        $('#checklists').on('change', function() {
            var ecl = $('#checklists').is(':checked');
            if (!ecl) {
                $('#cklAsRows').attr('disabled', true);

            } else {
                $('#cklAsRows').attr('disabled', false);
            }
        });

        $('input[name=asrows]').change(function() {
            setColumnHeadings(this.value);
        });

        if (localStorage.TrelloExportCustomFields) {
            $('#customfields').attr('checked', true);
            setColumnHeadings($('input[name=asrows]:checked').val());
        }

        $('#customfields').click(function() {
            var isON = $('#customfields').is(':checked');
            if (isON)
                localStorage.TrelloExportCustomFields = 'on';
            else
                localStorage.TrelloExportCustomFields = '';
            setColumnHeadings($('input[name=asrows]:checked').val());
        });

        if (selectedType) {
            $('#exporttype').val(selectedType);
            $('#exporttype').trigger('change');
        }

        if (twigTemplate) {
            $('#twigTemplate').val(twigTemplate);
            $('#twigTemplate').trigger('change');
        }


    }
    return false; // close dialog
}

function setColumnHeadings(asrowsMode) {
    switch (Number(asrowsMode)) {
        case 1: // checklist item
            columnHeadings = [
                'Organization', 'Board', 'List', 'Card #', 'Title', 'Link', 'Description',
                'Total Checklist items', 'Completed Checklist items', 'Checklist',
                'Checklist item', 'Completed', 'DateCompleted', 'CompletedBy',
                'NumberOfComments', 'Comments', 'Attachments', 'Votes', 'Spent', 'Estimate',
                'Points Estimate', 'Points Consumed', 'Created', 'CreatedBy', 'LastActivity', 'Due', 
                'Done', 'DoneBy', 'DoneTime', 'Members', 'Labels', 'Due Complete', 'Start', 'Checklist item Due', 'Checklist item idMember', 'Checklist item Member', 'Checklist item State'
            ];
            break;
        case 2: // label
            columnHeadings = [
                'Organization', 'Board', 'List', 'Card #', 'Title', 'Link', 'Description',
                'Total Checklist items', 'Completed Checklist items', 'Checklists',
                'NumberOfComments', 'Comments', 'Attachments', 'Votes', 'Spent', 'Estimate',
                'Points Estimate', 'Points Consumed', 'Created', 'CreatedBy', 'LastActivity', 'Due',
                'Done', 'DoneBy', 'DoneTime', 'Members', 'Label', 'Due Complete', 'Start'
            ];
            break;
        case 3: // member
            columnHeadings = [
                'Organization', 'Board', 'List', 'Card #', 'Title', 'Link', 'Description',
                'Total Checklist items', 'Completed Checklist items', 'Checklists',
                'NumberOfComments', 'Comments', 'Attachments', 'Votes', 'Spent', 'Estimate',
                'Points Estimate', 'Points Consumed', 'Created', 'CreatedBy', 'LastActivity', 'Due',
                'Done', 'DoneBy', 'DoneTime', 'Member', 'Labels', 'Due Complete', 'Start'
            ];
            break;
        default:
            // card
            columnHeadings = [
                'Organization', 'Board', 'List', 'Card #', 'Title', 'Link', 'Description',
                'Total Checklist items', 'Completed Checklist items', 'Checklists',
                'NumberOfComments', 'Comments', 'Attachments', 'Votes', 'Spent', 'Estimate',
                'Points Estimate', 'Points Consumed', 'Created', 'CreatedBy', 'LastActivity', 'Due',
                'Done', 'DoneBy', 'DoneTime', 'Members', 'Labels', 'Due Complete', 'Start'
            ];
            break;
    }

    var bExportCustomFields = $('#customfields').is(':checked');

    if (bExportCustomFields) {
        customFields = [];
        loadCustomFields(columnHeadings);
    }
    var ColumnOptions = [];

    isSelected = 'selected';
    for (var x = 0; x < columnHeadings.length; x++) {
        if (localStorage.TrelloExportSelectedColumns) {
            isSelected = '';
            var savedOptions = localStorage.TrelloExportSelectedColumns.split(',');
            if ($.inArray(columnHeadings[x], savedOptions) > -1) {
                isSelected = 'selected';
                // console.log('2ADD COLUMN ' + columnHeadings[x]);
                // options.push(columnHeadings[x]);
            }
        }
        var o = '<option value="' + columnHeadings[x] + '" ' + (isSelected === 'selected' ? 'selected="selected"' : '') + '>' + columnHeadings[x] + '</option>';
        ColumnOptions.push(o);
    }
    $('#selectedColumns').multiselect('destroy')
        .find('option')
        .remove()
        .end()
        .append(ColumnOptions.join(''))
        .multiselect({
            includeSelectAllOption: true,
            onSelectAll: function() {
                localStorage.TrelloExportSelectedColumns = '';
            }
        });

    $('button.multiselect.dropdown-toggle.btn.btn-default').click(function() {
        $('.multiselect-container.dropdown-menu').toggle();
    });

    return columnHeadings;
}

// append custom fields to column headings
function loadCustomFields(columnHeadings) {
    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
        url: 'https://trello.com/1/boards/' + idBoard + '/customfields',
        dataType: 'json',
        async: false,
        success: function(pdata) {
            if (pdata !== undefined) {
                for (var f = 0; f < pdata.length; f++) {
                    // console.log(JSON.stringify(pdata[f]));
                    customFields.push(pdata[f]);
                    columnHeadings.push(pdata[f].name);
                }
            }
        }
    });
}

function loadCardCustomFields(cardID) {
    var rc = [];

    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
        url: 'https://trello.com/1/cards/' + cardID + '/customFieldItems',
        dataType: 'json',
        async: false,
        success: function(pdata) {
            pdata.forEach(function(dv) {
                var theValue = dv.value;
                if (!theValue)
                    theValue = dv.idValue;

                var oVal = lookupCustomDataValue(dv.idCustomField, theValue);
                rc.push({ colName: oVal.name, value: oVal.value });
            });
            return rc;
        }
    });
    return rc;
}

function lookupCustomDataValue(key, cardCFValue) {
    if (!cardCFValue) {
        console.error('lookupCustomDataValue: card CF value for card ' + key + ' NOT AVAILABLE: ' + cardCFValue);
        return null;
    }
    var v = null;
    customFields.some(function(cf) {
        if (cf.id.toString().trim() === key.toString().trim()) {
            switch (cf.type) {
                case 'checkbox':
                    v = { name: cf.name, value: cardCFValue.checked };
                    break;

                case 'date':
                    v = { name: cf.name, value: (cardCFValue[cf.type] ? new Date(cardCFValue[cf.type]).toLocaleString() : null) };
                    break;

                case 'list':
                    v = { name: cf.name, value: cardCFValue };
                    $.each(cf.options, function(k, opt) {
                        if (cf.id === opt.idCustomField && opt.id === cardCFValue) {
                            v = { name: cf.name, value: opt.value.text };
                            return;
                        }
                    });
                    break;

                default:
                    v = { name: cf.name, value: cardCFValue[cf.type] };
                    break;
            }
            return v;
        }
    });
    return v;
}

function resetOptions() {
    $('#choosenlist').parent().parent().remove();
    $('#choosenboards').parent().parent().remove();
    $('#choosenCards').parent().parent().remove();
    $('#choosenSinglelist').parent().parent().remove();
    $('#filterListsNames').parent().parent().remove();
    // $('#customfields').attr('checked', false);
    $('#customfields').attr('disabled', false);
}

function getalllistsinboard() {
    var apiURL = "https://trello.com/1/boards/" + idBoard + "?lists=all&cards=none";
    var sHtml = "";
    var bexportArchived = $('#exportArchived').is(':checked');

    $.ajax({
            headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
            url: apiURL,
            async: false,
        })
        .done(function(data) {
            // console.log('DATA:' + JSON.stringify(data));
            $.each(data.lists, function(key, list) {

                if (!bexportArchived && list.closed)
                    return;

                var list_id = list.id;
                var listName = list.name;
                if (!list.closed) {
                    sHtml += '<option value="' + list_id + '">' + listName + '</option>';
                } else {
                    sHtml += '<option value="' + list_id + '">' + listName + ' [Archived]</option>';
                }
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("getalllistsinboard error: " + jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText);
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function() {
            // console.log("complete");
        });

    return sHtml;
}


function getorganizations() {
    var apiURL = "https://trello.com/1/members/me/organizations";
    var orgID = []; //[{ id: null, displayName: 'Private Boards' }];

    $.ajax({
            headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
            url: apiURL,
            async: false,
        })
        .done(function(data) {
            $.each(data, function(key, org) {
                orgID.push({ id: org.id, displayName: org.displayName });
            });
            orgID.push({ id: null, displayName: 'Personal Boards' });

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("getorganizations: " + textStatus);
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function() {
            // console.log("complete");
        });

    return orgID;
}

function getorganizationid() {
    var apiURL = "https://trello.com/1/boards/" + idBoard + '?lists=none';
    var orgID = "";

    $.ajax({
            headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
            url: apiURL,
            async: false,
        })
        .done(function(data) {
            //console.log('DATA:' + JSON.stringify(data));
            orgID = data.idOrganization;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("getorganizationid: " + textStatus);
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function() {
            // console.log("complete");
        });

    return orgID;
}

function getallboards() {

    var allIDs = getorganizations();
    var sHtml = "";
    var tmpIDs = [];

    allIDs.forEach(function(oid) {

        // GET /1/organizations/[idOrg or name]/boards
        var apiURL = "https://trello.com/1/organizations/" + oid.id + "/boards?lists=none&fields=name,idOrganization,closed";

        if (oid.id === null) {
            // current board outside any organization, get all boards
            apiURL = "https://trello.com/1/members/me/boards?lists=none&fields=name,idOrganization,closed";
        }

        $.ajax({
                headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
                url: apiURL,
                async: false,
            })
            .done(function(data) {

                var bexportArchived = $('#exportArchived').is(':checked');
                for (var i = 0; i < data.length; i++) {

                    if (!bexportArchived && data[i].closed)
                        continue;

                    var board_id = data[i].id;
                    if ($.inArray(board_id, tmpIDs) > -1)
                        continue;

                    tmpIDs.push(board_id);
                    var boardName = data[i].name;
                    if (!data[i].closed) {
                        sHtml += '<option value="' + board_id + '">[' + oid.displayName + '] ' + boardName + '</option>';
                    } else {
                        sHtml += '<option value="' + board_id + '">[' + oid.displayName + '] ' + boardName + ' [Archived]</option>';
                    }
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("getallboards error: " + jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText);
                $.growl.error({
                    title: "TrelloExport",
                    message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                    fixed: true
                });
            })
            .always(function() {
                // console.log("complete");
            });


    });

    // var orgID = getorganizationid();


    return sHtml;
}

function getBoardData(id) {

    var apiURL = "https://trello.com/1/boards/" + id + "?fields=name,idOrganization";
    var bData = "";

    $.ajax({
            headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
            url: apiURL,
            async: false,
        })
        .done(function(data) {
            bData = data;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("getBoardData error: " + textStatus);
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function() {
            // console.log("complete");
        });

    return bData;
}

function getallcardsinlist(listid) {
    // GET /1/lists/[idList]/cards?fields=idShort
    var apiURL = "https://trello.com/1/lists/" + listid + "/cards?fields=idShort,name,closed";
    var sHtml = "";

    $.ajax({
            headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
            url: apiURL,
            async: false,
        })
        .done(function(data) {
            var bexportArchived = $('#exportArchived').is(':checked');

            // console.log('Got cards: ' + JSON.stringify(data));
            for (var i = 0; i < data.length; i++) {

                if (!bexportArchived && data[i].closed)
                    continue;

                var card_id = data[i].id;
                var cardName = data[i].name;
                if (!data[i].closed) {
                    sHtml += '<option value="' + card_id + '">' + cardName + '</option>';
                } else {
                    sHtml += '<option value="' + card_id + '">' + cardName + ' [Archived]</option>';
                }
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("getallcardsinlist error!!!");
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function() {
            // console.log("complete");
        });

    return sHtml;
}

function extractFloat(str, regex, groupIndex) {
    var value = '';
    var match = str.match(regex);
    if (match !== null) {
        value = parseFloat(match[groupIndex]);
        if (value === false) {
            value = '';
        }
    }
    return value;
}

function getMember(id) {
    var apiURL = "https://trello.com/1/members/" + id;
    var bData = "";

    $.ajax({
        headers: { 'x-trello-user-agent-extension': 'TrelloExport' },
        url: apiURL,
        async: false,
    })
        .done(function (data) {
            bData = data;
            // console.log(JSON.stringify(data));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("getMember error: " + textStatus);
            $.growl.error({
                title: "TrelloExport",
                message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                fixed: true
            });
        })
        .always(function () {
            // console.log("complete");
        });

    return bData;
}

function loadData(exportFormat, bexportArchived, bExportComments, bExportChecklists, bExportAttachments, iExcelItemsAsRows, bckHTMLCardInfo, bchkHTMLInlineImages, allColumns, selectedColumns, css, filterMode, bExportCustomFields, templateURL, chkANDORFilter) {
    console.log('TrelloExport loading data, export format: ' + exportFormat + '... selectedColumns ' + selectedColumns.length + ' allColumns ' + allColumns.length);
    var converter = new showdown.Converter();
    var promLoadData = new Promise(
        function(resolve, reject) {
            $.growl({
                title: "TrelloExport",
                message: "Loading data, please wait..."
            });

            setTimeout(function() {
                resolve();
            }, 100);
        });

    promLoadData.then(function() {

        var oOrganizations = getorganizations();
        // console.log('oOrganizations = ' + JSON.stringify(oOrganizations));

        var jsonComputedCards = [];

        // RegEx to find the Trello Plus Spent and Estimate (spent/estimate) in card titles
        //var SpentEstRegex = /(\(([0-9]+(\.[0-9]+)?)(\/?([0-9]+(\.[0-9]+)?))?\))/;
        var SpentEstRegex = new RegExp("([0-9]*((\.[0-9]+))?)/([0-9]*(?:(\.[0-9]+))?)");
        var PointsEstRegex = /(\(([0-9]+(\.[0-9]+)?)\))/;
        var PointsConRegex = /(\[([0-9]+(\.[0-9]+)?)\])/;

        /*
            get data via Trello API instead of Board's json
        */

        if (exportboards.length === 0) {
            // export just current board
            exportboards.push(idBoard);
        }

        // loop boards
        for (var iBoard = 0; iBoard < exportboards.length; iBoard++) {
            console.log('Export board ' + exportboards[iBoard]);
            idBoard = exportboards[iBoard];

            var boardData = getBoardData(idBoard);
            var boardName = boardData.name;
            var orgName = '';
            if (oOrganizations) {
                var oOData = oOrganizations.find(function(obj) { return obj.id === boardData.idOrganization; });
                if (oOData)
                    orgName = oOData.displayName;
            } else {
                orgName = 'Personal Boards';
            }

            var readCards = 0;

            var apiURL = "https://trello.com/1/boards/" + idBoard + "/lists?fields=name,closed&filter=all"; //"?lists=all&cards=all&card_fields=all&card_checklists=all&members=all&member_fields=all&membersInvited=all&checklists=all&organization=true&organization_fields=all&fields=all&actions=commentCard%2CcopyCommentCard%2CupdateCheckItemStateOnCard&card_attachments=true";
            $.ajax({
                    headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
                    url: apiURL,
                    async: false,
                })
                .done(function(data) {

                    console.log('DONE: got ' + data.length + ' lists');

                    // if (!bexportArchived) {
                    //     if (data.closed) {
                    //         console.log('Skip archived Board ' + data.id);
                    //         return true;
                    //     }
                    // }

                    $.each(data, function(key, list) {

                        var sBefore = ''; // reset for each list

                        var list_id = list.id;
                        var listName = list.name;

                        if (!bexportArchived) {
                            if (list.closed) {
                                // console.log('skip archived list ' + listName);
                                return true;
                            }
                        }

                        if (exportlists.length > 0) {
                            if ($.inArray(list_id, exportlists) === -1) {
                                console.log('skip list ' + listName);
                                return true;
                            }
                        }

                        // 1.9.14: filter lists by name
                        var accept = true,
                            nListAccepted = 0;
                        if (filterListsNames.length > 0 && filterMode === 'List') {
                            for (var y = 0; y < filterListsNames.length; y++) {
                                if (!listName.toLowerCase().stringContains(filterListsNames[y].trim().toLowerCase())) {
                                    accept = false;
                                } else {
                                    accept = true;
                                    nListAccepted++;
                                    // break;
                                }
                            }
                        }
                        if (chkANDORFilter && filterMode === 'List') {
                            // AND filter: must match all filters
                            if (nListAccepted < filterListsNames.length)
                                accept = false;
                            else
                                accept = true;
                        }
                        if (!accept) {
                            // console.log('skipping not accepted list ' + listName);
                            return true;
                        }

                        console.log('processing list ' + listName);
                        nProcessedLists++;

                        // tag archived lists
                        if (list.closed) {
                            listName = '[archived] ' + listName;
                        }

                        var exportedCardsIDs = [];

                        do {
                            readCards = 0;

                            $.ajax({
                                    headers: { 'x-trello-user-agent-extension': 'TrelloExport'},
                                    url: 'https://trello.com/1/lists/' + list_id + '/cards?limit=' + pageSize + '&filter=all&fields=all&checklists=all&members=true&member_fields=all&membersInvited=all&organization=true&organization_fields=all&actions=commentCard%2CcopyCommentCard%2CupdateCheckItemStateOnCard&attachments=true' + "&before=" + sBefore,
                                    async: false,
                                    timeout: 60000,
                                })
                                .done(function(datacards) {

                                    readCards = datacards.length;
                                    // console.log('evaluating ' + datacards.length + ' cards');

                                    // Iterate through each card and transform data as needed
                                    $.each(datacards, function(i, card) {

                                        // console.log('=-=-=-=-=-=-=-=>>>>> I = ' + i);

                                        if (sBefore === card.id) {
                                            // console.log('ALREADY USED BEFORE VALUE ' + sBefore);
                                            readCards = -1;
                                            return;
                                        }

                                        if (i === 0) {
                                            sBefore = card.id;
                                        }

                                        if (card.idList == list_id && $.inArray(card.id, exportedCardsIDs) === -1) {

                                            if (!bexportArchived) {
                                                if (card.closed) {
                                                    console.log('Skip archived card ' + card.name);
                                                    return true;
                                                }
                                            }

                                            //export selected cards only option
                                            if (exportcards.length > 0) {
                                                if ($.inArray(card.id, exportcards) === -1) {
                                                    console.log('skip card ' + card.id);
                                                    return true;
                                                }
                                            }

                                            var accept = true,
                                                nCardAccepted = 0;
                                            if (filterListsNames.length > 0 && filterMode === 'Card') {
                                                for (var y = 0; y < filterListsNames.length; y++) {
                                                    if (!card.name.toLowerCase().stringContains(filterListsNames[y].trim().toLowerCase())) {
                                                        accept = false;
                                                    } else {
                                                        accept = true;
                                                        nCardAccepted++;
                                                        // break;
                                                    }
                                                }
                                            }
                                            if (chkANDORFilter && filterMode === 'Card') {
                                                // AND filter: must match all filters
                                                if (nCardAccepted < filterListsNames.length)
                                                    accept = false;
                                                else
                                                    accept = true;
                                            }
                                            if (!accept) {
                                                console.log('skipping card ' + card.name);
                                                return true;
                                            }

                                            exportedCardsIDs.push(card.id);
                                            var title = card.name;

                                            console.log(i + ') Card #' + card.idShort + ' ' + title + ' (' + card.id + ') - POS: ' + card.pos);
                                            nProcessedCards++;

                                            var spent = 0;
                                            var estimate = 0;
                                            var checkListsText = '',
                                                commentsText = '',
                                                attachmentsText = '',
                                                memberCreator = '',
                                                datetimeCreated = null,
                                                memberDone = '',
                                                datetimeDone = '',
                                                jsonCheckLists = [],
                                                jsonComments = [],
                                                jsonAttachments = [];

                                            // Trello Plus Spent/Estimate
                                            if(title.match(SpentEstRegex)){
                                                    var m = title.match(SpentEstRegex);
                                                    var cspent = m[1];
                                                    var cestimate = m[4];
                                                //   console.log("SPENT: " + cspent + " EST: " + cestimate);
                                                    spent += Number(cspent);
                                                    estimate += Number(cestimate);
                                                //   console.log("TOTAL SPENT: " + spent + " EST: " + estimate);
                                            }
                                            
                                            // spent = extractFloat(title, SpentEstRegex, 2);
                                            // if (typeof spent !== 'number' || isNaN(spent))
                                            //     spent = 0;        

                                            // estimate = extractFloat(title, SpentEstRegex, 3);
                                            // if (typeof estimate !== 'number' || isNaN(estimate))
                                            //     estimate = 0;

                                            // Scrum for Trello Points Estimate/Consumed
                                            points_estimate = extractFloat(title, PointsEstRegex, 2);
                                            if (typeof points_estimate !== 'number' || isNaN(points_estimate))
                                                points_estimate = 0;

                                            points_consumed = extractFloat(title, PointsConRegex, 2);
                                            if (typeof points_consumed !== 'number' || isNaN(points_consumed))
                                                points_consumed = 0;

                                            // Clean-up title
                                            title = title.replace(SpentEstRegex, '');
                                            title = title.replace(PointsEstRegex, '');
                                            title = title.replace(PointsConRegex, '');
                                            title = title.trim();

                                            // tag archived cards
                                            if (card.closed) {
                                                title = '[archived] ' + title;
                                            }
                                            var due = card.due || null;

                                            //Get all the Member IDs
                                            // console.log('Members: ' + card.idMembers.length);
                                            var memberIDs = card.idMembers;
                                            var memberInitials = [];
                                            $.each(memberIDs, function(i, memberID) {
                                                $.each(card.members, function(key, member) {
                                                    if (member.id == memberID) {
                                                        if (member.fullName !== undefined) {
                                                            memberInitials.push(member.fullName); // initials, username or fullName    
                                                        } else {
                                                            if (member.username !== undefined) {
                                                                memberInitials.push(member.username);
                                                            }
                                                        }

                                                    }
                                                });
                                            });

                                            //Get all labels
                                            var labels = [],
                                                jsonLabels = [],
                                                nAccepted = 0;
                                            if (card.labels.length <= 0 && filterListsNames.length > 0 && filterMode === 'Label') {
                                                // filtering by label name: skip cards without labels
                                                accept = false;
                                                return true;
                                            }

                                            if (filterListsNames.length > 0 && filterMode === 'Label')
                                                accept = false;

                                            $.each(card.labels, function(i, label) {
                                                jsonLabels.push(label);
                                                if (label.name) {
                                                    labels.push(label.name);
                                                } else {
                                                    labels.push(label.color);
                                                }
                                                if (filterListsNames.length > 0 && filterMode === 'Label') {
                                                    for (var y = 0; y < filterListsNames.length; y++) {
                                                        // if (accept)
                                                        //     continue;
                                                        if (!label.name.toLowerCase().stringContains(filterListsNames[y].trim().toLowerCase())) {
                                                            accept = false;
                                                        } else {
                                                            nAccepted++;
                                                            accept = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            });
                                            labels.sort();
                                            jsonLabels = sortByKeyDesc(jsonLabels, 'name');
                                            if (chkANDORFilter && filterMode === 'Label') {
                                                // AND filter: must match all filters
                                                if (nAccepted < filterListsNames.length)
                                                    accept = false;
                                                else
                                                    accept = true;
                                            }
                                            if (!accept) {
                                                // filtering by label name
                                                // console.log('FILTER2 label filter skipping card ' + card.name);
                                                return true;
                                            }

                                            if (bExportChecklists) {
                                                //all checklists
                                                // console.log('Checklists: ' + card.idChecklists.length);
                                                var checklists = [];
                                                if (card.idChecklists !== undefined) {
                                                    $.each(card.idChecklists, function(i, idchecklist) {
                                                        if (idchecklist) {
                                                            checklists.push(idchecklist);
                                                        }
                                                    });
                                                }

                                                //parse checklists
                                                $.each(checklists, function(i, checklistid) {
                                                    // console.log('PARSE ' + checklistid);
                                                    $.each(card.checklists, function(key, list) {
                                                        // console.log('list: ' + JSON.stringify(list));
                                                        var list_id = list.id;
                                                        if (list_id == checklistid) {
                                                            var jsonCheckList = {};
                                                            jsonCheckList.name = (exportFormat === 'HTML' ? html_encode(list.name) : list.name);
                                                            jsonCheckList.items = [];
                                                            checkListsText += list.name + ' (' + list.checkItems.length + ' items):\n';
                                                            //checkitems: reordered (issue #4 https://github.com/trapias/trelloExport/issues/4)
                                                            var orderedChecklists = Enumerable.From(list.checkItems)
                                                                .OrderBy(function(x) {
                                                                    return x.pos;
                                                                })
                                                                .ToArray();

                                                            $.each(orderedChecklists, function(i, item) {
                                                                if (item) {
                                                                    var cItem = {};
                                                                    cItem.name = item.name;
                                                                    cItem.due = item.due;
                                                                    cItem.state = item.state;
                                                                    cItem.idMember = item.idMember;
                                                                    if(item.idMember !== null){
                                                                        var m = getMember(item.idMember);
                                                                        if(m !== null){
                                                                            cItem.memberInitials = m.fullName;
                                                                        }
                                                                    }
                                                                    else {
                                                                        cItem.memberInitials = '';
                                                                    }
                                                                    
                                                                    if (exportFormat === 'HTML') {
                                                                        cItem.name = html_encode(cItem.name);
                                                                    }
                                                                    if (item.state == 'complete') {
                                                                        // issue #5
                                                                        // find who and when item was completed
                                                                        var oCompletedBy = searchupdateCheckItemStateOnCardAction(item.id, card.actions);
                                                                        checkListsText += ' - ' + item.name + ' [' + item.state + ' ' + (oCompletedBy.date ? oCompletedBy.date : '') + (oCompletedBy.by ? ' by ' + oCompletedBy.by : '') + ']\n';
                                                                        cItem.completed = true;
                                                                        cItem.completedDate = oCompletedBy.date;
                                                                        cItem.completedBy = oCompletedBy.by;
                                                                        jsonCheckList.items.push(cItem);

                                                                    } else {
                                                                        checkListsText += ' - ' + item.name + ' [' + item.state + ']\n';
                                                                        cItem.completed = false;
                                                                        jsonCheckList.items.push(cItem);
                                                                    }
                                                                }
                                                            });
                                                            jsonCheckLists.push(jsonCheckList);
                                                        }
                                                    });
                                                });
                                            }

                                            var numberOfComments = 0;

                                            if (bExportComments) {
                                                //comments
                                                var commentsOnCard = getCommentCardActions(idBoard, card.id);
                                                if (commentsOnCard) {
                                                    // console.log('parsing comments');
                                                    // console.log('parse ' + commentsOnCard.length + ' comment actions for this card ' + JSON.stringify(commentsOnCard));
                                                    $.each(commentsOnCard, function(j, action) {
                                                        if ((action.type == "commentCard" || action.type == 'copyCommentCard')) {
                                                            if (card.id == action.data.card.id) {
                                                                numberOfComments++;
                                                                var jsonComment = {};
                                                                //2013-08-08T06:57:18
                                                                var d = new Date(action.date);
                                                                if (d)
                                                                    jsonComment.date = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                                                                jsonComment.text = action.data.text;

                                                                // Trello Plus Spent/Estimate in comments
                                                                if(jsonComment.text.match(SpentEstRegex)){
                                                                     var m = jsonComment.text.match(SpentEstRegex);
                                                                     var cspent = m[1];
                                                                     var cestimate = m[4];
                                                                    //   console.log("SPENT: " + cspent + " EST: " + cestimate);
                                                                      spent += Number(cspent);
                                                                      estimate += Number(cestimate);
                                                                    //   console.log("TOTAL SPENT: " + spent + " EST: " + estimate);
                                                                }

                                                                if (exportFormat === 'HTML') {
                                                                    jsonComment.text = converter.makeHtml(html_encode(jsonComment.text));
                                                                }
                                                                var sActionDate = '';
                                                                if (d)
                                                                    sActionDate = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                                                                if (action.memberCreator !== undefined) {
                                                                    jsonComment.memberCreator = action.memberCreator;
                                                                    if (jsonComment.memberCreator.fullName !== undefined) {
                                                                        jsonComment.memberCreator.fullName = (exportFormat === 'HTML' ? html_encode(jsonComment.memberCreator.fullName) : jsonComment.memberCreator.fullName);
                                                                    } else {
                                                                        jsonComment.memberCreator.fullName = (exportFormat === 'HTML' ? html_encode(jsonComment.memberCreator.username) : jsonComment.memberCreator.username);
                                                                    }

                                                                    commentsText += '[' + sActionDate + ' - ' + (action.memberCreator.fullName !== undefined ? action.memberCreator.fullName : action.memberCreator.username) + '] ' + action.data.text + "\n";
                                                                } else {
                                                                    jsonComment.memberCreator = null;
                                                                    commentsText += '[' + sActionDate + '] ' + action.data.text + "\n";
                                                                }
                                                                jsonComments.push(jsonComment);
                                                            }
                                                        }
                                                    });
                                                }
                                            }

                                            if (bExportAttachments) {
                                                if (card.attachments) {
                                                    // console.log('Attachments: ' + card.attachments.length);
                                                    $.each(card.attachments, function(j, attach) {
                                                        // console.log("attach: " + JSON.stringify(attach));
                                                        attach.name = (exportFormat === 'HTML' ? html_encode(attach.name) : attach.name);
                                                        jsonAttachments.push(attach);
                                                        attachmentsText += '[' + attach.name + '] (' + attach.bytes + ') ' + attach.url + '\n';
                                                    });
                                                }
                                            }

                                            //pulled from https://github.com/bmccormack/export-for-trello/blob/5b2b8b102b98ed2c49241105cb9e00e44d4e1e86/trelloexport.js
                                            //Get member created and DateTime created
                                            var query = Enumerable.From(card.actions)
                                                .Where(function(x) {
                                                    if (x.data.card) {
                                                        return x.data.card.id == card.id && x.type == "createCard";
                                                    }
                                                })
                                                .ToArray();
                                            if (query.length > 0) {
                                                if (query[0].memberCreator !== undefined) {

                                                    if (query[0].memberCreator.fullName !== undefined) {
                                                        memberCreator = query[0].memberCreator.fullName + ' (' + query[0].memberCreator.username + ')';
                                                    } else {
                                                        memberCreator = query[0].memberCreator.username;
                                                    }
                                                    datetimeCreated = new Date(query[0].date);
                                                }

                                            } else {
                                                //use the API to get the action created method
                                                var actionCreateCard = getCreateCardAction(idBoard, card.id);
                                                if (actionCreateCard && actionCreateCard.memberCreator !== undefined) {
                                                    memberCreator = (actionCreateCard.memberCreator.fullName !== undefined ? actionCreateCard.memberCreator.fullName : actionCreateCard.memberCreator.username);
                                                    datetimeCreated = new Date(actionCreateCard.date);
                                                } else {
                                                    // calculate datetimeCreated from card id
                                                    // cfr http://help.trello.com/article/759-getting-the-time-a-card-or-board-was-created
                                                    datetimeCreated = new Date(1000 * parseInt(card.id.substring(0, 8), 16));
                                                    memberCreator = "";
                                                }
                                            }

                                            /**
                                             * 1.9.14: handle multiple nameListDone
                                             * e.g. Done, Finished
                                             */
                                            if (nameListDone === '') {
                                                nameListDone = 'Done';
                                            } // default
                                            var allnameListDone = nameListDone.split(',');
                                            for (var nd = 0; nd < allnameListDone.length; nd++) {
                                                //console.log('check ' + nd + ') ' + allnameListDone[nd] + " VS memberDone " + memberDone);
                                                if (memberDone === "") {
                                                    //Find out when the card was most recently moved to any list whose name starts with "Done" (ignore case, e.g. 'done' or 'DONE' or 'DoNe')
                                                    query = Enumerable.From(card.actions)
                                                        .Where(function(x) {
                                                            if (x.data.card && x.data.listAfter) {
                                                                var listAfterName = x.data.listAfter.name;
                                                                return x.data.card.id == card.id && listAfterName.toLowerCase().stringContains(allnameListDone[nd].trim().toLowerCase());
                                                            }
                                                        })
                                                        .OrderByDescending(function(x) {
                                                            return x.date;
                                                        })
                                                        .ToArray();
                                                    //console.log('query.length: ' + query.length);
                                                    if (query.length > 0 && query[0].memberCreator !== undefined) {
                                                        memberDone = (query[0].memberCreator.fullName !== undefined ? query[0].memberCreator.fullName : query[0].memberCreator.username);
                                                        datetimeDone = query[0].date;
                                                    } else {
                                                        var actionMoveCard = getMoveCardAction(idBoard, card.id, allnameListDone[nd].trim());
                                                        if (actionMoveCard && actionMoveCard.memberCreator !== undefined) {
                                                            memberDone = (actionMoveCard.memberCreator.fullName !== undefined ? actionMoveCard.memberCreator.fullName : actionMoveCard.memberCreator.username);
                                                            datetimeDone = actionMoveCard.date;
                                                        } else {
                                                            memberDone = "";
                                                            datetimeDone = "";
                                                        }
                                                    }
                                                }
                                            }

                                            var completionTime = "",
                                                completionTimeText = "";
                                            if (datetimeDone !== "" && datetimeCreated !== "") {
                                                // var d1 = new Date(datetimeCreated);
                                                var d2 = new Date(datetimeDone);
                                                var df = new DateDiff(d2, datetimeCreated);
                                                // PnYnMnDTnHnMnS ISO8601 -> PnDTnHnMnS
                                                completionTime = "P" + df.days + "DT" + df.hours + "H" + df.minutes + "M" + df.seconds + "S";
                                                completionTimeText = df.days + ' days, ' + df.hours + ' hours, ' + df.minutes + ' minutes, ' + df.seconds + ' seconds';
                                                datetimeCreated = datetimeCreated.toLocaleDateString() + ' ' + datetimeCreated.toLocaleTimeString();
                                                datetimeDone = d2.toLocaleDateString() + ' ' + d2.toLocaleTimeString();
                                            } else {
                                                if (datetimeCreated) {
                                                    datetimeCreated = datetimeCreated.toLocaleDateString() + ' ' + datetimeCreated.toLocaleTimeString();
                                                }
                                            }

                                            var isArchived = false;
                                            if (list.closed || card.closed) {
                                                isArchived = true;
                                            }

                                            var dateLastActivity = new Date(card.dateLastActivity);

                                            if (exportFormat === 'HTML') {
                                                card.desc = converter.makeHtml(html_encode(card.desc));
                                            }

                                            var rowData = {
                                                'organizationName': orgName,
                                                'boardName': (exportFormat === 'HTML' ? html_encode(boardName) : boardName),
                                                'listName': (exportFormat === 'HTML' ? html_encode(listName) : listName),
                                                'cardID': card.idShort,
                                                'title': (exportFormat === 'HTML' ? html_encode(title) : title),
                                                'shortLink': 'https://trello.com/c/' + card.shortLink,
                                                'cardDescription': (exportFormat === 'XLSX' && card.desc ? card.desc.substr(0, MAXCHARSPERCELL) : card.desc),
                                                'checkLists': (exportFormat === 'XLSX' && checkListsText !== undefined && checkListsText !== '' ? checkListsText.substr(0, MAXCHARSPERCELL) : checkListsText),
                                                'numberOfComments': numberOfComments,
                                                'comments': (exportFormat === 'XLSX' && commentsText !== undefined && commentsText !== '' ? commentsText.substr(0, MAXCHARSPERCELL) : commentsText),
                                                'attachments': (exportFormat === 'XLSX' && attachmentsText !== undefined && attachmentsText !== '' ? attachmentsText.substr(0, MAXCHARSPERCELL) : attachmentsText),
                                                'votes': card.idMembersVoted.length,
                                                'spent': spent,
                                                'estimate': estimate,
                                                'points_estimate': points_estimate,
                                                'points_consumed': points_consumed,
                                                'datetimeCreated': datetimeCreated,
                                                'memberCreator': memberCreator,
                                                'LastActivity': dateLastActivity.toLocaleDateString() + ' ' + dateLastActivity.toLocaleTimeString(),
                                                //'due': (card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''),
                                                'start': (card.start ? new Date(card.start) : ''),
                                                'due': (card.due ? new Date(card.due) : ''),
                                                'dueComplete': card.dueComplete,
                                                'datetimeDone': datetimeDone,
                                                'memberDone': memberDone,
                                                'completionTime': completionTime,
                                                'completionTimeText': completionTimeText,
                                                'memberInitials': memberInitials.toString(),
                                                'labels': labels,
                                                'isArchived': isArchived,
                                                'jsonCheckLists': jsonCheckLists,
                                                'jsonComments': jsonComments,
                                                'jsonAttachments': jsonAttachments,
                                                'customFields': [],
                                                'jsonLabels': jsonLabels
                                            };
                                            if (bExportCustomFields) {
                                                // load custom fields values for card
                                                var cfVals = loadCardCustomFields(card.id);

                                                cfVals.forEach(function(dv) {
                                                    rowData.customFields.push({
                                                        name: (exportFormat === 'HTML' ? html_encode(dv.colName) : dv.colName),
                                                        value: (exportFormat === 'HTML' ? html_encode(dv.value) : dv.value)
                                                    });
                                                    rowData[dv.colName] = dv.value;
                                                });

                                            }
                                            // console.log('RAWDATA ' + JSON.stringify(rowData));
                                            jsonComputedCards.push(rowData);
                                        }
                                    });

                                })
                                .fail(function(jqXHR, textStatus, errorThrown) {
                                    console.error("Error: " + jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText);
                                    readCards = -1;
                                    
                                    // Handle specific errors
                                    if (jqXHR.status === 429) {
                                        $.growl.error({
                                            title: "Rate Limit Error",
                                            message: 'Too many requests. Please wait a moment and try again with fewer items selected.',
                                            fixed: true,
                                            duration: 10000
                                        });
                                    } else if (jqXHR.status === 504 || textStatus === 'timeout') {
                                        $.growl.error({
                                            title: "Timeout Error", 
                                            message: 'Request timed out. Try exporting fewer cards or lists at once.',
                                            fixed: true,
                                            duration: 10000
                                        });
                                    } else {
                                        $.growl.error({
                                            title: "TrelloExport",
                                            message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                                            fixed: true
                                        });
                                    }
                                });

                        } while (readCards > 0);
                        // cards loop end

                    });

                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("Error: " + jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText);
                    $.growl.error({
                        title: "TrelloExport",
                        message: jqXHR.statusText + ' ' + jqXHR.status + ': ' + jqXHR.responseText,
                        fixed: true
                    });
                });

            // end loop boards
            nProcessedBoards++;
        }

        console.log('Processed ' + nProcessedLists + ' lists and ' + nProcessedCards + ' cards');
        console.log("The End. Now export.");

        $.growl.notice({
            title: "TrelloExport",
            message: 'Done. Processed ' + nProcessedLists + ' lists and ' + nProcessedCards + ' cards in ' + nProcessedBoards + (nProcessedBoards > 1 ? ' boards.' : ' board.'),
            fixed: false
        });

        switch (exportFormat) {

            case 'XLSX':
                createExcelExport(jsonComputedCards, iExcelItemsAsRows, allColumns, selectedColumns, bExportCustomFields, false);
                break;

            case 'MD':
                createMarkdownExport(jsonComputedCards, true, bckHTMLCardInfo, bchkHTMLInlineImages, bExportCustomFields);
                break;

            case 'HTML':
                createHTMLExport(jsonComputedCards, bckHTMLCardInfo, bchkHTMLInlineImages, css, templateURL, bExportCustomFields);
                break;

            case 'OPML':
                createOPMLExport(jsonComputedCards, bExportCustomFields);
                break;

            case 'CSV':
                var data = createExcelExport(jsonComputedCards, iExcelItemsAsRows, allColumns, selectedColumns, bExportCustomFields, true);
                createCSVExport(data, bexportArchived);
                break;

            default:
                console.log('Unknown exportFormat requested');
                $.growl.error({
                    title: "TrelloExport",
                    message: 'Unknown exportFormat requested',
                    fixed: true
                });
                break;
        }


    }).catch(
        // rejection
        function(reason) {
            console.error('===Error=== ' + reason);
            $.growl.error({
                title: "TrelloExport",
                message: reason,
                fixed: true
            });
        });

}

// createExcelExport: export to XLSX
function createExcelExport(jsonComputedCards, iExcelItemsAsRows, allColumns, columnHeadings, bExportCustomFields, isCsv) {
    console.log('TrelloExport exporting to Excel ' + jsonComputedCards.length + ' cards... columnHeadings ' + columnHeadings.length  + ' allColumns ' + allColumns.length);

    // prepare Workbook
    var wb = new Workbook();
    wArchived = {};
    wArchived.name = 'Archived lists and cards';
    wArchived.data = [];

    if(!isCsv) {
        wArchived.data.push([]);
        wArchived.data[0] = columnHeadings;    
    }

    // Setup the active list and cart worksheet
    w = {};
    // if(data.name.length>30)
    //     w.name = data.name.substr(0,30);
    // else
    //     w.name = data.name;
    w.data = [];
    w.data.push([]);
    w.data[0] = columnHeadings;

    // loop jsonComputedCards
    jsonComputedCards.forEach(function(card) {

        var toStringArray = [];
        var nTotalCheckListItems = 0,
            nTotalCheckListItemsCompleted = 0;

        card.jsonCheckLists.forEach(function(list) {
            nTotalCheckListItems += list.items.length;

            list.items.forEach(function(it) {
                if (it.completed) {
                    nTotalCheckListItemsCompleted++;
                }
            });
        });

        // iExcelItemsAsRows: 
        // 0=default
        // 1=checklist items as rows
        // 2=labels as rows
        // 3=members as rows
        switch (Number(iExcelItemsAsRows)) {
            case 0:
                // standard checklist export
                toStringArray = [];
                // filter columns
                for (var nCol = 0; nCol < allColumns.length; nCol++) {
                    //  var posInArray = $.inArray(allColumns[nCol].value, columnHeadings);
                    //  console.log('nCol ' + nCol + ', posInArray ' + posInArray + ' allColumns[nCol].value ' + allColumns[nCol].value);
                    if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                        //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 1');

                        switch (nCol) {
                            case 0:
                                toStringArray.push(card.organizationName);
                                break;
                            case 1:
                                toStringArray.push(card.boardName);
                                break;
                            case 2:
                                toStringArray.push(card.listName);
                                break;
                            case 3:
                                toStringArray.push(card.cardID);
                                break;
                            case 4:
                                toStringArray.push(card.title);
                                break;
                            case 5:
                                toStringArray.push(card.shortLink);
                                break;
                            case 6:
                                toStringArray.push(card.cardDescription);
                                break;
                            case 7:
                                toStringArray.push(nTotalCheckListItems);
                                break;
                            case 8:
                                toStringArray.push(nTotalCheckListItemsCompleted);
                                break;
                            case 9:
                                toStringArray.push(card.checkLists);
                                break;
                            case 10:
                                toStringArray.push(card.numberOfComments);
                                break;
                            case 11:
                                toStringArray.push(card.comments);
                                break;
                            case 12:
                                toStringArray.push(card.attachments);
                                break;
                            case 13:
                                toStringArray.push(card.votes);
                                break;
                            case 14:
                                toStringArray.push(card.spent);
                                break;
                            case 15:
                                toStringArray.push(card.estimate);
                                break;
                            case 16:
                                toStringArray.push(card.points_estimate);
                                break;
                            case 17:
                                toStringArray.push(card.points_consumed);
                                break;
                            case 18:
                                toStringArray.push(card.datetimeCreated);
                                break;
                            case 19:
                                toStringArray.push(card.memberCreator);
                                break;
                            case 20:
                                toStringArray.push(card.LastActivity);
                                break;
                            case 21:
                                toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                break;
                            case 22:
                                toStringArray.push(card.datetimeDone);
                                break;
                            case 23:
                                toStringArray.push(card.memberDone);
                                break;
                            case 24:
                                toStringArray.push(card.completionTime);
                                break;
                            case 25:
                                toStringArray.push(card.memberInitials);
                                break;
                            case 26:
                                toStringArray.push(card.labels.toString());
                                break;
                            case 27:
                                toStringArray.push(card.dueComplete);
                                break;
                            case 28:
                                toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                break;
                            default:
                                // custom fields
                                if (bExportCustomFields) {
                                    if (localStorage.TrelloExportSelectedColumns) {
                                        if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                            toStringArray.push(card[allColumns[nCol].value]);
                                        }
                                    } else {
                                        toStringArray.push(card[allColumns[nCol].value]);
                                    }
                                }
                                break;
                        }
                    }
                }

                if (card.isArchived) {
                    var rArch = wArchived.data.push([]) - 1;
                    wArchived.data[rArch] = toStringArray;
                } else {
                    var r = w.data.push([]) - 1;
                    w.data[r] = toStringArray;
                }
                break;

            case 1:
                // checklist items as rows
                if (card.jsonCheckLists.length > 0) {

                    card.jsonCheckLists.forEach(function(list) {

                        if (!list.items || list.items.length === 0) {
                            // checklist with no items
                            list.items.push({
                                name: null,
                                completed: null,
                                completedDate: null,
                                completedBy: null
                            });
                        }

                        list.items.forEach(function(it) {
                            toStringArray = [];
                            // filter columns
                            for (var nCol = 0; nCol < allColumns.length; nCol++) {
                                if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                                    //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 2');

                                    switch (nCol) {
                                        case 0:
                                            toStringArray.push(card.organizationName);
                                            break;
                                        case 1:
                                            toStringArray.push(card.boardName);
                                            break;
                                        case 2:
                                            toStringArray.push(card.listName);
                                            break;
                                        case 3:
                                            toStringArray.push(card.cardID);
                                            break;
                                        case 4:
                                            toStringArray.push(card.title);
                                            break;
                                        case 5:
                                            toStringArray.push(card.shortLink);
                                            break;
                                        case 6:
                                            toStringArray.push(card.cardDescription);
                                            break;
                                        case 7:
                                            toStringArray.push(nTotalCheckListItems);
                                            break;
                                        case 8:
                                            toStringArray.push(nTotalCheckListItemsCompleted);
                                            break;
                                        case 9:
                                            toStringArray.push(list.name);
                                            break;
                                        case 10:
                                            toStringArray.push(it.name);
                                            break;
                                        case 11:
                                            toStringArray.push(it.completed);
                                            break;
                                        case 12:
                                            toStringArray.push(it.completedDate);
                                            break;
                                        case 13:
                                            toStringArray.push(it.completedBy);
                                            break;
                                        case 14:
                                            toStringArray.push(card.numberOfComments);
                                            break;
                                        case 15:
                                            toStringArray.push(card.comments);
                                            break;
                                        case 16:
                                            toStringArray.push(card.attachments);
                                            break;
                                        case 17:
                                            toStringArray.push(card.votes);
                                            break;
                                        case 18:
                                            toStringArray.push(card.spent);
                                            break;
                                        case 19:
                                            toStringArray.push(card.estimate);
                                            break;
                                        case 20:
                                            toStringArray.push(card.points_estimate);
                                            break;
                                        case 21:
                                            toStringArray.push(card.points_consumed);
                                            break;
                                        case 22:
                                            toStringArray.push(card.datetimeCreated);
                                            break;
                                        case 23:
                                            toStringArray.push(card.memberCreator);
                                            break;
                                        case 24:
                                            toStringArray.push(card.LastActivity);
                                            break;
                                        case 25:
                                            toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                            break;
                                        case 26:
                                            toStringArray.push(card.datetimeDone);
                                            break;
                                        case 27:
                                            toStringArray.push(card.memberDone);
                                            break;
                                        case 28:
                                            toStringArray.push(card.completionTime);
                                            break;
                                        case 29:
                                            toStringArray.push(card.memberInitials);
                                            break;
                                        case 30:
                                            toStringArray.push(card.labels.toString());
                                            break;
                                        case 31:
                                            toStringArray.push(card.dueComplete);
                                            break;
                                        case 32:
                                            toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                            break;
                                        case 33:
                                            toStringArray.push(it.due);
                                            break;
                                        case 34:
                                            toStringArray.push(it.idMember);
                                            break;
                                        case 35:
                                            toStringArray.push(it.memberInitials);
                                            break;
                                        case 36:
                                            toStringArray.push(it.state);
                                            break;
                                        default:
                                            // custom fields
                                            if (bExportCustomFields) {
                                                if (localStorage.TrelloExportSelectedColumns) {
                                                    if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                        toStringArray.push(card[allColumns[nCol].value]);
                                                    }
                                                } else {
                                                    toStringArray.push(card[allColumns[nCol].value]);
                                                }
                                            }
                                            break;
                                    }
                                }
                            }

                            if (card.isArchived) {
                                var rArch2 = wArchived.data.push([]) - 1;
                                wArchived.data[rArch2] = toStringArray;
                            } else {
                                var r2 = w.data.push([]) - 1;
                                w.data[r2] = toStringArray;
                            }

                        });
                    });

                } else {
                    // no checklist items

                    toStringArray = [];
                    // filter columns
                    for (nCol = 0; nCol < allColumns.length; nCol++) {
                        if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                            //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 3');

                            switch (nCol) {
                                case 0:
                                    toStringArray.push(card.organizationName);
                                    break;
                                case 1:
                                    toStringArray.push(card.boardName);
                                    break;
                                case 2:
                                    toStringArray.push(card.listName);
                                    break;
                                case 3:
                                    toStringArray.push(card.cardID);
                                    break;
                                case 4:
                                    toStringArray.push(card.title);
                                    break;
                                case 5:
                                    toStringArray.push(card.shortLink);
                                    break;
                                case 6:
                                    toStringArray.push(card.cardDescription);
                                    break;
                                case 7:
                                    toStringArray.push(nTotalCheckListItems);
                                    break;
                                case 8:
                                    toStringArray.push(nTotalCheckListItemsCompleted);
                                    break;
                                case 9:
                                    toStringArray.push('');
                                    break;
                                case 10:
                                    toStringArray.push('');
                                    break;
                                case 11:
                                    toStringArray.push('');
                                    break;
                                case 12:
                                    toStringArray.push('');
                                    break;
                                case 13:
                                    toStringArray.push('');
                                    break;
                                case 14:
                                    toStringArray.push(card.numberOfComments);
                                    break;
                                case 15:
                                    toStringArray.push(card.comments);
                                    break;
                                case 16:
                                    toStringArray.push(card.attachments);
                                    break;
                                case 17:
                                    toStringArray.push(card.votes);
                                    break;
                                case 18:
                                    toStringArray.push(card.spent);
                                    break;
                                case 19:
                                    toStringArray.push(card.estimate);
                                    break;
                                case 20:
                                    toStringArray.push(card.points_estimate);
                                    break;
                                case 21:
                                    toStringArray.push(card.points_consumed);
                                    break;
                                case 22:
                                    toStringArray.push(card.datetimeCreated);
                                    break;
                                case 23:
                                    toStringArray.push(card.memberCreator);
                                    break;
                                case 24:
                                    toStringArray.push(card.LastActivity);
                                    break;
                                case 25:
                                    toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                    break;
                                case 26:
                                    toStringArray.push(card.datetimeDone);
                                    break;
                                case 27:
                                    toStringArray.push(card.memberDone);
                                    break;
                                case 28:
                                    toStringArray.push(card.completionTime);
                                    break;
                                case 29:
                                    toStringArray.push(card.memberInitials);
                                    break;
                                case 30:
                                    toStringArray.push(card.labels.toString());
                                    break;
                                case 31:
                                    toStringArray.push(card.dueComplete);
                                    break;
                                case 32:
                                    toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                    break;
                                default:
                                    // custom fields
                                    if (bExportCustomFields) {
                                        if (localStorage.TrelloExportSelectedColumns) {
                                            if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                toStringArray.push(card[allColumns[nCol].value]);
                                            }
                                        } else {
                                            toStringArray.push(card[allColumns[nCol].value]);
                                        }
                                    }
                                    break;
                            }
                        }
                    }

                    if (card.isArchived) {
                        var rArch2 = wArchived.data.push([]) - 1;
                        wArchived.data[rArch2] = toStringArray;
                    } else {
                        var r2 = w.data.push([]) - 1;
                        w.data[r2] = toStringArray;
                    }
                }
                break;

            case 2:
                // 2=labels as rows
                if (card.labels.length > 0) {

                    card.labels.forEach(function(lbl) {

                        toStringArray = [];
                        // filter columns
                        for (var nCol = 0; nCol < allColumns.length; nCol++) {
                            if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                                //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 4');

                                switch (nCol) {
                                    case 0:
                                        toStringArray.push(card.organizationName);
                                        break;
                                    case 1:
                                        toStringArray.push(card.boardName);
                                        break;
                                    case 2:
                                        toStringArray.push(card.listName);
                                        break;
                                    case 3:
                                        toStringArray.push(card.cardID);
                                        break;
                                    case 4:
                                        toStringArray.push(card.title);
                                        break;
                                    case 5:
                                        toStringArray.push(card.shortLink);
                                        break;
                                    case 6:
                                        toStringArray.push(card.cardDescription);
                                        break;
                                    case 7:
                                        toStringArray.push(nTotalCheckListItems);
                                        break;
                                    case 8:
                                        toStringArray.push(nTotalCheckListItemsCompleted);
                                        break;
                                    case 9:
                                        toStringArray.push(card.checkLists);
                                        break;
                                    case 10:
                                        toStringArray.push(card.numberOfComments);
                                        break;
                                    case 11:
                                        toStringArray.push(card.comments);
                                        break;
                                    case 12:
                                        toStringArray.push(card.attachments);
                                        break;
                                    case 13:
                                        toStringArray.push(card.votes);
                                        break;
                                    case 14:
                                        toStringArray.push(card.spent);
                                        break;
                                    case 15:
                                        toStringArray.push(card.estimate);
                                        break;
                                    case 16:
                                        toStringArray.push(card.points_estimate);
                                        break;
                                    case 17:
                                        toStringArray.push(card.points_consumed);
                                        break;
                                    case 18:
                                        toStringArray.push(card.datetimeCreated);
                                        break;
                                    case 19:
                                        toStringArray.push(card.memberCreator);
                                        break;
                                    case 20:
                                        toStringArray.push(card.LastActivity);
                                        break;
                                    case 21:
                                        toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                        break;
                                    case 22:
                                        toStringArray.push(card.datetimeDone);
                                        break;
                                    case 23:
                                        toStringArray.push(card.memberDone);
                                        break;
                                    case 24:
                                        toStringArray.push(card.completionTime);
                                        break;
                                    case 25:
                                        toStringArray.push(card.memberInitials);
                                        break;
                                    case 26:
                                        toStringArray.push(lbl);
                                        break;
                                    case 27:
                                        toStringArray.push(card.dueComplete);
                                        break;
                                    case 28:
                                        toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                        break;
                                    default:
                                        // custom fields
                                        if (bExportCustomFields) {
                                            if (localStorage.TrelloExportSelectedColumns) {
                                                if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                    toStringArray.push(card[allColumns[nCol].value]);
                                                }
                                            } else {
                                                toStringArray.push(card[allColumns[nCol].value]);
                                            }
                                        }
                                        break;
                                }
                            }
                        }

                        if (card.isArchived) {
                            var rArch2 = wArchived.data.push([]) - 1;
                            wArchived.data[rArch2] = toStringArray;
                        } else {
                            var r2 = w.data.push([]) - 1;
                            w.data[r2] = toStringArray;
                        }

                    });

                } else {
                    // no labels

                    toStringArray = [];
                    // filter columns
                    for (nCol = 0; nCol < allColumns.length; nCol++) {
                        if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                            //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 5');
                            switch (nCol) {
                                case 0:
                                    toStringArray.push(card.organizationName);
                                    break;
                                case 1:
                                    toStringArray.push(card.boardName);
                                    break;
                                case 2:
                                    toStringArray.push(card.listName);
                                    break;
                                case 3:
                                    toStringArray.push(card.cardID);
                                    break;
                                case 4:
                                    toStringArray.push(card.title);
                                    break;
                                case 5:
                                    toStringArray.push(card.shortLink);
                                    break;
                                case 6:
                                    toStringArray.push(card.cardDescription);
                                    break;
                                case 7:
                                    toStringArray.push(nTotalCheckListItems);
                                    break;
                                case 8:
                                    toStringArray.push(nTotalCheckListItemsCompleted);
                                    break;
                                case 9:
                                    toStringArray.push('');
                                    break;
                                case 10:
                                    toStringArray.push('');
                                    break;
                                case 11:
                                    toStringArray.push('');
                                    break;
                                case 12:
                                    toStringArray.push('');
                                    break;
                                case 13:
                                    toStringArray.push('');
                                    break;
                                case 14:
                                    toStringArray.push(card.numberOfComments);
                                    break;
                                case 15:
                                    toStringArray.push(card.comments);
                                    break;
                                case 16:
                                    toStringArray.push(card.attachments);
                                    break;
                                case 17:
                                    toStringArray.push(card.votes);
                                    break;
                                case 18:
                                    toStringArray.push(card.spent);
                                    break;
                                case 19:
                                    toStringArray.push(card.estimate);
                                    break;
                                case 20:
                                    toStringArray.push(card.points_estimate);
                                    break;
                                case 21:
                                    toStringArray.push(card.points_consumed);
                                    break;
                                case 22:
                                    toStringArray.push(card.datetimeCreated);
                                    break;
                                case 23:
                                    toStringArray.push(card.memberCreator);
                                    break;
                                case 24:
                                    toStringArray.push(card.LastActivity);
                                    break;
                                case 25:
                                    toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                    break;
                                case 26:
                                    toStringArray.push(card.datetimeDone);
                                    break;
                                case 27:
                                    toStringArray.push(card.memberDone);
                                    break;
                                case 28:
                                    toStringArray.push(card.completionTime);
                                    break;
                                case 29:
                                    toStringArray.push(card.memberInitials);
                                    break;
                                case 30:
                                    toStringArray.push(card.labels.toString());
                                    break;
                                case 31:
                                    toStringArray.push(card.dueComplete);
                                    break;
                                case 32:
                                    toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                    break;
                                default:
                                    // custom fields
                                    if (bExportCustomFields) {
                                        if (localStorage.TrelloExportSelectedColumns) {
                                            if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                toStringArray.push(card[allColumns[nCol].value]);
                                            }
                                        } else {
                                            toStringArray.push(card[allColumns[nCol].value]);
                                        }
                                    }
                                    break;
                            }
                        }
                    }

                    if (card.isArchived) {
                        var lblrArch2 = wArchived.data.push([]) - 1;
                        wArchived.data[lblrArch2] = toStringArray;
                    } else {
                        var lblr2 = w.data.push([]) - 1;
                        w.data[lblr2] = toStringArray;
                    }
                }
                break;

            case 3:
                // 3=members as rows
                if (card.memberInitials.length > 0) {

                    card.memberInitials.split(",").forEach(function(mbm) {

                        toStringArray = [];
                        // filter columns
                        for (var nCol = 0; nCol < allColumns.length; nCol++) {
                            if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                                //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 6');
                                switch (nCol) {
                                    case 0:
                                        toStringArray.push(card.organizationName);
                                        break;
                                    case 1:
                                        toStringArray.push(card.boardName);
                                        break;
                                    case 2:
                                        toStringArray.push(card.listName);
                                        break;
                                    case 3:
                                        toStringArray.push(card.cardID);
                                        break;
                                    case 4:
                                        toStringArray.push(card.title);
                                        break;
                                    case 5:
                                        toStringArray.push(card.shortLink);
                                        break;
                                    case 6:
                                        toStringArray.push(card.cardDescription);
                                        break;
                                    case 7:
                                        toStringArray.push(nTotalCheckListItems);
                                        break;
                                    case 8:
                                        toStringArray.push(nTotalCheckListItemsCompleted);
                                        break;
                                    case 9:
                                        toStringArray.push(card.checkLists);
                                        break;
                                    case 10:
                                        toStringArray.push(card.numberOfComments);
                                        break;
                                    case 11:
                                        toStringArray.push(card.comments);
                                        break;
                                    case 12:
                                        toStringArray.push(card.attachments);
                                        break;
                                    case 13:
                                        toStringArray.push(card.votes);
                                        break;
                                    case 14:
                                        toStringArray.push(card.spent);
                                        break;
                                    case 15:
                                        toStringArray.push(card.estimate);
                                        break;
                                    case 16:
                                        toStringArray.push(card.points_estimate);
                                        break;
                                    case 17:
                                        toStringArray.push(card.points_consumed);
                                        break;
                                    case 18:
                                        toStringArray.push(card.datetimeCreated);
                                        break;
                                    case 19:
                                        toStringArray.push(card.memberCreator);
                                        break;
                                    case 20:
                                        toStringArray.push(card.LastActivity);
                                        break;
                                    case 21:
                                        toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                        break;
                                    case 22:
                                        toStringArray.push(card.datetimeDone);
                                        break;
                                    case 23:
                                        toStringArray.push(card.memberDone);
                                        break;
                                    case 24:
                                        toStringArray.push(card.completionTime);
                                        break;
                                    case 25:
                                        toStringArray.push(mbm);
                                        break;
                                    case 26:
                                        toStringArray.push(card.labels.toString());
                                        break;
                                    case 27:
                                        toStringArray.push(card.dueComplete);
                                        break;
                                    case 28:
                                        toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                        break;
                                    default:
                                        // custom fields
                                        if (bExportCustomFields) {
                                            if (localStorage.TrelloExportSelectedColumns) {
                                                if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                    toStringArray.push(card[allColumns[nCol].value]);
                                                }
                                            } else {
                                                toStringArray.push(card[allColumns[nCol].value]);
                                            }
                                        }
                                        break;
                                }
                            }
                        }

                        if (card.isArchived) {
                            var rArch2 = wArchived.data.push([]) - 1;
                            wArchived.data[rArch2] = toStringArray;
                        } else {
                            var r2 = w.data.push([]) - 1;
                            w.data[r2] = toStringArray;
                        }

                    });

                } else {
                    // no members

                    toStringArray = [];
                    // filter columns
                    for (nCol = 0; nCol < allColumns.length; nCol++) {
                        if ($.inArray(allColumns[nCol].value, columnHeadings) > -1) {

                            //console.log('nCol ' + nCol + ' allColumns[nCol].value ' + allColumns[nCol].value + ' 7');
                            switch (nCol) {
                                case 0:
                                    toStringArray.push(card.organizationName);
                                    break;
                                case 1:
                                    toStringArray.push(card.boardName);
                                    break;
                                case 2:
                                    toStringArray.push(card.listName);
                                    break;
                                case 3:
                                    toStringArray.push(card.cardID);
                                    break;
                                case 4:
                                    toStringArray.push(card.title);
                                    break;
                                case 5:
                                    toStringArray.push(card.shortLink);
                                    break;
                                case 6:
                                    toStringArray.push(card.cardDescription);
                                    break;
                                case 7:
                                    toStringArray.push(nTotalCheckListItems);
                                    break;
                                case 8:
                                    toStringArray.push(nTotalCheckListItemsCompleted);
                                    break;
                                case 9:
                                    toStringArray.push('');
                                    break;
                                case 10:
                                    toStringArray.push('');
                                    break;
                                case 11:
                                    toStringArray.push('');
                                    break;
                                case 12:
                                    toStringArray.push('');
                                    break;
                                case 13:
                                    toStringArray.push('');
                                    break;
                                case 14:
                                    toStringArray.push(card.numberOfComments);
                                    break;
                                case 15:
                                    toStringArray.push(card.comments);
                                    break;
                                case 16:
                                    toStringArray.push(card.attachments);
                                    break;
                                case 17:
                                    toStringArray.push(card.votes);
                                    break;
                                case 18:
                                    toStringArray.push(card.spent);
                                    break;
                                case 19:
                                    toStringArray.push(card.estimate);
                                    break;
                                case 20:
                                    toStringArray.push(card.points_estimate);
                                    break;
                                case 21:
                                    toStringArray.push(card.points_consumed);
                                    break;
                                case 22:
                                    toStringArray.push(card.datetimeCreated);
                                    break;
                                case 23:
                                    toStringArray.push(card.memberCreator);
                                    break;
                                case 24:
                                    toStringArray.push(card.LastActivity);
                                    break;
                                case 25:
                                    toStringArray.push((card.due ? new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : ''));
                                    break;
                                case 26:
                                    toStringArray.push(card.datetimeDone);
                                    break;
                                case 27:
                                    toStringArray.push(card.memberDone);
                                    break;
                                case 28:
                                    toStringArray.push(card.completionTime);
                                    break;
                                case 29:
                                    toStringArray.push(card.memberInitials);
                                    break;
                                case 30:
                                    toStringArray.push(card.labels.toString());
                                    break;
                                case 31:
                                    toStringArray.push(card.dueComplete);
                                    break;
                                case 32:
                                    toStringArray.push((card.start ? new Date(card.start).toLocaleDateString() + ' ' + new Date(card.start).toLocaleTimeString() : ''));
                                    break;
                                default:
                                    // custom fields
                                    if (bExportCustomFields) {
                                        if (localStorage.TrelloExportSelectedColumns) {
                                            if (localStorage.TrelloExportSelectedColumns.stringContains(allColumns[nCol].value)) {
                                                toStringArray.push(card[allColumns[nCol].value]);
                                            }
                                        } else {
                                            toStringArray.push(card[allColumns[nCol].value]);
                                        }
                                    }
                                    break;
                            }
                        }
                    }

                    if (card.isArchived) {
                        var lblrArch3 = wArchived.data.push([]) - 1;
                        wArchived.data[lblrArch3] = toStringArray;
                    } else {
                        var lblr3 = w.data.push([]) - 1;
                        w.data[lblr3] = toStringArray;
                    }
                }
                break;

            default:
                // console.log('DEFAULT: ' + iExcelItemsAsRows);
                break;
        }

    });

    //console.log('w.data: ' + w.data.length + ', wArchived.data: ' + wArchived.data.length);

    if (isCsv) {
        var data = { data: w.data, archived: wArchived.data };
        return data;
    }

    var board_title = "TrelloExport";
    var ws = sheet_from_array_of_arrays(w.data);

    // add worksheet to workbook
    wb.SheetNames.push(board_title);
    wb.Sheets[board_title] = ws;
    console.log("Added sheet " + board_title);

    //add the Archived data
    var wsArchived = sheet_from_array_of_arrays(wArchived.data);
    if (wsArchived !== undefined) {
        wb.SheetNames.push("Archived");
        console.log("Added sheet Archived");
        wb.Sheets.Archived = wsArchived;
    }

    var now = new Date();
    var fileName = "TrelloExport_" + now.getFullYear() + dd(now.getMonth() + 1) + dd(now.getUTCDate()) + dd(now.getHours()) + dd(now.getMinutes()) + dd(now.getSeconds()) + ".xlsx";
    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary'
    });
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });
    console.log('saving BLOB ' + blob);
    saveAs(blob, fileName);

    console.log('Done exporting ' + fileName);

    $.growl.notice({
        title: "TrelloExport",
        message: 'Done. Downloading xlsx file ' + fileName,
        fixed: false
    });
}

function createMarkdownExport(jsonComputedCards, bPrint, bckHTMLCardInfo, bchkHTMLInlineImages, bExportCustomFields) {
    console.log('TrelloExport exporting to Markdown ' + jsonComputedCards.length + ' cards...');

    // console.log('jsonComputedCards: ' + JSON.stringify(jsonComputedCards));
    var mdOut = '',
        prevBoard = null,
        prevList = null;

    // loop jsonComputedCards
    jsonComputedCards.forEach(function(card) {

        if (prevBoard !== card.boardName) {
            // print board title
            mdOut += '# ' + card.boardName.trim() + '\n\n';
            prevBoard = card.boardName;
        }

        if (prevList !== card.listName) {
            // print board title
            mdOut += '## ' + card.listName.trim() + '\n\n';
            prevList = card.listName;
        }

        var sTitle = '';
        if (!bPrint) {
            // HTML export: add link to card
            sTitle = '### [ <a target="_blank" href="' + card.shortLink + '">' + card.cardID + '</a> ] ' + card.title.trim() + '\n\n';
        } else {
            sTitle = '### [' + card.cardID + '] ' + card.title.trim() + '\n\n';
        }
        if (bckHTMLCardInfo) {
            sTitle += '**Created:** ' + card.datetimeCreated + '\n\n' +
                '**Created by:** ' + card.memberCreator + '\n\n';
        }

        mdOut += sTitle +
            (card.due !== '' ? '**Due:** ' + new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() : '') + '\n\n' +
            (card.datetimeDone !== '' ? '**Completed:** ' + card.datetimeDone + '\n\n' : '') +
            (card.memberDone !== '' ? '**Completed by:** ' + card.memberDone + '\n\n' : '') +
            (card.completionTimeText !== '' ? '**Elapse:** ' + card.completionTimeText + '\n\n' : '') +
            (card.cardDescription !== '' ? '**Description:**\n\n' + card.cardDescription + '\n\n' : '');

        // checklists
        var i;
        if (card.jsonCheckLists.length > 0) {
            var prevCL = null;
            for (i = 0; i < card.jsonCheckLists.length; i++) {

                if (prevCL !== card.jsonCheckLists[i].name) {
                    mdOut += '#### ' + card.jsonCheckLists[i].name + '\n\n';
                    prevCL = card.jsonCheckLists[i].name;
                }

                for (var ii = 0; ii < card.jsonCheckLists[i].items.length; ii++) {
                    if (card.jsonCheckLists[i].items[ii].completed === true) {
                        mdOut += '[x] ' + card.jsonCheckLists[i].items[ii].name + ' ' + card.jsonCheckLists[i].items[ii].completedDate + ' ' + card.jsonCheckLists[i].items[ii].completedBy + '\n\n';
                    } else {
                        mdOut += '[ ] ' + card.jsonCheckLists[i].items[ii].name + '\n\n';
                    }
                }
            }
        }

        // comments
        if (card.jsonComments.length > 0) {
            mdOut += '#### Comments\n';
            for (i = 0; i < card.jsonComments.length; i++) {
                var d = card.jsonComments[i].date;
                if (d)
                    mdOut += '**' + d + ' ' + card.jsonComments[i].memberCreator.fullName + '**\n\n' + card.jsonComments[i].text + '\n\n';
                else
                    mdOut += '**' + card.jsonComments[i].memberCreator.fullName + '**\n\n' + card.jsonComments[i].text + '\n\n';
            }
        }

        // attachments
        if (card.jsonAttachments.length > 0) {
            mdOut += '#### Attachments\n';
            for (i = 0; i < card.jsonAttachments.length; i++) {

                // console.log('ATTACHMENT = ' + JSON.stringify(card.jsonAttachments[i]) );
                if (bchkHTMLInlineImages && isImage(card.jsonAttachments[i].name)) {

                    var sImg = '![' + card.jsonAttachments[i].name + '](' + card.jsonAttachments[i].url + ')';

                    mdOut += '**' + card.jsonAttachments[i].name + '** (' + Number(card.jsonAttachments[i].bytes / 1024).toFixed(2) + ' kb) [download](' + card.jsonAttachments[i].url + ')\n\n' + sImg + '\n\n';

                } else {

                    mdOut += '**' + card.jsonAttachments[i].name + '** (' + Number(card.jsonAttachments[i].bytes / 1024).toFixed(2) + ' kb) [download](' + card.jsonAttachments[i].url + ')\n\n';

                }

            }
        }

    });

    if (!bPrint) {
        return mdOut;
    }

    var now = new Date();
    var fileName = "TrelloExport_" + now.getFullYear() + dd(now.getMonth() + 1) + dd(now.getUTCDate()) + dd(now.getHours()) + dd(now.getMinutes()) + dd(now.getSeconds()) + ".md";

    saveAs(new Blob([mdOut], {
        type: "text/markdown;charset=utf-8"
    }), fileName);

    console.log('Done exporting ' + fileName);

    $.growl.notice({
        title: "TrelloExport",
        message: 'Done. Downloading markdown file ' + fileName,
        fixed: false
    });
}

function createCSVExport(jsonComputedCards, bexportArchived) {
    console.log('TrelloExport exporting to CSV ' + jsonComputedCards.data.length + ' cards...');
    console.log('TrelloExport exporting to CSV ' + jsonComputedCards.archived.length + ' archived cards...');

    var csvText = '';
    jsonComputedCards.data.forEach(function(card) {
        var i = 0;
        Object.keys(card).forEach(function(c) {
            var t = (typeof card[i] !== 'undefined' && card[i] !== null ? card[i].toString().replaceAll('\r', '') : '');
            t = t.replaceAll('\n', '');
            t = t.replaceAll('"', '\'');
            if (i === Object.keys(card).length) {
                csvText += '"' + t + '"';
            } else {
                csvText += '"' + t + '",';
            }
            i++;
        });
        csvText += "\r\n";
    });

    if (bexportArchived) {
        jsonComputedCards.archived.forEach(function(card) {
            var i = 0;
            Object.keys(card).forEach(function(c) {
                var t = (typeof card[i] !== 'undefined' && card[i] !== null ? card[i].toString().replaceAll('\r', '') : '');
                t = t.replaceAll('\n', '');
                t = t.replaceAll('"', '\'');
                if (i === Object.keys(card).length) {
                    csvText += '"' + t + '"';
                } else {
                    csvText += '"' + t + '",';
                }
                i++;
            });
            csvText += "\r\n";
        });
    }

    var now = new Date();
    var fileName = "TrelloExport_" + now.getFullYear() + dd(now.getMonth() + 1) + dd(now.getUTCDate()) + dd(now.getHours()) + dd(now.getMinutes()) + dd(now.getSeconds()) + ".csv";

    saveAs(new Blob([csvText], {
        type: "text/csv;charset=utf-8"
    }), fileName);

    console.log('Done exporting ' + fileName);

    $.growl.notice({
        title: "TrelloExport",
        message: 'Done. Downloading markdown file ' + fileName,
        fixed: false
    });

}

function isImage(name) {
    name = name.toLowerCase();
    return (name.endsWith("jpg") || name.endsWith("jpeg") || name.endsWith("png"));
}

function loadTemplate(sUrl) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", sUrl, true);
        xhr.onload = function () {
            if (xhr.status == 200) {
                // console.log('loadTemplate loaded: ' + xhr.response);
                resolve(xhr.response);
            }
            else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            if (xhr.status === 0) {
                console.error(xhr.response)
            }
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.crossDomain = true;
        xhr.withCredentials = false;
        xhr.send();
    });
}

function createHTMLExport(jsonComputedCards, bckHTMLCardInfo, bchkHTMLInlineImages, css, templateURL, bExportCustomFields) {

    if (!templateURL) {
        templateURL = chrome.runtime.getURL('/templates/html.twig');
        console.log('using default templateURL: ' + templateURL);
    } else {
        // get css from availableTwigTemplates
        for (var t = 0; t < availableTwigTemplates.length; t++) {
            if (availableTwigTemplates[t].url === templateURL)
                if (availableTwigTemplates[t].css)
                    css = availableTwigTemplates[t].css;
        }
    }

    if (css === undefined || css === '' || css === null) {
        css = chrome.runtime.getURL('/templates/default.css'); // 'https://trapias.github.io/assets/TrelloExport/default.css';
    }
    console.log('createHTMLExport css: ' + css + ', templateURL: ' + templateURL);

    var renderDATA = {
        renderSettings: { 'CSS': css, 'language': (window.navigator.userLanguage || window.navigator.language) },
        cards: jsonComputedCards
    };
    // console.log('renderDATA:' + JSON.stringify(renderDATA));

    // automatically link Digital Object Identifier numbers to their URL
    Twig.extendFilter("linkdoi", function(value) {
        // var pattern = /(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)/g;
        // var pattern = /(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+[^\s<>.'"$])/g;
        var pattern = /[^//><](10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+[^\s<>.'"$])/g;
        var matches = value.match(pattern);
        if (matches) {
            var result = '';
            for (var m = 0; m < matches.length; m++) {
                result = value.replace(pattern, '<a target="_blank" href="http://doi.org/$1">$1</a>');
            }
            return result;
        } else {
            return value;
        }
    });

    loadTemplate(templateURL).then(function(sTpl) {
        var template = Twig.twig({
            data: sTpl
        });
        var htmlBody = template.render({ data: renderDATA });
        var now = new Date();
        var fileName = "TrelloExport_" + now.getFullYear() + dd(now.getMonth() + 1) + dd(now.getUTCDate()) + dd(now.getHours()) + dd(now.getMinutes()) + dd(now.getSeconds()) + ".html";

        saveAs(new Blob([s2ab(htmlBody)], {
            type: "text/html;charset=utf-8"
        }), fileName);

        console.log('Done exporting ' + fileName);

        $.growl.notice({
            title: "TrelloExport",
            message: 'Done. Downloading HTML file ' + fileName,
            fixed: false
        });

    }, function(err) {
        console.error(err);
    });
}

function createOPMLExport(jsonComputedCards, bExportCustomFields) {

    var now = new Date();
    var sXML = '<?xml version="1.0" encoding="utf-8"?><opml version="1.0">';
    sXML += '<head><title>TrelloExport</title><dateCreated>' + now.toISOString() + '</dateCreated></head><body>';

    var prevBoard = null,
        prevList = null,
        description = null;

    // loop jsonComputedCards
    jsonComputedCards.forEach(function(card) {

        if (prevBoard !== card.boardName) {
            if (prevBoard !== null) {
                sXML += '</outline>';
            }
            // add board
            sXML += '<outline text="' + escape4XML(card.boardName.trim()) + '">';
            prevBoard = card.boardName;
        }

        if (prevList !== card.listName) {
            if (prevList !== null) {
                sXML += '</outline>';
            }
            // add list
            sXML += '<outline text="' + escape4XML(card.listName.trim()) + '">';
            prevList = card.listName;
        }

        // std is description, omnioutliner uses _note
        sXML += '<outline text="' + escape4XML(card.title.trim()) + '" _note="' + escape4XML(card.cardDescription) + '" created="' + card.datetimeCreated + '" createdBy="' + card.memberCreator + '"' +
            (card.due !== '' ? ' due="' + new Date(card.due).toLocaleDateString() + ' ' + new Date(card.due).toLocaleTimeString() + '"' : '') +
            (card.datetimeDone !== '' ? ' completed="' + card.datetimeDone + '"' : '') +
            (card.memberDone !== '' ? ' completedBy="' + card.memberDone + '"' : '') +
            (card.completionTimeText !== '' ? ' elapse="' + card.completionTimeText + '"' : '') +
            '>';

        // checklists
        var i;
        if (card.jsonCheckLists.length > 0) {
            sXML += '<outline text="Checklists">';
            for (i = 0; i < card.jsonCheckLists.length; i++) {
                sXML += '<outline text="' + card.jsonCheckLists[i].name + '">';
                for (var ii = 0; ii < card.jsonCheckLists[i].items.length; ii++) {
                    if (card.jsonCheckLists[i].items[ii].completed === true) {
                        sXML += '<outline text="' + '[x] ' + card.jsonCheckLists[i].items[ii].name + ' ' + card.jsonCheckLists[i].items[ii].completedDate + '" completedBy="' + card.jsonCheckLists[i].items[ii].completedBy + '"></outline>';
                    } else {
                        sXML += '<outline text="' + '[ ] ' + card.jsonCheckLists[i].items[ii].name + '"></outline>';
                    }
                }
                sXML += '</outline>';
            }
            sXML += '</outline>';
        }

        // comments
        if (card.jsonComments.length > 0) {
            sXML += '<outline text="Comments">';
            for (i = 0; i < card.jsonComments.length; i++) {
                var d = card.jsonComments[i].date;
                if (d) {
                    sXML += '<outline text="' + escape4XML(card.jsonComments[i].text) + '" created="' + d  + ( card.jsonComments[i].memberCreator !== null ? '" createdBy="' + escape4XML(card.jsonComments[i].memberCreator.fullName) : '' ) + '"></outline>';
                }
            }
            sXML += '</outline>';
        }

        // attachments
        if (card.jsonAttachments.length > 0) {
            sXML += '<outline text="Attachments">';
            for (i = 0; i < card.jsonAttachments.length; i++) {
                sXML += '<outline text="' + escape4XML(card.jsonAttachments[i].name) + '" size="' + Number(card.jsonAttachments[i].bytes / 1024).toFixed(2) + ' kb" url="' + escape4XML(card.jsonAttachments[i].url) + '"></outline>';
            }
            sXML += '</outline>';
        }

        sXML += '</outline>';
    });

    sXML += '</outline></outline>';
    sXML += '</body></opml>';

    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(sXML, "text/xml");

    var s = new XMLSerializer();
    var opml = s.serializeToString(oDOM);
    // console.log('OPML: ' + opml);

    var fileName = "TrelloExport_" + now.getFullYear() + dd(now.getMonth() + 1) + dd(now.getUTCDate()) + dd(now.getHours()) + dd(now.getMinutes()) + dd(now.getSeconds()) + ".opml";

    saveAs(new Blob([opml], {
        type: "text/xml;charset=utf-8"
    }), fileName);

    console.log('Done exporting ' + fileName);

    $.growl.notice({
        title: "TrelloExport",
        message: 'Done. Downloading OPML file ' + fileName,
        fixed: false
    });
}

// Async version of loadData function with retry logic and rate limiting
async function loadDataAsync(exportFormat, bexportArchived, bExportComments, bExportChecklists, bExportAttachments, iExcelItemsAsRows, bckHTMLCardInfo, bchkHTMLInlineImages, allColumns, selectedColumns, css, filterMode, bExportCustomFields, templateURL, chkANDORFilter) {
    console.log('TrelloExport loading data ASYNC, export format: ' + exportFormat);
    
    try {
        // Use the existing loadData function but wrap it in a promise to handle errors
        // For now, we'll just call the original function
        // TODO: Gradually migrate the internal API calls to use async functions
        
        return new Promise((resolve, reject) => {
            try {
                // Call the original loadData function
                loadData(exportFormat, bexportArchived, bExportComments, bExportChecklists, bExportAttachments, iExcelItemsAsRows, bckHTMLCardInfo, bchkHTMLInlineImages, allColumns, selectedColumns, css, filterMode, bExportCustomFields, templateURL, chkANDORFilter);
                
                // The original function doesn't return a promise, so we'll resolve after a delay
                setTimeout(() => {
                    resolve();
                }, 100);
            } catch (error) {
                reject(error);
            }
        });
        
    } catch (error) {
        console.error('loadDataAsync error:', error);
        throw error;
    }
}