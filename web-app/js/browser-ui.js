/* -*- mode: javascript; c-basic-offset: 4; indent-tabs-mode: nil -*- */

// 
// Dalliance Genome Explorer
// (c) Thomas Down 2006-2013
//
// browser-us.js: standard UI wiring
//

function formatLongInt(n) {
    return (n|0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/*
 * Quite a bit of this ought to be done using a templating system, but
 * since web-components isn't quite ready for prime time yet we'll stick
 * with constructing it all in Javascript for now...
 */

Browser.prototype.initUI = function(holder, genomePanel) {
    document.head.appendChild(makeElement('link', '', {rel: 'stylesheet', href: this.uiPrefix + 'css/bootstrap-scoped.css'}));
    document.head.appendChild(makeElement('link', '', {rel: 'stylesheet', href: this.uiPrefix + 'css/dalliance-scoped.css'}));
    document.head.appendChild(makeElement('link', '', {rel: 'stylesheet', href: this.uiPrefix + 'css/font-awesome.min.css'}));

    var b = this;

    if (!b.disableDefaultFeaturePopup) {
        this.addFeatureListener(function(ev, feature, hit, tier) {
            b.featurePopup(ev, feature, hit, tier);
        });
    }

    holder.classList.add('dalliance');
    var toolbar = b.toolbar = makeElement('div', null, {className: 'btn-toolbar toolbar'});

    var title = b.coordSystem.speciesName + ' ' + b.coordSystem.auth + b.coordSystem.version;
    if (this.setDocumentTitle) {
        document.title = title + ' :: dalliance';
    }
    
    var locField = makeElement('input', '', {className: 'loc-field'});
    b.makeTooltip(locField, 'Enter a genomic location or gene name');
    var locStatusField = makeElement('p', '', {className: 'loc-status'});


    var zoomInBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-search-plus'})], {className: 'btn'});
    var zoomSlider = makeElement('input', '', {type: 'range', min: 100, max: 250}, {className: 'zoom-slider'}, {width: '150px'});  // NB min and max get overwritten.
    var zoomOutBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-search-minus'})], {className: 'btn'});

    var clearHighlightsButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-eraser'})], {className: 'btn'});

    var addTrackBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-plus'})], {className: 'btn'});
    var favBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-bookmark'})], {className: 'btn'});
    var svgBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-print'})], {className: 'btn'});
    var resetBtn = makeElement('a', [makeElement('i', null, {className: 'fa fa-refresh'})], {className: 'btn'});
    var optsButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-cogs'})], {className: 'btn'});
    var helpButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-question'})], {className: 'btn'});

    var tierEditButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-road'})], {className: 'btn'});
    b.makeTooltip(tierEditButton, 'Configure currently selected track(s) (E)')

    var leapLeftButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-chevron-left'})], {className: 'btn'});
    var leapRightButton = makeElement('a', [makeElement('i', null, {className: 'fa fa-chevron-right'})], {className: 'btn pull-right'});

    var modeButtons = makeElement('div', [addTrackBtn, tierEditButton, svgBtn, optsButton, helpButton], {className: 'btn-group pull-right'});
    this.setUiMode = function(m) {
        this.uiMode = m;
        var mb = {help: helpButton, add: addTrackBtn, opts: optsButton, 'export': svgBtn, tier: tierEditButton};
        for (var x in mb) {
            if (x == m)
                mb[x].classList.add('active');
            else
                mb[x].classList.remove('active');
        }
    }


    toolbar.appendChild(leapRightButton);
    toolbar.appendChild(modeButtons);
    
    toolbar.appendChild(leapLeftButton);
    if (!this.noTitle) {
        toolbar.appendChild(makeElement('div', makeElement('h4', title, {}, {margin: '0px'}), {className: 'btn-group title'}));
    }
    toolbar.appendChild(makeElement('div', [locField, locStatusField], {className: 'btn-group loc-group'}));
    toolbar.appendChild(clearHighlightsButton);
    toolbar.appendChild(makeElement('div', [zoomInBtn,
                                            makeElement('span', zoomSlider, {className: 'btn'}),
                                            zoomOutBtn], {className: 'btn-group'}));
    

    holder.appendChild(toolbar);
    holder.appendChild(genomePanel);

    this.addViewListener(function(chr, min, max, _oldZoom, zoom) {
        locField.value = (chr + ':' + formatLongInt(min) + '..' + formatLongInt(max));
        zoomSlider.min = zoom.min|0;
        zoomSlider.max = zoom.max|0;
        zoomSlider.value = zoom.current|0;
        if (b.storeStatus) {
            b.storeViewStatus();
        }

        if (b.highlights.length > 0) {
            clearHighlightsButton.style.display = 'inline-block';
        } else {
            clearHighlightsButton.style.display = 'none';
        }
    });

    this.addTierListener(function() {
        if (b.storeStatus) {
            b.storeTierStatus();
        }
    });

    locField.addEventListener('keydown', function(ev) {
        if (ev.keyCode == 40) {
            ev.preventDefault(); ev.stopPropagation();
            b.setSelectedTier(0);
        } if (ev.keyCode == 10 || ev.keyCode == 13) {
            ev.preventDefault();


            var g = locField.value;
            b.search(g, function(err) {
                if (err) {
                    locStatusField.textContent = '' + err;
                } else {
                    locStatusField.textContent = '';
                }
            });
        }
    }, false);
    
    var trackAddPopup;
    addTrackBtn.addEventListener('click', function(ev) {
        if (trackAddPopup && trackAddPopup.displayed) {
            b.removeAllPopups();
        } else {
            trackAddPopup = b.showTrackAdder(ev);
        }
    }, false);
    b.makeTooltip(addTrackBtn, 'Add a new track from the registry or an indexed file. (A)');

    zoomInBtn.addEventListener('click', function(ev) {
      ev.stopPropagation(); ev.preventDefault();

      b.zoomStep(-10);
    }, false);
    b.makeTooltip(zoomInBtn, 'Zoom in (+)');

    zoomOutBtn.addEventListener('click', function(ev) {
      ev.stopPropagation(); ev.preventDefault();

      b.zoomStep(10);
    }, false);
    b.makeTooltip(zoomOutBtn, 'Zoom out (-)');

    zoomSlider.addEventListener('change', function(ev) {
    	b.zoomSliderValue = (1.0 * zoomSlider.value);
    	b.zoom(Math.exp((1.0 * zoomSlider.value) / b.zoomExpt));
    }, false);

    favBtn.addEventListener('click', function(ev) {
       ev.stopPropagation(); ev.preventDefault();
    }, false);
    b.makeTooltip(favBtn, 'Favourite regions');

    svgBtn.addEventListener('click', function(ev) {
       ev.stopPropagation(); ev.preventDefault();
        b.openExportPanel();
    }, false);
    b.makeTooltip(svgBtn, 'Export publication-quality SVG. (P)');

    var optsPopup;
    optsButton.addEventListener('click', function(ev) {
        ev.stopPropagation(); ev.preventDefault();

        b.toggleOptsPopup(ev);
    }, false);
    b.makeTooltip(optsButton, 'Configure options.');

    helpButton.addEventListener('click', function(ev) {
        ev.stopPropagation(); ev.preventDefault();
        b.toggleHelpPopup(ev);
    });
    b.makeTooltip(helpButton, 'Help; Keyboard shortcuts. (H)');

    tierEditButton.addEventListener('click', function(ev) {
        ev.stopPropagation(); ev.preventDefault();
        if (b.selectedTiers.length == 1) {
            b.openTierPanel(b.tiers[b.selectedTiers[0]]);
        }
    }, false);

    leapLeftButton.addEventListener('click', function(ev) {
        b.leap(b.reverseKeyScrolling ? -1 : 1, false);
    }, false);
    b.makeTooltip(leapLeftButton, function(ev) {
        var st = b.getSelectedTier();
        var tier;
        if (st >= 0)
            tier = b.tiers[st];

        if (tier && tier.featureSource && sourceAdapterIsCapable(tier.featureSource, 'quantLeap') && typeof(tier.quantLeapThreshold) == 'number') {
            return 'Jump to the next region with a score above the threshold in the selected track "' + (tier.config.name || tier.dasSource.name) + '"" (ctrl+LEFT)';
        } else if (tier && tier.featureSource && sourceAdapterIsCapable(tier.featureSource, 'leap')) {
            return 'Jump to the next feature in the selected track "' + (tier.config.name || tier.dasSource.name) + '" (ctrl+LEFT)';
        } else {
            return 'Jump left (shift+LEFT)';
        }
    });

    leapRightButton.addEventListener('click', function(ev) {
        b.leap(b.reverseKeyScrolling ? 1 : -1, false);
    }, false);
    b.makeTooltip(leapRightButton, function(ev) {
        var st = b.getSelectedTier();
        var tier;
        if (st >= 0)
            tier = b.tiers[st];

        if (tier && tier.featureSource && sourceAdapterIsCapable(tier.featureSource, 'quantLeap') && typeof(tier.quantLeapThreshold) == 'number') {
            return 'Jump to the next region with a score above the threshold in the selected track "' + (tier.config.name || tier.dasSource.name) + '"" (ctrl+RIGHT)';
        } else if (tier && tier.featureSource && sourceAdapterIsCapable(tier.featureSource, 'leap')) {
            return 'Jump to the next feature in the selected track "' + (tier.config.name || tier.dasSource.name) + '" (ctrl+RIGHT)';
        } else {
            return 'Jump right (shift+RIGHT)';
        }
    });

    clearHighlightsButton.addEventListener('click', function(ev) {
        b.clearHighlights();
    }, false);
    b.makeTooltip(clearHighlightsButton, 'Clear highlights (C)');

    b.addTierSelectionWrapListener(function(dir) {
        if (dir < 0) {
            b.setSelectedTier(null);
            locField.focus();
        }
    });

    b.addTierSelectionListener(function(sel) {
        if (b.uiMode === 'tier') {
            if (sel.length == 0) {
                b.hideToolPanel();
                b.manipulatingTier = null;
                b.uiMode = 'none';
            } else {
                var ft = b.tiers[sel[0]];
                if (ft != b.manipulatingTier) {
                    b.openTierPanel(ft);
                }
            }
        }
    });

    var uiKeyHandler = function(ev) {
        // console.log('bukh: ' + ev.keyCode);
        if (ev.keyCode == 65 || ev.keyCode == 97) {  // a
            ev.preventDefault(); ev.stopPropagation();
            b.showTrackAdder();
        } else if (ev.keyCode == 72 || ev.keyCode == 104) { // h
            ev.stopPropagation(); ev.preventDefault();
            b.toggleHelpPopup(ev);
        } else if (ev.keyCode == 69 || ev.keyCode == 101) { //e
            ev.stopPropagation(); ev.preventDefault();
            if (b.selectedTiers.length == 1) {
                b.openTierPanel(b.tiers[b.selectedTiers[0]]);
            }
        } else if (ev.keyCode == 80 || ev.keyCode == 112) { // p
            ev.stopPropagation(); ev.preventDefault();
            b.openExportPanel();
        } else if (ev.keyCode == 67 || ev.keyCode == 99) { // c
            ev.stopPropagation(); ev.preventDefault();
            b.clearHighlights();
        }
    };

    holder.addEventListener('focus', function(ev) {
        holder.addEventListener('keydown', uiKeyHandler, false);
    }, false);
    holder.addEventListener('blur', function(ev) {
        holder.removeEventListener('keydown', uiKeyHandler, false);
    }, false);

    holder.addEventListener('keydown', function(ev) {
        if (ev.keyCode === 27) {
            ev.preventDefault();
            ev.stopPropagation();
            b.uiMode = 'none';
            b.hideToolPanel();

            if (b.selectedTiers && b.selectedTiers.length > 0) {
                b.browserHolder.focus();
            }
        }
    }, false);
}

Browser.prototype.showToolPanel = function(panel, nowrap) {
    if (this.activeToolPanel) {
        this.activeToolPanel.parentElement.removeChild(this.activeToolPanel);
    }

    var content;
    if (nowrap)
        content = panel;
    else
        content = makeElement('div', panel, {}, {overflowY: 'auto', width: '100%'});

    this.activeToolPanel = makeElement('div', [makeElement('div', null, {className: 'tool-divider'}), content], {className: 'tool-holder'});
    this.svgHolder.appendChild(this.activeToolPanel);
    this.resizeViewer();

    var thisB = this;
}

Browser.prototype.hideToolPanel = function() {
    if (this.activeToolPanel) {
        this.activeToolPanel.parentElement.removeChild(this.activeToolPanel);
    }
    this.svgHolder.style.width = '100%';
    this.activeToolPanel = null;
    this.resizeViewer();
}

Browser.prototype.toggleHelpPopup = function(ev) {
    if (this.uiMode === 'help') {
        this.hideToolPanel();
        this.setUiMode('none');
    } else {
        var helpFrame = makeElement('iframe', null, {scrolling: 'yes', seamless: 'seamless', src: this.uiPrefix + 'help/index.html', seamless: 'seamless', className: 'help-panel'});
        this.showToolPanel(helpFrame, true);
        this.setUiMode('help');
    }
}

Browser.prototype.toggleOptsPopup = function(ev) {
    var b = this;

    if (this.uiMode === 'opts') {
        this.hideToolPanel();
        this.setUiMode('none');
    } else {
        var optsForm = makeElement('div', null, {className: 'form-horizontal'}, {boxSizing: 'border-box', MozBoxSizing: 'border-box', display: 'inline-block', verticalAlign: 'top'});
        var optsTable = makeElement('table');
        optsTable.cellPadding = 5;

        var scrollModeButton = makeElement('input', '', {type: 'checkbox', checked: b.reverseScrolling});
        scrollModeButton.addEventListener('change', function(ev) {
            b.reverseScrolling = scrollModeButton.checked;
            b.storeStatus();
        }, false);
        optsTable.appendChild(makeElement('tr', [makeElement('td', 'Reverse trackpad scrolling', {align: 'right'}), makeElement('td', scrollModeButton)]));

        var scrollKeyButton = makeElement('input', '', {type: 'checkbox', checked: b.reverseKeyScrolling});
        scrollKeyButton.addEventListener('change', function(ev) {
            b.reverseKeyScrolling = scrollKeyButton.checked;
            b.storeStatus();
        }, false);
        optsTable.appendChild(makeElement('tr', [makeElement('td', 'Reverse scrolling buttons and keys', {align: 'right'}), makeElement('td', scrollKeyButton)]));


        var rulerSelect = makeElement('select');
        rulerSelect.appendChild(makeElement('option', 'Left', {value: 'left'}));
        rulerSelect.appendChild(makeElement('option', 'Center', {value: 'center'}));
        rulerSelect.appendChild(makeElement('option', 'Right', {value: 'right'}));
        rulerSelect.appendChild(makeElement('option', 'None', {value: 'none'}));
        rulerSelect.value = b.rulerLocation;
        rulerSelect.addEventListener('change', function(ev) {
            b.rulerLocation = rulerSelect.value;
            b.positionRuler();
            for (var ti = 0; ti < b.tiers.length; ++ti) {
                b.tiers[ti].paintQuant();
            }
            b.storeStatus();
        }, false);
        optsTable.appendChild(makeElement('tr', [makeElement('td', 'Vertical guideline', {align: 'right'}), makeElement('td', rulerSelect)]));

        optsForm.appendChild(optsTable);

        var resetButton = makeElement('button', 'Reset browser', {className: 'btn'}, {marginLeft: 'auto', marginRight: 'auto', display: 'block'});
        resetButton.addEventListener('click', function(ev) {
            b.reset();
        }, false);
        optsForm.appendChild(resetButton);

        this.showToolPanel(optsForm);
        this.setUiMode('opts');
    }

}



