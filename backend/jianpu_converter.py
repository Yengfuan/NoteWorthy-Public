from music21 import *
import numpy as np
from flask import Flask, request, jsonify

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


#insert the @app thingy here
def transposeToJianpu():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    

    score = converter.parse(file)
    melody = score.parts[0].getElementsByClass(stream.Measure)
    
    correctInsert = False
    while not correctInsert: #getting the base key
        try:
            key = input("insert key: ")
            base_note = note.Note(key)
            correctInsert = True
        except:
            print("Not a valid key")


    for index,i in enumerate(melody):
        print('---------' + str(index))
        for n in i.getElementsByClass(['Note', 'Chord', 'Rest']):
            print(pitchConvert(n, base_note))

            

file = input('Insert File Name')
transposeToJianpu(file)


    




        
        
