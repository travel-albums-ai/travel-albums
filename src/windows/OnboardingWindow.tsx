import ConfigSettings from '@/components/ConfigSettings';
import IndexerContent from '@/components/IndexerContent';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Box, Button, Dialog, Divider, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { ChevronLeft, ChevronsRight, CircleX, FolderOutput, GalleryVerticalEnd, SquareMousePointer } from 'lucide-react';
import { cloneElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <SquareMousePointer />,
    titleKey: 'onboardingPhaseGoogleTakeoutTitle',
    descriptionKey: 'onboardingPhaseGoogleTakeoutDescription',
  },
  {
    key: '2',
    icon: <FolderOutput />,
    titleKey: 'onboardingPhaseConfigureFoldersTitle',
    descriptionKey: 'onboardingPhaseConfigureFoldersDescription',
  },
  {
    key: '3',
    icon: <GalleryVerticalEnd />,
    titleKey: 'onboardingPhaseIndexTitle',
    descriptionKey: 'onboardingPhaseIndexDescription',
  },
]

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
      {onboarding && <Box sx={{
        p: 2,
        borderRadius: 2,
        border: 2,
        borderColor: 'divider',
        bgcolor: 'background.default',
        overflowY: 'auto',
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

        {/* <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 500px)', gap: 4, p: 2, width: '100%', boxSizing: 'border-box', justifyContent: 'center' }}> */}
        {activeStep === 0 && <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, mx: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <img
            src="./logo_new_240.webp"
            alt="Logo"
            fetchPriority="high"
            width={240}
            height={186}
            style={{
              aspectRatio: '1/1',
              margin: 20
            }}
          />
          <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="body1" color="textPrimary">
            {t('onboardingWelcomeBody')}
          </Typography>

          <Divider sx={{ width: '100%' }} />
          <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="subtitle2" color="textSecondary">
            {t('onboardingWelcomeSubtitle')}
          </Typography>

          <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="caption" color="textDisabled">
            {t('onboardingWelcomeFooter')}
          </Typography>

        </Box>}

        {activeStep === 1 && <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, mx: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <img src="/googleTakeout.png" alt="Google Takeout" height={235} style={{ width: '100%', borderRadius: 8 }} />
          {phaseSteps.map((step, i) => (
            <Box key={step.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {cloneElement(step.icon, { size: 16 })}
                <Typography variant="subtitle1">{t(step.titleKey)}</Typography>
              </Box>
              <Typography variant="subtitle2" color="textSecondary">{t(step.descriptionKey)}</Typography>
              {i < phaseSteps.length - 1 && <Divider sx={{ width: '100%' }} />}
            </Box>
          ))}
        </Box>}

        {activeStep === 2 && <>
          <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, m: 2, bgcolor: 'background.paper' }}>
            <ConfigSettings />
          </Box>
          <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, m: 2, bgcolor: 'background.paper' }}>
            <IndexerContent />
          </Box>
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

      </Box>}
    </Dialog>
  </>)
}
