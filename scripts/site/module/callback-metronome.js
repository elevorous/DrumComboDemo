import { CallbackOscillatorNode } from "callback-oscillator-node";

/**
* Originally based off of Grant James' Metronome class
*
* INCLUDE:
*   <script type="module" src="scripts/site/module/callback-metronome.js"></script>
*
* USAGE:
*   import CallbackMetronome from "callback-metronome";
*
* @see https://github.com/grantjames/metronome/tree/master
* @author Grant James, elevorous
*/
class CallbackMetronome {

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

    static get DEFAULT_TEMPO() {
        return 120; // bpm
    }

    static get DEFAULT_LOOKAHEAD() {
        return 25; // in milliseconds
    }

    static get DEFAULT_SCHEDULE_AHEAD_TIME() {
        return 0.1;     //in seconds
    }

    static get DEFAULT_BEATS_PER_BAR() {
        return 4;
    }

    /**
     * @constructor
     */
    constructor(tempo = CallbackMetronome.DEFAULT_TEMPO, clickCallbackFn = null) {
        this.audioContext = null;
        // this.notesInQueue = [];         // notes that have been put into the web audio and may or may not have been played yet {note, time}
        this.currentBeatInBar = 0;
        this.beatsPerBar = CallbackMetronome.DEFAULT_BEATS_PER_BAR;
        this.tempo = tempo;
        this.lookahead = CallbackMetronome.DEFAULT_LOOKAHEAD;          // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = CallbackMetronome.DEFAULT_SCHEDULE_AHEAD_TIME;   // How far ahead to schedule audio (sec)
        this.nextNoteTime = 0.0;     // when the next note is due
        this.isRunning = false;
        this.intervalID = null;

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
     *
     *
     */
    nextNote() {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        this.currentBeatInBar++;    // Advance the beat number, wrap to zero
        if (this.currentBeatInBar == this.beatsPerBar) {
            this.currentBeatInBar = 0;
        }
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

    /**
     *
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
     *
     *
     */
    start() {
        if (this.isRunning) return;

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const START_OFFSET = 0.05;  // in seconds

        this.beatsSinceStarted = 0;
        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + START_OFFSET;

        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);

        this.isRunning = true;
    }

    /**
     *
     *
     */
    stop() {
        this.isRunning = false;
        clearInterval(this.intervalID);
    }

    /**
     *
     *
     */
    startStop() {
        if (this.isRunning) {
            this.stop();
        }
        else {
            this.start();
        }
    }
}

export { CallbackMetronome };
