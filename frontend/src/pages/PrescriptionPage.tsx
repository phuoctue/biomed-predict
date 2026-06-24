import React, { useState } from 'react';
import { usePrescription, useAIEvaluation } from '../hooks/useAPI';

export const PrescriptionPage: React.FC = () => {
  const { prescription, loading, error, createPrescription } = usePrescription();
  const { evaluation, createEvaluation } = useAIEvaluation();
  const [medicalRecordId, setMedicalRecordId] = useState('');
  const [note, setNote] = useState('');

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        medicalRecordId: parseInt(medicalRecordId),
        note,
      };
      await createPrescription(data);
      alert('Prescription created successfully');
    } catch (err) {
      alert('Failed to create prescription');
    }
  };

  const handleEvaluateWithAI = async () => {
    if (!prescription) {
      alert('No prescription to evaluate');
      return;
    }
    try {
      await createEvaluation({
        prescriptionId: prescription.id,
      });
      alert('AI Evaluation completed');
    } catch (err) {
      alert('Failed to evaluate prescription');
    }
  };

  return (
    <div className="prescription-page">
      <h1>Prescription Management</h1>
      <form onSubmit={handleCreatePrescription} className="prescription-form">
        <div className="form-group">
          <label>Medical Record ID:</label>
          <input
            type="number"
            value={medicalRecordId}
            onChange={(e) => setMedicalRecordId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </form>

      {prescription && (
        <div className="prescription-details">
          <h3>Prescription: {prescription.prescriptionCode}</h3>
          <p>Status: {prescription.status}</p>
          <button onClick={handleEvaluateWithAI}>Evaluate with AI</button>
        </div>
      )}

      {evaluation && (
        <div className="evaluation-results">
          <h3>AI Evaluation Results</h3>
          <p>Score: {evaluation.overallScore}</p>
          <p>Risk Level: {evaluation.overallRisk}</p>
          <p>Summary: {evaluation.summary}</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
