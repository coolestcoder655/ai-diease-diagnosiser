import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Symptoms
    chiefComplaint: '',
    onset: '',
    duration: '',
    location: '',
    severity: 0,
    associatedSymptoms: [],
    
    // Step 2: History
    age: '',
    gender: '',
    medications: '',
    allergies: '',
    pastMedical: '',
    familyHistory: '',
    
    // Step 3: Physical
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    physicalExam: '',
    labTests: '',
    
    // Step 4: Lifestyle
    smoking: '',
    alcohol: '',
    exercise: '',
    recentTravel: '',
    stress: '',
  });

  const steps = [
    'Chief Complaint',
    'Medical History',
    'Physical Assessment',
    'Lifestyle Factors',
    'Diagnosis Results'
  ];

  const associatedSymptomsOptions = [
    'Fever', 'Nausea', 'Vomiting', 'Headache', 'Dizziness', 'Fatigue',
    'Shortness of breath', 'Chest pain', 'Abdominal pain', 'Appetite changes',
    'Sleep changes', 'Other'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom) => {
    const current = formData.associatedSymptoms;
    if (current.includes(symptom)) {
      updateFormData('associatedSymptoms', current.filter(s => s !== symptom));
    } else {
      updateFormData('associatedSymptoms', [...current, symptom]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
    </View>
  );

  const SeverityScale = () => (
    <View style={styles.severityContainer}>
      <Text style={styles.label}>Rate severity (1 = mild, 10 = severe):</Text>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.scaleButton,
              formData.severity === num && styles.scaleButtonSelected
            ]}
            onPress={() => updateFormData('severity', num)}
          >
            <Text style={[
              styles.scaleText,
              formData.severity === num && styles.scaleTextSelected
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const CheckboxGroup = ({ options, selected, onToggle, title }) => (
    <View style={styles.checkboxContainer}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.checkboxGrid}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.checkboxRow}
            onPress={() => onToggle(option)}
          >
            <View style={[
              styles.checkbox,
              selected.includes(option) && styles.checkboxSelected
            ]}>
              {selected.includes(option) && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Chief Complaint & Symptoms</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What is your main concern today?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={formData.chiefComplaint}
          onChangeText={(text) => updateFormData('chiefComplaint', text)}
          placeholder="Describe your primary symptom..."
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>When did this start?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.onset}
              onValueChange={(value) => updateFormData('onset', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select onset" value="" />
              <Picker.Item label="Sudden (minutes/hours)" value="sudden" />
              <Picker.Item label="Gradual (days/weeks)" value="gradual" />
              <Picker.Item label="Chronic (months/years)" value="chronic" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => updateFormData('duration', text)}
            placeholder="e.g., 3 days, 2 weeks"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Where is the symptom located?</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => updateFormData('location', text)}
          placeholder="Describe the exact location"
        />
      </View>

      <SeverityScale />

      <CheckboxGroup
        title="Associated symptoms (check all that apply):"
        options={associatedSymptomsOptions}
        selected={formData.associatedSymptoms}
        onToggle={toggleSymptom}
      />
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Medical History</Text>
      
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => updateFormData('age', text)}
            keyboardType="numeric"
            placeholder="Enter age"
          />
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current medications</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.medications}
          onChangeText={(text) => updateFormData('medications', text)}
          placeholder="List all medications, supplements, OTC drugs..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Known allergies</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.allergies}
          onChangeText={(text) => updateFormData('allergies', text)}
          placeholder="List any known allergies..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Past medical conditions</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.pastMedical}
          onChangeText={(text) => updateFormData('pastMedical', text)}
          placeholder="Previous diagnoses, surgeries, hospitalizations..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Family medical history</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.familyHistory}
          onChangeText={(text) => updateFormData('familyHistory', text)}
          placeholder="Major conditions in immediate family..."
        />
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Physical Assessment & Vital Signs</Text>
      
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Temperature (°F)</Text>
          <TextInput
            style={styles.input}
            value={formData.temperature}
            onChangeText={(text) => updateFormData('temperature', text)}
            keyboardType="decimal-pad"
            placeholder="98.6"
          />
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Blood Pressure</Text>
          <TextInput
            style={styles.input}
            value={formData.bloodPressure}
            onChangeText={(text) => updateFormData('bloodPressure', text)}
            placeholder="120/80"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Heart Rate (BPM)</Text>
          <TextInput
            style={styles.input}
            value={formData.heartRate}
            onChangeText={(text) => updateFormData('heartRate', text)}
            keyboardType="numeric"
            placeholder="72"
          />
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Respiratory Rate</Text>
          <TextInput
            style={styles.input}
            value={formData.respiratoryRate}
            onChangeText={(text) => updateFormData('respiratoryRate', text)}
            keyboardType="numeric"
            placeholder="16"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Physical examination findings</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={formData.physicalExam}
          onChangeText={(text) => updateFormData('physicalExam', text)}
          placeholder="Describe any visible symptoms, skin changes, swelling..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recent lab tests or imaging (if available)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.labTests}
          onChangeText={(text) => updateFormData('labTests', text)}
          placeholder="Blood work results, X-rays, CT scans..."
        />
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Lifestyle & Environmental Factors</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Smoking status</Text>
        <View style={styles.radioGroup}>
          {['Never smoked', 'Former smoker', 'Current smoker'].map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              onPress={() => updateFormData('smoking', option)}
            >
              <View style={[
                styles.radio,
                formData.smoking === option && styles.radioSelected
              ]}>
                {formData.smoking === option && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Alcohol consumption</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.alcohol}
              onValueChange={(value) => updateFormData('alcohol', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select frequency" value="" />
              <Picker.Item label="Never" value="none" />
              <Picker.Item label="Occasional" value="occasional" />
              <Picker.Item label="Moderate (1-2/day)" value="moderate" />
              <Picker.Item label="Heavy (3+/day)" value="heavy" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Exercise frequency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.exercise}
              onValueChange={(value) => updateFormData('exercise', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select frequency" value="" />
              <Picker.Item label="Sedentary" value="none" />
              <Picker.Item label="Light (1-2/week)" value="light" />
              <Picker.Item label="Moderate (3-4/week)" value="moderate" />
              <Picker.Item label="Heavy (5+/week)" value="heavy" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recent travel or exposures</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.recentTravel}
          onChangeText={(text) => updateFormData('recentTravel', text)}
          placeholder="Recent travel, sick contacts, environmental exposures..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recent stress or life changes</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          value={formData.stress}
          onChangeText={(text) => updateFormData('stress', text)}
          placeholder="Job changes, relationship issues, major life events..."
        />
      </View>
    </ScrollView>
  );

  const renderStep5 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Differential Diagnosis Results</Text>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Possible Diagnoses (Ranked by Probability)</Text>
        
        <View style={styles.diagnosisCard}>
          <View style={styles.probabilityBadge}>
            <Text style={styles.probabilityText}>85% - Most Likely</Text>
          </View>
          <Text style={styles.diagnosisTitle}>Primary Diagnosis</Text>
          <Text style={styles.diagnosisDescription}>
            Based on the symptoms and information provided, this appears to be the most probable condition.
          </Text>
          <Text style={styles.recommendation}>
            <Text style={styles.recommendationLabel}>Recommended actions: </Text>
            Schedule appointment with primary care physician within 24-48 hours.
          </Text>
        </View>

        <View style={styles.diagnosisCard}>
          <View style={[styles.probabilityBadge, { backgroundColor: '#FFA500' }]}>
            <Text style={styles.probabilityText}>60% - Possible</Text>
          </View>
          <Text style={styles.diagnosisTitle}>Alternative Diagnosis</Text>
          <Text style={styles.diagnosisDescription}>
            This condition shares similar symptoms and should be considered as a differential diagnosis.
          </Text>
          <Text style={styles.recommendation}>
            <Text style={styles.recommendationLabel}>Recommended actions: </Text>
            Monitor symptoms and seek medical attention if worsening.
          </Text>
        </View>

        <View style={styles.diagnosisCard}>
          <View style={[styles.probabilityBadge, { backgroundColor: '#6c757d' }]}>
            <Text style={styles.probabilityText}>30% - Less Likely</Text>
          </View>
          <Text style={styles.diagnosisTitle}>Less Probable Diagnosis</Text>
          <Text style={styles.diagnosisDescription}>
            While less likely, this condition cannot be completely ruled out without further testing.
          </Text>
          <Text style={styles.recommendation}>
            <Text style={styles.recommendationLabel}>Recommended actions: </Text>
            Discuss with healthcare provider during next visit.
          </Text>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          This AI-generated assessment is for informational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider for proper diagnosis and treatment. 
          If you are experiencing a medical emergency, call 911 immediately.
        </Text>
      </View>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      case 4: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c5aa0" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Diagnosis AI</Text>
        <Text style={styles.headerSubtitle}>Comprehensive symptom assessment</Text>
      </View>

      <ProgressBar />

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </Text>
      </View>

      <View style={styles.content}>
        {renderCurrentStep()}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, currentStep === 0 && styles.disabledButton]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>← Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, currentStep === steps.length - 1 && styles.disabledButton]}
          onPress={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          <Text style={styles.buttonText}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c5aa0',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e9ecef',
    margin: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2c5aa0',
  },
  stepIndicator: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  stepText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c5aa0',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  severityContainer: {
    marginBottom: 20,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  scaleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  scaleButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  scaleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  scaleTextSelected: {
    color: 'white',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxGrid: {
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#495057',
    flex: 1,
  },
  radioGroup: {
    marginTop: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ced4da',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    borderColor: '#2c5aa0',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2c5aa0',
  },
  radioLabel: {
    fontSize: 16,
    color: '#495057',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  diagnosisCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5aa0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  probabilityBadge: {
    backgroundColor: '#2c5aa0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  probabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  diagnosisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  diagnosisDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recommendationLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2c5aa0',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: 'white',
  },
});

export default App;