var bTrelloExporterLoaded = false;
var bExportSubmenuLoaded = false;

console.log('[TrelloExport] Inject script loaded');

function TrelloExportLoader() {
    if (bTrelloExporterLoaded === true) return;
    setTimeout(function() { addExportLink(); }, 500);
}

// Check periodically but don't reset the flag unnecessarily
setInterval(function() {
    // Only try to add if not already loaded
    if (bTrelloExporterLoaded === false) {
        addExportLink();
    }
    // Also check for the export submenu
    checkExportSubmenu();
}, 1000);

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };
}

// Add a Export Excel button to the DOM and trigger export if clicked
function addExportLink() {
    
    console.log('[TrelloExport] addExportLink called, loaded=' + bTrelloExporterLoaded);

    if(bTrelloExporterLoaded === true) return;

    // Just mark as loaded since we're now adding the button to the export submenu
    // We don't add it to the main menu anymore
    bTrelloExporterLoaded = true;
    console.log('[TrelloExport] Extension loaded, waiting for export submenu');
}

// Function to check and add button to export submenu
function checkExportSubmenu() {
    // Look for all sections that might be the export submenu
    // We check for multiple possible indicators
    var exportMenu = null;
    
    // Try to find by looking for print icon or common export-related elements
    $('section').each(function() {
        var section = $(this);
        // Check if this section contains buttons with print or export related content
        if (section.find('button').length > 0 && 
            (section.find('svg path[d*="M4 3h12v3h1V3"]').length > 0 || // Print icon path
             section.find('button').text().match(/JSON|CSV|Print|Stampa|Esporta|Imprimir|Imprimer|Drucken|Печать|打印|印刷|列印/i))) {
            // Check if it's not the main menu (which has many more items)
            if (section.find('button').length < 10) {
                exportMenu = section;
                return false; // break the each loop
            }
        }
    });
    
    if (!exportMenu || exportMenu.length === 0) {
        // Also try to find by checking if there's a section that appeared after clicking export
        var allSections = $('section[role="dialog"]');
        if (allSections.length > 1) {
            // Get the last section which is likely the submenu
            exportMenu = allSections.last();
            // Verify it's the right one by checking it has fewer items than main menu
            if (exportMenu.find('button').length > 10) {
                exportMenu = null;
            }
        }
    }
    
    if (!exportMenu || exportMenu.length === 0) {
        // Reset flag if submenu is closed
        if (bExportSubmenuLoaded) {
            console.log('[TrelloExport] Export submenu closed');
            bExportSubmenuLoaded = false;
        }
        return;
    }
    
    if (bExportSubmenuLoaded === true) return;
    
    console.log('[TrelloExport] Found export submenu');
    
    // Remove any existing export buttons in submenu
    exportMenu.find('.trelloexport-submenu').remove();
    
    // Find the list in the submenu
    var submenuList = exportMenu.find('ul').first();
    if (!submenuList || submenuList.length === 0) {
        console.log('[TrelloExport] No list found in export submenu');
        return;
    }
    
    // Create the export button for submenu
    var $exportItem = $('<li>')
        .append(
            $('<button>')
                .attr({
                    class: 'TJ69T0gm8D5GkA tlkhw6C_OG8i32 bxgKMAm3lq5BpA SEj5vUdI3VvxDc trelloexport-submenu',
                    type: 'button',
                    id: 'TrelloExportSubmenu'
                })
                .html('<span role="img" aria-label="TrelloExport" class="css-kxjlgc" style="color: currentcolor;">' +
                      '<svg fill="none" viewBox="0 0 16 16" role="presentation" class="css-1t4wpzr">' +
                      '<path fill="currentcolor" fill-rule="evenodd" d="M8.75 1v7.19l2.72-2.72 1.06 1.06-4.53 4.53-4.53-4.53 1.06-1.06 2.72 2.72V1h1.5zM15 10v4.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V10h1.5v3.5h11V10H15z" clip-rule="evenodd"></path>' +
                      '</svg></span>' +
                      '<div class="S1YMKJFPn9WNGk">TrelloExport</div>')
                .click(async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[TrelloExport] Export button clicked from submenu');
                    await TrelloExportOptions();
                    return false;
                })
        );
    
    // Insert at the end of the list
    $exportItem.appendTo(submenuList);
    
    bExportSubmenuLoaded = true;
    console.log('[TrelloExport] Export button added to submenu');
}

// Start the loader
$(document).ready(function() {
    TrelloExportLoader();
});