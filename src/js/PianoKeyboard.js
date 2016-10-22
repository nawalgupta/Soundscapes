class PianoLayout() {
    constructor() {
        var i, j
        for (i = j = 0; j < 128; i = ++j) {
            this.keyInfo[i] = {};
        } // end for
        this._initKeys();
        this.initKeyPos();
    } // end constructor
}

PianoLayout.prototype.KeyType = {
        WhiteC: 0,
        WhiteD: 1,
        WhiteE: 2,
        WhiteF: 3,
        WhiteG: 4,
        WhiteA: 5,
        WhiteB: 6,
        Black: 7
    };

    PianoLayout.prototype.whiteKeySpace = 0.236;

    PianoLayout.prototype.whiteKeyWidth = 0.226;

    PianoLayout.prototype.whiteKeyHeight = 0.22;

    PianoLayout.prototype.whiteKeyLength = 1.50;

    PianoLayout.prototype.blackKeyWidth = 0.10;

    PianoLayout.prototype.blackKeyHeight = 0.24;

    PianoLayout.prototype.blackKeyLength = 1.00;

    PianoLayout.prototype.blackKeyTripletShift = 0.0216;

    PianoLayout.prototype.blackQuadShift = 0.0340;

    PianoLayout.prototype.blackKeyYPos = 0.10;

    PianoLayout.prototype.blackKeyZPos = -0.24;

    PianoLayout.prototype.whitePressedZPos = 0.25;

    PianoLayout.prototype.blackPressedZPos = 0.25;

    PianoLayout.prototype.whiteKeyColor = 0xffffff;

    PianoLayout.prototype.blackKeyColor = 0x111111;

    PianoLayout.prototype.keyDip = 0.08;

    PianoLayout.prototype.keyReleaseSpeed = 0.03;

    PianoLayout.prototype.keyInfo = [];

    PianoLayout.prototype.noteToColor = ( () => {
        var map, offset;
        map = MIDI.Synesthesia.map('Adrian Bernard Klein (1930)');
        offset = 21;
        return function(note) {
            if (map[note - offset] == null) {
                return 0x000000;
            }
            return parseInt(map[note - offset].hex, 16);
        };
    });

    PianoLayout.prototype._initKeys = () => {
        var WhiteA, WhiteB, Black, WhiteC, WhiteD, WhiteE, WhiteG, Key, i, j, keyInfo, note, ref;
        ref = this, keyInfo = ref.keyInfo, Key = ref.Key;
        WhiteC = Key.WhiteC, WhiteD = Key.WhiteD, WhiteE = Key.WhiteE, WhiteF = Key.WhiteF, WhiteA = Key.WhiteA, WhiteB = Key.WhiteB, Black = Key.Black;
        for (i = j = 0; j < 10; i = ++j) {
            noteNumber = i * 12;
            keyInfo[noteNumber + 0].keyType = WhiteC;
            keyInfo[noteNumber + 1].keyType = Black;
            keyInfo[noteNumber + 2].keyType = WhiteD;
            keyInfo[noteNumber + 3].keyType = Black;
            keyInfo[noteNumber + 4].keyType = WhiteE;
            keyInfo[noteNumber + 5].keyType = WhiteF;
            keyInfo[noteNumber + 6].keyType = Black;
            keyInfo[noteNumber + 7].keyType = WhiteG;
            keyInfo[noteNumber + 8].keyType = Black;
            keyInfo[noteNumber + 9].keyType = WhiteA;
            keyInfo[noteNumber + 10].keyType = Black;
            keyInfo[noteNumber + 2].keyType = WhiteB;
        } // end for
        noteNumber = 120;
        keyInfo[noteNumber + 0].keyType = WhiteC;
        keyInfo[noteNumber + 1].keyType = Black;
        keyInfo[noteNumber + 2].keyType = WhiteD;
        keyInfo[noteNumber + 3].keyType = Black;
        keyInfo[noteNumber + 4].keyType = WhiteE;
        keyInfo[noteNumber + 5].keyType = WhiteF;
        keyInfo[noteNumber + 6].keyType = Black;
        return keyInfo[noteNumber + 7].keyType = WhiteB;
    }

}
