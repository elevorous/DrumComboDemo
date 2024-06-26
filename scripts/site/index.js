//import { CallbackMetronome } from "callback-metronome";
import { createApp } from "petite-vue-pro";
import { GenerateGridFormComponent } from "component.generate-grid-form";
import { ControlPanelComponent } from "component.control-panel";
import { SideMenuComponent } from "component.side-menu";
import { MetronomeFormComponent } from "component.metronome-form";
import { AutoscrollFormComponent } from "component.autoscroll-form";
import { ViewOptionsFormComponent } from "component.view-options-form";
import { RenderAreaComponent } from "component.render-area";
import { ConsentBannerComponent } from "component.consent-banner";
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

        const gridFormInstance = GenerateGridFormComponent();
        const metronomeFormInstance = MetronomeFormComponent();
        const autoscrollFormInstance = AutoscrollFormComponent();
        const viewOptionsFormInstance = ViewOptionsFormComponent();
        const renderAreaInstance = RenderAreaComponent();

        const controlPanelComponents = [
            {
                componentInstance: gridFormInstance,
                name: 'Grid',
                icon: ''
            },
            {
                componentInstance: metronomeFormInstance,
                name: 'Metronome',
                icon: ''
            },
            {
                componentInstance: autoscrollFormInstance,
                name: 'Autoscroll',
                icon: ''
            }
        ];

        const controlPanelInstance = ControlPanelComponent({
            controlPanelComponents: controlPanelComponents
        });

        const menuItems = [
            {
                componentInstance: viewOptionsFormInstance,
                name: 'View Options',
                icon: ''
            }
        ];

        const sideMenuInstance = SideMenuComponent({
            menuItems: menuItems
        });

        const consentBannerInstance = ConsentBannerComponent();

        // Initialize any mixin functionality
        for (const instance of
            [gridFormInstance, metronomeFormInstance, autoscrollFormInstance, viewOptionsFormInstance,
                renderAreaInstance, controlPanelInstance, sideMenuInstance, consentBannerInstance]
        ) {
            if (instance.isPageManagerAware) instance.registerManager(pageManager);
        }


        // TODO: add event listeners for keyboard inputs to change metronome
        // TODO: add facility to load in last saved settings etc.
        //
        createApp({
            get controlPanelInstance() {
                return controlPanelInstance;
            },
            get sideMenuInstance() {
                return sideMenuInstance;
            },
            get viewOptionsFormInstance() {
                return viewOptionsFormInstance;
            },
            get renderAreaInstance() {
                return renderAreaInstance;
            },
            get consentBannerInstance() {
                return consentBannerInstance;
            }
        }).mount();
    }

    initialize();
})();
