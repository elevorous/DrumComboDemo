/**
* An extension of the JavaScript OscillatorNode, with added functionality to emit a "started" event (as a complement
*   to the "ended" event)
*
* INCLUDE:
*   <script type="module" src="scripts/site/module/callback-oscillator-node.js"></script>
*
* USAGE:
*   import CallbackOscillatorNode from "callback-oscillator-node";
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
* @author elevorous
*/
class CallbackOscillatorNode extends OscillatorNode {

    /**
     * @constructor
     *
     * @param {AudioContext} context
     * @param {object} options - optional
     */
    constructor(context, options) {
        super(context, options);
        // any additional data which might relate to this Node's general context (not AudioContext)
        this.contextData = options?.contextData || {};

        // force our handler to refer to this CallbackOscillatorNode, rather than the
        //  silent OscillatorNode which we are listening for the end of.
        this.emitStartedEvent = this.emitStartedEvent.bind(this);
    }

    /**
     * @return {undefined}
     */
    emitStartedEvent() {
        const e = new CustomEvent("started", {
            detail: {
                frequency: this.frequency,
                type: this.type,
                detune: this.detune,
                contextData: this.contextData
            }
        });

        this.dispatchEvent(e);
    }

    /**
     * @Override
     *
     * @param {int} when
     * @return {undefined}
     */
    start(when) {
        const startNode = this.context.createOscillator();
        startNode.addEventListener("ended", this.emitStartedEvent);

        startNode.connect(this.context.destination);
        startNode.start(when);
        startNode.stop(when);

        super.start(when);
    }
}

export { CallbackOscillatorNode };
