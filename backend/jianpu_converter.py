from music21 import *
from flask import Flask, request, jsonify, send_file
import io 
import os
import uuid #from audiveris app
import subprocess #from audiveris app

app = Flask(__name__)

AUDIVERIS_PATH = 'audiveris.jar'  # Path to your Audiveris JAR file
OUTPUT_DIR = 'output_musicxml'  # Directory to store output files
UPLOAD_DIR = 'uploads'  # Directory to store uploaded files

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    
    filename = str(uuid.uuid4())
    input_ext = os.path.splitext(file.filename)[1].lower()

    try:

        # ====Uploaded file is PDF====
        if input_ext == ".pdf":
            pdf_path = os.path.join(UPLOAD_DIR, filename + ".pdf")
            file.save(pdf_path)

            # Run Audiveris command
            cmd = ['java', '-jar', AUDIVERIS_PATH, '-batch', '-output', OUTPUT_DIR, pdf_path]
            subprocess.run(cmd, check=True)

            
            xml_path = os.path.join(OUTPUT_DIR, filename + ".xml")
            if not os.path.exists(xml_path):
                return jsonify({"error": "MusicXML file not found"}), 500
            
            score = converter.parse(xml_path)
        
        # ====Uploaded file is MusicXML====
        elif input_ext in ['.xml', '.musicxml']:
            file_content = file.read()
            score = converter.parse(file_content, format='musicxml', forceSource=True)

        else:
            return jsonify({"error": "Unsupported file format"}), 400
            
        if not score.parts:
            return jsonify({"error": "No melody part found"}), 400
        
        melody = score.parts[0].getElementsByClass(stream.Measure)
        output = []

        for measure in melody:
            measure_output = []
            for n in measure.getElementsByClass(['Note', 'Chord', 'Rest']):
                measure_output.append(pitchConvert(n, base_note))
            output.append(measure_output)

        return jsonify({"jianpu": output}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Audiveris conversion failed: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)





    




        
        
