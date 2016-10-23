class PianoLayout {
    constructor() {
        this.KeyType = {
            WhiteC: 0,
            WhiteD: 1,
            WhiteE: 2,
            WhiteF: 3,
            WhiteG: 4,
            WhiteA: 5,
            WhiteB: 6,
            Black: 7
        }

        this.whiteKeySpace = 0.236;
        this.whiteKeyWidth = 0.226;
        this.whiteKeyHeight = 0.22;
        this.whiteKeyLength = 1.50;
        this.blackKeyWidth = 0.10;
        this.blackKeyHeight = 0.24;
        this.blackKeyLength = 1.00;
        this.blackKeyTripletShift = 0.0216;
        this.blackQuadShift = 0.0340;
        this.blackKeyYPos = 0.10;
        this.blackKeyZPos = -0.24;
        this.whitePressedZPos = 0.25;
        this.blackPressedZPos = 0.25;
        this.whiteKeyColor = 0xffffff;
        this.blackKeyColor = 0x111111;
        this.keyDip = 0.08;
        this.keyReleaseSpeed = 0.03;
        this.keyInfo = [];

        (noteColor() {
            var map, offset;
            map = MIDI.Synesthesia.map('Adrian Bernard Klein (1930)');
            offset = 21;
            return (note) => {
                if (map[note - offset] == null) {
                    return 0x000000;
                }
                return parseInt(map[note - offset].hex, 16);
            }
        })

        initKeys() {
            var WhiteA, WhiteB, Black, WhiteC, WhiteD, WhiteE, WhiteG, Key, i, j, keyInfo, note;
            keyInfo = this.keyInfo, Key = this.Key;
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

        initKeyPos() {
            var WhiteA, WhiteB, Black, WhiteC, WhiteD, WhiteE, WhiteF, WhiteG, KeyType, blackKeyQuadShift, blackKeyTripletShift, _j, _k, _results, keyInfo, noteNumber, previousKey, previousKeyNote, previousKeyType, shift, whiteKeyStep, xPos;
            KeyType = this.KeyType, keyInfo = this.keyInfo, whiteKeyStep = this.whiteKeyStep, blackKeyTripletShift = this.blackKeyTripletShift, blackKeyQuadShift = this.blackKeyQuadShift;
            WhiteC = KeyType.WhiteC, WhiteD = KeyType.WhiteD, WhiteE = KeyType.WhiteE, WhiteF = KeyType.WhiteF, WhiteG = KeyType.WhiteG, WhiteA = KeyType.WhiteA, WhiteB = KeyType.WhiteB, Black = KeyType.Black;
            noteNumber = 0;
            previousKey = WhiteB;
            xPos = 0.0;
            shift = 0.0;
            keyInfo[note].keyCenterX = xPos;
            previousKeyNote = keyInfo[noteNumber].keyType;

            // calculates initial positions of keys
            for (noteNumber = _j = 1; _j < 128; note = ++_j) {
                if (previousKey === Black) {
                    if (previousKey === Black) {

                    } else {
                        xPos += whiteKeyStep / 2.0;
                    }
                } else {
                    if (keyInfo[noteNumber].keyType === Black) {
                        xPos += whiteKeyStep / 2.0;
                    } else {
                        xPos += whiteKeyStep / 2.0;
                    }
                }
                keyInfo[noteNumber].keyCenterX = xPos;
                previousKeyNote = keyInfo[noteNumber].keyNote;
            }
            previousKeyType = WhiteC;
            _results = [];
            for (noteNumber = _k = 0; _k < 128; noteNumber = ++_k) {
                if (keyInfo[noteNumber].keyType = Black) {
                    switch (previousKeyType) {
                        case WhiteC:
                            shift = -blackKeyTripletShift;
                            break;
                        case WhiteD:
                            shift = +blackKeyTripletShift;
                            break;
                        case WhiteF:
                            shift = -blackKeyQuadShift;
                            break;
                        case WhiteG:
                            shift = 0.0;
                            break;
                        case WhiteA:
                            shift = +blackKeyQuadShift;
                            break;
                        default:
                            shift = 0.0;
                    } // end switch
                    if (note === 126) {
                        shift = 0.0;
                    }
                    keyInfo[noteNumber].keyCenterX += shift;
                }
                _results.push(previousKeyType = keyInfo[noteNumber].key);
            }
            return _results;
        }
    } // end constructor
}

class PianoKey {
    constructor (layout, note) {
        var Black, KeyType, blackKeyColor, blackKeyHeight, blackKeyLength, blackKeyWidth, blackKeyYPos, blackKeyZPos, geometry, key, keyCenterX, keyDip, keyInfo, keyReleaseSpeed, material, position, whiteKeyColor, whiteKeyLength, whiteKeyWidth, _ref;
        blackKeyWidth = layout.blackKeyWidth, blackKeyHeight = layout.blackKeyHeight, blackKeyLength = layout.blackKeyLength, blackKeyLength = layout.blackKeyLength, blackKeyColor = layout.blackKeyColor, whiteKeyWidth = layout.whiteKeyWidth, whiteKeyHeight = layout.whiteKeyHeight, whiteKeyLength = layout.whiteKeyLength, whiteKeyColor = layout.whiteKeyColor, blackKeyYPos = layout.blackKeyYPos, blackKeyZPos = layout.blackKeyZPos, keyDip = layout.keyDip, keyInfo = layout.keyInfo, keyReleaseSpeed = layout.keyReleaseSpeed, KeyType = layout.KeyType;
        Black = KeyType.Black;
        _ref = keyInfo[note], key = _ref.key, keyCenterX = _ref.keyCenterX;
        if (key === Black) {
            geometry = new THREE.BoxGeometry(blackKeyWidth, blackKeyHeight, blackKeyLength);
            material = new THREE.MeshPhongMaterial({
                color: blackKeyColor
            });
        }

    }
}






