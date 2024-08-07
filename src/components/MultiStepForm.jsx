import React from 'react'
import { Card, CardContent } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import { object, number, mixed, boolean, string } from 'yup'

export default function MultiStepForm() {
    return (
        <>
            <div style={{ margin: '15px' }}>
                <Card>
                    <CardContent>
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                millionaire: false,
                                money: 0,
                                description: ''
                            }}
                            validationSchema={object({
                                firstName: string().required().min(3).max(10),
                                lastName: string().required().min(3).max(10),
                                money: mixed().when('millionaire', {
                                    is: (value) => value === true,
                                    then: () => number().required().min(1_000_000, 'Because you said you are a millionaire you need to give 1 million'),
                                    otherwise: () => number().required(),
                                })
                            })}
                            onSubmit={() => { }}
                        >
                            <Form>
                                <Field name='firstName' component={TextField} label='First Name' />
                                <Field name='lastName' component={TextField} label='Last Name' />
                                <Field name='millionaire' type='checkbox' component={CheckboxWithLabel} Label={{ label: 'Are you a millionaire ?' }} />
                                <Field name='money' type='number' component={TextField} label='All the money you have' />
                                <Field name='description' component={TextField} label='Description' />
                            </Form>
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
