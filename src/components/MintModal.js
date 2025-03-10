import React, { useEffect, useImperativeHandle, useState } from "react";
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { QuantityModalStep } from './QuantityModalStep';
import { PaymentModalStep } from './PaymentModalStep';
import { getBaseURL } from '../constants';

const DialogTitleWithClose = ({ children, onClose }) => {
    return <DialogTitle>
        <Box sx={{ mr: 4 }}>{children}</Box>
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    ml: 4,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
            <CloseIcon />
        </IconButton>) : null}
    </DialogTitle>
}

export const MintModal = (props, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [txHash, setTxHash] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        // TODO: Remove this after merging to main
        if (window.location.href.includes("ameegos.io")) {
            setStep(2)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false);
    }

    useImperativeHandle(ref, () => ({
            setIsOpen, setQuantity
        })
    )

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}>
            {isLoading &&
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 300,
                    height: 300,
                    maxWidth: "50vw"
                }}>
                    {txHash ? <CircularProgress /> : <span style={{
                        fontSize: 60,
                        lineHeight: 1,
                        margin: 0
                    }}>
                        👋
                    </span>}
                    <Typography sx={{mt: 3}} variant="subtitle1">{
                        txHash
                        ? `Minting ${quantity} NFT...`
                        : 'Confirm the transaction in your wallet'
                    }</Typography>
                    {!txHash && <Typography sx={{
                        mt: 1,
                        color: "#757575",
                        textAlign: "center"
                    }} variant="subtitle2">Wait until transaction window appears.<br/>If you don't see the Confirm button, scroll down ⬇️</Typography>}
                </Box>
            }
            {!isLoading && <>
            <DialogTitleWithClose onClose={handleClose}>
                {step === 1 ? "Choose how many to mint" : "Pay with"}
            </DialogTitleWithClose>
            <DialogContent style={styles.mintModalContent}>
                {step === 1 && <QuantityModalStep
                    setTxHash={setTxHash}
                    setQuantity={setQuantity}
                    setStep={setStep}
                    setIsLoading={setIsLoading}
                />}
                {step === 2 && <PaymentModalStep quantity={quantity} />}
            </DialogContent>
            </>}
        </Dialog>
    )
}

export const modalRef = React.createRef();

export const showMintModal = (quantity) => {
    if (quantity) {
        modalRef.current?.setQuantity(quantity)
    }
    modalRef.current?.setIsOpen(true);
}

const styles = {
    mintModalContent: {
        paddingTop: "8px",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row"
    },
    mintOption: {
        padding: "16px",
        marginLeft: "12px",
        marginRight: "12px",
        textAlign: "center",

        ":hover": {
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderRadius: "16px"
        }
    },
}

export default React.forwardRef(MintModal);
