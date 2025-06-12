from music21 import *
from flask import Flask, request, jsonify

app = Flask(__name__)

class JianpuChord: #Singular notes are also represented as chords with a single note
    def __init__(self, notes, underline):
        self.notes = notes  # List of JianpuNote objects
        self.underline = underline  # underline for each note in the chord

    def addNote(self, note):
        self.notes.append(note)

    def addUnderline(self):
        chord_duration = self.notes[0].n.quarterLength if self.notes else 0
        dots = self.notes[0].n.duration.dots if self.notes else 0
        for i in range(dots):
            chord_duration /= 1.5 # Adjust the chord duration based on the dots
        self.underline = JianpuChord.getUnderline(chord_duration) 

    def toDict(self):
        return {
            'notes': [note.toDict() for note in self.notes],
            'underline': self.underline
        }


    @staticmethod
    def getUnderline(chord_duration):
        if chord_duration == 0.25:
            return 2
        elif chord_duration == 0.5:
            return 1
        elif chord_duration == 0.125:
            return 3
        elif chord_duration == 0.0675:
            return 4
        elif chord_duration == 0.03375:
            return 5
        else: 
            return 0
        
    def addDash(self):
        chord_duration = self.notes[0].n.quarterLength if self.notes else 0
        res = [self]
        for i in range(int(chord_duration) - 1):
            if self.notes[0].n.isRest:
                chord_note = JianpuChord([JianpuNote.giveRest()], 0)
            else:
                chord_note = JianpuChord([JianpuNote.giveDash()], 0)
            res.append(chord_note)
        return res


        

class JianpuNote:
    # [num, isSharp, isFlat]
    converterTable = {"rest" : ("0", False, False),
                  0 : ("1", False, False),
                  1 : ("1", True, False),
                  2 : ("2", False, False),
                  3 : ("2", True, False),
                  4 : ("3", False, False),
                  5 : ("4", False, False),
                  6 : ("4", True, False),
                  7 : ("5", False, False),
                  8 : ("5", True, False),
                  9 : ("6", False, False),
                  10 : ("6", True, False),
                  11 : ("7", False, False),
                  12 : ("7", True, False)
    }

    def __init__(self, n, num, isSharp, isFlat, dotsAbove, dotsBelow, dotted):
        self.n = n
        self.num = num  
        self.isSharp = isSharp
        self.isFlat = isFlat
        self.dotsAbove = dotsAbove
        self.dotsBelow = dotsBelow
        self.dotted = dotted

    @staticmethod
    def giveDash(): 
        return JianpuNote(None, "dash", False, False, 0, 0, 0)  # Placeholder for a dash note
    
    @staticmethod
    def giveRest():
        return JianpuNote(None, "0", False, False, 0, 0, 0)


    @staticmethod
    def getDots(n_pitch, base_note): 
        octave = (n_pitch.midi - base_note.pitch.midi) // 12

        if octave < 0:
            octave *= -1
            return (0, octave)
        else:
            return (octave, 0)
    
            
    @staticmethod
    def getJianpuNote(n, base_note):
        if n.isRest:
            noteArray = JianpuNote.converterTable["rest"]
            dots = (0, 0, n.duration.dots)  # No dots for rests
            return JianpuNote(n, *noteArray, *dots)  # Create a JianpuNote object for rest
        else: 
            semitones = (n.pitch.midi - base_note.pitch.midi) % 12
            noteArray = JianpuNote.converterTable[semitones] # [num, isSharp, isFlat]
            dots = JianpuNote.getDots(n.pitch, base_note)  # [DotsAbove, DotsBelow]
            return JianpuNote(n, *noteArray, *dots,  n.duration.dots)  # Create a JianpuNote object with the note attributes
        
    def toDict(self):
        return {
            'num': self.num,
            'isSharp': self.isSharp,
            'isFlat': self.isFlat,
            'dotsAbove': self.dotsAbove,
            'dotsBelow': self.dotsBelow,
            'dotted': self.dotted
        }

      

def convert(n, base_note): 
    notes = JianpuChord([], 0)  # Initialize an empty JianpuChord
    if n.isChord:
        # Handle chords by converting each note in the chord
        for indivNote in n.notes:
            notes.addNote(JianpuNote.getJianpuNote(indivNote, base_note)) 
    else:
        notes.addNote(JianpuNote.getJianpuNote(n, base_note))  # Convert a single note
    
    notes.addUnderline()  # Add dashes based on the chord duration
    res = notes.addDash()

    return res # Return the list of JianpuNotes or JianpuChords
    

@app.route('/upload', methods=['POST'])
def transposeToJianpu():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
   
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if 'key' not in request.form:
        return jsonify({"error": "No key provided"}), 400
    
    key = request.form['key']


    
    try:
        base_note = note.Note(key)
    except:
        return jsonify({"error": "Invalid key"}), 400
    

    try:
        file_content = file.read()
        score = converter.parse(file_content, format='musicxml', forceSource=True)
        if not score.parts:
            return jsonify({"error": "No melody part found"}), 400

        
        melody = score.parts[0].getElementsByClass(stream.Measure)
        output = []

                
        
        for measure in melody:
            measure_output = []
            for n in measure.getElementsByClass(['Note', 'Chord', 'Rest']):
                measure_output.extend(convert(n, base_note))
            output.append(measure_output)

        
        result = list(map(mapMeasure, output))

        return jsonify({"jianpu": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def mapMeasure(measure):
    return list(map(lambda n: n.toDict(), measure))
    






    




        
        
