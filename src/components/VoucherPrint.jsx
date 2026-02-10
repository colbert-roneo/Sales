import React, { useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

const VoucherPrint = ({ voucher }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!voucher) return null;

  const { header, details } = voucher;

  return (
    <div className="voucher-print">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Sales Voucher</Typography>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
        >
          Print Voucher
        </Button>
      </Box>

      <Paper ref={componentRef} className="printable-voucher">
        <Box p={3}>
          <Box mb={4}>
            <Typography variant="h4" align="center" gutterBottom>
              SALES VOUCHER
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <div>
                <Typography><strong>Voucher No:</strong> {header.vr_no}</Typography>
                <Typography><strong>Date:</strong> {new Date(header.vr_date).toLocaleDateString()}</Typography>
              </div>
              <div>
                <Typography><strong>Status:</strong> {header.status === 'A' ? 'Active' : 'Inactive'}</Typography>
              </div>
            </Box>
            <Typography>
              <strong>Account Name:</strong> {header.ac_name}
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Sr No</strong></TableCell>
                  <TableCell><strong>Item Code</strong></TableCell>
                  <TableCell><strong>Item Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="right"><strong>Qty</strong></TableCell>
                  <TableCell align="right"><strong>Rate (₹)</strong></TableCell>
                  <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.sr_no}</TableCell>
                    <TableCell>{row.item_code}</TableCell>
                    <TableCell>{row.item_name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right">{parseFloat(row.qty).toFixed(3)}</TableCell>
                    <TableCell align="right">{parseFloat(row.rate).toFixed(2)}</TableCell>
                    <TableCell align="right">{row.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={4} pt={2} borderTop={1} borderColor="grey.300">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                Total Amount: ₹{header.ac_amt.toFixed(2)}
              </Typography>
              <Box textAlign="center">
                <Typography>Authorized Signature</Typography>
                <Box height={60} borderBottom={1} borderColor="grey.300" />
              </Box>
            </Box>
            <Typography variant="caption" display="block" textAlign="center" mt={2}>
              This is a computer generated voucher
            </Typography>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default VoucherPrint;