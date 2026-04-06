import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API_BASE_URL } from "../Url/Url";

const InvoiceView = () => {
  const { id } = useParams();
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getInvoiceById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoiceData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  // Auto download PDF
  useEffect(() => {
    if (invoiceData) {
      setTimeout(downloadPDF, 800);
    }
  }, [invoiceData]);

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice-${invoiceData?.invoiceNumber}.pdf`);
  };

  if (!invoiceData)
    return <div className="text-center p-5">Loading invoice...</div>;

  const company = invoiceData.companyId;
  const payment = invoiceData.paymentTransactionId?.stripe;

  return (
    <section className="main-dashboard-content d-flex flex-column">
      <div className="invoice-container" ref={invoiceRef}>
        {/* Header */}
        <div className="invoice-header d-flex justify-content-between">
          <div>
            <h2 className="invoice-title mb-2">INVOICE</h2>
            <span className="status-badge">
              {invoiceData.status || "Validated"}
            </span>
          </div>
          <div className="text-end invoice-meta">
            <p>
              <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoiceData.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {invoiceData.paymentMethod || "Pending"}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="row mt-4">
          <div className="col-md-6">
            <h6 className="text-muted">Billed To</h6>
            <p className="mb-1 fw-bold">{company?.brandName}</p>
            <p className="mb-0">{payment?.billingEmail || "N/A"}</p>
            <p className="mb-0">{company?.companyAddress}</p>
            <p className="mb-0">
              +{company?.phone?.countryCode} {company?.phone?.number}
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <h6 className="text-muted">From</h6>
            <p className="mb-1 fw-bold">Your Platform Name</p>
            <p className="mb-0">support@yourplatform.com</p>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive mt-4">
          <table className="table invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
           
            <tbody>
              <tr>
                <td>
                  <strong>Credit Recharge</strong>

                  <div className="text-muted small">
                    Job Credits: {invoiceData.jobCredits ?? 0}
                    <br />
                    Profile Credits: {invoiceData.profileCredits ?? 0}
                    <br />
                    Payment Method: {invoiceData.paymentMethod || "N/A"}
                    <br />
                   Transaction ID: {invoiceData.paymentTransactionId?._id || "N/A"}
                  </div>
                </td>

                <td className="text-center">1</td>

                <td className="text-end">
                  {invoiceData.currency} {invoiceData.amount}
                </td>

                <td className="text-end">
                  {invoiceData.currency} {invoiceData.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="row justify-content-end mt-4">
          <div className="col-md-5">
            <div className="total-box">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>
                  {invoiceData.currency} {invoiceData.amount}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax (0%)</span>
                <span>{invoiceData.currency} 0</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>
                  {invoiceData.currency} {invoiceData.amount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer text-center">
          This invoice was automatically generated after admin validation.
        </div>
      </div>
    </section>
  );
};

export default InvoiceView;
