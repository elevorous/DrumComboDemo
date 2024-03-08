/**
*
* @author elevorous
*/
class CallbackOscillatorNode extends OscillatorNode {

    /**
     * @constructor
     * @param {AudioContext} context
     * @param {object} options - optional
     */
    constructor(context, options) {
        super(context, options);
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

/**
* An extension of Grant James' Metronome class, to allow for a callback to be
*   registered on particular clicks.
*
* @author elevorous
*/
class CallbackMetronome extends Metronome {

    // the tone of an accent "click", in Hz
    static get ACCENT_TONE() {
        return 1000;
    }

    // the tone of a regular "click", in Hz
    static get TONE() {
        return 800;
    }

    // the audible duration of one "click", in seconds
    static get CLICK_DURATION() {
        return 0.03;
    }

    static get CLICK_GAIN_DROPOFF_DURATION() {
        return CallbackMetronome.CLICK_DURATION - 0.01;
    }

    /**
     * @constructor
     */
    constructor(tempo = 120, clickCallbackFn = null) {
        super(tempo);
        this.clickCallbackFn = clickCallbackFn;
        this.beatsSinceStarted = 0;     // keep a running total of all beats that have been played
    }

    /**
     * @param {object} contextData - the contextData to attach to the new CallbackOscillatorNode
     * @return {CallbackOscillatorNode}
     */
    createCallbackOscillator(contextData) {
        const osc = new CallbackOscillatorNode(this.audioContext, {contextData: contextData});

        if (this.clickCallbackFn) {
            osc.addEventListener("started", this.clickCallbackFn);
        }

        return osc;
    }

    /**
     *
     * @Override
     */
    nextNote() {
        super.nextNote();
        this.beatsSinceStarted++;
    }


    /**
     * @Override
     *
     */
    scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({ note: beatNumber, time: time });

        // once a node has been played, it can't be replayed, so we need to make a new
        //  set of nodes on each schedule.
        const oscillator = this.createCallbackOscillator({
            beatNumber: beatNumber,
            beatsPerBar: this.beatsPerBar,
            metronome: this
        });
        const envelope = this.audioContext.createGain();

        // also provide a master volume node
        //const masterVolume = this.audioContext.createGain();
        //masterVolume.gain.value = 1;


        oscillator.frequency.value = (!beatNumber) ? CallbackMetronome.ACCENT_TONE : CallbackMetronome.TONE;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + CallbackMetronome.CLICK_GAIN_DROPOFF_DURATION);

        oscillator.connect(envelope);
        //envelope.connect(masterVolume);
        envelope.connect(this.audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + CallbackMetronome.CLICK_DURATION);
    }

    /**
     * @Override
     */
    start() {
        this.beatsSinceStarted = 0;
        super.start();
    }
}
