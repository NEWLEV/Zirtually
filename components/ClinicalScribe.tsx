import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { MicrophoneIcon } from './ui/icons/Icon';

interface ClinicalScribeProps {
  user: User;
}

type ScribeStatus = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'DONE' | 'ERROR';

const statusMessages: Record<ScribeStatus, string> = {
    IDLE: 'Click the microphone to start recording a note.',
    RECORDING: 'Recording... Click the microphone again to stop.',
    PROCESSING: 'Processing audio with AI. Please wait...',
    DONE: 'Transcription complete. You can now copy or clear the text.',
    ERROR: 'An error occurred. Please try again.'
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ClinicalScribe: React.FC<ClinicalScribeProps> = ({ user }) => {
    const [status, setStatus] = useState<ScribeStatus>('IDLE');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        if (status === 'RECORDING') {
            handleStopRecording();
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Audio recording is not supported by your browser.');
            setStatus('ERROR');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setStatus('PROCESSING');
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                try {
                    const base64Audio = await blobToBase64(audioBlob);
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

                    const audioPart = {
                        inlineData: {
                            mimeType: 'audio/webm',
                            data: base64Audio,
                        },
                    };
                    const textPart = {
                        text: "Transcribe the following audio recording from a healthcare professional. Structure the output as a clear, concise note suitable for a patient handoff or a personal reminder. Do not invent any details. Focus on clarity and proper medical terminology if present. Format with headings or bullet points where appropriate."
                    };

                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: { parts: [textPart, audioPart] }
                    });

                    setTranscript(response.text);
                    setStatus('DONE');
                } catch (apiError: any) {
                    console.error("Gemini API Error:", apiError);
                    setError(`Failed to process audio: ${apiError.message}`);
                    setStatus('ERROR');
                }
            };

            mediaRecorderRef.current.start();
            setStatus('RECORDING');
            setError(null);

        } catch (err: any) {
            console.error("Error accessing microphone:", err);
            setError('Microphone access was denied. Please allow microphone access in your browser settings.');
            setStatus('ERROR');
        }
    };
    
    const handleStopRecording = () => {
        if (mediaRecorderRef.current && status === 'RECORDING') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
    };

    const handleClear = () => {
        setTranscript('');
        setStatus('IDLE');
        setError(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">AI Clinical Scribe</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg dark:bg-yellow-900/50 dark:border-yellow-600">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <span className="font-bold">Important:</span> Do not record any Patient Health Information (PHI) or other sensitive data with this tool. This feature is intended for general, non-PHI administrative notes and reminders.
                </p>
            </div>

            <Card>
                <div className="flex flex-col items-center text-center">
                    <button
                        onClick={handleStartRecording}
                        disabled={status === 'PROCESSING'}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                            status === 'RECORDING' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400 animate-pulse' : 'bg-brand-primary hover:bg-brand-dark focus:ring-brand-primary'
                        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        aria-label={status === 'RECORDING' ? 'Stop recording' : 'Start recording'}
                    >
                        <MicrophoneIcon className="w-12 h-12 text-white" />
                    </button>
                    <p className="mt-4 text-lg font-medium text-gray-700 dark:text-dark-text-secondary">{statusMessages[status]}</p>
                    {error && <p className="mt-2 text-sm text-status-danger">{error}</p>}
                </div>

                <div className="mt-6">
                    <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                        Generated Note
                    </label>
                    <textarea
                        id="transcript"
                        readOnly={status === 'PROCESSING'}
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text disabled:bg-gray-100 dark:disabled:bg-gray-900"
                        placeholder="Your transcribed note will appear here..."
                        disabled={status === 'PROCESSING'}
                    />
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={handleCopy} disabled={!transcript || status === 'PROCESSING'}>
                        Copy to Clipboard
                    </Button>
                    <Button variant="danger" onClick={handleClear} disabled={!transcript || status === 'PROCESSING'}>
                        Clear Text
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ClinicalScribe;
