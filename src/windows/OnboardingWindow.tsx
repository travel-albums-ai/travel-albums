import IndexerContent from '@/components/IndexerContent';
import IndexerSettings from '@/components/IndexerSettings';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import OnboardingTakeout from '@/windows/onboarding/OnboardingTakeout';
import OnboardingWelcome from '@/windows/onboarding/OnboardingWelcome';
import { Box, Button, Dialog, Step, StepLabel, Stepper } from '@mui/material';
import { ChevronLeft, ChevronsRight, CircleX } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingWindow() {
  const { setSetting } = useSettings()
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);

  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    t('onboardingStepWelcome'),
    t('onboardingStepGoogleTakeout'),
    t('onboardingStepConfigureFolders'),
  ];

  const showWindow = onboarding === true

  if (!showWindow) {
    return null
  }

  return (<>
    <Dialog onClose={() => { }} open={onboarding} fullWidth>
      <Box sx={{
      }}>
        <Box sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label} onClick={() => setActiveStep(steps.indexOf(label))} sx={{ cursor: 'pointer' }}>
                <StepLabel >{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && <OnboardingWelcome />}
        {activeStep === 1 && <OnboardingTakeout />}
        {activeStep === 2 && <>
          <IndexerSettings />
          <IndexerContent />
        </>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
          <Button
            disabled={activeStep === 0}
            startIcon={ <ChevronLeft size={16} /> }
            onClick={() => {
              if (activeStep > 0) {
                setActiveStep(prev => prev - 1)
              }
            } } variant="outlined">
            {t('onboardingPreviousStep')}
          </Button>
          <Button onClick={() => {
            if (activeStep < steps.length - 1) {
              setActiveStep(prev => prev + 1)

            }
            if (activeStep === steps.length - 1) {
              // setSetting(prev => ({ ...prev, indexing: true }));
              setSetting(prev => ({ ...prev, onboarding: false }))
              setSetting(prev => ({ ...prev, tutorial: true }))

            }
          }}
          startIcon={ activeStep === steps.length - 1 ? <CircleX size={16} /> : <ChevronsRight size={16} /> }
          variant="contained">
            {activeStep === steps.length - 1 ? 'Close onboarding' : t('onboardingNextStep')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  </>)
}
