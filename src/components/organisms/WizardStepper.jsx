import WizardStep from '@/components/molecules/WizardStep'

const WizardStepper = ({ 
  currentStep, 
  completedSteps = [], 
  onStepClick,
  className = ''
}) => {
  const steps = [
    { id: 1, number: 1, title: 'Connect', description: 'Airtable Setup' },
    { id: 2, number: 2, title: 'Design', description: 'Google Docs' },
    { id: 3, number: 3, title: 'Map Fields', description: 'Field Mapping' },
    { id: 4, number: 4, title: 'Save', description: 'Save Template' }
  ]
  
  return (
    <div className={`flex items-center justify-center space-x-8 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <WizardStep
            step={step}
            isActive={currentStep === step.id}
            isCompleted={completedSteps.includes(step.id)}
            isClickable={completedSteps.includes(step.id) || currentStep === step.id}
            onClick={onStepClick}
          />
          
          {index < steps.length - 1 && (
            <div className={`wizard-connector ${completedSteps.includes(step.id) ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default WizardStepper