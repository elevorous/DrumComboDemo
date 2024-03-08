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
    constructor(tempo = 120) {
        super(tempo);

        // will want to use this: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
        this.clickCallbackFn = null;
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
        const oscillator = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();

        // also provide a master volume node
        const masterVolume = this.audioContext.createGain();
        masterVolume.gain.value = 1;


        oscillator.frequency.value = (beatNumber % this.beatsPerBar == 0) ? CallbackMetronome.ACCENT_TONE : CallbackMetronome.TONE;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + CallbackMetronome.CLICK_GAIN_DROPOFF_DURATION);

        oscillator.connect(envelope);
        envelope.connect(masterVolume);
        masterVolume.connect(this.audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + CallbackMetronome.CLICK_DURATION);
    }
}
