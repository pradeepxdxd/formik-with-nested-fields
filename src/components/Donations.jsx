import { Button, Card, CardContent, CardHeader, CircularProgress, colors, Grid, TextField as TextFieldMUI } from "@mui/material"
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik"
import { CheckboxWithLabel, TextField } from "formik-material-ui"
import { object, number, string, boolean, array } from "yup"

export const Donations = () => {
  return (<>
    <div style={{ margin: '15px' }}>
      <Card>
        <CardContent>
          <Formik
            initialValues={{
              fullName: '',
              demo: '',
              donationsAmount: 0,
              termsAndConditions: false,
              donations: [{ institution: '', percentage: 0 }]
            }}
            validationSchema={object({
              fullName: string().required('FullName is requried').min(2, 'FullName should be atleast more than 2 character').max(10, 'FullName should be less than 10 character'),
              demo: string().required(),
              donationsAmount: number().required('Donation is required').min(10, 'Donation should be more than 10'),
              termsAndConditions: boolean().required().isTrue(),
              donations: array(object({
                institution: string().required('Institutaion Name is required').min(3, 'Institution should be more than 3').max(10, 'Institution should be less than 10'),
                percentage: number().required('Percentage is required').min(1, 'Percentage should be more than 1').max(10, 'Percentage should be less than 10')
              })).min(1).max(3)
            })}
            onSubmit={async (values, { resetForm }) => {
              await new Promise(res => setTimeout(res, 2400))
              resetForm()
            }}
          >
            {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
              <Form>
                <Grid container direction={'column'} spacing={2}>
                  <Grid item>
                    <Field fullWidth name='fullName' type='text' component={TextField} label='First Name' />
                  </Grid>
                  <Grid item>
                    <TextFieldMUI fullWidth name='demo' onChange={handleChange} type='text' label='demo' onBlur={handleBlur} error={Boolean(touched.demo && errors.demo)}
                      helperText={touched.demo && errors.demo ? errors.demo : ''} />
                  </Grid>
                  <Grid item>
                    <Field fullWidth name='donationsAmount' type='number' component={TextField} label='Donation' />
                  </Grid>

                  <div>
                    <FieldArray name="donations">
                      {({ push, remove }) => (
                        <>
                          <Card>
                            <CardHeader
                              title="All Donations here"
                            />
                            <CardContent>
                              {values.donations.map((_, index) =>
                                <Grid container item spacing={2} marginTop={1}>
                                  <Grid item>
                                    <Field name={`donations[${index}].institution`} component={TextField} label='Institution' />
                                  </Grid>
                                  <Grid item>
                                    <Field name={`donations[${index}].percentage`} type='number' component={TextField} label='Percentage' />
                                  </Grid>
                                  <Grid item>
                                    <Button onClick={() => remove(index)}>Delete</Button>
                                  </Grid>
                                </Grid>
                              )}
                              {
                                typeof errors.donations === 'string' ? <><p style={{ color: 'red' }}>{errors.donations}</p></> : null
                              }
                              <Grid item marginTop={1}>
                                <Button onClick={() => push({ institution: '', percentage: 0 })}>Add</Button>
                              </Grid>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </FieldArray>
                  </div>
                  <Grid item>
                    <Field name='termsAndConditions' type='checkbox' component={CheckboxWithLabel} Label={{ label: 'I accept the terms and conditions' }} />
                  </Grid>
                  <Grid item>
                    <Button disabled={isSubmitting}
                      variant="contained"
                      color="primary"
                      type="submit"
                      startIcon={isSubmitting ? <CircularProgress size={'0.9rem'} /> : null}
                    >
                      {isSubmitting ? 'Submitting' : 'Submit'}
                    </Button>
                  </Grid>
                </Grid>
                <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div >
  </>)
}