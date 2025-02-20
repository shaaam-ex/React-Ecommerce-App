import { Step, StepLabel, Stepper, Typography } from '@material-ui/core'
import React from 'react'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import './CheckoutSteps.css'


const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShippingIcon />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheckIcon />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalanceIcon />
        },
    ];

    const stepStyles = {
        boxSizing: 'border-box'
    };
    return (
        <>
            <Stepper alternativeLabel activeStep={activeStep} style={stepStyles} >
                {
                    steps.map((item, index) => (
                        <Step
                            key={index}
                            active={ activeStep === index ? true : false }
                            completed={ activeStep >= index ? true : false }
                        >
                            <StepLabel
                                icon={item.icon}
                                style={{
                                    color: activeStep >= index ? 'red' : 'rgba(0, 0, 0, 0.65)'
                                }}
                            >
                                {item.label}
                            </StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
        </>
    )
}

export default CheckoutSteps