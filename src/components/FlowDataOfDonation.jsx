import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid } from "@mui/material"
import { Field, FieldArray, Form, Formik } from "formik"
import { CheckboxWithLabel, TextField } from "formik-material-ui"
import { object, number, string, boolean, array } from "yup"
import data from '../data.json'

export default function FlowDataOfDonation() {
  // const [initialState, setInitialState] = useState([])
  // useEffect(() => {
  //   if (data.length > 0) {
  //     const newData = data.map(dt => ({...dt, institution : '', percentage : 0}))
  //     setInitialState(newData)
  //   }
  // }, [])

  const [initialState, setInitialState] = useState({
    fullName: '',
    donationsAmount: 0,
    termsAndConditions: false,
    donations: []
  });

  useEffect(() => {
    if (data.length > 0) {
      const newData = data.map(dt => ({ ...dt, institution: '', percentage: 0 }));
      setInitialState({
        fullName: '',
        donationsAmount: 0,
        termsAndConditions: false,
        donations: newData
      });
    }
  }, []);

  console.log({ initialState })
  return (
    <>
      <div style={{ margin: '15px' }}>
        <Card>
          <CardHeader title={'Flow of donation'} />
          <CardContent>
            <Formik
              // initialValues={{
              //   fullName: '',
              //   donationsAmount: 0,
              //   termsAndConditions: false,
              //   donations: initialState
              // }}
              enableReinitialize
              initialValues={initialState}
              validationSchema={object({
                fullName: string().required('FullName is requried').min(2, 'FullName should be atleast more than 2 character').max(10, 'FullName should be less than 10 character'),
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
              {({ values, errors, isSubmitting }) => {
                console.log({values})
                return <Form>
                  <Grid container direction={'column'} spacing={2}>
                    <Grid item>
                      <Field fullWidth name='fullName' type='text' component={TextField} label='First Name' />
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
                                {values?.donations?.length > 0 && values?.donations?.map((_, index) =>
                                  <Grid container item spacing={2} marginTop={1}>
                                    <Grid item>
                                      <Field name={`donations[${index}].name`} component={TextField} label='User Name' value={values.donations[index].name} disabled/>
                                    </Grid>
                                    <Grid item>
                                      <Field name={`donations[${index}].age`} component={TextField} label='Age' value={values.donations[index].age} disabled/>
                                    </Grid>
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
              }}
            </Formik>
          </CardContent>
        </Card>
      </div >
    </>
  )
}
