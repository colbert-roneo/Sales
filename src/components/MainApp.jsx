import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Save, Clear, Visibility } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  submitSalesData,
  clearForm,
  setSavedVoucher,
} from "../redux/slices/salesSlice";
import HeaderForm from "./HeaderForm";
import DetailForm from "./DetailForm";
import VoucherPrint from "./VoucherPrint";
import "../styles/App.css";

const MainApp = () => {
  const dispatch = useDispatch();
  const { header, details, loading, error, success, savedVoucher } =
    useSelector((state) => state.sales);

  const handleSubmit = async () => {
    // Validation
    if (!header.vr_no || !header.ac_name || !header.vr_date) {
      alert("Please fill in all required fields in header section");
      return;
    }

    const invalidDetails = details.some(
      (detail) => !detail.item_code || detail.qty <= 0 || detail.rate < 0
    );

    if (invalidDetails) {
      alert(
        "Please fill in all required fields in details section with valid values"
      );
      return;
    }

    // Prepare payload
    const payload = {
      header_table: {
        vr_no: parseInt(header.vr_no),
        vr_date: header.vr_date,
        ac_name: header.ac_name,
        ac_amt: parseFloat(header.ac_amt.toFixed(2)),
        status: header.status,
      },
      detail_table: details.map((detail) => ({
        vr_no: parseInt(header.vr_no),
        sr_no: detail.sr_no,
        item_code: detail.item_code,
        item_name: detail.item_name,
        description: detail.description,
        qty: parseFloat(detail.qty),
        rate: parseFloat(detail.rate),
      })),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const result = await dispatch(submitSalesData(payload)).unwrap();
      console.log("Submission successful:", result);
    } catch (err) {
      console.error("Submission error details:", {
        message: err.message,
        response: err.response,
        data: err.data,
        status: err.status,
      });
      alert(
        `Submission failed: ${
          err.message || "Voucher number cannot be repeated"
        }`
      );
      window.location.reload();
    }
  };

  const handleClear = () => {
    dispatch(clearForm());
  };

  const handleViewVoucher = () => {
    dispatch(setSavedVoucher({ header, details }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleViewVoucher();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Container maxWidth="lg" className="app-container">
      <Paper elevation={3} className="main-paper">
        <Box p={3}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Sales Entry System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Data saved successfully!
            </Alert>
          )}

          <Box mb={4}>
            <HeaderForm />
          </Box>

          <Box mb={4}>
            <DetailForm />
          </Box>

          <Box display="flex" justifyContent="space-between" mb={4}>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Voucher"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Clear />}
                onClick={handleClear}
                sx={{ ml: 2 }}
              >
                Clear Form
              </Button>
            </div>
            {savedVoucher && (
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handleViewVoucher}
              >
                View Voucher
              </Button>
            )}
          </Box>

          {savedVoucher && (
            <Box mt={4}>
              <VoucherPrint voucher={savedVoucher} />
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default MainApp;
