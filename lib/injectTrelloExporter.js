var bTrelloExporterLoaded = false;

function TrelloExportLoader() {
    if (bTrelloExporterLoaded === true) return;
    setTimeout(function() { addExportLink(); }, 500);
}

setInterval(function() {

    if (bTrelloExporterLoaded === false) {
        setTimeout(function() { addExportLink(); }, 500);
    } else {
        bTrelloExporterLoaded = false;
    }

}, 500);


if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };
}

// Add a Export Excel button to the DOM and trigger export if clicked
function addExportLink() {
    
    var ul = $('.IfckxJ5PbpJuxT ul');
    //console.log(ul.outerHTML);

    //var ul = $('ul.pop-over-list');

     $('.trelloexport').remove();

     //console.log('T ' + $('.trelloexport').length);
    if ($('.trelloexport').length > 0) return;

    bTrelloExporterLoaded = false;

    if(ul !== null && ul !== undefined) {

        //console.log('UL ' + ul);
        $excel_btn = $('<a>')
        .attr({
            class: 'trelloexport',
            href: '#',
            target: '_blank',
            title: 'TrelloExport',
            id: 'TrelloExport'
        })
        // .text('TrelloExport')
        .html('<b>TrelloExport</b>')
        .click(TrelloExportOptions)
        // .insertAfter(ul)
        .appendTo(ul)
        .wrap(document.createElement("li"));

    bTrelloExporterLoaded = true;
    }
}