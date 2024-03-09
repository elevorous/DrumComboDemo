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

    static get PREAMBLE_TONE() {
        return 600;
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
        this.preambleBeats = 0;
    }

    /**
     * @getter
     * @return {int} - the number of complete bars that have elapsed since the metronome started
     */
    get barsSinceStarted() {
        return Math.floor(this.beatsSinceStarted / this.beatsPerBar);
    }

    /**
     * @getter
     * @return {boolean} - true if we are currently at the beginning of a new bar
     */
    get newBarStarted() {
        return this.beatsSinceStarted % this.beatsPerBar == 0;
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

        osc.addEventListener("ended", (e) => this.beatsSinceStarted++);

        return osc;
    }


    /**
     * @Override
     *
     */
    scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        // // TODO: not sure ther's any point in keeping this in tis current form - also it grows indefinitely :/
        // this.notesInQueue.push({ note: beatNumber, time: time });

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

    // stop() {
    //     super.stop();
    //     this.audioContext.suspend();
    //     this.audioContext.close().then((function() {
    //         this.audioContext = null;
    //     }).bind(this));
    // }

    /**
     *
     * @Override
     */
    scheduler() {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            // TODO: account for preamble beats.
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    /**
     * @Override
     */
    start() {
        this.beatsSinceStarted = 0;
        super.start();
    }
}
