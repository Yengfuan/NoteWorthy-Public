from music21 import *
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

converterTable = {"rest" : 0,
                  0 : "1",
                  1 : "#1",
                  2 : "2",
                  3 : "#2",
                  4 : "3",
                  5 : "4",
                  6 : "#4",
                  7 : "5",
                  8 : "#5",
                  9 : "6",
                  10 : "#6",
                  11 : "7",
                  12 : "#7" }

def getJianpuNote(num, octave):
    if octave < 0:
        octave *= -1
        return (octave * ".") + num
    else:
        return num + (octave * ".")

def pitchConvert(n, base_note): #gives 
    if n.isRest:
        return converterTable["rest"]
    elif n.isChord:
        stringOfNotes = ""
        for notePitch in n.pitches:
            key = (notePitch.midi - base_note.pitch.midi) % 12
            octave = getRelativeOctave(notePitch, base_note)
            stringOfNotes += getJianpuNote(converterTable[key], octave)  + " "
        return stringOfNotes    
    else:
        key = (n.pitch.midi - base_note.pitch.midi) % 12
        octave = getRelativeOctave(n.pitch, base_note)
        return getJianpuNote(converterTable[key], octave)

def getRelativeOctave(nPitch, base_note):
    return (nPitch.midi - base_note.pitch.midi) // 12


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
        score = converter.parse(file)
        melody = score.parts[0].getElementsByClass(stream.Measure)
        output = []

        for measure in melody:
            measure_output = []
            for n in measure.getElementsByClass(['Note', 'Chord', 'Rest']):
                measure_output.append(pitchConvert(n, base_note))
            output.append(measure_output)

        return jsonify({"jianpu": output}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)





    




        
        
