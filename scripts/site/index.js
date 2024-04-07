//import { CallbackMetronome } from "callback-metronome";
import { createApp } from "petite-vue-pro";
import { GenerateGridFormComponent } from "component.generate-grid-form";
import { ControlPanelComponent } from "component.control-panel";
import { MetronomeFormComponent } from "component.metronome-form";
import { AutoscrollFormComponent } from "component.autoscroll-form";
import { ViewOptionsFormComponent } from "component.view-options-form";
import { RenderAreaComponent } from "component.render-area";
import { PageManager } from "page-manager";

/**
*
* @author elevorous
*/
(function() {
    'use strict';

    /**
     * @return {undefined}
     */
    function initialize() {
        const pageManager = PageManager();

        const gridFormInstance = GenerateGridFormComponent().registerManager(pageManager);
        const metronomeFormInstance = MetronomeFormComponent();
        const autoscrollFormInstance = AutoscrollFormComponent();
        const viewOptionsFormInstance = ViewOptionsFormComponent().registerManager(pageManager);
        const renderAreaInstance = RenderAreaComponent().registerManager(pageManager);

        const controlPanelComponents = [
            {
                clazz: gridFormInstance,
                name: 'Grid',
                icon: ''
            },
            {
                clazz: metronomeFormInstance,
                name: 'Metronome',
                icon: ''
            },
            {
                clazz: autoscrollFormInstance,
                name: 'Autoscroll',
                icon: ''
            }
        ];

        const controlPanelInstance = ControlPanelComponent({
            controlPanelComponents: controlPanelComponents
        });


        // TODO: add event listeners for keyboard inputs to change metronome
        // TODO: add facility to load in last saved settings etc.
        //
        createApp({
            get controlPanelInstance() {
                return controlPanelInstance;
            },
            get viewOptionsFormInstance() {
                return viewOptionsFormInstance;
            },
            get renderAreaInstance() {
                return renderAreaInstance;
            }
        }).mount();
    }

    initialize();
})();
