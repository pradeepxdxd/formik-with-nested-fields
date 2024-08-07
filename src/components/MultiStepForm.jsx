import React, { Children, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import { object, number, mixed, string, boolean } from 'yup'

const sleep = timer => new Promise(acc => setTimeout(acc, timer))

export default function MultiStepForm() {
  return (
    <>
      <div style={{ margin: '15px' }}>
        <Card>
          <CardContent>
            <FormikStepper
              initialValues={{
                firstName: '',
                lastName: '',
                millionaire: false,
                money: 0,
                description: ''
              }}
              onSubmit={async (values) => { 
                await sleep(3000)
                console.log({values})
              }}
            >
              <FormikStep 
                label='Personal Data'
                validationSchema={object({
                  firstName : string().required().min(3).max(10),
                  lastName : string().required().min(3).max(10)
                })}
              >
                <Box paddingBottom={2}>
                  <Field fullWidth name='firstName' component={TextField} label='First Name' />
                </Box>
                <Box paddingBottom={2}>
                  <Field fullWidth name='lastName' component={TextField} label='Last Name' />
                </Box>
                <Box paddingBottom={2}>
                  <Field name='millionaire' type='checkbox' component={CheckboxWithLabel} Label={{ label: 'Are you a millionaire ?' }} />
                </Box>
              </FormikStep>
              <FormikStep
                label='Bank Info'
                validationSchema={object({
                  money: mixed().when('millionaire', {
                    is: (value) => value === true,
                    then: () => number().required().min(1_000_000, 'Because you said you are a millionaire you need to give 1 million'),
                    otherwise: () => number().required(),
                  })
                })}
              >
                <Box paddingBottom={2}>
                  <Field fullWidth name='money' type='number' component={TextField} label='All the money you have' />
                </Box>
              </FormikStep>
              <FormikStep 
                label='More Info'
                validationSchema={object({
                  description : string().required().min(5).max(15),
                })}
              >
                <Box paddingBottom={2}>
                  <Field fullWidth name='description' component={TextField} label='Description' />
                </Box>
              </FormikStep>
            </FormikStepper>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export const FormikStep = ({ children }) => {
  return <>{children}</>
}

export const FormikStepper = ({ children, ...props }) => {
  const childrenArray = Children.toArray(children)
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const currentChild = childrenArray[step]

  const isLastStep = () => {
    return step === childrenArray.length - 1
  }

  return (
    <>
      <Formik {...props} validationSchema={currentChild.props.validationSchema} onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers)
          setCompleted(true)
        }
        else setStep(prev => prev + 1)
      }}>
        {({ isSubmitting }) =>
          <Form>
            <Stepper alternativeLabel activeStep={step} style={{ marginBottom: '1rem' }}>
              {childrenArray.map((child, index) => (
                <Step key={child.props.label} completed={step > index || completed}>
                  <StepLabel>{child.props.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {currentChild}
            <Grid container spacing={2}>

              {step > 0 ? <Grid item><Button disabled={isSubmitting} variant='contained' color='primary' onClick={() => setStep(prev => prev - 1)}>Back</Button> </Grid> : null}
              <Grid item><Button startIcon={isSubmitting ? <CircularProgress size={'1rem'}/> : null} disabled={isSubmitting} variant='contained' color='primary' type='submit'>{isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}</Button></Grid>
            </Grid>
          </Form>
        }
      </Formik>
    </>
  )
}