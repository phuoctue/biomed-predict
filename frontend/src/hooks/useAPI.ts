import { useState, useCallback } from 'react';
import * as api from '../services/api';

export const usePatient = () => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await api.patientAPI.getById(id);
      setPatient(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch patient');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.patientAPI.create(data);
      setPatient(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { patient, loading, error, fetchPatient, createPatient };
};

export const usePrescription = () => {
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescription = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await api.prescriptionAPI.getById(id);
      setPrescription(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch prescription');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPrescription = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.prescriptionAPI.create(data);
      setPrescription(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { prescription, loading, error, fetchPrescription, createPrescription };
};

export const useAIEvaluation = () => {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvaluation = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.aiEvaluationAPI.evaluate(data);
      setEvaluation(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create evaluation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { evaluation, loading, error, createEvaluation };
};
